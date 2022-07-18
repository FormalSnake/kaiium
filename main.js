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

const electronVibrancy = require("electron-vibrancy-updated");

const pty = require("node-pty");
const os = require("os");
const { getSettings } = require("./settings");
const username = process.env["LOGNAME"];

const { autoUpdater } = require("electron-updater");

const { bgColor, cols, rows, shellSettings } = getSettings();

const TrayImage = nativeImage.createFromPath("./build/icon@4x.png");

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
mainWindow.on("ready-to-show", function () {
  var nativeHandleBuffer = mainWindow.getNativeWindowHandle();
  var electronVibrancy = require(path.join(__dirname, "..", ".."));

  // Whole window vibrancy with Material 0 and auto resize
  electronVibrancy.SetVibrancy(mainWindow, 0);

  // auto resizing vibrant view at {0,0} with size {300,300} with Material 0
  //electronVibrancy.AddView(mainWindow, { Width: 300,Height:300,X:0,Y:0,ResizeMask:2,Material:0 })

  // non-resizing vibrant view at {0,0} with size {300,300} with Material 0
  //electronVibrancy.AddView(mainWindow, { Width: 300,Height:300,X:0,Y:0,ResizeMask:3,Material:0 })

  // Remove a view
  // var viewId = electronVibrancy.SetVibrancy(mainWindow, 0);
  // electronVibrancy.RemoveView(mainWindow,viewId);

  // Add a view then update it
  // var viewId = electronVibrancy.SetVibrancy(mainWindow, 0);
  // electronVibrancy.UpdateView(mainWindow,{ ViewId: viewId,Width: 600, Height: 600 });

  // Multipe views with different materials
  // var viewId1 = electronVibrancy.AddView(mainWindow, { Width: 300,Height:300,X:0,Y:0,ResizeMask:3,Material:0 })
  // var viewId2 = electronVibrancy.AddView(mainWindow, { Width: 300,Height:300,X:300,Y:0,ResizeMask:3,Material:2 })

  // console.log(viewId1);
  // console.log(viewId2);

  // // electronVibrancy.RemoveView(mainWindow,0);
  // // electronVibrancy.RemoveView(mainWindow,1);

  // // or

  //electronVibrancy.DisableVibrancy(mainWindow);

  mainWindow.show();
});
