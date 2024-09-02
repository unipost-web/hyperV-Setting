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
  getPortProxy : async () => {
    return await ipcRenderer.invoke('getPortProxy');
  },
  savePortProxy : async (param) => {
    return await ipcRenderer.invoke('savePortProxy', param);
  },
  initPortProxy : async () => {
    return await ipcRenderer.invoke('initPortProxy');
  },
  deletePortProxy : async (listenPort) => {
    return await ipcRenderer.invoke('deletePortProxy', listenPort);
  }
});