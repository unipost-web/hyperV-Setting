interface Response {
  success: boolean;
  message: string;
  data: object;
}

interface Electron {
  changeHostName: (param: object) => Promise<Response>;
  changeIp: (param: object) => Promise<Response>;
  getConfig: () => Promise<Response>;
  reboot: () => Promise<Reponse>;
}

interface Window {
  electron: Electron;
}
