import Patient  from '../model/patient.model.js';
const createPatient = async (req, res) => {
    const {name, email,DOB, image, phoneNumber} = req.body;

    const patientData = new Patient({
        name: name,
        email: email,
        DOB: DOB,
        image: image,
        phoneNumber: phoneNumber,
        doctorID : req.user.sub
    });
    await patientData.save();
}

export { createPatient };