#!/bin/bash
. ~/.nvm/nvm.sh
./stop.sh

services[0]=api
for servicename in "${services[@]}"
do
	cd ${servicename}
	nvm use
	nohup ./run-dev.sh &
done
