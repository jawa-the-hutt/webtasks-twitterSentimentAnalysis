var webpack = require('webpack');
var path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var nodeExternals = require('webpack-node-externals');
var isProd = (process.env.NODE_ENV === 'production');


module.exports = {
  entry: {
    'webtask': './index.js',
  }, 
  target: 'node',
  output: {
    path: __dirname,
    filename: '[name].js',
    libraryTarget: "commonjs2"
  },
  node: {
    __filename: false,
    __dirname: false
  },
  externals: [nodeExternals()],
  module: {
    rules: [ 
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: getPlugins()
}


function getPlugins() {
  var plugins = [];

  // Always expose NODE_ENV to webpack, you can now use `process.env.NODE_ENV`
  // inside your code for any environment checks; UglifyJS will automatically
  // drop any unreachable code.
  plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }));

  //plugins.push(new webpack.IgnorePlugin(/^(buffertools)$/));

  // Conditionally add plugins for Production builds.
  if (isProd) {
    plugins.push(
      new UglifyJSPlugin({
        uglifyOptions: {
          ie8: false,
          warnings: false,
          mangle: false,
          compress: {
            warnings: false, // Suppress uglification warnings
            pure_getters: true
          },
          output: {
            comments: false,
          },
          exclude: [/\.min\.js$/gi] // skip pre-minified libs
        }
      })
    );
  }

  // Conditionally add plugins for Development
  else {
    // ...
  }

  return plugins;
}




// var webpack = require('webpack');
// var path = require('path');
// var _ = require('lodash');
// var Request = require('request-promise');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// var isProd = (process.env.NODE_ENV === 'production');

// var LIST_MODULES_URL = 'https://webtask.it.auth0.com/api/run/wt-tehsis-gmail_com-1?key=eyJhbGciOiJIUzI1NiIsImtpZCI6IjIifQ.eyJqdGkiOiJmZGZiOWU2MjQ0YjQ0YWYyYjc2YzAwNGU1NjgwOGIxNCIsImlhdCI6MTQzMDMyNjc4MiwiY2EiOlsiZDQ3ZDNiMzRkMmI3NGEwZDljYzgwOTg3OGQ3MWQ4Y2QiXSwiZGQiOjAsInVybCI6Imh0dHA6Ly90ZWhzaXMuZ2l0aHViLmlvL3dlYnRhc2tpby1jYW5pcmVxdWlyZS90YXNrcy9saXN0X21vZHVsZXMuanMiLCJ0ZW4iOiIvXnd0LXRlaHNpcy1nbWFpbF9jb20tWzAtMV0kLyJ9.MJqAB9mgs57tQTWtRuZRj6NCbzXxZcXCASYGISk3Q6c';

// module.exports = Request.get(LIST_MODULES_URL, { json: true }).then(function (data) {
//   var modules = data.modules;
  
//   return {
//     entry: //{
//       _.set({}, 'webtask', './index.js'),
//     //}, 
//     output: {
//       path: __dirname, //path.join(__dirname, "build"),
//       filename: '[name].js',
//       publicPath: '/build/',
//       libraryTarget: "commonjs2"
//     },
//     externals: _(modules).reduce(function (acc, module) {
//       return _.set(acc, module.name, true);
//     }, {
//         // Not provisioned via verquire
//         'auth0-api-jwt-rsa-validation': true,
//         'auth0-authz-rules-api': true,
//         'auth0-oauth2-express': true,
//         'auth0-sandbox-ext': true,
//         'detective': true,
//         'sandboxjs': true,
//         'webtask-tools': true,
//     }),
//     node: false,
//     module: {
//       rules: [ 
//         // { test: /rx\.lite\.aggregates\.js/, use: 'imports-loader?define=>false' },
//         {
//           test: /\.js$/,
//           exclude: /(node_modules)/,
//           use: {
//             loader: 'babel-loader'
//           }
//         }
//       ]
//     },
    
//     plugins: getPlugins() 
//   }
// });


// function getPlugins() {
//   var plugins = [];

//   // Always expose NODE_ENV to webpack, you can now use `process.env.NODE_ENV`
//   // inside your code for any environment checks; UglifyJS will automatically
//   // drop any unreachable code.
//   plugins.push(new webpack.DefinePlugin({
//     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
//   }));

//   //plugins.push(new webpack.IgnorePlugin(/^(buffertools)$/));

//   // Conditionally add plugins for Production builds.
//   if (isProd) {
//     plugins.push(
//       new UglifyJSPlugin({
//         uglifyOptions: {
//           ie8: false,
//           warnings: false,
//           mangle: false,
//           compress: {
//             warnings: false, // Suppress uglification warnings
//             pure_getters: true
//           },
//           output: {
//             comments: false,
//           },
//           exclude: [/\.min\.js$/gi] // skip pre-minified libs
//         }
//       })
//     );
//   }

//   // Conditionally add plugins for Development
//   else {
//     // ...
//   }

//   return plugins;
// }
