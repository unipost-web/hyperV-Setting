import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  changeHostName: async (param) => {
    return await ipcRenderer.invoke('changeHostName', param);
  },
  changeIp: async (param) => {
    return await ipcRenderer.invoke('changeIp', param);
  },
  getConfig: async () => {
    return await ipcRenderer.invoke('getConfig');
  },
  reboot: async () => {
    return await ipcRenderer.invoke('reboot');
  },
});