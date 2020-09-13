const path = require('path');
const webpack = require('webpack');

module.exports = {
  // 生产环境不生成 source map
  productionSourceMap: false,
  // webpack-dev-server 参考 https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 7000,
    compress: true,
  },
  // 该对象将会被 webpack-merge 合并入最终的 webpack 配置
  configureWebpack: {
    // webpack plugins
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require('./package.json').version}"`,
        BUILD_DATE: JSON.stringify(new Date().toLocaleString()),
      }),
    ],
  },
  // https://github.com/neutrinojs/webpack-chain
  chainWebpack: config => {
    config.resolve.alias.set('@$', path.join(__dirname, 'src'));
    config.resolve.alias.set('set-ui', path.join(__dirname, '../'));

    // svg icon
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]',
      });
  },
  pluginOptions: {},
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'border-radius-base': '2px',
          'layout-header-height': '48px',
          'menu-collapsed-width': '48px',
        },
        javascriptEnabled: true,
      },
    },
  },
};
