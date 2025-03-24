import {Router} from 'express';
import {createPatient,getPatients} from '../services/doctors.service.js';
import authenticateJWT  from '../middlewares/authenticate.js';
const router = Router();

router.post('/create-patient',authenticateJWT, createPatient);
router.get('/get-patients',authenticateJWT, getPatients);

export {router}
    