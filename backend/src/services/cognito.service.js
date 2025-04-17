import {hashGenerator} from '../utils/cognito.hash.js'
import AWS from 'aws-sdk'
//import cognito_client from '@aws-sdk/client-cognito-identity-provider'
import jwt from 'jsonwebtoken'
import Doctor from '../model/doctor.model.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import dotenv from 'dotenv'
dotenv.config();



// AWS Cognito Configuration
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: "us-east-1" // <-- Add this line to specify the region
});

const handleSignup = async (req, res) => {
  const { email, password, name, phone_number } = req.body;
  console.log("Signup attempt for:", email);

  // Generate secret hash for Cognito
  const secretHash = hashGenerator(email);

  // Cognito SignUp Parameters
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Password: password,
    Username: email,
    SecretHash: secretHash,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
      { Name: "phone_number", Value: phone_number },
    ],
  };

  try {
    // Check if doctor exists
    const existingDoctor = await Doctor.findOne({ where: { email: email }});
    
    if (existingDoctor) {
      return res.status(400).json(
        new ApiResponse(false, "Doctor already exists with this email", null)
      )
      
    }
    
    // 1. FIRST TRY COGNITO SIGNUP (CLOUD)
    const cognitoResponse = await cognito.signUp(params).promise();
     if (!cognitoResponse.UserSub) {
      throw new Error("Cognito signup failed: No UserSub returned");
    }

    // 2. ONLY IF COGNITO SUCCEEDS, SAVE TO MYSQL DATABASE (LOCAL)
    const doctorData = new Doctor({
      email: email,
      name: name,
      phoneNumber: phone_number,
      cognitoReference: cognitoResponse.UserSub,
    });

    const savedDoctor = await doctorData.save();
    console.log("Doctor saved to Local database:", savedDoctor);

    // 3. RETURN SUCCESS RESPONSE
    return res.status(200).json(
      new ApiResponse(true,savedDoctor, "Doctor registered successfully")
    );

  } catch (error) {
    console.error("Signup Error:", error.message);

    // If Cognito fails, DO NOT save to MongoDB
    res.status(400).json({
      success: false,
      message: error.message,
      details: error.code || "Cognito signup failed",
    });
  }
};
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