const Solicitacao = require('../models/solicitacaoModel');
const factory = require('./handlerFactory');

exports.getMySolicitations = (req, res, next) => {
  req.query.cliente = req.user.id;
  next();
};

exports.getUserSolicitations = (req, res, next) => {
  if (req.params.userId && req.params.perfilCode) {
    if (req.params.perfilCode === 2) req.query.cliente = req.params.userId;
    else req.query.mediador = req.params.userId;
  }
  next();
};

exports.validateData = (req, res, next) => {
  if (!req.body.seguro) req.body.seguro = req.params.seguroId;
  if (!req.body.cliente) req.body.cliente = req.user.id;
  req.body.estado = 1;
  next();
};

exports.getSolicitacao = factory.getOne(Solicitacao);
exports.getAllSolicitacao = factory.getAll(Solicitacao);
exports.createSolicitacao = factory.createOne(Solicitacao);
exports.updateSolicitacao = factory.updateOne(Solicitacao);
exports.deleteSolicitacao = factory.deleteOne(Solicitacao);
