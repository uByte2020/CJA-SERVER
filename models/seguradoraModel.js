const mongoose = require('mongoose');

const seguradoraSchema = new mongoose.Schema({
  codigoSeguradora: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  seguradora: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  ibans: {
    type: [String],
    required: true
  },
  modalidades: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'modalidades'
      }
    ],
    default: []
  },
  icon: {
    type: String,
    default: ''
  },
  img: {
    type: String,
    default: ''
  },
  ripple: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

seguradoraSchema.pre(/^find/, async function(next) {
  this.populate({
    path: 'modalidades',
    select: '_id modalidade isActive isAutomatic'
  });
  next();
});

const Seguradora = mongoose.model('seguradoras', seguradoraSchema);

module.exports = Seguradora;
