// import { app, BrowserWindow, ipcMain } from 'electron'
// import path from 'node:path'
// import os from 'node:os'
// import { fileURLToPath } from 'node:url'
// import { scheduleNotification } from './background.js'
// // needed in case process is undefined under Linux
// const platform = process.platform || os.platform()

// const currentDir = fileURLToPath(new URL('.', import.meta.url))

// let mainWindow

// async function createWindow() {
//   /**
//    * Initial window options
//    */
//   mainWindow = new BrowserWindow({
//     icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
//     width: 1000,
//     height: 600,
//     useContentSize: true,
//     webPreferences: {
//       contextIsolation: true,
//       // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
//       preload: path.resolve(
//         currentDir,
//         path.join(
//           process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
//           'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
//         ),
//       ),
//     },
//   })

//   if (process.env.DEV) {
//     await mainWindow.loadURL(process.env.APP_URL)
//   } else {
//     await mainWindow.loadFile('index.html')
//   }

//   if (process.env.DEBUGGING) {
//     // if on DEV or Production with debug enabled
//     mainWindow.webContents.openDevTools()
//   } else {
//     // we're on production; no access to devtools pls
//     mainWindow.webContents.on('devtools-opened', () => {
//       mainWindow.webContents.closeDevTools()
//     })
//   }

//   mainWindow.on('closed', () => {
//     mainWindow = null
//   })
// }

// app.whenReady().then(createWindow)

// app.on('window-all-closed', () => {
//   if (platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow()
//   }
// })
// ipcMain.on('schedule-notification', (event, dateTime) => {
//   scheduleNotification(new Date(dateTime))
// })
//=========================================================

// import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron' // إضافة Tray و Menu
// import path from 'node:path'
// import os from 'node:os'
// import { fileURLToPath } from 'node:url'
// import { scheduleNotification } from './background.js'

// const platform = process.platform || os.platform()
// const currentDir = fileURLToPath(new URL('.', import.meta.url))

// let mainWindow
// let tray // تعريف متغير للـ Tray

// async function createWindow() {
//   mainWindow = new BrowserWindow({
//     icon: path.resolve(currentDir, 'icons/icon.png'),
//     width: 1000,
//     height: 600,
//     useContentSize: true,
//     webPreferences: {
//       contextIsolation: true,
//       preload: path.resolve(
//         currentDir,
//         path.join(
//           process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
//           'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
//         ),
//       ),
//     },
//   })

//   if (process.env.DEV) {
//     await mainWindow.loadURL(process.env.APP_URL)
//   } else {
//     await mainWindow.loadFile('index.html')
//   }

//   if (process.env.DEBUGGING) {
//     mainWindow.webContents.openDevTools()
//   } else {
//     mainWindow.webContents.on('devtools-opened', () => {
//       mainWindow.webContents.closeDevTools()
//     })
//   }

//   mainWindow.on('closed', () => {
//     mainWindow = null
//   })
// }

// app.whenReady().then(() => {
//   createWindow()

//   // إنشاء Tray
//   tray = new Tray(path.resolve(currentDir, 'icons/icon.png'))
//   const contextMenu = Menu.buildFromTemplate([
//     {
//       label: 'Show App',
//       click: () => {
//         mainWindow.show()
//       },
//     },
//     {
//       label: 'Quit',
//       click: () => {
//         app.quit()
//       },
//     },
//   ])
//   tray.setToolTip('Quasar Alarm App')
//   tray.setContextMenu(contextMenu)

//   tray.on('click', () => {
//     if (mainWindow) {
//       mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
//     } else {
//       createWindow()
//     }
//   })
// })

// app.on('window-all-closed', () => {
//   if (platform !== 'darwin') {
//     // لا تقم بإنهاء التطبيق عند إغلاق جميع النوافذ
//   }
// })

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// ipcMain.on('schedule-notification', (event, dateTime) => {
//   scheduleNotification(new Date(dateTime))
// })
//=========================================================
import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { scheduleNotification } from './background.js'
import AutoLaunch from 'electron-auto-launch' // إضافة مكتبة AutoLaunch

const platform = process.platform || os.platform()
const currentDir = fileURLToPath(new URL('.', import.meta.url))

let mainWindow
let tray

// إعداد AutoLaunch
const autoLauncher = new AutoLaunch({
  name: 'Quasar Alarm App',
  path: app.getPath('exe'),
})

autoLauncher
  .isEnabled()
  .then((isEnabled) => {
    if (!isEnabled) autoLauncher.enable()
  })
  .catch((err) => {
    console.error('Error enabling auto-launch:', err)
  })

async function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'),
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
        ),
      ),
    },
  })

  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL)
  } else {
    await mainWindow.loadFile('index.html')
  }

  if (process.env.DEBUGGING) {
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  tray = new Tray(path.resolve(currentDir, 'icons/icon.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show()
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      },
    },
  ])
  tray.setToolTip('Quasar Alarm App')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    } else {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    // لا تقم بإنهاء التطبيق عند إغلاق جميع النوافذ
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('schedule-notification', (event, dateTime) => {
  scheduleNotification(new Date(dateTime))
})
