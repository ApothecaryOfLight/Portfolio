#!/bin/bash

echo -n "Initial setup? (y/n)"
read prompt
if [ "$prompt" != "${prompt#[Yy]}" ] ;then
  #NODEJS
  curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
  sudo apt-get install -y nodejs


  #Install Nginx
  sudo apt-get install nginx -y
  sudo ufw allow ssh
  sudo ufw enable
  cd /etc/nginx/sites-enabled && sudo sed -i "s/root \/var\/www\/html;/root \/home\/ubuntu\/Portfolio\/frontend;/g" default
  sudo systemctl restart nginx


  #Install MySQL
  sudo apt install mysql-server -y
  sudo mysql_secure_installation
fi

#MySQL Schema
echo -n "Setup SQL Schema? (y/n)"
read prompt
if [ "$prompt" != "${prompt#[Yy]}" ] ;then
  ./create_schema.sh
  sudo mysql < create_schema.sql
fi

#HTTP/HTTPS
echo -n "Setup HTTPS? (y/n/skip)"
read prompt
if [ "$prompt" != "${prompt#[Yy]}" ] ;then
  sudo apt-get install certbot
  sudo apt-get install python3-certbot-nginx
  sudo certbot --nginx
  sudo ufw allow https
  sfuo ufw allow 'Nginx HTTPS'
  echo "const ip = 'https://abesportfolio.net:3000/';" > frontend/ip_file.js
  screen -d -m -S backend bash -c 'cd backend && npm i && ./run-https.sh'
elif [ "$prompt" != "${prompt#[Nn]}" ] ;then
  sudo ufw allow 'Nginx HTTP'
  echo "const ip = 'http://54.218.94.125:3000/';" > frontend/ip_file.js
  screen -d -m -S backend bash -c 'cd backend && npm i && ./run-http.sh'
fi
