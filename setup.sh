#!/bin/bash

#NODEJS
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs


#Install Nginx
sudo apt-get install nginx -y
sudo ufw allow 'Nginx HTTP'
sudo ufw allow ssh
sudo ufw enable
cd /etc/nginx/sites-enabled && sudo sed -i "s/root \/var\/www\/html;/root \/home\/ubuntu\/Portfolio;/g" default
sudo systemctl restart nginx
