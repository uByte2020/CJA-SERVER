const Seguradora = require('../models/seguradoraModel');
const factory = require('./handlerFactory');

exports.getSeguradora = factory.getOne(Seguradora);
exports.getAllSeguradoras = factory.getAll(Seguradora);
exports.createSeguradora = factory.createOne(Seguradora);
exports.updateSeguradora = factory.updateOne(Seguradora);
exports.deleteSeguradora = factory.deleteOne(Seguradora);
