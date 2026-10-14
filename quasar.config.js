/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app'
import { readFileSync } from 'node:fs'

export default defineConfig(function (ctx) {
  const packageJson = readFileSync('./package.json', 'utf8')
  const version = JSON.parse(packageJson).version || 0

  return {
    // https://quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'settings',
      'axios',
      'feathersClient',
      'auth',
      'i18n',
      'vuelidate',
      'recaptcha',
      'errors',
      'csv',
      'amber'
    ],

    // https://quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: [
      '~@fontsource-variable/sora/index.css',
      '~@fontsource-variable/instrument-sans/index.css',
      'app.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      'fontawesome-v7',
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      target: {
        browser: 'baseline-widely-available',
        node: 'node22'
      },

      vueRouterMode: 'history', // available values: 'hash', 'history'

      // required by Options API dependencies (@obiba/quasar-ui-amber, vuedraggable);
      // defaults to false since @quasar/app-vite v3
      vueOptionsAPI: true,

      vitePlugins: [],

      // Environment variables (exposed as import.meta.env.*)
      defineEnv: {
        VERSION: version
      },

      // make sure a single copy of vue is bundled (git workspace deps)
      alias: {
        vue: ctx.appPaths.resolve.app('node_modules/vue')
      },

      publicPath: '/',

      // https://quasar.dev/quasar-cli-vite/handling-vite
      extendViteConf (viteConf) {
        viteConf.base = './'
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli-vite/quasar-config-file#devServer
    devServer: {
      https: false,
      open: false, // opens browser window automatically
      port: 3080
    },

    // https://quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'AppFullscreen',
        'Notify',
        'LocalStorage',
        'LoadingBar'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      prodPort: 3000,
      pwa: false
    },

    // https://quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      injectPWAMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      extendPWAManifestJson (json) {
        Object.assign(json, {
          name: 'Amber Studio',
          short_name: 'Amber Studio',
          description: 'Amber Studio for managing Amber server',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#ffffff',
          theme_color: '#027be3',
          icons: [
            {
              src: 'icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png'
            },
            {
              src: 'icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icons/icon-256x256.png',
              sizes: '256x256',
              type: 'image/png'
            },
            {
              src: 'icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png'
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        })
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {},

    // Full list of options: https://quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        appId: 'amber-studio'
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      extraScripts: []
    }
  }
})
