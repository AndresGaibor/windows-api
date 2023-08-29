#!/bin/sh

# Fetch the newest code for the main branch
git fetch origin main

# Hard reset to the latest commit on the main branch
git reset --hard origin/main

# Force pull the latest changes from the main branch
git pull origin main --force

pm2 restart startscript