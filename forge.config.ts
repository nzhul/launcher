import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    extraResource: ['./src/assets/app.prod.json'],
    icon: './src/assets/aw-green-256',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      authors: 'Damage Software',
      description: 'Ancient Warriors Game Launcher',
      iconUrl:
        'https://raw.githubusercontent.com/nzhul/launcher/master/src/assets/aw-green-256.ico',
      setupIcon: './src/assets/aw-green-256.ico',
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'nzhul',
          name: 'launcher',
        },
        draft: true,
      },
    },
  ],
  plugins: [
    new WebpackPlugin({
      devContentSecurityPolicy:
        "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src static: self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;",
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
          {
            html: './src/splash/splash.html',
            js: './src/splash/renderer.ts',
            name: 'splash',
            preload: {
              js: './src/splash/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
