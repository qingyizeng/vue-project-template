const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  publicPath: process.env.VUE_APP_CONTEXT_PATH,
});
