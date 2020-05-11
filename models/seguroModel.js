/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const Estado = require('./estadoModel');
const seguradora = require('./seguradoraModel');
const modalidade = require('./modalidadeModel');
const AppError = require('../utils/appError');
const ErrorMessage = require('./../utils/error');

const seguroSchema = new mongoose.Schema({
  tipo: {
    type: String
  },
  modalidade: {
    type: Object,
    required: true
  },
  price: {
    type: Number,
    default: 'default.jpg'
  },
  simulacao: {
    type: Number,
    default: 'default.jpg'
  },
  apolice: {
    type: String,
    default: ''
  },
  comprovativos: {
    type: [String],
    default: ''
  },
  docIdentificacaos: {
    type: [String],
    required: [true, 'Um Serviço deve ter um endereço']
  },
  estado: {
    type: Object,
    required: [true, 'Um Serviço deve ter um estado']
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

seguroSchema.index({ location: '2dsphere' });

seguroSchema.pre('save', async function(next) {
  this.seguradora = await seguradora.findById(this.seguradora);
  this.estado = await Estado.findOne({ estadoCode: { $eq: this.estado } });
  this.modalidade = await modalidade.findById(this.modalidade);

  if (!this.seguradora)
    return next(new AppError(ErrorMessage[21].message, 400));
  if (!this.estado) return next(new AppError(ErrorMessage[22].message, 400));
  if (!this.modalidade)
    return next(new AppError(ErrorMessage[23].message, 400));

  next();
});

const Seguro = mongoose.model('seguros', seguroSchema);

module.exports = Seguro;
