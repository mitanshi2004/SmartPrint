const express = require('express');
const router = express.Router(); 

const { signup, login } = require('../controllers/auth-controllers');
const { signUpValidation, LogInValidation } = require('../middlewares/auth-validations');

// Login route
router.post('/login', LogInValidation, login);

// Signup route
router.post('/signup', signUpValidation, signup);

module.exports = router;  
