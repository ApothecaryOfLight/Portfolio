#!/bin/bash
cd "${0%/*}"
if [[ "$1" = "dev" ]];
then
  IP=$(hostname -I | xargs)
  echo "const ip = \"ws://${IP}:3005\";" > ./frontend/ip_file.sh
elif [[ "$1" = "prod" ]];
then
  echo "const ip = \"wss://abesportfolio.com:3005\";" > ./frontend/ip_file.sh
else
  echo "Command line argument:";
  echo "  run.sh dev";
  echo "    Will run Portfolio without an SSL/TSL Certificates.";
  echo "  run.sh prod";
  echo "    Will run Portfolio with SSL/TSL Certificates.";
  exit -1
fi

cd backend && screen -d -m -S Portfolio bash -c './run.sh "$1"'
