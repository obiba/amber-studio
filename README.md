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

Environment variable when running the app in production:

* `AMBER_URL`, the url of the Amber server, exposing a REST API used by Amber Studio (make sure CORS policy is set correctly on the server)
* `RECAPTCHA_SITE_KEY`, the [reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3) site key for the Registration page. If not specified, user self-registration is disabled.
- `PATH_PREFIX`, the public path of your app. By default, it uses the root: `/`. Use it when your public path is something else, like "https://www.example.org/some_path" where the path prefix is `/some_path/`.

### Settings

* Override Docker's file `/app/settings.json` file to apply your own CSS classes or add some translations.

## License

[MIT](https://mit-license.org/)
