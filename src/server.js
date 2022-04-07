const express = require ('express')
const dotenv = require('dotenv')
const formData = require('express-form-data')

const os = require('os')
const path = require('path')

const IP = os.networkInterfaces()['Беспроводная сеть'][1]['address']
const PORT = process.env.PORT || 5555
const app = express()

dotenv.config(process.cwd())
const options = {
    uploadDir:path.join(__dirname, 'files'),
	autoClean:false
}

app.set('images',path.join(__dirname,'files'))

const accessControlMiddle = require('./middlewares/access.js')
const checkToken = require('./middlewares/checkToken.js')
const databaseTool = require('./middlewares/databaseTool.js')
const routes = require('./routes/routes.js')



app.use(express.static(path.join(app.get('images'))))
app.use(accessControlMiddle)
app.use(databaseTool({databasePath: path.join(__dirname,'data')}))
app.use(express.json())
app.use(formData.parse(options))


app.get('/profile', checkToken,routes.profile)
app.post('/register', routes.register)
app.post('/login', routes.login)
app.post('/upload',checkToken,routes.upload)



app.get(['/users/:id','/users'], routes.users)

app.get('/video', routes.video)
app.put('/video', checkToken,routes.video)
app.delete('/video', checkToken,routes.video)



app.use( (err,req,res,next) => {
    
    if(err.message == 'jwt must be provided'){
        return res.response(401,false,"Token required",[])
    }
    else if(err.message == 'jwt malformed'){
        return res.response(401,false,"Invalid token",[])
    }
    else if(err instanceof SyntaxError){
        return res.response(400,false,'JSON Parse error',[])
    }
    else{
        return res.response(500,false,"Internal Server Error",[])
    }
})

app.listen(PORT, () => console.log('backend http://' + IP + ':' + PORT))