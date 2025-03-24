import {hashGenerator} from '../utils/cognito.hash.js'
  import AWS from 'aws-sdk'
 import dotenv from 'dotenv'
 dotenv.config();
import jwt from 'jsonwebtoken'

const cognito = new AWS.CognitoIdentityServiceProvider();
 
const handleSignup = async (req, res) => {

    const { email, password, name, phone_number } = req.body;
      console.log(email);
    
       const secretHash = hashGenerator(email);
    
      const params = {
        ClientId: process.env.COGNITO_CLIENT_ID, 
        Password: password,
        Username: email, // Ensure this matches the value used in SecretHash
        SecretHash: secretHash,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "name",
            Value: name,
          },
          {
            Name: "phone_number",
            Value: phone_number ,
          },
        ],
      };
    
      try {
        const data = await cognito.signUp(params).promise();
        res.json(data);
      } catch (error) {
        console.error("Cognito SignUp Error:", error);
        res.status(400).json(error);
      }
}

const handleEmailVerification = async (req, res) => {
    const {email, code} = req.body;
    
        const secretHash = hashGenerator(email);
    
      const params ={
        ClientId : process.env.COGNITO_CLIENT_ID, 
        Username : email,
        ConfirmationCode : code,    
        SecretHash : secretHash
      }
    
      try{
        const data = await cognito.confirmSignUp(params).promise();
        res.json(data);
      }
      catch(error){
        console.error("Cognito Confirm SignUp Error:", error);
        res.status(400).json(error);
      }
}

const handleLogin = async (req, res) => {
  const{email, password} = req.body;
  const secretHash = hashGenerator(email);
  const params= {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,  
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash
    }
  }
  try{
    const data = await cognito.initiateAuth(params).promise();
    const token = jwt.sign({email : data.AuthenticationResult.AccessToken}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
    res.json({
      token : token,
      data : data
    });
  }
  catch(error){
    console.error("Cognito Login Error:", error);
    res.status(400).json(error);
  }
}
export { handleSignup , handleEmailVerification,handleLogin}