const User = require('../models/UserModel');


exports.index = (req, res) => {
    res.render('register');
}

exports.register = async function (req, res) {
    try{
        const register = new User(req.body);
    await register.register();
    
    if (register.erros.length > 0) {
        req.flash('erros', register.erros);
        req.session.save(function () {
            return res.redirect(req.headers.referer || '/register');
        });
        return;
    }
    return res.redirect('/main');
    }catch(e){
        console.log(e);
        return res.redirect('404');
    }
}