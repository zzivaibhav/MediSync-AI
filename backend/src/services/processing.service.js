import Visit from '../model/visits.model.js';
import { randomUUID } from 'crypto';
import { ApiResponse } from '../utils/ApiResponse.js';
import { logError, logInfo } from '../utils/CustomLogger.js';
import { createDirectory } from './s3.service.js';
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

const deleteVisit = async (req, res) => {}
export  {
    createVisit,
    deleteVisit
}