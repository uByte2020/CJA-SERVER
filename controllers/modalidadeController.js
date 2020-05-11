const Modalidade = require('../models/modalidadeModel');
const factory = require('./handlerFactory');

exports.getModalidade = factory.getOne(Modalidade);
exports.getAllModalidades = factory.getAll(Modalidade);
exports.createModalidade = factory.createOne(Modalidade);
exports.updateModalidade = factory.updateOne(Modalidade);
exports.deleteModalidade = factory.deleteOne(Modalidade);
