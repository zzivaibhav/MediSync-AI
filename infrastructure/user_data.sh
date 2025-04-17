#!/bin/bash

# EC2 setup script for MediSync AI Frontend Docker container
# This script installs Docker and runs the specified container on Amazon Linux

# Exit on any error
set -e

echo "===== Starting MediSync AI Docker Container Setup ====="

# Update system packages
echo "Updating system packages..."
sudo yum update -y

# Install required packages (Docker, AWS CLI, jq)
echo "Installing required packages..."
sudo yum install -y docker aws-cli jq

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group to avoid using sudo
sudo usermod -aG docker $(whoami)

# Retrieve the SERVER environment variable from Secrets Manager
echo "Retrieving SERVER environment variable from Secrets Manager..."
SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id medisync-app-secrets --region ${aws_region} | jq -r '.SecretString')
SERVER_ENV=$(echo "$SECRET_JSON" | jq -r '.SERVER')

# Validate that we got the secret
if [ -z "$SERVER_ENV" ]; then
  echo "ERROR: Failed to retrieve SERVER environment variable from Secrets Manager"
  exit 1
fi

# Pull the specified Docker image
echo "Pulling Docker image: vaibhav1476/medisync-ai-frontend..."
sudo docker pull vaibhav1476/medisync-ai-frontend

# Stop any existing container with the same name if it exists
if sudo docker ps -a | grep -q medisync-frontend; then
    echo "Stopping existing medisync-frontend container..."
    sudo docker stop medisync-frontend || true
    sudo docker rm medisync-frontend || true
fi

# Run the Docker container with the environment variable
echo "Starting MediSync AI Frontend container with SERVER environment variable..."
sudo docker run -d \
    --name medisync-frontend \
    -p 80:80 \
    -e SERVER="$SERVER_ENV" \
    --restart unless-stopped \
    vaibhav1476/medisync-ai-frontend

# Verify the container is running
echo "Verifying container status..."
sudo docker ps | grep medisync-frontend

echo "===== MediSync AI Frontend setup complete! ====="
echo "The application should now be accessible at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"