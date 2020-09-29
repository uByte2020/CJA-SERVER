/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const Estado = require('./estadoModel');
const AppError = require('./../utils/appError');
const ErrorMessage = require('./../utils/error');

const solicitacaoSchema = new mongoose.Schema({
  data: {
    type: Date
  },
  estado: {
    type: Object,
    required: [true, 'Uma Solicitação deve ter um estado']
  },
  seguro: {
    type: mongoose.Schema.ObjectId,
    ref: 'seguros',
    required: [true, 'Uma Solicitação deve ter um seguro']
  },
  cliente: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true
  },
  mediador: {
    type: mongoose.Schema.ObjectId,
    ref: 'users'
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  updatedAt: {
    type: Date
  },
  validAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

solicitacaoSchema.pre('save', async function(next) {
  // this.validAt = Date.now() + 365 * 24 * 3600 * 1000;
  this.estado = await Estado.findOne({ estadoCode: { $eq: this.estado } });
  if (!this.estado) return next(new AppError(ErrorMessage[17].message, 500));
  next();
});

solicitacaoSchema.pre(/^find/, async function(next) {
  this.populate({ path: 'cliente' }).populate({ path: 'seguro' });
  next();
});

const Solicitacao = mongoose.model('solicitacoes', solicitacaoSchema);

module.exports = Solicitacao;
