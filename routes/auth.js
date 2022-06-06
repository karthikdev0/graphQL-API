const express = require('express');
const { body }  =  require('express-validator');

const User  =  require('../models/user');
const authController  =  require('../controllers/auth');
const isAuth  =  require('../middleware/is-auth');

const router  =  express.Router();

router.put('/signup',[
    body('email').isEmail().withMessage('Enter a valid email')
    .custom((value,{req}) =>{
        return User.findOne({email:value}).then( userDoc  =>{
            if(userDoc){
                return Promise.reject('Email already exists');
            }
        });
    }).normalizeEmail(),
    body('password').trim().isLength({min:5}),
    body('name').trim().notEmpty() 

],authController.singup);

router.post('/login',authController.login);

router.get('/status',isAuth,authController.getUserStatus);

router.patch('/status',isAuth,authController.updateStatus);

module.exports =  router;