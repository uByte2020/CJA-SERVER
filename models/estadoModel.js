const mongoose = require('mongoose');

const estadoSchema = new mongoose.Schema({
  estado: {
    type: String,
    unique: true,
    required: [true, 'A Estado deve ter uma descrição']
  },
  estadoCode: {
    type: Number,
    unique: true,
    required: [true, 'A Estado deve ter um code']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Estado = mongoose.model('estados', estadoSchema);

module.exports = Estado;
