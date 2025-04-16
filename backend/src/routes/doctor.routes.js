import {Router} from 'express';
import {createPatient,getPatients,deletePatient,updatePatient,uploadAudio} from '../services/doctors.service.js';
import { createVisit , deleteVisit, getVisits, returnRecentVisits,fetchReport} from '../services/processing.service.js';
import authenticateJWT  from '../middlewares/authenticate.js';
import {upload} from '../middlewares/fileUpload.js';
const router = Router();

router.post('/create-patient',authenticateJWT, createPatient);
router.get('/get-patients',authenticateJWT, getPatients);
//router.post('/upload-conversation', authenticateJWT ,upload.single("file"), uploadAudio);

router.put('/update-patient',authenticateJWT,updatePatient);
router.delete('/delete-patient',authenticateJWT,deletePatient);

//visits related APIs

router.post('/create-visit', authenticateJWT,upload.single("file"), createVisit);
router.get('/get-visits', authenticateJWT, getVisits);
router.delete('/delete-visit', authenticateJWT, deleteVisit);
router.get("/get-recent-visits", authenticateJWT, returnRecentVisits);
router.get("/report", authenticateJWT, fetchReport);
export {router}
    