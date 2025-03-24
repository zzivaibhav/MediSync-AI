import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const authenticatJWT = (req, res, next) => {
    const token = req.headers.authorization. split(' ')[1];
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY, (err,user)=>{
            if(err){
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        })

    }
    else{
        res.sendStatus(401);
    }
}

export default authenticatJWT;