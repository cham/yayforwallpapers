#!/bin/bash

export NODE_ENV=development
export NS_Y4W_API_PORT=4000
export NS_Y4W_PSQL_CONNECTION_STRING=postgres://postgres:root@localhost:5432/y4w
export NS_Y4W_JWT_SECRET=supersecretsecret

echo "Environment set to development"
