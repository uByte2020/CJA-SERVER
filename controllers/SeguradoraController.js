const Seguradora = require('../models/seguradoraModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const ErrorMessage = require('./../utils/error');

exports.validateIbanFild = (req, res, next) => {
  if (!req.params.id || !req.body.ibans)
    return next(new AppError(ErrorMessage[12].message, 400));
  req.filter = { ibans: req.body.ibans };
  next();
};

exports.addIban = factory.addTo(Seguradora);

exports.removeIban = factory.removeFrom(Seguradora);

exports.validateModalidadeFild = (req, res, next) => {
  if (!req.params.id || !req.body.modalidades)
    return next(new AppError(ErrorMessage[12].message, 400));
  req.filter = { modalidades: req.body.modalidades };
  next();
};

exports.addModalidades = factory.addTo(Seguradora);

exports.removeModalidade = factory.removeFrom(Seguradora);

exports.getSeguradora = factory.getOne(Seguradora);
exports.getAllSeguradoras = factory.getAll(Seguradora);
exports.createSeguradora = factory.createOne(Seguradora);
exports.updateSeguradora = factory.updateOne(Seguradora);
exports.deleteSeguradora = factory.deleteOne(Seguradora);
