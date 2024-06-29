const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
  const userId = req.userID;

  const contatos = await Contato.buscaCliente(userId);
  res.render('main', { contatos, title: "Agenda" });
};
