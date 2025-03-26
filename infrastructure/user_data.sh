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

# Get IP addresses (both public and private for completeness)
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
PRIVATE_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
AVAILABILITY_ZONE=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone)

# Create a simple HTML file showing IP information
sudo cat > /usr/share/nginx/html/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>EC2 Instance Information</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 20px;
            background-color: #f0f0f0;
        }
        .info-box {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 20px;
            max-width: 500px;
            margin: 0 auto;
        }
        .info-item {
            margin: 10px 0;
            padding: 8px;
            background-color: #f8f8f8;
            border-radius: 4px;
        }
        h1 {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="info-box">
        <h1>EC2 Instance Information</h1>
        <div class="info-item">
            <strong>Public IP:</strong> ${PUBLIC_IP}
        </div>
        <div class="info-item">
            <strong>Private IP:</strong> ${PRIVATE_IP}
        </div>
        <div class="info-item">
            <strong>Instance ID:</strong> ${INSTANCE_ID}
        </div>
        <div class="info-item">
            <strong>Availability Zone:</strong> ${AVAILABILITY_ZONE}
        </div>
    </div>
</body>
</html>
EOF

# Restart Nginx to ensure the new page is loaded
sudo systemctl restart nginx

# Debug output to verify the information was retrieved
echo "Instance information:"
echo "Public IP: ${PUBLIC_IP}"
echo "Private IP: ${PRIVATE_IP}"
echo "Instance ID: ${INSTANCE_ID}"
echo "AZ: ${AVAILABILITY_ZONE}"