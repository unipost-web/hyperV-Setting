import { app, BrowserWindow, Tray, Menu } from 'electron';
import electronLocalShortcut from 'electron-localshortcut';
import isDev from 'electron-is-dev';
import { paths } from './common.js';
import { setupIpcHandlers, setupAutoUpdateHandlers } from './ipcMainService.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { autoUpdater } = require('electron-updater');

let mainWindow, tray;
const { preloadPath, runPath, iconPath } = paths;

const browserOption = {
  width: 1280,
  height: 960,
  icon: iconPath,
  webPreferences: {
    nodeIntegration: true,
    preload: preloadPath,
  },
  autoHideMenuBar: true,
  show: true,
  resizable: false,
  center: true,
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
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

  await mainWindow.loadURL(runPath);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.show();
  electronLocalShortcut.register(mainWindow, 'F5', () => {
    mainWindow.reload();
  });
  electronLocalShortcut.register(mainWindow, 'F12', () => {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  });
};

const createTray = () => {
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '재시작',
      click: () => {
        app.relaunch();
        app.exit();
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
  setupIpcHandlers();
  if (!isDev) {
    setupAutoUpdateHandlers(mainWindow, app);
    autoUpdater.checkForUpdatesAndNotify();
  }
});
