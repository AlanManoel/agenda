exports.middlewareGlobal = (req, res, next) => {
  res.locals.erros = req.flash('erros');
  res.locals.user = req.session.user;
  next();
};

exports.outroMiddleware = (req, res, next) => {
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if(err) {
    return res.render('404');
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};



// Middleware para obter o ID do usuário autenticado
exports.userIdMiddleware = (req, res, next) => {
  if (req.session.user && req.session.user._id) {
    req.userID = req.session.user._id;
  } else {
    req.userID = null; // Ou lidar com a falta de autenticação de alguma outra forma
  }
  next();
};

