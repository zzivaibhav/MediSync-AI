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
    sudo usermod -aG docker ec2-user

    # Retrieve the SERVER environment variable from Secrets Manager
    echo "Retrieving SERVER environment variable from Secrets Manager..."
    SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id medisync_secrets_data --region us-east-1 | jq -r '.SecretString')
    SERVER_ENV=$(echo "$SECRET_JSON" | jq -r '.VITE_SERVER_URL')

    # Validate that we got the secret and it's not empty
    if [ -z "$SERVER_ENV" ]; then
    echo "ERROR: Failed to retrieve SERVER environment variable from Secrets Manager"
    exit 1
    fi

    echo "Retrieved VITE_SERVER_URL: $SERVER_ENV"

    # Pull the specified Docker image
    echo "Pulling Docker image: vaibhav1476/medisync-ai-frontend"
    sudo docker pull vaibhav1476/medisync-ai-frontend

    # Stop any existing container with the same name if it exists
    if sudo docker ps -a | grep -q frontend-medisync; then
        echo "Stopping existing frontend-medisync container..."
        sudo docker stop frontend-medisync || true
        sudo docker rm frontend-medisync || true
    fi

    # Run the Docker container with the environment variable
    echo "Starting MediSync AI Frontend container with SERVER environment variable..."
    sudo docker run -d \
        --name frontend-medisync \
        -p 80:80 \
        -e VITE_SERVER_URL=$SERVER_ENV \
        --restart unless-stopped \
        vaibhav1476/medisync-ai-frontend

    # Verify environment variables in container
    echo "Verifying environment variables in container..."
    sudo docker exec frontend-medisync env | grep VITE_SERVER_URL

    # Verify the container is running
    echo "Verifying container status..."
    sudo docker ps | grep frontend-medisync

    echo "===== MediSync AI Frontend setup complete! =====" 
    echo "The application should now be accessible at http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"