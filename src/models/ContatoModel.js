const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, require: true },
    sobrenome: { type: String, require: false, default: '' },
    email: { type: String, require: false, default: '' },
    telefone: { type: String, require: false, default: '' },
    criadoEm: {
        type: String,
        default: () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}-${month}-${year}`;
        }
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body, id) {
        this.userId = id;
        this.body = body;
        this.erros = [];
        this.contato = null;
    }

    async cadastrar() {
        this.valida();
        if (this.erros.length > 0) return;

        this.contato = await ContatoModel.create(this.body);
    }

    valida() {
        this.limpeza();
        //Validar se tem o nome
        if (!this.body.nome) this.erros.push("Nome é um campo obrigatório.")

        //validar email
        if (this.body.email && !validator.isEmail(this.body.email)) {
            this.erros.push("E-mail invalido.");
        }

        //validar se tem o email ou senha
        if (!this.body.email && !this.body.telefone) this.erros.push("E-mail ou telefone precisa ser enviado.")
    }

    limpeza() {
        for (const key in this.body) {
            if (typeof this.body[key] !== "string") {
                this.body[key] = "";
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
            userId: this.userId
        }
    }
    async editar(id) {
        if (typeof id !== 'string') return;
        this.valida();

        if (this.erros.length > 0) return;

        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
    }

    static async buscarId(id) {
        if (typeof id !== 'string') return;

        const contato = await ContatoModel.findById(id);
        return contato;
    }

    static async buscaCliente(userId) {
        const contatos = await ContatoModel.find({ userId }).sort({ criadoEm: 1 });
        return contatos;
    }

    static async delete(id) {
        if (typeof id !== 'string') return;

        const contato = await ContatoModel.findByIdAndDelete({ _id: id });
        return contato;
    }
}

module.exports = Contato;
