import { ipcMain } from 'electron';
import { execPromise } from './common.js';

export default function setupIpcHandlers() {
  ipcMain.handle('getConfig', async () => {
    const response = { message: '', success: false, data: {} };
    try {
      const currentHostName = await execPromise('hostname');
      const cleanedHostName = currentHostName.trim();
      response.success = true;
      response.data.currentHostName = cleanedHostName;
    } catch (error) {
      response.message = `getConfig Error : ${error.message}`;
    }

    return response;
  });
  ipcMain.handle('changeHostName', async (event, param) => {
    const response = { message: '', success: false, data: {} };
    try {
      const { currentHostName, changeHostName } = param;
      const hostNameChangeCommand = `wmic ComputerSystem Where Name="${currentHostName}" Call Rename Name="${changeHostName}"`;
      await execPromise(hostNameChangeCommand);

      response.success = true;
      response.message = '호스트네임 변경 완료';
    } catch (error) {
      response.message = `changeHostName Error : ${error.message}`;
    }

    return response;
  });
}
