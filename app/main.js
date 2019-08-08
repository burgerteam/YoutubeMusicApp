const {app, BrowserWindow} = require("electron");

let window = null;
const createWindow = () => {
    window = new BrowserWindow({show: false});
    window.loadURL("https://music.youtube.com");
    window.once("ready-to-show", () => {
        window.show();
    });
    window.on("closed", () => {
        window = null;
    });
};

app.on("ready", () => {
    createWindow();
});
