const jwt = require('jsonwebtoken');
const moment = require('moment');


exports.createToken =  function(user){
    const payload = {
        user_id : user._id,
        nick : user.nick,
        iat : moment().unix(),
        exp : moment().add(1, 'd').unix()
    }

    return jwt.sign(payload, 'VrsaWikiTourljko');
}