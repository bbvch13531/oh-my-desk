const {
  app, BrowserWindow, Menu, Tray,
} = require('electron');
const path = require('path');
const url = require('url');
const { ipcMain } = require('electron');
const WidgetManager = require('./src/WidgetManager');

let setting_win;
const widgetManager = new WidgetManager({
  icon: path.join(__dirname, 'resource', 'icon.png'),
});
let tray;

function createSetting() {
  if (setting_win) {
    setting_win.focus();
    return;
  }

  setting_win = new BrowserWindow({
    width: 800,
    height: 800,
    icon: path.join(__dirname, 'resource', 'icon.png'),
  });

  const ENV_PATH = process.env.NODE_ENV === 'development' ? 'app' : 'build';

  setting_win.loadURL(url.format({
    pathname: path.join(__dirname, ENV_PATH, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  if (process.env.NODE_ENV === 'development') {
    setting_win.webContents.openDevTools();
  }

  setting_win.on('closed', () => {
    setting_win = null;
    widgetManager.setSettingWin(null);
  });

  widgetManager.setSettingWin(setting_win);
}

function createTray(contextMenuTemplate) {
  if (!tray) tray = new Tray(path.join(__dirname, 'resource', 'tray_icon.png'));

  const contextMenu = Menu.buildFromTemplate(contextMenuTemplate.concat([
    { type: 'separator' },
    { label: 'Setting', type: 'normal', click: createSetting },
    {
      label: 'Exit',
      type: 'normal',
      click: () => {
        app.quit();
      },
    },
  ]));

  tray.setToolTip('Oh My Desk');
  tray.setContextMenu(contextMenu);
}

function init() {
  widgetManager.onUpdateTray(createTray);
  widgetManager.openAllWindow();

  ipcMain.on('WIDGET_MANAGE', (event, arg) => {
    if (arg.operation === 'CREATE') {
      widgetManager.create(arg.widget);
    } else if (arg.operation === 'UPDATE') {
      widgetManager.update(arg.widget);
    } else if (arg.operation === 'DELETE') {
      widgetManager.delete(arg.widget.id);
    } else {
      throw new Error('WIDGET_MANAGER : operaction is not set');
    }
  });

  ipcMain.on('WIDGET_SHOW_INACTIVE', (e, arg) => {
    widgetManager.callTargetEvent('showInactive', arg);
  });

  ipcMain.on('WIDGET_OPEN', (event, arg) => {
    widgetManager.update(arg);
    widgetManager.openWindow(arg);
  });

  ipcMain.on('WIDGET_INFO_REQUEST', (event) => {
    event.sender.send('WIDGET_INFO_RESULT', widgetManager.getWidgets());
  });

  if (widgetManager.isFirstTime) createSetting();
}

// remove dock icon on macOS
if (process.platform === 'darwin') {
  app.dock.hide();
}

app.on('ready', init);

app.on('window-all-closed', () => {
});

app.on('activate', () => {
});
