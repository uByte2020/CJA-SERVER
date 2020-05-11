const mongoose = require('mongoose');

const perfilSchema = new mongoose.Schema({
  perfil: {
    type: String,
    required: [true, 'Um perfil deve ter a usa descrição']
  },
  perfilCode: {
    type: Number,
    required: [true, 'Um perfil deve ter um Code'],
    unique: true
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

perfilSchema.pre(/^find/, async function(next) {
  this.populate({ path: 'modalidades', select: '_id modalidade' });
  next();
});

const Perfil = mongoose.model('perfils', perfilSchema);

module.exports = Perfil;
