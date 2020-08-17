const express = require('express');
const router = express.Router();
const resetPassword = require('../controllers/resetPassword');



router.post('/reset',resetPassword.resetPassword);
router.post('/resetpassword',resetPassword.reset);


module.exports = router