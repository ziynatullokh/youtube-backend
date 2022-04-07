const sha256 = require('sha256')
const path = require('path')
const jwt = require('../tool/JWTToken.js')


const register = (req,res) => {
    const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,20}$/
    try{
        let { name, password } = req.body
        let file = req.files
        name = name.trim()
        password = password.trim()

        if(!name || !password || !file.file) return res.response(400,false,"Required data is insufficient",[])
        else if(name.length < 3) return res.response(400,false,'nick length less than 3',[])
        else if(name.length >30) return res.response(400,false,'nick length more than 30',[])
        
        else if(password.length < 6) return res.response(400,false,'password length less than 6',[])
        else if(password.length >20) return res.response(400,false,'password length more than 20',[])
        else if(!regPass.test(password)) return res.response(400,false,'the password must contain 1 uppercase letter and number',[])
        else if(file.size > 5242880) return res.response(400,false,'the file size being sent is more than 5 mb',[])
        else if(file.file.type != 'image/png' && file.file.type != 'image/jpg' && file.file.type != 'image/jpeg') return res.response(400,false,'You can send a file in png, jpg or jpeg format',[])
        
        let users = req.readFile('users') || []
        
        let user = users.filter( el => el.name == name)
        
        if(user[0]) return res.response(409,false,"It is already registered with the nickname.",[])
    
        users.push({
            userId: users.at(-1)?.userId + 1 || 1,
            name,
            password: sha256(password),
            profileImage: path.basename(file.file.path),
            videos:[],
            later:[],
            favorits:[]
        })

        const token = jwt.sign({userId: users.at(-1).userId, clientAgent: req.headers['user-agent'], clientIp: req.clientIp || req.ip || '0.0.0.0'})
        
        req.writeFile('users',users)

        return res.response('201',true,'you have successfully registered',[{token}])
    }catch(error){
        req.serverLog('/register', error.message,req.headers['user-agent'],req.clientIp,req.body)
        if(error.message == "Cannot read properties of undefined (reading 'trim')"){
            return res.response(400,false,'nickname and password required',[])}
        else{
            return res.response(500,false,"Internal server error",[])
        }
    }
}


module.exports ={
    POST: register
}