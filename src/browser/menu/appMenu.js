'use strict';

// import app from 'app';
// import Menu from 'menu';
// import MenuItem from 'menu-item';

import { app, Menu, MenuItem } from 'electron';

let template = [{
  label: 'Putflix',
  submenu: [{
    label: 'Quit',
    accelerator: 'Command+Q',
    click: function () {app.quit()}
  }]
}];

let appMenu = Menu.buildFromTemplate(template);

module.exports = appMenu;
