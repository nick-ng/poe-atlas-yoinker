#!/bin/bash

cd /home/pi/git/poe-atlas-yoinker

/usr/bin/git checkout main

/usr/bin/git pull

/home/pi/.nvm/versions/node/v16.15.0/bin/npm ci

/home/pi/.nvm/versions/node/v16.15.0/bin/node server.js
