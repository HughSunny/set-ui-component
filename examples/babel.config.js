const isProd = ['production', 'prod'].includes(process.env.NODE_ENV);

const plugins = [
  // ['import', { libraryName: 'set-ui-vue', libraryDirectory: 'lib', style: true }, 'set-ui-vue'],
  // [
  //   'import',
  //   { libraryName: 'ant-design-vue', libraryDirectory: 'lib', style: true },
  //   'ant-design-vue',
  // ],
  'transform-class-properties',
];
if (isProd) {
  plugins.push('transform-remove-console');
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
  ],
  plugins,
};
