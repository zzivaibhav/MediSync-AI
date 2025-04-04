import {Router} from 'express';
import {createPatient,getPatients,deletePatient,updatePatient,uploadAudio} from '../services/doctors.service.js';
import authenticateJWT  from '../middlewares/authenticate.js';
import {upload} from "../middlewares/fileUpload.js"
const router = Router();

router.post('/create-patient',authenticateJWT, createPatient);
router.get('/get-patients',authenticateJWT, getPatients);
router.post('/upload-audio', authenticateJWT ,upload.single("file"), uploadAudio);

router.put('/update-patient',authenticateJWT,updatePatient);
router.delete('/delete-patient',authenticateJWT,deletePatient);


export {router}
    