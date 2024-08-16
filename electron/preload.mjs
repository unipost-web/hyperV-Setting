import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  changeHostName: (data) => ipcRenderer.send('changeHostName', data),
  onPDFSaved: (callback) => ipcRenderer.on('pdfSaved', (event, message) => callback(message)),
});
