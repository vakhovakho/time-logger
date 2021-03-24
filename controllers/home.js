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
            .sort( { lastRecord: 1 } )
            .toArray(function (err, users) {
                users = users
                    .map(user => {
                        const dayInMiliseconds = 1000 * 3600 * 24;
                        user.lastRecord = new Date(user.lastRecord).getTime();
                        
                        const daysMissed =  user.timeSpent >= 200 ? 0 : Math.floor((Date.now() - user.lastRecord) / dayInMiliseconds - 0.25);
                        if(daysMissed > 0) {
                            user.timeTotal += (1 +daysMissed) * daysMissed;
                        }
                        return {...user, penalty: user.timeTotal - 200, finalTime: user.timeSpent - (user.timeTotal - 200), timeLeft: 200 - (user.timeSpent - (user.timeTotal - 200))};
                    })
                    .sort((a, b) => (b.timeSpent - b.penalty) - (a.timeSpent - a.penalty) );
                
                const maxTotal = findMaxTotal(users);
                client.close();
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