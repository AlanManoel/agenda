const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const UserModel = mongoose.model('User', UserSchema);

class User {
  constructor(body) {
    this.body = body;
    this.erros = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if (this.erros.length > 0) return;

    this.user= await UserModel.findOne({ email: this.body.email });

    if(! this.user){ 
     this.erros.push("Email ou senha inválido");
     return;
    }

    if(! bcrypt.compareSync(this.body.password, this.user.password)){
      this.erros.push("Senha incorreta.")
      this.user = null;
    }
  } 

  async register() {
    this.valida();
    if (this.erros.length > 0) return;

    await this.usuarioExiste();

    if (this.erros.length > 0) return;

    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);

    this.user = await UserModel.create(this.body);
  }

  async usuarioExiste() {
    this.user = await UserModel.findOne({ email: this.body.email });

    if (this.user) this.erros.push("Usuário já existe.")
  }

  valida() {
    this.limpeza();

    //validar nome
    if (this.body.nome === "") {
      this.erros.push("Campo nome vazio.");
    }
    //validar email
    if (!validator.isEmail(this.body.email)) {
      this.erros.push("E-mail invalido.");
    }
    //validar senha
    if (this.body.password.length < 8) {
      this.erros.push("A senha deve ter no mínimo 8 caracteres.");
    }
  }

  limpeza() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      nome: this.body.nome,
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = User;
