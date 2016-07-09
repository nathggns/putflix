import 'babel/polyfill';

// import app from 'app';
// import BrowserWindow from 'browser-window';
// import crashReporter from 'crash-reporter';
// import Menu from 'menu';

import { app, BrowserWindow, crashReporter, Menu } from 'electron';
import appMenu from './browser/menu/appMenu';

let mainWindow = null;
if(process.env.NODE_ENV === 'develop'){
  crashReporter.start();
  //appMenu.append(devMenu);
}

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  //Menu.setApplicationMenu(appMenu);
  mainWindow = new BrowserWindow({});
  // mainWindow.openDevTools();
  mainWindow.loadURL('file://' + __dirname + '/renderer/index.html');
});

