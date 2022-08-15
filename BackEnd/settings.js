// This gets the file system of the computer, eg. Finder, File explorer, etc.
const fs = require("fs");
// These are the default settings for this application
const default_settings = {
  // Background color
  bgColor: "rgba(26, 27, 38, 0.1)",
  // Width
  cols: 158,
  // Height
  rows: 45,
  // The shell used
  shellSettings: "/bin/zsh",
  // Cursor blinking
  CursorBlink: true,
  // The text font
  FontFamily: "SauceCodePro Nerd Font",
  // The text size
  FontSize: 14,
  // Blur type
  // type string | null - Can be appearance-based, light, dark, titlebar, selection, menu, popover, sidebar, medium-light, ultra-dark, header, sheet, window, hud, fullscreen-ui, tooltip, content, under-window, or under-page.
  blurType: "hud",
  // Toggles the blur
  completeTransparent: false,
};
// The file name and path for the configuration file.
// It gets stored in the .config folder in your home directory
var fileName = `${process.env["HOME"]}/.config/kaiium_config.json`;

// Gets the settings
const getSettings = () => {
  const getSettingsFromFile = () => {
    // If the file already exists, it will read its data
    if (!!fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName, { encoding: "utf-8" });
      return JSON.parse(data);
    }
    // In case it doesn't exist, it creates the file instead
    else {
      fs.writeFile(fileName, JSON.stringify(default_settings), (err) => {
        if (err) {
          console.log("An error ocurred creating the file " + err.message);
        }
        console.log("The file has been succesfully saved");
      });
      if (fileName === undefined) {
        console.log("You didn't save the file");
        return;
      }
      return {};
    }
  };

  return { ...default_settings, ...getSettingsFromFile() };
};

exports.getSettings = getSettings;
