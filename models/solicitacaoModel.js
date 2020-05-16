/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const solicitacaoSchema = new mongoose.Schema({
  data: {
    type: Date
  },
  estado: {
    type: Number,
    default: 0
  },
  seguro: {
    type: mongoose.Schema.ObjectId,
    ref: 'seguros',
    required: [true, 'Uma Solicitação deve ter um serviço']
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
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

solicitacaoSchema.pre('save', async function(next) {
  this.validAt = Date.now() + 365 * 24 * 3600 * 1000;
  next();
});

solicitacaoSchema.pre(/^find/, async function(next) {
  this.populate({ path: 'cliente' }).populate({ path: 'seguro' });
  next();
});

const Solicitacao = mongoose.model('solicitacoes', solicitacaoSchema);

module.exports = Solicitacao;
