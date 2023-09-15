# Amber Studio

[Amber](https://github.com/obiba/amber) is the Electronic Data Capture server. Amber Studio is a web interface for managing the server:

* users and groups
* studies and forms
* case reports
* ...

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn quasar dev
```

Note that the Amber server is expected to run at [http://localhost:3030](http://localhost:3030).

### Build the app for production

```bash
yarn quasar build
```

Environment variable for building the app in production:

* `AMBER_URL`, the url of the Amber server, exposing a REST API used by Amber Studio (make sure CORS policy is set correctly on the server)
* `RECAPTCHA_SITE_KEY`, the [reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3) site key for the Registration page
* `REGISTER_ENABLED`, a logical to specify whether it is possible to signup from this app. Default is true.

### Customize the configuration

* Modify the `settings.json` file for theming and overriding translations.
* Override the `src/components/Banner.vue` file to apply your own banner in front pages (login, register, forgot password etc. pages).
* Override the `src/css/custom.scss` file to apply your own stylesheet rules.

See also [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

## License

[MIT](https://mit-license.org/)
