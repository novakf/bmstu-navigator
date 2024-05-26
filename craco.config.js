const path = require("path")

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules[1].oneOf.unshift(
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        { test: /\.svg$/, loader: "svg-inline-loader" }
      )
      console.log(webpackConfig.module.rules[1])

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
