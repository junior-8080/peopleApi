const express = require('express');
const router = express.Router();
const {
    check,
    body,
    validationResult
} = require('express-validator')



const userController = require('../controllers/userController')
const Errors = require('../utils/validationErr')
const userService = require('../services/userService')
const passwordController = require('../utils/password')
const update = require('../services/update')
// const provideToken = require('../utils/provideToken')

const signupParam = [
    check('username').exists().isLength({
        min: 5
    }).trim().escape().withMessage('username must be atleast 5 characters'),
    check('useremail').isEmail().normalizeEmail().withMessage('invalid email'),
    check('password').isLength({
        min: 8
    }).withMessage("Password must have atleast 8 characters"),
    check('password').isLength({
        max: 20
    }).withMessage("password too long"),
    check('msisdn').isLength({
        min: 10,max:15
    }).withMessage('incorrect Phonenumber'),
    check('confirmPassword', 'Passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)),
    check('username').custom((value) => {
        return userService.findUser(value).then(user => {
            if (user[0]) {
                return Promise.reject('Username already exits')
            }
        })
    }),
    check('msisdn').custom((value) => {
        return userService.findNumber(value).then(number => {
            if (number[0]) {
                return Promise.reject('Phonenumber already exits')
            }
        })
    }),
    check('useremail').custom((value) => {
        return userService.findEmail(value).then(email => {
            if (email[0]) {
                return Promise.reject('Email already exits')
            }
        })
    })
]

const updateProfile = [
    check('username').exists().isLength({
        min: 5
    }).trim().escape().withMessage('username must be atleast 5 characters'),
    check('useremail').isEmail().normalizeEmail().withMessage('invalid email'),
    check('msisdn').isLength({
        max: 10
    }).withMessage('incorrect Phonenumber'),
    check('useremail').custom((value) => {
        return update.findEmail(value).then(email => {
            if (email[0]) {
                return Promise.reject('Email already exits')
            }
        })
    }),
    check('username').custom((value) => {
        return update.findUser(value).then(user => {
            if (user[0]) {
                return Promise.reject('Username already exits')
            }
        })
    }),
    check('msisdn').custom((value) => {
        return update.findNumber(value).then(number => {
            if (number[0]) {
                return Promise.reject('Phonenumber already exits')
            }
        })
    }),
]
// find password ,unhash password ,compare password 
const sigininParam = [
    check('useremail').notEmpty().withMessage('provide an email'),
    check('password').notEmpty().withMessage("provide a password"),
    check('useremail').custom(value => {
        return userService.findEmail(value).then(email =>{
            if(email.length > 0){
                if(email[0].user_email !== value || email){
                    return Promise.reject('inavlid email or password')
                }
            } 
        })
        .catch(err => console.log(err))
    })
]
router.post('/signup', signupParam, Errors.ErrorArray, userController.signup)
router.post('/signin', sigininParam,Errors.ErrorArray,userController.signin)
router.put('/updateProfile',updateProfile,Errors.ErrorArray,userController.updateProfile)
router.get('/profile',userController.getProfile)
router.get('/logout',userController.logout)
module.exports = router;                                            