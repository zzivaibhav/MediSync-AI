import Patient from '../model/patient.model.js';

const createPatient = async (req, res) => {
    try {
        const {name, email, DOB, image, phoneNumber} = req.body;

        const patientData = await Patient.create({
            name,
            email,
            DOB,
            image,
            phoneNumber,
            doctorID: req.user.sub
        });
        
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

export { createPatient,getPatients };