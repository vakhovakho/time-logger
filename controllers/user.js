const MongoClient = require('mongodb').MongoClient;
const { mongoUrl } = require('../config');

exports.registration = (req, res, next) => {
    res.render('registration', {
		title: "Registration"
	});
}

exports.register = (req, res, next) => {
    const User = require('../models/user');
    
  	MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, function(err, client){
		if(err) {
            res.redirect(`/auth/register?error=${err}`) 
            return;
        }

        const user = new User(Date.now(), req.body.name, req.body.password);

        let db = client.db('users_database');
        db.collection('users').insertOne(user);
        
        res.redirect('/auth/registration-success');
    });
};

exports.login = (req, res, next) => {
    const sha256 = require('crypto-js/sha256');
    const Base64 = require('crypto-js/enc-base64');

    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, function(err, client){
		if(err) {
            res.redirect(`/auth/login?error=${err}`) 
            return;
        }

        let db = client.db('users_database');
        const hash = Base64.stringify(sha256(req.body.password));
        console.log(hash);
        db.collection('users').findOne({password: hash})
            .then(user => {
                if(!user) {
                    res.redirect(`/auth/login?error=No such user`);
                    return; 
                }
                
                req.session.user = user.id;
                res.redirect('/user/dashboard');
            });
    });
}

exports.dashboard = (req, res) => {
    if(!req.session.user) {
        res.redirect('/auth/login');
    }

    res.render('dashboard');
}

exports.saveHours = (req, res, next) => {
    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, function(err, client){
		if(err) {
            res.redirect(`/user/dashboard?error=${err}`) 
            return;
        }

        let db = client.db('users_database');

        db.collection('users').findOne({id: req.session.user})
            .then(user => {
                if(!user) {
                    res.redirect(`/auth/login?error=No such user`);
                    return; 
                }
                
                if(Date.now() - new Date(user.lastRecord).getTime() < (1000 * 3600 * 24)) {
                    res.redirect('/user/dashboard?error=You can only do it once per 24 hour');
                    return;
                }
                
                db.collection('users').updateOne(
                    {id: user.id},
                    { $set: {
                            "timeSpent": user.timeSpent + parseInt(req.body.hours),
                            "lastRecord": new Date()
                        } 
                    }
                ).then(() => {
                    res.redirect('/user/dashboard');
                }).catch(e => {
                    res.redirect('/user/dashboard?error=' + e.message);
                })
                
                
            });
    });
}
