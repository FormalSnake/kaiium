const fs = require("fs");

const default_settings = {
  bgColor: "rgba(26, 27, 38, 0.1)",
  cols: 158,
  rows: 45,
  shellSettings: "/bin/zsh",
  CursorBlink: true,
  FontFamily: "SauceCodePro Nerd Font",
  FontSize: 14,
  blurType: "hud",
  completeTransparent: false,
};
var fileName = `${process.env["HOME"]}/.config/kaiium_config.json`;

const getSettings = () => {
  const getSettingsFromFile = () => {
    if (!!fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName, { encoding: "utf-8" });
      return JSON.parse(data);
    } else {
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
