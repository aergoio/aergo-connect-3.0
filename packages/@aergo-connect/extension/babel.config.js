module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        targets: { esmodules: true },
        polyfills: [],
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
};
