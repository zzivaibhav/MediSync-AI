import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand , GetObjectCommand} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { s3Client } from "../utils/s3client.js";
import { logError, logInfo } from "../utils/CustomLogger.js";
import fs from "fs";
dotenv.config();

const createDirectory = async (  email) => {
    try {
        // Add validation and debugging
        if (!process.env.S3_INPUT_BUCKET_NAME || !process.env.S3_OUTPUT_BUCKET_NAME) {
            console.error("S3 bucket environment variables are not properly set");
            return false;
        }
    
        console.log(`Creating S3 directories for   (${email})`);
        
        const folderName = `${email}/`;
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
            
            // // Create in output bucket
            // s3Client.send(new PutObjectCommand({
            //     Bucket: process.env.S3_OUTPUT_BUCKET_NAME,
            //     Key: baseFolder,
            //     Body: ''  // Empty content for the folder object
            // }))
        ];
        
        await Promise.all(folderCreationPromises);
        
        return true;
    } catch (error) {
        console.error("Error creating folders in S3:", error);
        return false;
    }
}

const deleteDirectory = async (  email) => {
    try {
        if (  !email) {
            logError("Email is required to delete directory");
            return false;
        }
        
        logInfo(`Deleting S3 directories for   (${email})`);
        
        const folderName = `${email}/`;
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
        logError("Error deleting folders in S3:", error);
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

// function to upload a single file to the S3 bucket
const uploadFile = async(folderName, file)=> {
    try {
        if (!file) {
            console.error("No file provided for upload");
            return false;
        }
        if (!folderName) {
            console.error("Folder name cannot be empty");
            return false;
        }
        // Ensure folderName has trailing slash for S3
        const baseFolder = folderName.endsWith('/') ? folderName : `${folderName}/`;
        // Use file.buffer if available, otherwise read from disk
        const fileBody = file.buffer ? file.buffer : fs.readFileSync(file.path);
        const params = {
            Bucket: process.env.S3_INPUT_BUCKET_NAME,
            Key: `${baseFolder}${Date.now()}-${file.originalname}`,
            Body: fileBody,
            ContentType: file.mimetype
        };
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        console.log("File uploaded successfully to S3");
        return true;
    } catch (error) {
        console.error("Error uploading file to S3:", error);
        return false;
    }
}

const getFile = async (folderName ) => {
    try {
        const params = {
            Bucket: process.env.S3_OUTPUT_BUCKET_NAME,
            Key: `${folderName}/summary.json`
        };
        const command = new GetObjectCommand(params);
        const data = await s3Client.send(command);

        // Read the stream and parse JSON
        const streamToString = (stream) =>
            new Promise((resolve, reject) => {
                const chunks = [];
                stream.on("data", (chunk) => chunks.push(chunk));
                stream.on("error", reject);
                stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
            });

        const bodyString = await streamToString(data.Body);
        return JSON.parse(bodyString);
    } catch (error) {
        console.error("Error fetching file from S3:", error);
        return null;
    }
}

export { createDirectory, deleteDirectory, uploadFile , getFile};

