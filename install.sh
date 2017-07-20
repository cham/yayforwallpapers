#!/bin/bash
. ~/.nvm/nvm.sh

services[0]=api
for servicename in "${services[@]}"
do
	cd ${servicename}
	nvm install
	nvm use
	npm install
done
