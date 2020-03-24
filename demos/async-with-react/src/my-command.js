import BrowserWindow from "sketch-module-web-view";
import { getWebview } from "sketch-module-web-view/remote";
import UI from "sketch/ui";
import MochaJSDelegate from "mocha-js-delegate";

const webviewIdentifier = "async-with-react.webview";

const Delegate = new MochaJSDelegate({
  "doSomething:": args => {
    const resolve = args[0];
    const reject = args[1];

    try {
      log("ccc 1");
      // This may take 6~8 seconds.
      let n = 0;
      for (let i = 0; i < 3000000000; i++) {
        n = n + 1;
      }
      log("ccc 2");
      log(n);
      resolve(n);
    } catch (err) {
      log(err);
      reject(err);
    }
  },
  "notifyStatus:": args => {
    const webContents = args[0];
    const msg = args[1];

    const str = `${msg}`;

    log("IIII");
    webContents.executeJavaScript(`result(${str})`).catch(console.error);
  }
});

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
    UI.message("start.....5");

    log("111");

    const delegate = Delegate.getClassInstance();

    log("222");

    (async () => {
      try {
        log("xxx 10");

        const result = await new Promise((resolve, reject) => {
          log("aaaaaa");

          delegate.performSelectorInBackground_withObject("doSomething:", [
            resolve,
            reject
          ]);
        });

        log("yy");
        log(result);

        delegate.performSelectorOnMainThread_withObject_waitUntilDone(
          "notifyStatus:",
          [webContents, result],
          true
        );

        log("zz");
      } catch (err) {
        log("err");
        log(err);
      }
    })();
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
