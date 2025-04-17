import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

// Create an S3 client service with proper credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // If using session token (temporary credentials)
   // sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

export { s3Client };

