const { WebglAddon } = require("xterm-addon-webgl");
const { getSettings } = require("./settings");
const { FitAddon } = require("./xterm-addon-fit");

const ipc = require("electron").ipcRenderer;

const { bgColor, cols, rows, CursorBlink, FontFamily, FontSize } =
  getSettings();

//const FitAddon = require("xterm-addon-fit");
var term = new Terminal({
  fontSize: FontSize,
  fontFamily: FontFamily,
  cursorBlink: CursorBlink,
  termProgram: "Kaiium",
});
term.setOption("theme", {
  background: bgColor,
});
var webgl = new WebglAddon();
//var fitAddon = new FitAddon.FitAddon();
const fitAddon = new FitAddon();

/*term.onData(function (data) {
  term.write(data);
});*/
document.body.style.backgroundColor = bgColor;
term.open(document.getElementById("terminal"));
term.loadAddon(fitAddon);
term.loadAddon(webgl);
fitAddon.fit();
/*permissions.askForFullDiskAccess();
permissions.askForContactsAccess();
permissions.askForCalendarAccess();
permissions.askForSpeechRecognitionAccess();
permissions.askForRemindersAccess();
permissions.askForCameraAccess();
permissions.askForInputMonitoringAccess();
permissions.askForMicrophoneAccess();
permissions.askForMusicLibraryAccess();
permissions.askForPhotosAccess();
permissions.askForScreenCaptureAccess();
permissions.askForAccessibilityAccess();*/
//term.write("export TERM_PROGRAM=Kaiium\n");

function log() {
  console.log(
    term.cols,
    term.rows,
    viewport.style.lineHeight,
    viewport.style.height
  );
}

var viewport = document.querySelector(".xterm-viewport");
log();

term.onRender = function () {
  fitAddon.fit();
};

window.onresize = function () {
  log();
  fitAddon.fit();
};

ipc.on("terminal.incomingData", (event, data) => {
  term.write(data);
});

term.onData((e) => {
  ipc.send("terminal.keystroke", e);
});
console.log(bgColor);
