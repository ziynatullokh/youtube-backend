
const path = require('path')
const jwt = require('../tool/JWTToken.js')


const users = (req,res) => {
    try{
        let id = req.params.id


        let data = req.readFile('users') || []

        if(id){
            const user = data.filter( el => el.userId == id)
            
            delete user[0].password
            return user.length ? res.response(200,true,'',user) : res.response(404,false,"User not found",[])
        }

        let users = data.map( el => {
            delete el.password
            return el
        })


        return res.response('200',true,'',users)
        
    }catch(error){
        req.serverLog('/users', error.message,req.headers['user-agent'],req.clientIp,req.body)
        return res.response(500,false,"Internal server error",[])
    }
}


module.exports ={
    GET: users
}