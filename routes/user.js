const { parse } = require('crypto-js/enc-base64');
const e = require('express');
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.get('/dashboard', userCtrl.dashboard);
router.post(
    '/dashboard', 
    body('hours')
        .not().isEmpty()
        .custom((value,{req, loc, path}) => {
            return parseInt(value);
        }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect(`/user/dashboard?error=[${errors.array()[0].param}] ${errors.array()[0].msg}`) 
            return;
        }
    
        userCtrl.saveHours(req, res);
    }
);

module.exports = router;