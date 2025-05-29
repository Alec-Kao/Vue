// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })
const path = require("path");
const debug = process.env.NODE_ENV !== "production";

module.exports = {
  publicPath: "/", // 跟遇上下文目錄
  outputDir: "dist", // 構建輸出目錄
  assetsDir: "assets", // 靜態資源目錄 (js, css, img, fonts)
  lintOnSave: false, // 是否開啟eslint保存檢測, true | false | 'error'
  runtimeCompiler: true, //運行時版本是否需要編譯
  transpileDependencies: true,
  productionSourceMap: true, // 是否再購艦生產包時生成 sourceMap 文件, false 將提高購艦速度 
  configureWebpack: config => {
    if (debug) {
      // 開發環境配置
      // config.devtool = "cheap-module-eval-source-map"; // Vue 2
      config.devtool = "eval-cheap-module-source-map";
    } else {
      // 生產環境配置
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          ...options.compilerOptions,
          bindingMetadata: {}
        }
        return options
      });

    if (debug) {
      // 開發環境配置
    } else {
      // 生產環境配置
    }
  },
  parallel: require("os").cpus().length > 1,
  pluginOptions: {
    // 第三方插件
  },
  pwa: {
    // 單頁插件相關配置
    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  },
  devServer: {
    open: true,
    host: "0.0.0.0",
    port: 8080,
    https: false,
    // hotOnly: false, // vue 2
    hot: false,
    proxy: {
      // 配置跨域
      "/api": {
        target: "http://localhost:5000/api",
        ws:true,
        changeOrigin: true,
        pathRewrite: { "^/api": "" }
      }
    },
    // before: app => {} // Vue 2
    onBeforeSetupMiddleware(devServer) {
      console.log("自訂中間件載入前...");
    }
  }
};

// module.exports = {
//   transpileDependencies: true,
//   chainWebpack: config => {
//     config.module
//       .rule('vue')
//       .use('vue-loader')
//       .tap(options => {
//         options.compilerOptions = {
//           ...options.compilerOptions,
//           bindingMetadata: {}
//         }
//         return options
//       })
//   }
// }
