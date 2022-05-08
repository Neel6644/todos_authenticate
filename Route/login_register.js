const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const router=require('express').Router();
const validation=require('../middleware/validation');
const authorization = require('../middleware/authorization');


router.post('/registration',validation,async(req,res)=>{
    try {
        //descructive data 
        const {user_name,user_email,user_password}=req.body;
        //check if user exist 
        const isUserExist=await pool.query('SELECT * FROM users WHERE user_email=$1',[user_email]);
        if(isUserExist.rows.length !== 0){
            return res.status(401).json('User is existed');
        }
        //convert password
        const saltRound=10;
        const salt=await bcrypt.genSalt(saltRound);
        const hashPassword=await bcrypt.hash(user_password,salt);
        //insert data into database
        const newUser=await pool.query('INSERT INTO users(user_name,user_email,user_password) VALUES ($1,$2,$3) RETURNING *',[user_name,user_email,hashPassword]);

        //generate token 
        const token=await jwtGenerator(newUser.rows[0].user_id);
        return res.status(200).json(token);
    } catch (error) {
        console.log(error);
        return res.status(500).json('server error');
    }
});

router.post('/login',validation,async(req,res)=>{
    try {
        //destructive all variable 
        const {user_email,user_password}=req.body;
        //check user is exist
        const isUserExist=await pool.query('SELECT * FROM users WHERE user_email=$1',[user_email]);
        if(isUserExist.rows.length === 0){
            return res.status(401).json('Email or Password is invalid');
        }
        //check password is valid 
        const password=await bcrypt.compare(user_password,isUserExist.rows[0].user_password);
        if(!password){
            return res.status(401).json('Email or Password is invalid');
        }
        //generate jwt token
        const token =await jwtGenerator(isUserExist.rows[0].user_id);
        return res.status(200).json(token);
    } catch (error) {
        console.log(error);
        return res.status(500).json('server error');
    }
});

router.get('/is_verify',authorization, (req,res)=>{
    try {
        return res.json(true);
    } catch (error) {
        console.log(error);
        return res.status(500).json('server error');
    }
})

module.exports=router