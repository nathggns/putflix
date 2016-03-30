# Putflix

Custom browser for putlocker.is enabling a Netflix-like experience on the site.

**Note: This is not yet functional**

This is an [Electron](http://electron.atom.io/) application.

## Install

Clone this repository, so execute the following command.

```bash
cd putflix
npm install -g gulp electron-prebuilt
npm install
```

## Run application
### With file watch and livereload

```bash
gulp serve
```

### Pre-packaging app

```bash
gulp build;electron dist
```

## Package application

```bash
gulp package
```

## Directory structure

```
+ .serve/              Compiled files
+ dist/                Application for distribution
- release/             Packaged applications for platforms
 |+ darwin/
 |+ linux/
 |+ win32/
- src/                 Source directory
 |- assets/
  |+ images/
 |- browser/           For browser process scripts
  |+ menu/
 |- renderer/          For renderer process scripts and resources
  |+ components/       React components
  |  bootstrap.js      Entry point for render process
  |  index.html
 |- styles/            SCSS directory
  |  main.scss
 |  app.js             Entry point for browser process
  gulpfile.js
  package.json
```

