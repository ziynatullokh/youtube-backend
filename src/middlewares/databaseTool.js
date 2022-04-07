const path = require('path')
const fs = require('fs')

module.exports = ({ databasePath }) => {
    return (req, res, next) => {
        try {

            req.serverLog = (route, error, clientAgent, clientIp,body) =>{
                const time = new Date().toString().split(' ')
                return fs.writeFileSync(path.join(__dirname,'../../log', time[1]+time[2]+time[3] + time[4].split(':').join() + '.json'),JSON.stringify({route, error, clientAgent, clientIp,body},null,4))
            }

            req.ClientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            res.response = (status,success, sms, data)=>{
                return res.status(status).send({ status,success,sms,data})
            }

            req.readFile = function (fileName) {
                let buffer = fs.readFileSync(
                    path.join(databasePath, fileName + '.json'), 'UTF-8'
                )
                return JSON.parse(buffer || null) || null
            }

            req.writeFile = function (fileName, data) {
                let buffer = fs.writeFileSync(
                    path.join(databasePath, fileName + '.json'),
                    JSON.stringify(data, null, 4)
                )
                return true
            }

            return next()
            
        } catch (error) {
           return console.log(error)
        }
    }
}