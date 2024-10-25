import { ipcMain } from 'electron';
import { execPromise, paths } from './common.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { autoUpdater } = require('electron-updater');

// 공통 응답 생성 함수
const createResponse = (success, message = '', data = {}) => ({
  success,
  message,
  data,
});

// ipconfig /all 명령어 실행 및 데이터 파싱
const parseIpConfigOutput = (output) => {
  const adapters = [];
  const lines = output.split('\n');

  let currentAdapter = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('이더넷 어댑터') || trimmedLine.startsWith('무선 LAN 어댑터')) {
      if (currentAdapter) adapters.push(currentAdapter);
      const interfaceName = trimmedLine.split(':')[0].trim();
      // 접두사 "이더넷 어댑터 " 또는 "무선 LAN 어댑터 "를 제거합니다.
      const cleanedInterfaceName = interfaceName.replace(/^이더넷 어댑터\s*|\s*무선 LAN 어댑터\s*/, '');

      currentAdapter = { interfaceName: cleanedInterfaceName };
    } else if (currentAdapter) {
      // 어댑터 정보 추가
      if (trimmedLine.startsWith('물리적 주소')) {
        currentAdapter.mac = trimmedLine.split(':')[1].trim();
      } else if (trimmedLine.startsWith('IPv4 주소') || trimmedLine.startsWith('자동 구성 IPv4 주소')) {
        currentAdapter.ipv4 = trimmedLine.split(':')[1].split('(')[0].trim();
      } else if (trimmedLine.startsWith('서브넷 마스크')) {
        currentAdapter.subnetMask = trimmedLine.split(':')[1].trim();
      } else if (trimmedLine.startsWith('기본 게이트웨이')) {
        currentAdapter.gateway = trimmedLine.split(':')[1].trim();
      }
    }
  }

  if (currentAdapter) adapters.push(currentAdapter);

  return adapters;
};

const convertPortsToArray = (proxyData) => {
  return proxyData.map((proxyItem) => ({
    ...proxyItem,
    listenPort: proxyItem.listenPort.split(',').map(Number),
    connectPort: proxyItem.connectPort.split(',').map(Number),
  }));
};

// 기본 게이트웨이를 결정하기 위한 함수
const getDefaultGateway = (ip) => {
  if (ip.startsWith('192.168.10.')) {
    return '192.168.10.1';
  } else if (ip.startsWith('192.168.11.')) {
    return '192.168.11.1';
  } else if (ip.startsWith('192.168.12.')) {
    return '192.168.12.1';
  } else {
    throw new Error('Unsupported IP range');
  }
};

export function setupIpcHandlers() {
  ipcMain.handle('getConfig', async () => {
    try {
      const currentHostName = await execPromise('hostname');
      const cleanedHostName = currentHostName.trim();

      const ipconfig = await execPromise('ipconfig /all');
      const adapters = parseIpConfigOutput(ipconfig);

      return createResponse(true, '', { currentHostName: cleanedHostName, ipconfig: adapters });
    } catch (error) {
      return createResponse(false, `getConfig Error: ${error.message}`);
    }
  });

  ipcMain.handle('changeHostName', async (event, param) => {
    try {
      const { currentHostName, changeHostName } = param;
      const hostNameChangeCommand = `wmic ComputerSystem Where Name="${currentHostName}" Call Rename Name="${changeHostName}"`;

      await execPromise(hostNameChangeCommand);

      return createResponse(true, '호스트네임 변경 완료');
    } catch (error) {
      return createResponse(false, `changeHostName Error: ${error.message}`);
    }
  });

  ipcMain.handle('changeIp', async (event, param) => {
    try {
      const { interfaceName, changeIp } = param;

      const ipChangeCommand = `netsh interface ipv4 set address name="${interfaceName}" static ${changeIp} 255.255.255.0 ${getDefaultGateway(changeIp)}`;
      const dnsChangeCommand = `netsh interface ipv4 set dns name="${interfaceName}" static 164.124.101.2`;
      const dnsChangeCommand2 = `netsh interface ipv4 add dns name="${interfaceName}" 8.8.8.8 index=2`;

      await execPromise(ipChangeCommand);
      await execPromise(dnsChangeCommand);
      await execPromise(dnsChangeCommand2);

      return createResponse(true, 'Ip 주소 및 DNS 변경 완료');
    } catch (error) {
      return createResponse(false, `changeIp Error: ${error.message}`);
    }
  });

  ipcMain.handle('getPortProxy', async () => {
    try {
      await execPromise('start cmd /k "netsh interface portproxy show all');

      return createResponse(true, '', {});
    } catch (error) {
      return createResponse(false, `PortProxy Error: ${error.message}`);
    }
  });

  ipcMain.handle('initPortProxy', async () => {
    try {
      await execPromise('netsh interface portproxy reset');

      return createResponse(true, '초기화 완료', {});
    } catch (error) {
      return createResponse(false, `PortProxy Error: ${error.message}`);
    }
  });

  ipcMain.handle('deletePortProxy', async (event, listenPort) => {
    try {
      await execPromise(`netsh interface portproxy delete v4tov4 listenport=${listenPort}`);

      return createResponse(true, '삭제 완료', {});
    } catch (error) {
      return createResponse(false, `PortProxy Error: ${error.message}`);
    }
  });

  ipcMain.handle('savePortProxy', async (event, param) => {
    try {
      const filterParam = convertPortsToArray(param);
      for (let j = 0; j < filterParam.length; j++) {
        const item = filterParam[j];
        const { listenAddress, listenPort, connectPort, connectAddress } = item;

        for (let i = 0; i < listenPort.length; i++) {
          const portProxyCommand = `netsh interface portproxy add v4tov4 listenaddress=${listenAddress} listenport=${listenPort[i]} connectport=${connectPort[i]} connectaddress=${connectAddress}`;
          await execPromise(portProxyCommand);
        }
      }

      return createResponse(true, 'PortProxy 추가 완료');
    } catch (error) {
      return createResponse(false, `PortProxy Error: ${error.message}`);
    }
  });

  ipcMain.handle('updateSapGui', async (event, workSpace, param) => {
    try {
      const updatedData = param.map((item) => {
        let instanceNum = item.instanceNumber;
        // instanceNumber가 10 미만이면 앞에 '0'을 붙여 2자리로 만듦
        if (parseInt(instanceNum) < 10) instanceNum = instanceNum.padStart(2, '0');
        // '32'를 앞에 붙임
        item.instanceNumber = `32${instanceNum}`;
        return item;
      });

      const { updateSapPowerShellPath } = paths;

      for (let i = 0; i < updatedData.length; i++) {
        const { description, instanceNumber, systemId, applicationServer } = updatedData[i];
        const sapGuiUpdateCommand = `powershell.exe -ExecutionPolicy Bypass -File "${updateSapPowerShellPath}" -serviceName "${description}" -systemId "${systemId}" -server "${applicationServer}:${instanceNumber}" -workSpace "${workSpace}"`;
        await execPromise(sapGuiUpdateCommand);
      }

      return createResponse(true, 'SAP GUI UPDATE 완료');
    } catch (error) {
      return createResponse(false, `SAP GUI UPDATE Error: ${error.message}`);
    }
  });

  ipcMain.handle('reboot', async () => {
    try {
      await execPromise('shutdown -r -f -t 00');

      return createResponse(true, 'PC 재부팅 완료');
    } catch (error) {
      return createResponse(false, `reBoot Error: ${error.message}`);
    }
  });
}

export function setupAutoUpdateHandlers(mainWindow, app) {
  // 업데이트 할 신규 버전이 없을 시 호출 됨
  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update-available', '신규 버전 없음');
  });

  // 업데이트 확인 중 에러 발생 시 호출 됨
  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('update-available', err);
  });

  // 업데이트 할 신규 버전이 있을 시 호출 됨
  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-available', { isUpdate: true });
  });

  // 업데이트 설치 파일 다운로드 상태 수신
  // 해당 단계까지 자동으로 진행 됨
  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('download-progress', progressObj);
  });

  // 업데이트 설치 파일 다운로드 완료 시 업데이트 진행 여부 선택
  autoUpdater.on('update-downloaded', () => {
    app.isQuiting = true;
    autoUpdater.quitAndInstall();
  });
}
