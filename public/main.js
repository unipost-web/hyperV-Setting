import { fileURLToPath } from 'url';
import { dirname } from 'path';
import isDev from 'electron-is-dev';
import { app, Tray, Menu, BrowserWindow } from 'electron/main';
import electronLocalShortcut from 'electron-localshortcut';

// 현재 모듈의 디렉토리 경로를 얻습니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow, tray;
const browserOption = {
  width: 800,
  height: 960,
  webPreferences: {
    contextIsolation: false,
    nodeIntegration: true,
    enableRemoteModule: true,
    devTools: isDev,
  },
  autoHideMenuBar: true,
  show: false,
  y: 0,
  x: 0,
  title: 'S',
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  app.exit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized() || !mainWindow.isVisible()) mainWindow.show();
      mainWindow.focus();
    }
  });
}

const createWindow = async () => {
  mainWindow = new BrowserWindow(browserOption);

  await mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${__dirname.join('../build/index.html')}`);

  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    electronLocalShortcut.register(mainWindow, 'F5', () => {
      // mainWindow.webContents.reloadIgnoringCache();
      mainWindow.reload();
    });
    electronLocalShortcut.register(mainWindow, 'Ctrl+F12', () => {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
  });
};

const createTray = () => {
  tray = new Tray(`${__dirname}\\1.png`);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '도움말',
      click: async () => {},
    },
    {
      label: '재시작',
      click: () => {
        app.exit();
        app.relaunch();
      },
    },
    {
      label: '종료',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('HyperV-Setting');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.show();
  });

  mainWindow.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
};

app.on('ready', () => {
  createWindow();
  createTray();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
