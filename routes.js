const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginControler');
const registerController = require('./src/controllers/registerController');


// Rotas da home
route.get('/main', homeController.index);

//Rotas de login
route.get("/", loginController.index);
route.post("/", loginController.entrar);

//rotas de register
route.get("/register", registerController.index);   
route.post("/register", registerController.register)


route.get("/sair", loginController.sair);

module.exports = route;
