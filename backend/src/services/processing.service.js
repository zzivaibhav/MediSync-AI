import Visit from '../model/visits.model.js';
import { randomUUID } from 'crypto';
import { ApiResponse } from '../utils/ApiResponse.js';
import { logError, logInfo } from '../utils/CustomLogger.js';
import { createDirectory, deleteDirectory } from './s3.service.js';
import { ApiError } from '../utils/ApiError.js';
const createVisit = async (req, res) => {
   try {
     const {purpose,email, id} = req.body;
 
     //validation
     if(!purpose || !email || !id){
         logError("Purpose, email and id are required")
         return res.status(400).json(
             new ApiResponse(false,null,"Purpose, email and id are required")
         );
     }
 
     const doctorID = req.user.sub;
 
     //create the unique bucket name
     const uniqueBucketName = `${email}_${randomUUID().slice(0, 4)}`;
 
     //make the S3 directory for the patient
     const s3_decision = await createDirectory(uniqueBucketName);
     if(s3_decision){
         logInfo("Successfully created Directory on S3 for "+ email +" with unique bucket name: "+ uniqueBucketName)
         logInfo("Saving the patient visit to the database...")
 
         const visit = new Visit({
             purpose,
             doctorID: doctorID,
             patientID: id,
             uniqueID:uniqueBucketName
         });
         const savedVisit = await visit.save();  
         if(savedVisit){
             logInfo("Successfully created visit with ID: "+ savedVisit.id)
             return res.status(200).json(
                 new ApiResponse(true,savedVisit,"Visit created successfully")
             );
         }
        
         logError("Something broke while creating the visit in database.")
     }
 
     logError("Something broke while creating the S3 directory.")
     return res.status(500).json(
         new ApiResponse(false,null,"Something went wrong. Please try again.")
     );
   } catch (error) {
        logError("Error in createVisit: ", error);
        throw new ApiError(500, "Internal Server Error", error);
   }
    
}

const deleteVisit = async (req, res) => {
    try {
        const { id } = req.query;
        //validation
        if(!id){
            logError("ID is required")
            return res.status(400).json(
                new ApiResponse(false,null,"ID is required")
            );
        }
    
        {/**
            find the visit associated with the visit id and validate it with the doctorID 
        */}
        const visit = await Visit.findOne({
            where: {
                id: id,
                doctorID: req.user.sub
            }
        });
        if(!visit){
            logError("No visit found")
            return res.status(404).json(
                new ApiResponse(false,null,"No visit found")
            );
        }
        {/**
            delete the visit froom the S3 and then from the database
        */}
        
        const s3_decision = await deleteDirectory(visit.uniqueID);
        if(s3_decision){
            logInfo("Successfully deleted Directory on S3 for "+ visit.uniqueID)
            const deletedRecord =  await visit.destroy();
            if(deletedRecord){
                logInfo("Successfully deleted visit with ID: "+ id)
                return res.status(200).json(
                    new ApiResponse(true,null,"Visit deleted successfully")
                );
            }
            logError("Something broke while deleting the visit in database.")
        }
        logError("Something broke while deleting the S3 directory.")
        return res.status(500).json(
            new ApiResponse(false,null,"Something went wrong. Please try again.")
        );
    } catch (error) {
        logError("Error in deleteVisit: ", error);
        throw new ApiError(500, "Internal Server Error", error);
        
    }
}

const getVisits = async (req, res) => {

    try {
        const{id} = req.query;
        //validation
        if(!id){
            logError("ID is required")
            return res.status(400).json(
                new ApiResponse(false,null,"ID is required")
            );
        }

        
        {/**
            find the patient visit associated with the patiend id and validate it with the doctorID 
        */}
        const patients = await Visit.findAll({
            where: {
                patientID: id,
                doctorID: req.user.sub
            }
        });
        if(!patients){
            logError("No patients found")
            return res.status(404).json(
                new ApiResponse(false,null,"No patients found")
            );
        }

        logInfo("Successfully fetched patients with ID: "+ patients.id)
        {/**
            return the patients
        */}
      
         return res.status(200).json({
            success: true,
            message: "Patients fetched successfully",
            data: patients
        });
    
    } catch (error) {
        logError("Error in getPatients: ", error);
        throw new ApiError(500, "Internal Server Error", error);
    }
}
export  {
    createVisit,
    deleteVisit,
    getVisits
}