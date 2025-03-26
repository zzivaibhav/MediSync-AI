#!/bin/bash

# Update the system
sudo dnf update -y

# Install Nginx
sudo dnf install nginx -y

# Start Nginx service
sudo systemctl start nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

 
# Open HTTP port in firewall
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload

# Verify Nginx configuration
sudo nginx -t

# Restart Nginx to ensure everything is loaded
sudo systemctl restart nginx