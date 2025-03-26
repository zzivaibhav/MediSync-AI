import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { s3Client } from "../utils/s3client.js";
dotenv.config();

const createDirectory = async (name, email) => {
    try {
        // Add validation and debugging
        if (!process.env.S3_INPUT_BUCKET_NAME || !process.env.S3_OUTPUT_BUCKET_NAME) {
            console.error("S3 bucket environment variables are not properly set");
            return false;
        }
        
       
        
        
        console.log(`Creating S3 directories for ${name} (${email})`);
        
        const folderName = `${name}-${email}/`;
        if (!folderName) {
            return res.status(400).json({
                success: false,
                message: "Folder name cannot be empty"
            });
        }
        
        // Ensure folderName has trailing slash for S3
        const baseFolder = folderName.endsWith('/') ? folderName : `${folderName}/`;
        
        // Create folders in both input and output buckets
        const folderCreationPromises = [
            // Create in input bucket
            s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_INPUT_BUCKET_NAME,
                Key: baseFolder,
                Body: ''  // Empty content for the folder object
            })),
            
            // Create in output bucket
            s3Client.send(new PutObjectCommand({
                Bucket: process.env.S3_OUTPUT_BUCKET_NAME,
                Key: baseFolder,
                Body: ''  // Empty content for the folder object
            }))
        ];
        
        await Promise.all(folderCreationPromises);
        
        return true;
    } catch (error) {
        console.error("Error creating folders in S3:", error);
        return false;
    }
}

const deleteDirectory = async (name, email) => {
    try {
        if (!name || !email) {
            console.error("Name and email are required for directory deletion");
            return false;
        }
        
        const folderName = `${name}-${email}/`;
        // Ensure folderName has trailing slash for S3
        const baseFolder = folderName.endsWith('/') ? folderName : `${folderName}/`;
        
        // Delete from both input and output buckets
        const deleteBucketPromises = [
            deleteFromBucket(process.env.S3_INPUT_BUCKET_NAME, baseFolder),
            deleteFromBucket(process.env.S3_OUTPUT_BUCKET_NAME, baseFolder)
        ];
        
        await Promise.all(deleteBucketPromises);
        return true;
    } catch (error) {
        console.error("Error deleting folders in S3:", error);
        return false;
    }
}

// Helper function to delete objects from a specific bucket
async function deleteFromBucket(bucketName, prefix) {
    if (!bucketName) {
        console.error("Bucket name is required");
        return false;
    }
    
    // List all objects with the folder prefix
    const listParams = {
        Bucket: bucketName,
        Prefix: prefix
    };
    
    const listCommand = new ListObjectsV2Command(listParams);
    const listedObjects = await s3Client.send(listCommand);
    
    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log(`No objects found to delete in bucket: ${bucketName}`);
        return true;
    }
    
    // Create an array of objects to delete
    const deleteParams = {
        Bucket: bucketName,
        Delete: {
            Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
            Quiet: false
        }
    };
    
    // Delete all the objects
    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    await s3Client.send(deleteCommand);
    
    // If there are more than 1000 objects (S3 list limit), recursively delete them
    if (listedObjects.IsTruncated) {
        await deleteFromBucket(bucketName, prefix);
    }
    
    return true;
}

export { createDirectory, deleteDirectory };

