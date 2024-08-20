interface Response {
  success: boolean;
  message: string;
  data: object;
}

interface Electron {
  changeHostName: (param: object) => Promise<Response>;
  getConfig: () => Promise<Response>;
}

interface Window {
  electron: Electron;
}
