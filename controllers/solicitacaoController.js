const Solicitacao = require('../models/solicitacaoModel');
const factory = require('./handlerFactory');
const Estado = require('./../models/estadoModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const ErrorMessage = require('./../utils/error');

exports.getMySolicitations = (req, res, next) => {
  req.query.cliente = req.user.id;
  next();
};

exports.desactiveMySolicitations = (req, res, next) => {
  req.body.cliente = req.user.id;
  req.body.isActive = false;
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
  req.body.estado = 2;
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.extractFilds = (req, res, next) => {
  req.body = filterObj(req.body, 'estado');
  next();
};

exports.getEstadoById = catchAsync(async (req, res, next) => {
  if (!req.body.estado) {
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(req.body.estado)) {
      req.body.estado = await Estado.findOne({
        estadoCode: { $eq: req.body.estado }
      });
      if (!req.body.estado)
        return next(new AppError(ErrorMessage[17].message, 500));
    }
  }
  next();
});

exports.getSolicitacao = factory.getOne(Solicitacao);
exports.getAllSolicitacao = factory.getAll(Solicitacao);
exports.createSolicitacao = factory.createOne(Solicitacao);
exports.updateSolicitacao = factory.updateOne(Solicitacao);
exports.deleteSolicitacao = factory.deleteOne(Solicitacao);
