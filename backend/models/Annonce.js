const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  contenu: {
    type: String,
    required: true
  },
  categorie: {
    type: String,
    required: true,
    enum: ['Général', 'Événement', 'Urgence', 'Information']
  },
  date: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

annonceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Annonce', annonceSchema);
