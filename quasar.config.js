/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import { configure } from 'quasar/wrappers'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'))
const version = packageJson.version || '0'
const settingsJson = readFileSync('./settings.json', 'utf8')

export default configure(function (/* ctx */) {
  return {
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'axios',
      'feathersClient',
      'auth',
      'i18n',
      'vuelidate',
      'recaptcha',
      'errors',
      'settings',
      'csv'
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
    css: [
      'app.scss',
      'custom.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v7',
      'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node20'
      },

      vueRouterMode: 'history', // available values: 'hash', 'history'
      vitePlugins: [],

      // Environment variables
      env: {
        API: process.env.VITE_API || 'http://localhost:3030',
        RECAPTCHA_SITE_KEY: process.env.VITE_RECAPTCHA_SITE_KEY || '6Lc3D34cAAAAANwhMFOH-yEB147CqspT-eBwF5-u',
        SETTINGS: process.env.VITE_SETTINGS || settingsJson,
        REGISTER_ENABLED: process.env.VITE_RECAPTCHA_SITE_KEY !== undefined ? 'true' : 'false',
        VERSION: version
      },

      publicPath: process.env.PATH_PREFIX || '/',
      rtl: true, // https://quasar.dev/options/rtl-support

      // Vite build options
      extendViteConf (viteConf, { isServer, isClient }) {
        // Add any Vite-specific configuration here
        viteConf.resolve = viteConf.resolve || {}
        viteConf.resolve.alias = viteConf.resolve.alias || {}
      },

      viteVuePluginOptions: {},

      // Rollup options for manual chunking
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks for better caching
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-quasar': ['quasar'],
            'vendor-feathers': [
              '@feathersjs/client',
              '@feathersjs/authentication-client',
              '@feathersjs/feathers',
              '@feathersjs/rest-client',
              'feathers-pinia'
            ],
            'vendor-utils': [
              'axios',
              'echarts',
              'marked',
              'uuid'
            ],
            'vendor-validation': [
              '@vuelidate/core',
              '@vuelidate/validators'
            ],
            'vendor-blitzar': [
              '@blitzar/form',
              '@blitzar/types',
              '@blitzar/utils'
            ]
          }
        }
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devserver
    devServer: {
      https: false,
      open: false, // opens browser window automatically
      port: 3080
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
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

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: [
        'render' // keep this as last one
      ]
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
      extendGenerateSWOptions (cfg) {},
      extendInjectManifestOptions (cfg) {},
      extendManifestJson (json) {},
      extendPWACustomSWConf (esbuildConf) {},
      manifest: {
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
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      inspectPort: 5858,

      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'test'
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      contentScripts: [
        'my-content-script'
      ],

      // extendBexScriptsConf (esbuildConf) {}
      // extendBexManifestJson (json) {}
    }
  }
})
