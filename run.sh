#!/bin/bash
cd "${0%/*}"
if [[ "$1" = "http" ]];
then
  echo "const ip = \"http://${2}:3005\/\";" > ./frontend/ip_file.js
  cd backend && screen -d -m -S Portfolio bash -c './run.sh http'
elif [[ "$1" = "https" ]];
then
  echo "const ip = \"https://abesportfolio.com:3005\/\";" > ./frontend/ip_file.js
  cd backend && screen -d -m -S Portfolio bash -c './run.sh https'
else
  echo "Command line argument:";
  echo "  run.sh dev";
  echo "    Will run Portfolio without an SSL/TSL Certificates.";
  echo "  run.sh prod";
  echo "    Will run Portfolio with SSL/TSL Certificates.";
  exit -1
fi
