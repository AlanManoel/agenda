const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginControler');
const registerController = require('./src/controllers/registerController');
const cadastroContato = require('./src/controllers/cadastroContatoController');

const {userIdMiddleware} = require('./src/middlewares/middleware');

// Rotas da home
route.get('/main',userIdMiddleware, homeController.index);

//Rotas de login
route.get("/", loginController.index);
route.post("/", loginController.entrar);

//rotas de register
route.get("/register", registerController.index);   
route.post("/register", registerController.register)

route.get("/sair", loginController.sair);

//rotas de cadastro e edição de contatos
route.get("/cadastroContato", cadastroContato.index);
route.post("/cadastroContato", userIdMiddleware, cadastroContato.adicionar);

//rotas da edição
route.get("/cadastroContato/:id", cadastroContato.editar);
route.post("/cadastroContato/:id", userIdMiddleware, cadastroContato.update);

//rotas de exclusão
route.get("/cadastroContato/delete/:id", userIdMiddleware, cadastroContato.delete);

module.exports = route;
