#!/bin/bash
set -xe
exec > /var/log/user-data.log 2>&1

echo "===== Starting MediSync AI Frontend Docker Container Setup ====="

# Update system packages
yum update -y

# Install required packages (Docker, AWS CLI, jq)
yum install -y docker aws-cli jq

# Start Docker service
systemctl start docker
systemctl enable docker

# Wait until Docker is ready
until docker info > /dev/null 2>&1; do
    echo "Waiting for Docker to be ready..."
    sleep 3
done

# Retrieve secrets from AWS Secrets Manager
echo "Retrieving secrets from Secrets Manager..."
SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id medisync_secrets_data --region us-east-1 | jq -r '.SecretString')
SERVER_ENV=$(echo "$SECRET_JSON" | jq -r '.VITE_SERVER_URL')

# Validate secret
if [ -z "$SERVER_ENV" ]; then
    echo "❌ ERROR: VITE_SERVER_URL is empty or missing!"
    exit 1
fi

echo "✅ Retrieved VITE_SERVER_URL: $SERVER_ENV"

# Pull the Docker image
echo "Pulling Docker image: vaibhav1476/medisync-ai-frontend"
docker pull vaibhav1476/medisync-ai-frontend

# Stop and remove existing container if it exists
if docker ps -a --format '{{.Names}}' | grep -q "^frontend-medisync$"; then
    echo "Stopping and removing existing container..."
    docker stop frontend-medisync || true
    docker rm frontend-medisync || true
fi

# Run the Docker container with environment variable
echo "Running frontend container..."
docker run -d \
  --name frontend-medisync \
  -p 80:80 \
  -e VITE_SERVER_URL=$SERVER_ENV \
  --restart unless-stopped \
  vaibhav1476/medisync-ai-frontend

# Verify container and environment variable
echo "Verifying container and env var..."
docker exec frontend-medisync env | grep VITE_SERVER_URL || echo "❌ Failed to verify VITE_SERVER_URL"

docker ps | grep frontend-medisync && echo "✅ Frontend container is running"

# Print public IP
echo "🌐 Application should be accessible at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
