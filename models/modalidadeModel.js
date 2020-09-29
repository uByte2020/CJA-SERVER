const mongoose = require('mongoose');

const modalidadeSchema = new mongoose.Schema({
  modalidade: {
    type: String,
    required: [true, 'A modalidade deve ter uma descrição'],
    unique: true
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
  isAutomatic: {
    type: Boolean,
    default: false
  },
  onlyEmpresa: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Modalidade = mongoose.model('modalidades', modalidadeSchema);

module.exports = Modalidade;
