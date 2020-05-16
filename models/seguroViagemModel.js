/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const AppError = require('./../utils/appError');
const ErrorMessage = require('./../utils/error');

const seguroViagemSchema = new mongoose.Schema({
  plano: {
    type: String,
    required: true,
    enum: ['Europa', 'Mundial', 'Medica']
  },
  pessoas: {
    type: Number,
    default: 1
  },
  dataPartida: {
    type: Date,
    required: true
  },
  dataVolta: {
    type: Date,
    required: true
  },
  documentos: {
    type: [String],
    required: true
  },
  seguro: {
    type: mongoose.Schema.ObjectId,
    ref: 'seguros'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

seguroViagemSchema.pre(/^find/, async function(next) {
  this.populate({ path: 'seguro' });
  next();
});

seguroViagemSchema.pre('save', async function(next) {
  const difference =
    new Date(this.dataVolta).getTime() - new Date(this.dataPartida).getTime();
  if (difference <= 0) return next(new AppError(ErrorMessage[0].message, 500));
  next();
});

const SeguroViagem = mongoose.model('seguroViagems', seguroViagemSchema);

module.exports = SeguroViagem;
