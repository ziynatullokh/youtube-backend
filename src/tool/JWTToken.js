const JWT = require('jsonwebtoken')
const kalit = process.env.SECRET_KEY


module.exports = {
    sign: data => JWT.sign(data,kalit),
    verify: token => JWT.verify(token,kalit)
}