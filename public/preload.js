import { contextBridge, ipcRenderer } from 'electron';

const preloadInterface = 'myPreload';

contextBridge.exposeInMainWorld(preloadInterface, {
  listenChannelMessage: (callback) => ipcRenderer.on('channel', (_, data) => callback(data)),
  sendMessage: (data) => ipcRenderer.send('channel', data),
});
