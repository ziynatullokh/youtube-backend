const register = require('../controllers/register.js')
const login = require('../controllers/login.js')
const profile = require('../controllers/profile.js')
const users = require('../controllers/users.js')
const upload = require('../controllers/upload.js')
const video = require('../controllers/video.js')






module.exports = {
    'register': register.POST,
    'login': login.POST,
    'profile':profile.GET,
    'users':users.GET,
    'upload':upload.POST,
    'video':video.GET
}