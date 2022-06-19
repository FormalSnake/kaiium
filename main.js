const { app, BrowserWindow, ipcMain, Notification } = require("electron");

const pty = require("node-pty");
const os = require("os");
const { getSettings } = require("./settings");
const username = process.env["LOGNAME"];

const { autoUpdater } = require("electron-updater");

const { bgColor, cols, rows, shellSettings } = getSettings();

console.log(getSettings());

var shell =
  os.platform() === "win32"
    ? "powershell.exe"
    : shellSettings; /* "/opt/homebrew/bin/fish"*/

autoUpdater.checkForUpdatesAndNotify();

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    height: 1080,
    width: 1920,
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
  mainWindow.on("closed", function () {
    mainWindow = null;
  });

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
