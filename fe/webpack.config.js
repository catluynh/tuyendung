module.exports = {
  //...
  devServer: {
    compress: true,
    disableHostCheck: true,
    port: 3000,
    contentBase: path.resolve(__dirname, "dist"),
    historyApiFallback: { index: "/", disableDotRule: true },
  },
};