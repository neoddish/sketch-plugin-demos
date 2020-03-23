import BrowserWindow from "sketch-module-web-view";
import { getWebview } from "sketch-module-web-view/remote";
import UI from "sketch/ui";

const webviewIdentifier = "async-with-react.webview";

export default function() {
  const options = {
    identifier: webviewIdentifier,
    width: 240,
    height: 180,
    show: false,
    hidesOnDeactivate: false
  };

  const browserWindow = new BrowserWindow(options);

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once("ready-to-show", () => {
    browserWindow.show();
  });

  const webContents = browserWindow.webContents;

  // print a message when the page loads
  webContents.on("did-finish-load", () => {
    UI.message("UI loaded!");
  });

  // add a handler for a call from web content's javascript
  webContents.on("sayhi", s => {
    UI.message(s);

    // We need something that takes a while....
    log("start compute n");
    // This may take 6~8 seconds.
    let n = 0;
    for (let i = 0; i < 3000000000; i++) {
      n = n + 1;
    }
    log("done compute n");

    webContents.executeJavaScript(`result(${n})`).catch(console.error);
  });

  browserWindow.loadURL(require("../resources/webview.html"));
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier);
  if (existingWebview) {
    existingWebview.close();
  }
}
