interface Response {
  success: boolean;
  message: string;
  data: Record<string, any>;
}

interface Electron {
  changeHostName: (param: Record<string, any>) => Promise<Response>;
  changeIp: (param: Record<string, any>) => Promise<Response>;
  savePortProxy: (param: Record<string, any>) => Promise<Response>;
  getPortProxy: () => Promise<Response>;
  initPortProxy: () => Promise<Response>;
  deletePortProxy: (listenPort: number) => Promise<Response>;
  getConfig: () => Promise<Response>;
  updateSapGui: (param: Record<string, any>) => Promise<Response>;
  reboot: () => Promise<Reponse>;
}

interface IpcRenderer {
  on: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
  send: (channel: string, ...args: any[]) => void;
  removeAllListeners: (channel: string) => void;
}

interface Window {
  electron: Electron;
  ipcRenderer: IpcRenderer;
}
