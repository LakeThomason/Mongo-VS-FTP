const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
  entry: path.resolve(__dirname, "app/client/public/index.js"),
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.bundled.js"
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: "file-loader"
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: "svg-react-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./app/client/public/index.html",
      favicon: "./app/client/public/favicon.ico"
    })
  ],
  devServer: {
    publicPath: "/",
    contentBase: "/app",
    hot: true,
    overlay: true,
    port: 5000,
    inline: true,
    open: "http://localhost:5000"
  }
};

module.exports = config;
