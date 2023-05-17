const express = require('express')
const bcrypt = require('bcrypt')
const user = require('../controller/userController')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const router = express.Router()
const secretKey = process.env.token_secret

router.post('/create',async(req,res)=>{
    try {
        const {phoneNumber , password} = req.body
        // console.log(phoneNumber,password);
        if(!phoneNumber || !password){
            let error = ''
            if(!phoneNumber) error = 'phoneNumber'
            if(!password){
                error = error ==''? 'password ': `${error} and password`
            }
            return res.status(400).send(`${error} are required`)
        }  
        // console.log('coming'); 
        const userAlreadyExist = await user.findUser('user',phoneNumber)
        // console.log(userAlreadyExist);
        if(userAlreadyExist){
            res.status(400).json({status : 400, message : 'user already exist'})
        }
        else{
            // console.log('coming for creating user part');
            const hashedPassword = await bcrypt.hash(password,10)
            const newuser = await user.createUser({phoneNumber,hashedPassword})
            res.status(200).json({status : 200, message : 'user created', phoneNumber : newuser.phonenumber})
        }
    } catch (error) {
        // console.log(error);
        res.json({message : 'error cooured' , error})
    }
})

router.post('/login',async(req,res)=>{
    try {
        const {phoneNumber,password} = req.body
        if(!phoneNumber || !password){
            let error = ''
            if(!phoneNumber){
                error = 'phoneNumber'
            }
            if(!password){
                error = error ==''?'password ':`${error} and password `
            }
            return res.status(400).json({status : 400, message : `${error} are required`})
        }
        const loggedUser = await user.findUser('user',phoneNumber)
        // console.log(loggedUser);
        if(loggedUser){
            const compare = await bcrypt.compare(password,loggedUser.password)
            if(compare){
                delete loggedUser.password
                delete loggedUser.token
                const token = await jwt.sign(loggedUser,secretKey)
                const result = await user.updateUser('user',token,loggedUser.userid)
                if(result){
                    res.status(200).json({status: 200, message : 'logged in successful', token, loggedUser })
                }else{
                    res.status(400).json({status:400, message :'error occured',error})
                }
            }else{
                res.status(400).json({status : 400, message : 'wrong credentials'})
            }
        }else{
            res.status(404).json({status: 404, message :'user not found'})
        }  
    } catch (error) {
        console.log(error);
        res.status(400).json({status :400, message :'error occured',error})
        
    }
})

module.exports = router

