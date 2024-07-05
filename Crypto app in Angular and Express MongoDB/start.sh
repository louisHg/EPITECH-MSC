#!/bin/sh

# Script qui lance tout les autres script (front et back)

echo "-- Version --"
npm -v
node -v
npm install

echo " -Back"

# Lancement Back Info
bash startBackInfo.sh &


echo " -Front"
# Lancement Front
bash startFront.sh

