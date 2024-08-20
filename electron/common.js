import isDev from 'electron-is-dev';
import path from 'node:path';
import { exec } from 'child_process';
const __dirname = path.resolve();

// Define base paths
const basePaths = {
  dev: path.join(__dirname, 'electron'),
  prod: path.join(__dirname, 'resources', 'app', 'electron'),
};
// Determine the current environment paths
const currentPaths = isDev ? basePaths.dev : basePaths.prod;

export const paths = {
  currentPaths,
  runPath: isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'resources', 'app', 'build', 'index.html')}`,
  preloadPath: path.join(currentPaths, 'preload.mjs'),
  iconPath: path.join(currentPaths, 'favicon.ico'),
};

export const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject({ error: err, stderr });
      } else {
        resolve(stdout);
      }
    });
  });
};
