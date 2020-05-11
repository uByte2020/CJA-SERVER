const mongoose = require('mongoose');

const modalidadeSchema = new mongoose.Schema({
  modalidade: {
    type: String,
    required: [true, 'A modalidade deve ter uma descrição'],
    unique: true
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Modalidade = mongoose.model('modalidades', modalidadeSchema);

module.exports = Modalidade;
