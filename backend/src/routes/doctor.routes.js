import {Router} from 'express';
import {createPatient,getPatients,deletePatient,updatePatient,uploadAudio,returnRecentPatients} from '../services/doctors.service.js';
import { createVisit , deleteVisit, getVisits} from '../services/processing.service.js';
import authenticateJWT  from '../middlewares/authenticate.js';
const router = Router();

router.post('/create-patient',authenticateJWT, createPatient);
router.get('/get-patients',authenticateJWT, getPatients);
//router.post('/upload-conversation', authenticateJWT ,upload.single("file"), uploadAudio);
router.get("/get-recent-patients", authenticateJWT, returnRecentPatients);
router.put('/update-patient',authenticateJWT,updatePatient);
router.delete('/delete-patient',authenticateJWT,deletePatient);

//visits related APIs

router.post('/create-visit', authenticateJWT, createVisit);
router.get('/get-visits', authenticateJWT, getVisits);
router.delete('/delete-visit', authenticateJWT, deleteVisit);
export {router}
    