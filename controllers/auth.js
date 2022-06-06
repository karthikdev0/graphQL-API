const User  =  require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult} =  require('express-validator/check');

exports.singup = (req,res,next) =>{
    const errors =  validationResult(req);
    if(!errors.isEmpty()){
        const error  =  new Error('Validation failed');
        error.statusCode  = 422;
        error.data  =  errors.array();
        throw error;
    }
    const email  =  req.body.email;
    const name  =  req.body.name;
    const password  =  req.body.password;

    bcrypt.hash(password,12)
    .then(hashedPassword  =>{
        const user  = new User({
            name:name,
            email:email,
            password:hashedPassword
        });
        return user.save();
    })
    .then(result  =>{
        res.status(201).json({message:'User created',userId : result._id});
    })
    .catch(err  => next(err))



};

exports.login  = ( req,res,next) =>{
    const email  =  req.body.email;
    const password  =  req.body.password;
    let loadedUser;

    User.findOne({email:email})
    .then(user =>{
        if(!user){
            const error  =  new Error('No user found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password,user.password);
    })
    .then(isEqual  =>{
        if(!isEqual){
            const error  =  new Error('wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token  =  jwt.sign({email:loadedUser.email,userId:loadedUser._id.toString()},
        'asdfghjkl1234567890',{expiresIn:'1hr'}
        );
        res.status(200).json({token:token,userId:loadedUser._id.toString()});
    })
    .catch(err => next(err))

};

exports.getUserStatus = (req,res,next) =>{
    User.findById(req.userId)
    .then(user =>{
        if(!user){
            const error  =  new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({status:user.status});

    })
    .catch(err => next(err))
};

exports.updateStatus = (req,res,next) =>{
    const newStatus  =  req.body.status;
    User.findById(req.userId)
    .then(user =>{
        if(!user){
            const error  =  new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        user.status = newStatus;
        return user.save();
    })
    .then(result  =>{
        res.status(200).json({status:newStatus,message:'stauts updated'});
    })
    .catch(err  => next(err))
};