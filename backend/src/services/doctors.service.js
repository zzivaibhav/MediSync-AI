import Patient from '../model/patient.model.js';
import {createDirectory, deleteDirectory} from './s3.service.js'
const createPatient = async (req, res) => {
    try {
        // Log the incoming request body to debug
        console.log('Received data:', req.body);

        // Extract fields from req.body
        const {name, email, DOB, phoneNumber} = req.body;

        // Log the extracted values
        console.log('Extracted values:', { name, email, DOB, phoneNumber });
        if (await Patient.findOne({ where: { email : email } })) {
            return res.status(400).json({
                success: false,
                message: "Patient with this email already exists"
            });
        }
        const patientData = await Patient.create({
            name,
            email,
            DOB,
            phoneNumber,
            doctorID: req.user.sub
        });

       
        // Create directory only once with name and email
        const s3_patient = await createDirectory(name, email);
        
        // Remove the second createDirectory call that's using incorrect parameters
        // if(patientData){
        //     await createDirectory(req,res);
        // }
         
        return res.status(201).json({
            success: true,
            message: "Patient created successfully",
            data: patientData
        });
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
     
    await deleteDirectory(patient.name, patient.email);
    await patient.destroy();
    
    return res.status(200).json({
        success: true,
        message: "Patient deleted"
    });


 } catch (error) {
    console.error('Error deleting patient:', error);
    return false
 }
}

const updatePatient = async (req, res) => {
    
}
export { createPatient,getPatients,deletePatient,updatePatient };