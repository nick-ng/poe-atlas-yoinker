#!/bin/bash

cd /home/pi/git/poe-atlas-yoinker

git checkout main

git pull

npm ci

/home/pi/.nvm/versions/node/v16.15.0/bin/node server.js
