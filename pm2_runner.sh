#!/bin/bash
if ! type pm2 > /dev/null
then
    sudo npm install -g pm2 && pm2 start ./startscript.js --name windowsApi
else
    pm2 restart windowsApi
fi