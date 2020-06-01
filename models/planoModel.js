const mongoose = require('mongoose');

const planoSchema = new mongoose.Schema({
  plano: {
    type: String,
    unique: true,
    required: [true, 'O plano deve ter uma descrição']
  },
  planoCode: {
    type: Number,
    unique: true,
    required: [true, 'O plano deve ter um code']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Plano = mongoose.model('planos', planoSchema);

module.exports = Plano;
