/* eslint-disable @typescript-eslint/no-var-requires */
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');

module.exports = {
  publicPath: '',
  pages: {
    index: 'src/main.ts',
    popup: 'src/main.ts',
    'popup-request': 'src/main.ts',
    background: 'src/background/main.js',
  },
  chainWebpack: (config) => {
    config.module.rules.delete('eslint');
    if (process.env.npm_lifecycle_event === 'build-dev') {
      config.plugin('extension-reloader').use(ChromeExtensionReloader, [
        {
          reloadPage: false,
        },
      ]);
    }

    // config.module
    //   .rule('webextension-polyfill')
    //   .test(/webextension-polyfill[\\/]dist[\\/]browser-polyfill\.js$/)
    //   .use('babel-loader')
    //   .loader('babel-loader')
    //   .options({
    //     presets: ['@babel/preset-env'],
    //   });

    // config
    //   .entry('background')
    //   .add('./src/background/main.js')
    //   .end()
    //   .output.filename((pathData) => {
    //     switch (pathData.chunk.name) {
    //       case 'background':
    //         return '[name].js';
    //       default:
    //         return 'js/[name].js';
    //     }
    //   })
    //   .end();

    // manifest.json interpolation
    config.module
      .rule('manifest')
      .test(/manifest\.json$/)
      .type('javascript/auto')
      .use('file-loader')
      .loader('file-loader')
      .options({ name: '[name].[ext]' })
      .end()
      .use('extricate-loader')
      .loader('extricate-loader')
      .end()
      .use('interpolate-loader')
      .loader('interpolate-loader')
      .end();

    // Stop parsing package.json
    config.module
      .rule('json')
      .test(/package\.json$/)
      .type('javascript/auto')
      .exclude.add(/node_modules/)
      .end();

    // Disable inlining of images
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 1 }));

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        options.compiler = require('vue-template-babel-compiler');
        return options;
      });

    // Add content-script entry
    config.entry('content-script').add('./src/content-script.js').end();
    config.entry('service-worker').add('./src/background.js').end();
    // Fix for https://github.com/LedgerHQ/ledger-live/issues/763
    config.resolve.alias.set('@ledgerhq/devices/hid-framing', '@ledgerhq/devices/lib/hid-framing');

    config.optimization.minimizer('terser').tap((args) => {
      const { terserOptions } = args[0];
      terserOptions.output = { ...terserOptions.output, ascii_only: true };
      return args;
    });

    config.optimization.delete('splitChunks');
  },
  configureWebpack: {
    devtool: 'cheap-module-source-map',
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
    },
  },
};
