const Seguradora = require('../models/seguradoraModel');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const ErrorMessage = require('./../utils/error');

exports.addIban = (req, res, next) => {
  if (!req.params.id || !req.body.ibans)
    return next(new AppError(ErrorMessage[12].message, 400));

  return factory.addTo(Seguradora, { ibans: req.body.ibans });
};

exports.removeIban = (req, res, next) => {
  if (!req.params.id || !req.body.iban)
    return next(new AppError(ErrorMessage[12].message, 400));

  factory.removeFrom(Seguradora, { ibans: req.body.iban });
};

exports.addModalidades = (req, res, next) => {
  if (!req.params.id || !req.body.modalidades)
    return next(new AppError(ErrorMessage[12].message, 400));

  return factory.addTo(Seguradora, { modalidades: req.body.modalidades });
};

exports.removeModalidade = (req, res, next) => {
  if (!req.params.id || !req.body.modalidade)
    return next(new AppError(ErrorMessage[12].message, 400));

  factory.removeFrom(Seguradora, { modalidades: req.body.modalidade });
};

exports.getSeguradora = factory.getOne(Seguradora);
exports.getAllSeguradoras = factory.getAll(Seguradora);
exports.createSeguradora = factory.createOne(Seguradora);
exports.updateSeguradora = factory.updateOne(Seguradora);
exports.deleteSeguradora = factory.deleteOne(Seguradora);
