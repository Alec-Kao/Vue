module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        },
        exclude: /node_modules/
      }
    ]
  }
}

// const { VueLoaderPlugin } = require('vue-loader')
// const path = require('path')

// module.exports = {
//   entry: './src/main.ts',
//   resolve: {
//     extensions: ['.ts', '.js', '.vue'],
//     alias: {
//       vue: 'vue/dist/vue.esm-bundler.js'
//     }
//   },
//   module: {
//     rules: [
//       {
//         test: /\.vue$/,
//         loader: 'vue-loader'
//       },
//       {
//         test: /\.ts$/,
//         loader: 'ts-loader',
//         exclude: /node_modules/,
//         options: {
//           appendTsSuffixTo: [/\.vue$/]
//         }
//       }
//     ]
//   },
//   plugins: [new VueLoaderPlugin()]
// }