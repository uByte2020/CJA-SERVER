const mongoose = require('mongoose');

const seguradoraSchema = new mongoose.Schema({
  seguradora: {
    type: String,
    required: true,
    trim: true
  },
  ibans: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Seguradora = mongoose.model('seguradoras', seguradoraSchema);

module.exports = Seguradora;
