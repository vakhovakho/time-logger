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
        db.collection('users').findOne({password: hash, name: req.body.name})
            .then(user => {
                if(!user) {
                    res.redirect(`/auth/login?error=No such user`);
                    return; 
                }
                
                req.session.user = user;
                res.redirect('/user/dashboard');
            });
    });
}


exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/'); 
}

exports.dashboard = (req, res) => {
    if(!req.session.user) {
        res.redirect('/auth/login');
    }

    res.render('dashboard', {user: req.session.user.name, title: 'Dashboard'});
}

exports.saveHours = (req, res, next) => {
    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, function(err, client){
		if(err) {
            res.redirect(`/user/dashboard?error=${err}`) 
            return;
        }

        let db = client.db('users_database');

        db.collection('users').findOne({id: req.session.user.id})
            .then(user => {
                if(!user) {
                    res.redirect(`/auth/login?error=No such user`);
                    return; 
                }

                const dayInMiliseconds = 1000 * 3600 * 24;
                const hours = parseInt(req.body.hours);
                user.lastRecord = new Date(user.lastRecord).getTime();
                
                if(Date.now() - new Date(user.lastRecord).getTime() < dayInMiliseconds / 2) {
                    res.redirect('/user/dashboard?error=You can only do it once per 12 hour');
                    return;
                }

                
                if(hours === 1) {
                    user.timeTotal += 2;
                }

                // 2 to the power of days without logged time
                const daysMissed =  Math.floor((Date.now() - user.lastRecord) / dayInMiliseconds) - 1;
                if(daysMissed > 0) {
                    user.timeTotal += (1 +daysMissed) * daysMissed;
                }
                
                
                const updateUserPromise = db.collection('users').updateOne(
                    {id: user.id},
                    { $set: {
                            "timeSpent": user.timeSpent + hours,
                            "lastRecord": new Date(),
                            "timeTotal": user.timeTotal
                        } 
                    }
                );

      
                const addLogPromise = db.collection('logs').updateOne(
                    { userId: user.id },
                    { $push: { logs: {time: new Date(), hours: hours} } },
                    { upsert: true }
                )

                Promise.all([updateUserPromise, addLogPromise])
                    .then(() => {
                        res.redirect('/');
                    })
                    .catch(e => {
                        res.redirect('/user/dashboard?error=' + e.message);
                    })
                
            });
    });
}
