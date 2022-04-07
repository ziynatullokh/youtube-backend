const sha256 = require('sha256')
const path = require('path')
const jwt = require('../tool/JWTToken.js')


const login = (req,res) => {

    try{
        let { name, password } = req.body
        console.log(req.body)
        name = name.trim()
        password = password.trim()

        if(!name || !password) return res.response(400,false,"Required data is insufficient",[])
        else if(name.length < 2) return res.response(400,false,'nick length less than 3',[])
        else if(name.length >30) return res.response(400,false,'nick length more than 30',[])
        
        else if(password.length < 6) return res.response(400,false,'password length less than 6',[])
        else if(password.length >20) return res.response(400,false,'password length more than 20',[])
        
        
        let users = req.readFile('users') || []
        
        let user = users.filter( el => el.name == name)
        
        if(!user[0]) return res.response(404,false,"such a user does not exist.",[])
        user= user[0]
        
        if(user.password != sha256(password)) return res.response(401,false,"password entered incorrectly",[])

        const token = jwt.sign({userId: user.userId, clientAgent: req.headers['user-agent'], clientIp: req.clientIp || req.ip || '0.0.0.0'})

        return res.response('200',true,'successfully logged in',[{token}])
    }catch(error){
        req.serverLog('/login', error.message,req.headers['user-agent'],req.clientIp,req.body)
        if(error.message == "Cannot read properties of undefined (reading 'trim')"){
            return res.response(400,false,'nickname and password required',[])}
        else{
            return res.response(500,false,"Internal server error",[])
        }
    }
}


module.exports ={
    POST: login
}