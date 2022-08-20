# Kaiium terminal

![alt text](https://github.com/superlopez-real/kaiium/blob/master/Screenshot.png?raw=true)

## What is Kaiium terminal?

Kaiium terminal is a terminal made using web technologies, it is made using Electron and Xterm JS, which makes it cross-platform easily. It is designed to be performant, yet powerful.

## What are the benefits?

Since it is made using web-technologies, you get the benefits of WebGL gpu-acceleration (if available), better font rendering and the ability to display images using some clis.

## What makes Kaiium terminal stand out?

Not much yet, because the terminal is not finished, but I am planning to add support for numerous tools to help workflows, like putting reference images, plugins, and more! Right now what makes it stand out is the fact that there are no many performant terminals using web technologies.

# Configuration

In your .config folder in your home directory, if not automatically made after opening the terminal, create a file named: `kaiium_config.json`
This is how it would look like inside of the configuration file:
(This is what i personally use)

    {
      "bgColor": "rgba(26, 27, 38, 0.1)",
      "cols": 190,
      "rows": 46,
      "shellSettings": "/bin/zsh",
      "CursorBlink": true,
      "FontFamily": "SauceCodePro Nerd Font",
      "FontSize": 18,
      "blurType": "hud",
      "completeTransparent": false,
      "showContextMenu": false
    }

If your terminal text looks all weird, install the SauceCodePro Nerd Font onto your computer, which can be found here: https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/SourceCodePro/Regular/complete/Sauce%20Code%20Pro%20Nerd%20Font%20Complete.ttf

# Developing

Documentation will be available in the future!

# Compiling from source

First download this repository: `git clone https://github.com/superlopez-real/kaiium.git`
Go into the directory: `cd kaiium`
Get all of the dependecies: `npm install`
Start kaiium! `npm start`

# Building

See package.json!

# Exiting

You can exit by typing exit in the terminal, or cmd+q or alt+f4.

# To-Do

- [ ] Windows support
- [x] Mac support
- [x] Linux support (Untested but should work)
- [x] Fancy window blur and transparency
- [x] Configuration system (In your .config folder in your home directory)
- [x] Window resizing
- [ ] Multiple terminal instances
