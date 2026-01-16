#!/bin/bash

# MinIO CDN Bucket Policy Setup Script
# This script sets up public read access for the 'cdn' bucket

set -e

# Load environment variables
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Default values if not in .env
MINIO_ROOT_USER=${MINIO_ROOT_USER}
MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}
MINIO_BUCKET_NAME=${MINIO_BUCKET_NAME}
MINIO_ENDPOINT=${MINIO_PUBLIC_BASE_URL}

echo "Setting up MinIO bucket policy for public read access..."
echo "Bucket: $MINIO_BUCKET_NAME"
echo "Endpoint: $MINIO_ENDPOINT"

# Create the bucket if it doesn't exist
echo "Creating bucket '$MINIO_BUCKET_NAME' if it doesn't exist..."
docker compose exec minio mc alias set local http://minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD || true

# Create bucket if it doesn't exist
docker compose exec minio mc mb local/$MINIO_BUCKET_NAME --ignore-existing || true

# Create bucket policy JSON
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::$MINIO_BUCKET_NAME/*"
      ]
    }
  ]
}
EOF

# Apply the policy
echo "Applying public read policy to bucket '$MINIO_BUCKET_NAME'..."
docker compose exec minio mc anonymous set public local/$MINIO_BUCKET_NAME || true

# Verify the policy
echo "Verifying bucket policy..."
docker compose exec minio mc anonymous get local/$MINIO_BUCKET_NAME || true

# Clean up
rm -f bucket-policy.json

echo "✅ MinIO bucket '$MINIO_BUCKET_NAME' is now publicly readable!"
echo "Images can be accessed at: $MINIO_ENDPOINT/$MINIO_BUCKET_NAME/<image-path>"