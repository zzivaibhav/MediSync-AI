#!/bin/bash
set -xe
exec > /var/log/user-data.log 2>&1

echo "===== Starting MediSync AI Docker Container Setup ====="

# Update system packages
yum update -y

# Install required packages (Docker, AWS CLI, jq)
yum install -y docker aws-cli jq

# Start Docker service
systemctl start docker
systemctl enable docker

# Wait until Docker is fully ready
until docker info > /dev/null 2>&1; do
    echo "Waiting for Docker to be ready..."
    sleep 3
done

# Retrieve the SERVER environment variable from Secrets Manager
echo "Retrieving secrets from Secrets Manager..."
SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id medisync_secrets_data --region us-east-1 | jq -r '.SecretString')
SERVER_ENV=$(echo "$SECRET_JSON" | jq -r '.VITE_SERVER_URL')
AWS_ACCESS_KEY_ID=$(echo "$SECRET_JSON" | jq -r '.AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY=$(echo "$SECRET_JSON" | jq -r '.AWS_SECRET_ACCESS_KEY')
CORS_ORIGIN=$(echo "$SECRET_JSON" | jq -r '.CORS_ORIGINS')
DATABASE_NAME=$(echo "$SECRET_JSON" | jq -r '.RDS_DATABASE_NAME')
DATABASE_USER=$(echo "$SECRET_JSON" | jq -r '.RDS_USERNAME')
DATABASE_PASSWORD=$(echo "$SECRET_JSON" | jq -r '.RDS_PASSWORD')
DATABASE_HOST=$(echo "$SECRET_JSON" | jq -r '.RDS_HOST')
JWT_SECRET_KEY=$(echo "$SECRET_JSON" | jq -r '.JWT_SECRET_KEY')
COGNITO_CLIENT_ID=$(echo "$SECRET_JSON" | jq -r '.COGNITO_CLIENT_ID')
COGNITO_CLIENT_SECRET=$(echo "$SECRET_JSON" | jq -r '.COGNITO_CLIENT_SECRET')
COGNITO_USER_POOL_ID=$(echo "$SECRET_JSON" | jq -r '.COGNITO_USER_POOL_ID')
S3_INPUT_BUCKET_NAME=$(echo "$SECRET_JSON" | jq -r '.S3_INPUT_BUCKET_NAME')
S3_OUTPUT_BUCKET_NAME=$(echo "$SECRET_JSON" | jq -r '.S3_OUTPUT_BUCKET_NAME')

if [ -z "$SERVER_ENV" ]; then
    echo "ERROR: Failed to retrieve SERVER environment variable from Secrets Manager"
    exit 1
fi

# Pull the specified Docker image
echo "Pulling Docker image: vaibhav1476/backend-medisync"
docker pull vaibhav1476/backend-medisync

# Stop existing container if it exists
EXISTING_CONTAINER_ID=$(docker ps -aqf "ancestor=vaibhav1476/backend-medisync")
if [ -n "$EXISTING_CONTAINER_ID" ]; then
    echo "Stopping and removing existing container..."
    docker stop $EXISTING_CONTAINER_ID || true
    docker rm $EXISTING_CONTAINER_ID || true
fi

# Run the Docker container with environment variables
echo "Starting Docker container..."
docker run -d \
  -p 80:8080 \
  -e DATABASE_NAME=$DATABASE_NAME \
  -e DATABASE_USER=$DATABASE_USER \
  -e DATABASE_PASSWORD=$DATABASE_PASSWORD \
  -e DATABASE_HOST=$DATABASE_HOST \
  -e JWT_SECRET_KEY=$JWT_SECRET_KEY \
  -e COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID \
  -e COGNITO_CLIENT_SECRET=$COGNITO_CLIENT_SECRET \
  -e COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID \
  -e S3_INPUT_BUCKET_NAME=$S3_INPUT_BUCKET_NAME \
  -e S3_OUTPUT_BUCKET_NAME=$S3_OUTPUT_BUCKET_NAME \
    -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  vaibhav1476/backend-medisync

echo "✅ MediSync AI setup complete!"
echo "Application should be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
