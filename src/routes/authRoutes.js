const express = require('express');
const authController = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../schemas/authSchema');
const validate = require('../middlewares/validate');

const router = express.Router();

router.post(
    '/register',
    validate(registerSchema, 'body'),
    authController.register
);

router.post(
    '/login',
    validate(loginSchema, 'body'),
    authController.login
);

module.exports = router;
