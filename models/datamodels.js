const mongoose = require('mongoose');

// Definir el esquema para el modelo de datos
const dataSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Crear y exportar el modelo basado en el esquema
module.exports = mongoose.model('Data', dataSchema);
