import isDev from 'electron-is-dev';
import path from 'node:path'
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
    runPath: isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'resources', 'app', 'build', 'index.html')}`,
    preloadPath: path.join(currentPaths, 'preload.mjs'),
    trayPath: path.join(currentPaths, 'favicon.ico'),
};