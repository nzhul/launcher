import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';

const assets = ['assets'];
const patternsMain = assets.map((asset) => ({
  from: path.resolve(__dirname, 'src', asset),
  to: path.resolve(__dirname, '.webpack/main', asset),
}));

const assetsRenderer = ['assetsrenderer'];
const patternsRenderer = assetsRenderer.map((asset) => ({
  from: path.resolve(__dirname, 'src', asset),
  to: path.resolve(__dirname, '.webpack/renderer', asset),
}));

const patternsAll = patternsMain.concat(patternsRenderer);

const copyPlugins = new CopyPlugin({
  patterns: patternsAll,
});

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [copyPlugins],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
