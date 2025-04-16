import Patient from '../model/patient.model.js';
import {createDirectory, deleteDirectory,uploadFile  } from './s3.service.js'
import fs from 'fs';
import { logError, logInfo } from '../utils/CustomLogger.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
const createPatient = async (req, res) => {
    try {
        // Log the incomin  g request body to debug
        console.log("incoming request body:", req.body);
     logInfo("Incoming request body:", req.body);
      
         // Extract fields from req.body
        const {name, email, DOB, phoneNumber} = req.body;

       if(!name || !email || !DOB || !phoneNumber  ){
            return res.status(400).json(
                new ApiResponse(false,null,"Name, email, DOB, phoneNumber and purpose are required")
            )
        }
        else{

       
        if (await Patient.findOne({ where: { email : email } })) {
            return res.status(400).json({
                success: false,
                message: "Patient with this email already exists"
            });
        }
        
        logInfo("Successfully created Directory on S3 for "+ email)
            const patientData = await Patient.create({
                name,
                email,
                DOB,
                phoneNumber,
                
                doctorID: req.user.sub
            });
            if(patientData){
                logInfo("Successfully created patient with ID: "+ patientData.id)
            }
            
            return res.status(201).json({
                success: true,
                message: "Patient created successfully",
                data: patientData
            });
       
        // Create directory only once with name and email
        // const s3_patient = await createDirectory( email);
        // if(s3_patient){
        //     logInfo("Successfully created Directory on S3 for "+ email)
        //     const patientData = await Patient.create({
        //         name,
        //         email,
        //         DOB,
        //         phoneNumber,
                
        //         doctorID: req.user.sub
        //     });
        //     if(patientData){
        //         logInfo("Successfully created patient with ID: "+ patientData.id)
        //     }
            
        //     return res.status(201).json({
        //         success: true,
        //         message: "Patient created successfully",
        //         data: patientData
        //     });
        // }

        //log 
        // if(!s3_patient){
        //     console.log("==========================================");
        //     console.log("Failed to create directory on S3");
        //     console.log("==========================================");
        // }
        //  return res.status(500).json(
        //     new ApiResponse(false,null,"Failed to create directory")
        //  )
         
        }
    } catch (error) {
        console.error('Error creating patient:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to create patient",
            error: error.message
        });
    }
}

const getPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll({
            where: {
                doctorID: req.user.sub
            }
        });

        return res.status(200).json({
            success: true,
            message: "Patients fetched successfully",
            data: patients
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch patients",
            error: error.message
        });
    }
}

const deletePatient = async (req, res) => {
 try {
    const { id } = req.body;
    const patient = await Patient.findOne({
        where: {
            id,
            doctorID: req.user.sub
        }
    });
    if (!patient) {
        return res.status(404).json({
            success: false,
            message: "Patient not found"
        });
    }
     
//    const decision =  await deleteDirectory( patient.email);
//    if(decision){
    await patient.destroy();
    logInfo("Successfully deleted patient with ID: "+ id)
    return res.status(200).json({
        success: true,
        message: "Patient deleted and associated data removed successfully"
    });
   //}

   logError("Failed to delete patient with ID: "+ id)
   res.status(500).json({
    success: false,
    message: "Failed to delete patient and associated data"
   });

 } catch (error) {
    console.error('Error deleting patient:', error);
    return false
 }
}

const updatePatient = async (req, res) => {
    try {
        // Extract patient id and fields to update
        const { id, name, email, DOB, phoneNumber } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Patient ID is required"
            });
        }

        // Check if patient exists and belongs to the doctor
        const patient = await Patient.findOne({
            where: {
                id,
                doctorID: req.user.sub
            }
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found or you don't have permission to update this patient"
            });
        }

        // If email is being updated, check if it's already in use
        if (email && email !== patient.email) {
            const existingPatient = await Patient.findOne({ where: { email } });
            if (existingPatient) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use by another patient"
                });
            }
        }

        // Create an object with only the fields that are provided
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (DOB) updateData.DOB = DOB;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;

        // If no fields to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update"
            });
        }

        // Update patient
        await patient.update(updateData);

        
        return res.status(200).json({
            success: true,
            message: "Patient updated successfully",
            data: patient
        });
    } catch (error) {
        console.error('Error updating patient:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to update patient",
            error: error.message
        });
    }
}

const uploadAudio = async(req,res) =>{
   const{name, email} = req.body;
    
     
    const file = req.file;
    
    // validation checks

        //existance of the file
        if(!file){
            return res.status(400).json(
                new ApiResponse(false,null, "No file provided")
            )
        }

        //existance of the name and email
        if(!name || !email){
           
            return res.status(400).json(
                 new ApiResponse(false,null, "Name and email are required")
              
            )
        }
 
    //upload the file to s3 using the utility function
    const uploadResult = await uploadFile(`${email}/`, file);
    
    if(uploadResult){
           //delete the file from local storage
           fs.unlink(file.path, (err) => {
            if (err) {
                console.error("Error deleting file from local ❌:", err);
            } else {
                console.log("File deleted successfully from local storage ✅");
                console.log("Local path from where the file was deleted:", file.path);
            }
        });
    }
     

    //return the appropriate responses.
    if(!uploadResult){
        return res.status(500).json(
            new ApiResponse(false,"Failed to upload file", null)
        )
    }

    if(uploadResult){
        console.log("File uploaded successfully ✅");

        return res.status(200).json(
            new ApiResponse(true,"File uploaded successfully", {
                fileName: file.originalname,
                filePath: `${name}-${email}/${file.originalname}`,
                bucketName: process.env.S3_INPUT_BUCKET_NAME
            })
        )
    }
  
}

const returnRecentPatients = async (req, res) => {
    try {
        console.log("Fetching recent patients for doctor ID:", req.user.sub);
        //find all the patients of the doctor
        const patients = await Patient.findAll({
            where:{
                doctorID: req.user.sub
            },
            order:[
                ['createdAt', 'DESC']
            ],
            limit: 7
        })

        //now arrange the patients in descending order of their createdAt date.

        return res.status(200).json(    
            new ApiResponse(true,patients,"Recent patients fetched successfully")
        )

    
    } catch (error) {
        logError("Error fetching recent patients:", error);
       throw new ApiError(500,"Something went wrong",error.message);
    }
}
export { createPatient, getPatients, deletePatient, updatePatient, uploadAudio,returnRecentPatients };