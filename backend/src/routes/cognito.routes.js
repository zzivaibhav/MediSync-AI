import {Router} from 'express';
import {handleSignup, handleEmailVerification,handleLogin}from '../services/cognito.service.js'

const router = Router();

router.post("/signup", handleSignup );

router.post("/confirm", handleEmailVerification);

router.post("/login", handleLogin);
export {router}