/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const seguradora = require('./seguradoraModel');
const modalidade = require('./modalidadeModel');
const AppError = require('../utils/appError');
const ErrorMessage = require('./../utils/error');

const seguroSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true,
    enum: ['Empresa', 'Particular']
  },
  modalidade: {
    type: Object,
    required: true
  },
  price: {
    type: Number,
    default: 0.0
  },
  simulacao: {
    type: Number,
    default: 0.0
  },
  apolice: {
    type: String,
    default: ''
  },
  comprovativos: {
    type: [String],
    default: []
  },
  docIdentificacaos: {
    type: [String],
    required: [true, 'Um Serviço deve ter um endereço']
  },
  estado: {
    type: Number,
    min: 0,
    default: 0
  },
  seguradora: {
    type: Object,
    required: true
  },
  sinistros: {
    type: mongoose.Schema.ObjectId,
    ref: 'sinistros'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date
  },
  validAt: {
    type: Date
  }
});

seguroSchema.pre('save', async function(next) {
  this.seguradora = await seguradora.findById(this.seguradora);
  this.modalidade = await modalidade.findById(this.modalidade);

  if (!this.seguradora)
    return next(new AppError(ErrorMessage[21].message, 400));
  if (!this.modalidade)
    return next(new AppError(ErrorMessage[23].message, 400));

  next();
});

const Seguro = mongoose.model('seguros', seguroSchema);

module.exports = Seguro;
