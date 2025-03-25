import {Router} from 'express';
import {createPatient,getPatients,deletePatient} from '../services/doctors.service.js';
import authenticateJWT  from '../middlewares/authenticate.js';
const router = Router();

router.post('/create-patient',authenticateJWT, createPatient);
router.get('/get-patients',authenticateJWT, getPatients);
router.delete('/delete-patient',authenticateJWT,deletePatient);
export {router}
    