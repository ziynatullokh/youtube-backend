
const path = require('path')
const jwt = require('../tool/JWTToken.js')


const upload = (req,res) => {
    try{
        
        const {videoName} = req.body
        if(!videoName || videoName.length == 0 || videoName.length > 30) return res.response(400,false,"Video name required",[])
        if(req.files.file.size > 52428800 ) return res.response(400,false,"video size must be less than 50 mb",[])

        const user = jwt.verify(req.headers.token)
        const videopath = path.basename(req.files.file.path)

        let users = req.readFile('users') || []

        let data = users.filter( el => el.userId == user.userId)

        if(!data.length) return res.response(404,false,"User not found",[])

        const time = new Date().toISOString().slice(0,10) + '|' + new Date().toISOString().slice(11,16)


        req.writeFile('users', users.map( el => {
            if(el.userId == user.userId){
                el.videos.push(videopath)
            }
            return el
        }))

        delete data.password
        delete data.userId
        
        req.writeFile(videopath,{
            owner: data,
            videoName,
            like: 0,
            dislike:0,
            views:0,
            downloads:0,
            category:'',
            size: req.files.file.size,
            time
        })
        
        return res.response(200,true,"video uploaded successfully",[{videopath,data:req.readFile(videopath)}])
        
    }catch(error){
        req.serverLog('/upload', error.message,req.headers['user-agent'],req.clientIp,req.body)
        return res.response(500,false,"Internal server error",[])
    }
}


module.exports ={
    POST: upload
}