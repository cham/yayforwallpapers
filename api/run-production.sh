#!/bin/bash
. ~/.nvm/nvm.sh
. env/env-dev.sh
. env/env-production.sh
nvm use && node .
