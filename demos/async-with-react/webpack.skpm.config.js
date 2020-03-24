module.exports = function(config, entry) {
  config.node = entry.isPluginCommand
    ? false
    : {
        setImmediate: false
      };

  // https://sketchplugins.com/d/1205-guide-how-to-use-async-await-functions-in-your-plugin
  config.entry = ["@babel/polyfill", config.entry];

  config.resolve.extensions = [".sketch.js", ".js", ".jsx"];

  config.module.rules.push({
    test: /\.(html)$/,
    use: [
      {
        loader: "@skpm/extract-loader"
      },
      {
        loader: "html-loader",
        options: {
          attrs: ["img:src", "link:href"],
          interpolate: true
        }
      }
    ]
  });
  config.module.rules.push({
    test: /\.(css)$/,
    use: [
      {
        loader: "@skpm/extract-loader"
      },
      {
        loader: "css-loader"
      }
    ]
  });
  config.module.rules.push({
    test: /\.less$/,
    use: [
      {
        loader: "style-loader" // creates style nodes from JS strings
      },
      {
        loader: "css-loader" // translates CSS into CommonJS
      },
      {
        loader: "less-loader" // compiles Less to CSS
      }
    ]
  });
};
