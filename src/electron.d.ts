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
  reboot: () => Promise<Reponse>;
}

interface Window {
  electron: Electron;
}
