const Planos = require('../models/planoModel');
const factory = require('./handlerFactory');

exports.getAllPlanos = factory.getOne(Planos);
exports.getPlano = factory.getAll(Planos);
// exports.createPlano = factory.createOne(Planos);
// exports.updatePlano = factory.updateOne(Planos);
// exports.deletePlano = factory.deleteOne(Planos);
