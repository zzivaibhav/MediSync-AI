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

export { createPatient };