const express = require ('express')
const formidable = require('express-formidable');
const route = express.Router()

const userController = require ('../controllers/user.contoller')

route.post('/createUser', formidable() , userController.createUser)

route.get('/getAllUser', userController.getAllUser)

route.get('/getoneuser/:id', userController.getoneuser)

route.get('/userPhoto/:id',userController.userPhoto)

route.delete('/:id', userController.delete)

route.put('/updateUser/:id', formidable() , userController.updateUser)

module.exports = route 