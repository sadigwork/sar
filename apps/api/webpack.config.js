const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  mode: 'development',
  output: {
    path: join(__dirname, '../../dist/apps/api'), // ✅ المسار الصحيح
    filename: 'main.js',
    clean: true,
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: join(__dirname, 'src/main.ts'),
      tsConfig: join(__dirname, 'tsconfig.app.json'),
      assets: [join(__dirname, 'src/assets')],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMap: true,
      externalDependencies: 'all',
    }),
  ],
};
