import express from "express";
import cors from "cors";
import {  PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import multer from "multer";
import { s3Client } from "../src/utils/s3client.js";
import authenticatJWT from "./middlewares/authenticate.js";

dotenv.config();

const app = express();

//CORS configuration 
console.log(process.env.CORS_ORIGIN);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, //whitelisted the given url
    credentials: true,
  })
);

//JSON body parser 
app.use(express.json({ limit: "20kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "20kb",
  })
);

//Static files
app.use(express.static("public"));

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for audio files
  } 
});

 


// Add audio upload endpoint
app.post("/upload-audio", upload.single('audioFile'), async (req, res) => {
  try {
    const { folderName, bucketName } = req.body;
    const file = req.file;
    
    if (!file || !folderName || !bucketName) {
      return res.status(400).json({
        success: false,
        message: "Audio file, folder name, and bucket name are required"
      });
    }
    
    // Ensure folderName has the right format
    const normalizedFolderName = folderName.endsWith('/') ? folderName : `${folderName}/`;
    
    // Create file path in the input subdirectory
    const filePath = `${normalizedFolderName}input/${Date.now()}-${file.originalname}`;
    
    // Upload the file to S3
    const params = {
      Bucket: bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype
    };
    
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    res.status(201).json({
      success: true,
      message: "Audio file uploaded successfully",
      data: {
        fileName: file.originalname,
        filePath: filePath,
        bucketName: bucketName
      }
    });
    
  } catch (error) {
    console.error("Error uploading audio file to S3:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload audio file",
      error: error.message
    });
  }
});

app.get("/",authenticatJWT, (req, res) => {
  res.send("Hello from Express!");
});
// routes import
import { router as cognitoRouter } from "./routes/cognito.routes.js";
import {router as doctorRouter} from "./routes/doctor.routes.js";
//routes declaration

app.use("/cognito", cognitoRouter);
app.use("/doctor-api", doctorRouter);
app.use
export { app };