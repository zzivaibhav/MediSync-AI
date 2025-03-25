import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { s3Client } from "../utils/s3client.js";
dotenv.config();

const createDirectory = async (req, res) => {
    try {
        // Add validation and debugging
        if (!process.env.S3_INPUT_BUCKET_NAME) {
            console.error("S3_INPUT_BUCKET_NAME environment variable is not set");
            return false;
        }
        
        // Check if req.body exists
        if (!req || !req.body || !req.body.name || !req.body.email) {
            console.error("Request body is missing required fields");
            return false;
        }
        
        const { name, email } = req.body;
        console.log(`Creating S3 directory for ${name} (${email})`);
        
        const folderName = `${name}-${email}/`;
        if (!folderName) {
            return res.status(400).json({
                success: false,
                message: "Folder name and bucket name are required"
            });
        }
        
        // Ensure folderName has trailing slash for S3
        const baseFolder = folderName.endsWith('/') ? folderName : `${folderName}/`;
        
        // Create the main folder, input subfolder, and output subfolder
        const folderKeys = [
            baseFolder,                // Main folder
            `${baseFolder}input/`,     // Input subfolder
            `${baseFolder}output/`     // Output subfolder
        ];
        
        // Create all three folders in parallel
        const folderPromises = folderKeys.map(folderKey => {
            const params = {
                Bucket: process.env.S3_INPUT_BUCKET_NAME,
                Key: folderKey,
                Body: ''  // Empty content for the folder object
            };
            
            const command = new PutObjectCommand(params);
            return s3Client.send(command);
        });
        
        await Promise.all(folderPromises);
        
        return true

    } catch (error) {
        console.error("Error creating folders in S3:", error);
        return false
    }
}

const deleteDirectory = async (name, email) => {
    try {
       
        
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }
        
        const folderName = `${name}-${email}/`;
        // Ensure folderName has trailing slash for S3
        const baseFolder = folderName.endsWith('/') ? folderName : `${folderName}/`;
        
        // List all objects with the folder prefix
        const listParams = {
            Bucket: process.env.S3_INPUT_BUCKET_NAME,
            Prefix: baseFolder
        };
        
        const listCommand = new ListObjectsV2Command(listParams);
        const listedObjects = await s3Client.send(listCommand);
        
        if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
            console.log("No objects found to delete");
            return true;
        }
        
        // Create an array of objects to delete
        const deleteParams = {
            Bucket: process.env.S3_INPUT_BUCKET_NAME,
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
            // Call the function again to delete remaining objects
            await deleteDirectory(req, res);
        }
        
        return true;
    } catch (error) {
        console.error("Error deleting folders in S3:", error);
        return false;
    }
}

export { createDirectory, deleteDirectory };

 