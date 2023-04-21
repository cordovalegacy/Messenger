const UserController = require('../controllers/user.controller')

module.exports = (app) => {
    app.get('/api/getAllUsers', UserController.getAllUsers)
    app.post('/api/register', UserController.registerUser)
    app.post('/api/login', UserController.loginUser)
    app.post('/api/logout', UserController.logoutUser)
}