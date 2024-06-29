const User = require('../models/UserModel');

exports.index = (req, res) => {
    if (req.session.user) {
        res.redirect('/main');
        return;
    }
    res.render('index', {title: "Login"});
}

exports.entrar = async function (req, res) {
    try {
        const login = new User(req.body);
        await login.login();

        if (login.erros.length > 0) {
            req.flash('erros', login.erros);
            req.session.save(function () {
                return res.redirect(req.headers.referer || '/');
            });
            return;
        }
        req.session.user = login.user;

        return res.redirect('/main');
    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}

exports.sair = (req, res) => {
    req.session.destroy();
    res.redirect('/')
}