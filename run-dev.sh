#!/bin/bash
./stop.sh

services[0]=api
for servicename in "${services[@]}"
do
	cd ${servicename}
	nohup ./run-dev.sh &
done
