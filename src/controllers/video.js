const fs = require('fs')
const path = require('path')
const jwt = require('../tool/JWTToken.js')

const video = (req,res) => {

	try{
		if(req.method == 'DELETE'){

			const client = jwt.verify(req.headers.token)
			const videoPath = req.query.info
			if(!req.query.info) return res.response(405,false,"parse error",[])


			const users = req.readFile('users') || []

			let user = users.map(el => {
				if(el.userId == client.userId){

					let index = el.videos.indexOf(videoPath)
					if(index != -1) el.videos.splice(index,1)
					console.log(index,videoPath,el.videos)
				}
				return el
			})
			console.log(user)

			req.writeFile('users',user)

			let removeFile = fs.unlinkSync(path.join(__dirname,'../files',videoPath))
			let removeFilePass = fs.unlinkSync(path.join(__dirname,'../data',videoPath + '.json'))			
			
			return res.response(200,true,"Video removed",[]) 
		}
		else if(req.method == 'PUT'){
			console.log(req.body)
			const object = Object.keys(req.body)

			if(!req.query.info) return res.response(405,false,"parse error",[])
			if(object.length > 1) return res.response(400,false,"only 1 argument can be submitted",[])

			
			if(req.body.videoName) {
				if(req.body.videoName > 30) return res.response(400,false,"invalid video name",[])
				let data = req.readFile(req.query.info)
				data.videoName = req.body.videoName
				req.writeFile(req.query.info,data)
				return res.response(200,true,"successfully changed",[])
			}

		
			return res.response(400,true,"Bad request",[]) 
		}
		if(req.query.download){
			return res.status(200).download(path.join(__dirname,'../files',req.query.download))
		}

		if(req.query.watch){
			return res.status(206).sendFile(path.join(__dirname,'../files',req.query.watch))

		}

		if(req.query.info){
			let data = req.readFile(req.query.info)
			return res.response(200,true,'',[data])
		}

		else{
			const files = fs.readdirSync(path.join(__dirname,'../data'))
			const index = files.indexOf('users.json')
			files.splice(index,1)
			const result = files.map( el=> {
				return {[el.slice(0,-5)]:JSON.parse(fs.readFileSync(path.join(__dirname,'../data',el)))}
			})
			
			return res.response(200,true,'',result)
		}
	}catch(error){
		req.serverLog('/video', error.message,req.headers['user-agent'],req.clientIp,req.body)
		return res.response(500,false,"Internal server error",[])
	}
}



module.exports = {
	GET:video
}