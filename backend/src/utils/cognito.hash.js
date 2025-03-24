import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

 const hashGenerator = (email) => {

     const secretHash = crypto
         .createHmac('SHA256', process.env.COGNITO_CLIENT_SECRET)
         .update(email + process.env.COGNITO_CLIENT_ID) // Use username instead of email if required
         .digest('base64');


         return secretHash;
 }
 export{hashGenerator}