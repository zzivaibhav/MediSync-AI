import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
dotenv.config();

const authenticateJWT = async (req, res, next) => {
    // Check if authorization header exists
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No authorization header provided' });
    }

    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Create verifier for Cognito tokens
        const verifier = CognitoJwtVerifier.create({
            userPoolId: process.env.COGNITO_USER_POOL_ID,
            tokenUse: 'access',
            clientId: process.env.COGNITO_CLIENT_ID,
        });

        // Verify the token and attach the decoded payload to the request object
        const decoded = await verifier.verify(token);
        req.user = decoded;
        console.log("Decoded JWT:", decoded);
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        
        // Provide better error messages based on the error type
        if (error.name === 'JwtWithoutValidKidError') {
            return res.status(403).json({ 
                message: 'Invalid token format or token not issued by Cognito' 
            });
        }
        
        return res.status(403).json({ message: 'Authentication failed' });
    }
};

export default authenticateJWT;