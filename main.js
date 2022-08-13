const {
  app,
  ipcMain,
  globalShortcut,
  BrowserWindow,
  Menu,
  MenuItem,
  Tray,
  nativeImage,
} = require("electron");

const pty = require("node-pty");
const os = require("os");
const { getSettings } = require("./settings");
const username = process.env["LOGNAME"];

const { autoUpdater } = require("electron-updater");

const { bgColor, cols, rows, shellSettings, blurType, completeTransparent } = getSettings();

const TrayImage = nativeImage.createFromPath("./build/icon@4x.png");
const electron = require('electron')

// Enable live reload for all the files inside your project directory
require('electron-reload')(__dirname, {
    // Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
});

console.log(getSettings());

var shell =
  os.platform() === "win32"
    ? "powershell.exe"
    : shellSettings; /* "/opt/homebrew/bin/fish"*/

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    height: 1080,
    width: 1920,
    center: true,
    frame: false,

    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      allowRunningInsecureContent: true,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // type string | null - Can be appearance-based, light, dark, titlebar, selection, menu, popover, sidebar, medium-light, ultra-dark, header, sheet, window, hud, fullscreen-ui, tooltip, content, under-window, or under-page.
  //mainWindow.setVibrancy("hud");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.on("update-available", function () {
    mainWindow.loadURL(`file://${__dirname}/updater.html`);
  });
  autoUpdater.on("update-downloaded", (updateInfo) => {
    setTimeout(() => {
      autoUpdater.quitAndInstall();
      app.exit();
    }, 10000);
  });
  if(!completeTransparent)
	{
		mainWindow.setVibrancy(blurType);
	}
  //ipcing

  var ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: cols,
    rows: rows,
    cwd: process.env.HOME,
    env: process.env,
  });

  ptyProcess.on("data", function (data) {
    mainWindow.webContents.send("terminal.incomingData", data);
    console.log("Sent data to terminal");
  });
  ipcMain.on("terminal.keystroke", (event, key) => {
    ptyProcess.write(key);
  });
  ipcMain.on("terminal.resize", (event, size) => {
    ptyProcess.resize(size.cols, size.rows);
    console.log("resized");
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
