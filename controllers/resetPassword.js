const userServive = require('../services/userService');
const cryptoRandomString = require('crypto-random-string');
const nodemailer = require('nodemailer');
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
    console.log(email);
    userServive.fetchUser(email).then((result) => {
        if (result === undefined) {
            return res.status(422).json({
                errors: [{
                    msg: "email doest not exit"
                }]
            })
        }
        sendEmail()
            .then(messageId => {
                console.log('<<<<')
                console.log(messageId)
                if (result.accepted) {
                    console.log('//')
                    return res.json({
                        msg: "reset"
                    })
                }

            })
            .catch(err => console.log(err))

    })
}


function sendEmail() {
    const param = cryptoRandomString({
        length: 15,
        type: 'url-safe'
    });

    let message = {
        from: process.env.USER,
        to: 'abdulmukhsin@gmail.com',
        subject: '<h3>Reset Password</h3>',
        html: `<a href="http://localhost:3001/api/reset/${param}</a>`
    }

    return new Promise((reject, resolve) => {

        transporter.sendMail(message, (err, info) => {
            if (err) {
                return reject(err)
            }
            resolve();
        })


    })
}

module.exports = {
    resetPassword
}