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
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

seguradoraSchema.pre(/^find/, async function(next) {
  this.populate({ path: 'modalidades', select: '_id modalidade' });
  next();
});

const Seguradora = mongoose.model('seguradoras', seguradoraSchema);

module.exports = Seguradora;
