import { ipcMain } from 'electron';
import { execPromise } from './common.js';

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
      } else if (trimmedLine.startsWith('IPv4 주소')) {
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

export default function setupIpcHandlers() {
  ipcMain.handle('getConfig', async () => {
    try {
      const currentHostName = await execPromise('hostname');
      const cleanedHostName = currentHostName.trim();

      const ipconfig = await execPromise('ipconfig /all');
      const adapters = parseIpConfigOutput(ipconfig);

      // const publicIp = await execPromise('curl ifconfig.me');

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
      const dnsChangeCommand2 = `netsh interface ipv4 add dns name="${interfaceName}" static 8.8.8.8`;

      await execPromise(ipChangeCommand);
      await execPromise(dnsChangeCommand);
      await execPromise(dnsChangeCommand2);

      return createResponse(true, 'Ip 주소 및 DNS 변경 완료');
    } catch (error) {
      return createResponse(false, `changeIp Error: ${error.message}`);
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

  ipcMain.handle('savePortProxy', async (event, param) => {
    try {
      for (let j = 0; j < param.length; j++) {
        const item = param[j];
        const { listenPort, connectPort, connectAddress } = item;

        for (let i = 0; i < listenPort.length; i++) {
          const portProxyCommand = `netsh interface portproxy add v4tov4 listenport=${listenPort[i]} connectport=${connectPort[i]} connectaddress=${connectAddress}`;
          await execPromise(portProxyCommand);
        }
      }

      return createResponse(true, 'PortProxy 추가 완료');
    } catch (error) {
      return createResponse(false, `changeIp Error: ${error.message}`);
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
