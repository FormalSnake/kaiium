// This imports the webGL addon for xterm, which allows for gpu acceleration
const { WebglAddon } = require("xterm-addon-webgl");
// Imports the getSettings function
const { getSettings } = require("../BackEnd/settings");
// This imports the FitAddon which allows for window resizing
//const { FitAddon } = require("../xterm-addon-fit/typings/xterm-addon-fit");
const { FitAddon } = require("xterm-addon-fit");
// This gets the ipc from electron
const ipc = require("electron").ipcRenderer;
// This gets the settings variables required in this file
const { bgColor, CursorBlink, FontFamily, FontSize } = getSettings();

//const FitAddon = require("xterm-addon-fit");
// This creates the xterm.js front end
var term = new Terminal({
  // Sets the size of the text
  fontSize: FontSize,
  // Sets the font of the text
  fontFamily: FontFamily,
  // Sets if the cursor blinks or not
  cursorBlink: CursorBlink,
  // This gives the terminal name to other programs like neofetch
  termProgram: "Kaiium",
  experimentalCharAtlas: "dynamic",
  // This allows xterm.js to use rgba backgrounds
  allowTransparency: "true",
});
// This sets the background color of xterm.js
term.setOption("theme", {
  background: bgColor,
});
// This instantiates the webGL addon
const webgl = new WebglAddon();
//var fitAddon = new FitAddon.FitAddon();
// This instantiates the fitAddon addon
const fitAddon = new FitAddon();

/*term.onData(function (data) {
  term.write(data);
});*/
// This sets the background color of the window itself, so that you don't get white borders around xterm.js
document.body.style.backgroundColor = bgColor;
// This spawns xterm.js in the terminal div
term.open(document.getElementById("terminal"));
// Loads the fitAddon addon into xterm.js
term.loadAddon(fitAddon);
// Loads the webGL addon into xterm.js
term.loadAddon(webgl);
// This fits xterm.js into your window
fitAddon.fit();

// Logs xterm.js dimensions, call this function to debug window resizing.
function log() {
  console.log(
    term.cols,
    term.rows,
    viewport.style.lineHeight,
    viewport.style.height
  );
}
// Gets the xterm viewport, which appears after spawning xterm.js
var viewport = document.querySelector(".xterm-viewport");
//var canvas = document.querySelectorAll("canvas");
// This logs in the inspect element console, enable when needed
// log();
// Fits again, because im paranoid
term.onRender = function () {
  fitAddon.fit();
};
// Same here
window.onresize = function () {
  // Logs the window dimensions when resized
  //log();
  fitAddon.fit();
};
// Writes incoming data from the pty process into xterm.js
ipc.on("terminal.incomingData", (event, data) => {
  term.write(data);
});
// Does the same kindof
term.onData((e) => {
  ipc.send("terminal.keystroke", e);
});
// To debug the background color, enable if needed
// console.log(bgColor);
// This resizes the pty process itself
term.onResize(function (size) {
  ipc.send("terminal.resize", size);
});
// This writes the version number into the terminal window
term.write("Kaiium V1.1.0 ");
// This handles the copy and paste for the pty process
term.attachCustomKeyEventHandler((arg) => {
  if (arg.ctrlKey && arg.code === "KeyV" && arg.type === "keydown") {
    navigator.clipboard.readText().then((text) => {
      term.write(text);
    });
  }
  return true;
});
