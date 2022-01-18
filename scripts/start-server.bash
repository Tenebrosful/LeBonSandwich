#!/bin/bash

if [[ ! -d "logs" ]]
then
    mkdir logs
fi

if [[ ! -d "logs/server" ]]
then
    mkdir logs/server
fi

timestamp=$(date +%d_%m_%Y_%H_%M_%S)

ts-node src/server/server.ts > logs/server/$timestamp.log 2>&1