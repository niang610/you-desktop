const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  MenuItem,
  screen,
} = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;

const contextMenuTemplate = [
  {
    label: "Exit",
    click: () => {
      mainWindow.close();
    },
  },
];

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    x: Math.floor((width - 800) / 2), // Calculate the x position for centering
    y: Math.floor((height - 600) / 2), // Calculate the y position for centering
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
  });

  mainWindow.loadURL("https://you.com");
  mainWindow.setVisibleOnAllWorkspaces(true);

  mainWindow.on("blur", () => {
    mainWindow.hide();
  });

  globalShortcut.register("CommandOrControl+Shift+Y", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  const floatingButton = new BrowserWindow({
    width: 80,
    height: 90,
    x: width - 100, // Calculate the x position for centering
    y: height - 100, // Calculate the y position for centering
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    resizable: false,
  });
  floatingButton.setVisibleOnAllWorkspaces(true);

  floatingButton.loadURL(
    url.format({
      pathname: path.join(__dirname, "floatingButton.html"),
      protocol: "file",
      slashes: true,
    })
  );

  ipcMain.on("toggleMainWindow", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });

  ipcMain.on("show-context-menu", (event, x, y) => {
    const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
    contextMenu.popup({ window: mainWindow, x, y });
  });

  mainWindow.on("closed", () => {
    app.quit();
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  console.log(1);
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
