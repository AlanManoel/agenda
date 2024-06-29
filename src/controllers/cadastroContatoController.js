const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('cadastroContato', {
        contato: {},
        title: "Cadastro"
    });
}

exports.adicionar = async (req, res) => {
    try {
        const contato = new Contato(req.body, req.userID);
        await contato.cadastrar();

        if (contato.erros.length > 0) {
            req.flash('erros', contato.erros);
            req.session.save(function () {
                return res.redirect(req.headers.referer || '/cadastroContato');
            });
            return;
        }

        req.session.save(() => res.redirect('back'));

    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}

exports.editar = async (req, res) => {
    if (!req.params.id) return res.render('404');

    const contato = await Contato.buscarId(req.params.id);

    if (!contato) res.render('404');

    res.render('cadastroContato', { contato, title: "Editar"})
}

exports.update = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');
        const contato = new Contato(req.body, req.userID);

        await contato.editar(req.params.id);

        if (contato.erros.length > 0) {
            req.flash('erros', contato.erros);
            req.session.save(function () {
                // return res.redirect(`/cadastroContato/${contato.contato._id}`);
                return res.redirect('/cadastroContato');
            });
            return;
        }

        req.session.save(() => res.redirect('/main'));
    } catch (e) {
        console.log(e);
        res.render('404')
    }

}

exports.delete = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');
        const contato = await Contato.delete(req.params.id);

        if (!contato) return res.render('404');

        req.session.save(()=> res.redirect('back'));
        return;
    } catch (e) {
        console.log(e);
        res.render('404')
    }
}