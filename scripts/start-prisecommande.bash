#!/bin/bash

if [[ ! -d "logs" ]]
then
    mkdir logs
fi

if [[ ! -d "logs/prise-commande" ]]
then
    mkdir logs/prise-commande
fi

timestamp=$(date +%d_%m_%Y_%H_%M_%S)

ts-node prise-commande/src/server.ts > logs/prise-commande/$timestamp.log 2>&1