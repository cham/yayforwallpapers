# yayforwallpapers-api
API for YayForWallpapers

Requirements
============
- nvm
- npm
- postgres

Installation
============
nvm install && nvm use

npm install

Running
=======
npm run dev

Running in Production
=====================
npm start

Do not commit your changes to env-production.sh or you risk leaking live auth details into source control

Tests
=====
npm test

Lint
====
npm run lint

Config vars
===========
Either supply config via command line arguments as above, or set them as environment variables prefixed with NS_Y4W_API_.

Supported switches
------------------
- --port
- --psql-connection-string

supported env vars
------------------
- NS_Y4W_PORT
- NS_Y4W_PSQL_CONNECTION_STRING
