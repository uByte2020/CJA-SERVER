/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const seguroViagemSchema = new mongoose.Schema({
  plano: {
    type: String,
    required: true
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

const SeguroViagem = mongoose.model('seguroViagems', seguroViagemSchema);

module.exports = SeguroViagem;
