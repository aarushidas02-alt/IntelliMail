const { app, BrowserWindow } = require("electron");
const path = require("path");

// APP ID + APP NAME
app.setName("IntelliMail");
app.setAppUserModelId("com.intellimail.app");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,

    // APP ICON
    icon: path.join(__dirname, "assets/intellimail.png"),

    autoHideMenuBar: true,
    backgroundColor: "#0f172a",
  });

  // LOAD YOUR LIVE WEBSITE
  win.loadURL("https://intelli-mail-lilac.vercel.app");
}

// APP READY
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// CLOSE APP
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});