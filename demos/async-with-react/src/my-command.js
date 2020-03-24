import BrowserWindow from "sketch-module-web-view";
import { getWebview } from "sketch-module-web-view/remote";
import UI from "sketch/ui";

const webviewIdentifier = "async-with-react.webview";

// from https://blog.magicsketch.io/interacting-with-objective-c-classes-in-cocoascript-68be7f39616f
const Class = function(className, BaseClass, selectorHandlerDict) {
  const uniqueClassName = className + NSUUID.UUID().UUIDString();
  const delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(
    uniqueClassName,
    BaseClass
  );
  for (let selectorString in selectorHandlerDict) {
    delegateClassDesc.addInstanceMethodWithSelector_function_(
      selectorString,
      selectorHandlerDict[selectorString]
    );
  }
  delegateClassDesc.registerClass();
  return NSClassFromString(uniqueClassName);
};

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

  const computeN = () => {
    log("ccc 1");
    // This may take 6~8 seconds.
    let n = 0;
    for (let i = 0; i < 3000000000; i++) {
      n = n + 1;
    }
    log("ccc 2");
    return n;
  };

  // failed
  const longRun = () => {
    const fiber = require("sketch/async").createFiber();

    log("long run p");

    return new Promise(async (resolve, reject) => {
      // We need something that takes a while....
      log("start compute n");

      log("xxxxx");
      const n = computeN();

      fiber.cleanup();

      log("done compute n");
      log(n);
      resolve(n);
    });
  };

  // add a handler for a call from web content's javascript
  webContents.on("sayhi", s => {
    UI.message("start...");

    // const fiber = require("sketch/async").createFiber();

    // longRun()
    //   .then(res => {
    //     webContents.executeJavaScript(`result(${res})`).catch(console.error);
    //   })
    //   .catch(err => log(err));

    var Exporter = Class("Exporter", NSObject, {
      "exportImageWithParameters:": args => {
        const resolve = args[0];
        const reject = args[1];

        try {
          log("bbbbb");
          const res = computeN();
          log("dddd");
          log("res");
          log(res);

          
          

          resolve(res);

          log("eee");
        } catch (err) {
          reject(err);
        }

        // coscript.setShouldKeepAround(false);
        
      },
      "hello:": args => {
        const result = args[0];

        log("IIII");
        webContents.executeJavaScript(`result(${result})`).catch(console.error);
      }
    });

    var exporter = Exporter.new();

    (async () => {
      log("x");

      const re = await new Promise((resolve, reject) => {
        log("aaaaaa");

        exporter.performSelectorInBackground_withObject(
          "exportImageWithParameters:",
          [resolve, reject]
        );
        // fiber.cleanup();
        
      });

      

      log("yy");
      log(re);

      exporter.performSelectorOnMainThread_withObject_waitUntilDone(
        "hello:",
        [re],
        true
      );

      log("zz");
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
