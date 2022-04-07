const jwt = require('../tool/JWTToken.js')

module.exports = (req,res,next) => {
    const token = jwt.verify(req.headers.token)
    const remoteIp = req.clientIp || req.ip || '0.0.0.0'
    const remoteAgent = req.headers['user-agent']

    if(remoteIp !=token.clientIp || remoteAgent != token.clientAgent) return res.response(403,false,'Token expired',[])
    next()
}