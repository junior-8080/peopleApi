const jwt = require('jsonwebtoken')

const userService = require('../services/userService')
const passwordController = require('../utils/password')
const peopleService = require('../controllers/peopleController')



function signup(req, res) {
    let data = req.body
    console.log(data)
    data.useremail = data.useremail.toLowerCase()
    passwordController.hashPassword(data.password).then(hash => {
            data.password = hash;
            userService.signup(data)
                .then(result => {
                    if (result) {
                        res.json({
                            message: "user created sucessfully"
                        })
                    }
                })
        })
        .catch(err => console.log(err))
}

function signin(req, res) {
    let password = req.body.password;
    userService.fetchUser(req.body.useremail)
        .then(result => {
            if(result === undefined){
                return res.status(422).json({
                    errors: [{msg:"invalid email or password"}]
                })
            }
            passwordController.comparePassword(password, result.user_password)
                .then(compare => {
                    let payload = {
                        userId: result.user_id,
                        username: result.user_name,
                        useremail:result.user_email
                    }
                    console.log(payload)
                    if (compare) {
                        generatetoken(payload)
                            .then(token => {
                                res.cookie('token', token, {
                                    maxAge: 1000 * 60 * 60,
                                    httpOnly: true,
                                    path:"/api"
                                })
                                console.log(token)
                                console.log("///")
                                return res.json({
                                    message: "success",
                                    username: payload.username
                                })
                            })
                    }
                })
                .catch(err => {

                    if (err.name === 'error password') {
                        console.log('pp')
                        return res.status(422).json({
                            errors: [{msg:"invalid email or password"}]
                        })
                    }
                })
                .catch(err => {
                    console.log('hi',err)
                })
        })
}

function generatetoken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign({
            payload
        }, 'secretKey', {
            expiresIn: '1hr'
        }, (err, token) => {
            if (token) {
                resolve(token)
            } else {
                reject(err)
            }
        })
    })
}

function updateProfile(req, res) {
    let data = req.body;
    console.log(data)
    userService.updateProfile(data)
        .then(result => {
            if (result) {
                return res.json({
                    message: "successfully updated"
                })
            }
        })
        .catch(err => console.log(err))
}

function getProfile(req,res) {
    if(req.cookies.token){
        console.log(req.cookies.token)
        peopleService.verifyToken(req.cookies.token)
        .then(decoded=> {
            console.log(decoded)
            userService.fetchUser(decoded.payload.useremail)
            .then(result=>{
                console.log(result)
                res.json({
                    message:"success",
                    data:result
                })
            })
            .catch(err => console.log(err))
        })
        .catch(err=>{
            console.log(err)
        })
        
    }else {
        res.status(422).json({
         errors:[{msg: "token expired"}]
        })
      }
}

function logout(req,res){
    res.clearCookie('token').json({
        message:'cookie cleared'
    })
}


module.exports = {
    signup,
    signin,
    updateProfile,
    getProfile,
    logout
}