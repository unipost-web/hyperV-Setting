import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  changeHostName: async (param) => {
    return await ipcRenderer.invoke('changeHostName', param);
  },
  getConfig: async () => {
    return await ipcRenderer.invoke('getConfig');
  },
  reboot: async () => {
    return await ipcRenderer.invoke('reboot');
  },
});