import {Router} from 'express';
import {createPatient} from '../services/doctors.service.js';
import authenticateJWT  from '../middlewares/authenticate.js';
const router = Router();

router.post('/create-patient',authenticateJWT, createPatient);
export {router}
    