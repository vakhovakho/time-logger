const MongoClient = require('mongodb').MongoClient;
const { mongoUrl } = require('../config');

exports.index = (req, res, next) => {
    MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, function(err, client){
		if(err) {
            res.render('error', {error: err})
            return;
        }

        let db = client.db('users_database');

        db.collection('users')
            .find({})
            .toArray(function (err, users) {
                users = users
                    .map(user => ({...user, penalty: user.timeTotal - 200}))
                    .sort((a, b) => (b.timeSpent - b.penalty) - (a.timeSpent - a.penalty) );
                
                const maxTotal = findMaxTotal(users);
                res.render('index', {
                    users: users, 
                    maxTotal: maxTotal, 
                    title: "Home Page"
                });  
            });
    });
}

function findMaxTotal(users) {
    let max = 0;
    users.forEach(user => {
        if(user.timeTotal > max) {
            max = user.timeTotal;
        }
    });

    return max;
}