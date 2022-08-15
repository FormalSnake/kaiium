// Imports dependencies for executing electron
const { app, ipcMain, BrowserWindow } = require("electron");

// Imports node-pty, which is required for the actual terminal process
const pty = require("node-pty");
// Gets the os you are on, to switch between eg. bash and zsh depending on your operating system
const os = require("os");
// This is a custom function that imports the settings library
const { getSettings } = require("./BackEnd/settings");
// This is the auto updater that updates the application when a new version comes out.
const { autoUpdater } = require("electron-updater");
// This gets the required settings from the settings file using the getSettings(); function
const { cols, rows, shellSettings, blurType, completeTransparent } =
  getSettings();

// Enable live reload for all the files inside your project directory
require("electron-reload")(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(`${__dirname}/node_modules/electron`),
});

// This logs the settings (Good for debugging purposes)
// console.log(getSettings());

// This gets what shell to use using your operating system.
var shell =
  os.platform() === "win32"
    ? "powershell.exe"
    : shellSettings; /* fish shell path: "/opt/homebrew/bin/fish"*/

let mainWindow;
// This is the configuration for the electron window
function createWindow() {
  // Creates the window object
  mainWindow = new BrowserWindow({
    // The height of the application
    height: 1080,
    // The width of the application
    width: 1920,
    // This starts the application in the center of your screen
    center: true,
    // This disables the default macOS window bar
    frame: false,
    // This allows for the see-trough window
    transparent: true,
    // Web permissions to make the application actually work as intended
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      allowRunningInsecureContent: true,
    },
  });
  // This loads the terminal using dynamic directories
  mainWindow.loadURL(`file://${__dirname}/FrontEnd/index.html`);
  // type string | null - Can be appearance-based, light, dark, titlebar, selection, menu, popover, sidebar, medium-light, ultra-dark, header, sheet, window, hud, fullscreen-ui, tooltip, content, under-window, or under-page.
  //mainWindow.setVibrancy("hud");
  // When the main window is closed, it sets the main window to nothing
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  // This checks if there is a new version available, and notifies it to the process
  autoUpdater.checkForUpdatesAndNotify();
  // When there is an update available, it changes the window to the updating screen
  autoUpdater.on("update-available", function () {
    mainWindow.loadURL(`file://${__dirname}/FrontEnd/updater.html`);
  });
  // When the update has been downloaded, it quits the application and installs it
  autoUpdater.on("update-downloaded", (updateInfo) => {
    setTimeout(() => {
      autoUpdater.quitAndInstall();
      app.exit();
    }, 10000);
  });
  // If the completeTransparent setting is enabled, it sets the blurry transparency.
  if (!completeTransparent) {
    mainWindow.setVibrancy(blurType);
  }
  //ipcing
  // This starts the pty process, with basic terminal configurations
  var ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: cols,
    rows: rows,
    cwd: process.env.HOME,
    env: process.env,
  });
  // This sends your input to the ptyProcess
  ptyProcess.on("data", function (data) {
    mainWindow.webContents.send("terminal.incomingData", data);
    // console.log("Sent data to terminal");
    console.log(data);
  });

  // Exits the application
  ptyProcess.onExit((exitCode) => {
    app.quit();
  });

  /*ptyProcess.onData((data) => {
  console.log(data);
});*/
  // Write in the terminal
  ipcMain.on("terminal.keystroke", (event, key) => {
    ptyProcess.write(key);
  });
  // This resizes the terminal when called
  ipcMain.on("terminal.resize", (event, size) => {
    ptyProcess.resize(size.cols, size.rows);
    console.log("resized");
  });
}

// Create a window when the app is ready
app.on("ready", createWindow);

// When there are no windows, it just quits the entire process
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// When the app is activated it creates a new window
app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
