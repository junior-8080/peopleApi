const userService = require('../services/userService');
const cryptoRandomString = require('crypto-random-string');
const resetService = require('../services/resetPassword');
const nodemailer = require('nodemailer');
const passwordController = require('../utils/password');
require('dotenv').config();



// creating a transporter for the default smtp transporter.
let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    // auth: {
    //     user: process.env.USER, // generated ethereal user
    //     pass: process.env.PASSWORD, // generated ethereal password
    // },
    auth: {
        user: 'willow.turcotte34@ethereal.email',
        pass: 'EZ6RAgrUhwejE1fc4k'
    },
});



function resetPassword(req, res) {
    const email = req.body.email;
    const secret = cryptoRandomString({
        length: 15,
        type: 'url-safe'
    });

    // console.log(secret)
    const data = {
        email: email,
        secret: secret
    }
    userService.fetchUser(email).then((result) => {
            if (result === undefined) {
                return res.status(422).json({
                    errors: [{
                        msg: "email doest not exit"
                    }]
                })
            }
            sendEmail(secret).then(info => {
                if (info.accepted) {
                    resetService.saveReset(data)
                        .then(result => {
                            if (result[0].reset_id) {
                               return res.json({
                                    message: 'reset'
                                })
                            }
                        })
                }
            })
        })
        .catch(err => console.log(err))
}


function sendEmail(secret) {

    let message = {
        from: process.env.USER,
        to: 'abdulmukhsin@gmail.com',
        subject: 'Reset Password',
        html: `<a href="http://localhost:3001/api/reset/${secret}">Click here</a>`
    }

    return transporter.sendMail(message)

}



function reset(req, res) {
    let data = req.body;
    resetService.fetchSecretString(data.secret).then(result => {

            if (result === undefined) {
                return res.json({
                    message: 'cannot reset password'
                })
            }
            passwordController.hashPassword(data.password)
                .then(password => {
                    data.email = result.email;
                    data.password = password
                    userService.updatePassword(data)
                        .then(result => {
                            console.log(result.user_id)
                            if (result) {
                                res.json({
                                    message: 'password reset'
                                })
                            }
                        })
                })


        })
        .catch(err => console.log(err));

}

module.exports = {
    resetPassword,
    reset
}