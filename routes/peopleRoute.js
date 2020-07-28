const express = require('express');
const router = express.Router();
const {
    check,
    body,
    validationResult
} = require('express-validator');

const peoplecontorller = require('../controllers/peopleController');
const Errors = require('../utils/validationErr')

const personProfile = [
    check('name').exists().isLength({
        min: 1
    }).trim().escape().withMessage('username must be atleast 1 characters'),
    check('email').isEmail().normalizeEmail().withMessage('invalid email'),
    check('number').isLength({
        max: 10
    }).withMessage('incorrect Phonenumber'),
];

router.get('/getAllPeople', peoplecontorller.getAllPeople);
router.get('/getPerson/:id', peoplecontorller.getPerson);
router.post('/addPerson', personProfile, Errors.ErrorArray, peoplecontorller.addPerson);
router.put('/updatePerson', personProfile, Errors.ErrorArray, peoplecontorller.updatePerson)
router.delete('/Person/:id', peoplecontorller.deletePerson);

module.exports = router;