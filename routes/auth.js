const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const userCtrl = require('../controllers/user');

// router.post('/login', userCtrl.login);
router.get('/login', (req, res) => {
    res.render('login');
});

router.post(
    '/login', 
    body('password')
        .not().isEmpty()
        .isLength({ min: 6 }),
        (req, res) => {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.redirect(`/auth/login?error=[${errors.array()[0].param}] ${errors.array()[0].msg}`) 
                return;
            }
        
            userCtrl.login(req, res);
        },
);

router.get('/register', userCtrl.registration);
router.post(
    '/register', 
    body('name').not().isEmpty(),
    // password must be at least 5 chars long
    body('password')
        .not().isEmpty()
        .isLength({ min: 6 })
        .custom((value,{req, loc, path}) => {
            if (value !== req.body.confirm_password) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        }),
    (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect(`/auth/register?error=[${errors.array()[0].param}] ${errors.array()[0].msg}`) 
            return;
        }
    
        userCtrl.register(req, res);
    },
);
router.get('/registration-success', (req, res) => {
    res.render('registration_success');
});

module.exports = router;