const { Application } = require('ee-core');
const {app, session} = require("electron");
const CoreElectronApp = require('ee-core/electron/app');
const Cross = require('ee-core/cross');
const EE = require('ee-core/ee');
class Index extends Application {

  constructor() {
    super();
    // this === eeApp;
  }

  /**
   * core app have been loaded
   */
  async ready () {
    // do some things
    CoreElectronApp.create = async () => {
      const { CoreApp } = EE;

      app.whenReady().then(() => {
        CoreApp.createWindow();
        // only one instance is guaranteed
        const gotTheLock = app.requestSingleInstanceLock()
        if (!gotTheLock) {
          app.quit();
        }

        // show the first opened window
        app.on('second-instance', (event, argv, workingDirectory) => {
          this.mainWindow.show();
        });

      })

      app.on('window-all-closed', () => {
        if (!UtilsIs.macOS) {
          Log.coreLogger.info('[ee-core] [lib/eeApp] window-all-closed quit');
          CoreApp.appQuit();
        }
      })

      app.on('before-quit', () => {
        Electron.extra.closeWindow = true;

        // kill cross services
        Cross.kill();
      })

      return app;
    }
  }

  /**
   * electron app ready
   */
  async electronAppReady () {
    // do some things
  }

  /**
   * main window have been loaded
   */
  async windowReady () {
    // do some things
    // 延迟加载，无白屏
    const winOpt = this.config.windowsOption;
    if (winOpt.show == false) {
      const win = this.electron.mainWindow;
      win.once('ready-to-show', () => {
        win.show();
        win.focus();
      })
    }
  }

  /**
   * before app close
   */  
  async beforeClose () {
    // do some things

  }
}

Index.toString = () => '[class Index]';
module.exports = Index;