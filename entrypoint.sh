#!/bin/bash

# the goal of this script is to inject environment variables into the frontend
# by creating a javascript file that will be injected in the boot file
WWW_DIR=/usr/share/nginx/html
ENV_PATH="${WWW_DIR}/env.js"
# Create the file
echo -n "window.env = {" > "${ENV_PATH}"
COMMA=""
for envrow in $(printenv); do
  IFS='=' read -r key value <<< "${envrow}"
  case "${key}" in
    "AMBER_URL" | "RECAPTCHA_SITE_KEY" | "PATH_PREFIX")
      echo -n "${COMMA}" >> "${ENV_PATH}"
      echo -n "${key}: '${value}'" >> "${ENV_PATH}"
      COMMA=","
      ;;
    *)
      # ignore the key
      ;;
  esac
done
echo "};" >> "${ENV_PATH}"

# apply PATH_PREFIX to nginx template
PATH_PREFIX=${PATH_PREFIX:-/}
# make sure PATH_PREFIX ends with /
if [[ "${PATH_PREFIX}" != */ ]]; then
  PATH_PREFIX="${PATH_PREFIX}/"
fi
export PATH_PREFIX
envsubst '${PATH_PREFIX}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# settings initialization
# backup the original file if it does not exist
if [ ! -f /usr/share/nginx/html/settings.json.bak ]; then
  cp /usr/share/nginx/html/settings.json /usr/share/nginx/html/settings.json.bak 2>/dev/null || true
fi
# copy /app/settings.json to /usr/share/nginx/html/settings.json if it exists
if [ -f /app/settings.json ]; then
  cp /app/settings.json /usr/share/nginx/html/settings.json
else
  # if the file does not exist, restore the backup if it exists
  if [ -f /usr/share/nginx/html/settings.json.bak ]; then
    cp /usr/share/nginx/html/settings.json.bak /usr/share/nginx/html/settings.json
  fi
fi

# execute the web server
exec nginx -g 'daemon off;'