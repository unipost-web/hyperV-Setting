import { ipcMain } from 'electron';
import { execPromise } from './common.js';

// 공통 응답 생성 함수
const createResponse = (success, message = '', data = {}) => ({
  success,
  message,
  data,
});

export default function setupIpcHandlers() {
  ipcMain.handle('getConfig', async () => {
    try {
      const currentHostName = await execPromise('hostname');
      const cleanedHostName = currentHostName.trim();

      return createResponse(true, '', { currentHostName: cleanedHostName });
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

  ipcMain.handle('reboot', async () => {
    try {
      await execPromise('shutdown -r -f -t 00');

      return createResponse(true, 'PC 재부팅 완료');
    } catch (error) {
      return createResponse(false, `reBoot Error: ${error.message}`);
    }
  });
}
