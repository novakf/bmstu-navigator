const path = require("path")

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.html$/i,
        loader: "html-loader",
      })

      webpackConfig.resolve.alias = {
        "@svgedit/svgcanvas": path.resolve(__dirname, "src/svgedit/canvas"),
      }

      webpackConfig.ignoreWarnings = [
        { message: /source-map-loader/ },
        { message: /Critical dependency/ },
      ]

      return webpackConfig
    },
  },
}
