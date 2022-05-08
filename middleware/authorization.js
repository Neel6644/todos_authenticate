const createError = require('http-errors');
const jwt =require('jsonwebtoken');
require('dotenv').config();

const authorization=async (req,res,next)=>{
    try {
        const token=req.headers['token'];
        //const token=req.header('token');
       // console.log(token);
        if(!token){
            return res.status(403).json('Unauthorized user');
        }
        // const payload=jwt.verify(JSON.parse(token),process.env.JWT_SECRET,(err)=>{
        //     if (err){
        //         const errorMessage = err.name === JsonWebTokenError ? 'Unauthorized' : err.name;
        //         return next(createError.Unauthorized(errorMessage));
        //     }
        // });
        // req.user=payload.user.id;
        jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
            if (err){
                const errorMessage = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.name;
                return res.status(403).json(errorMessage);
            }
            req.user=payload.user.id;
            next();
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json('server error');
    }
    
}

module.exports = authorization;