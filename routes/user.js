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
            const hours = parseInt(value);
            if(hours < 1 || hours > 20) {
                throw new Error('Value must be between 1 and 20');
            }
            return hours;
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