
const path = require('path')
const jwt = require('../tool/JWTToken.js')


const profile = (req,res) => {

    try{
         
        if(!req.headers.token) return res.response(403,false,"Token not found",[])
        
        const id = jwt.verify(req.headers.token)

        let users = req.readFile('users') || []
        
        let user = users.filter( el => el.userId == id.userId)
        if(!user[0]) return res.response(404,false,"such a user does not exist.",[])
        delete user[0].password
        return res.response('200',true,'', user)
        
    }catch(error){
        req.serverLog('/profile', error.message,req.headers['user-agent'],req.clientIp,req.body)
        return res.response(500,false,"Internal server error",[])
    }
}


module.exports ={
    GET: profile
}