const mongoose = require('mongoose');

const abonneSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} n'est pas une adresse email valide!`
    }
  },
  telephone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} n'est pas un numéro de téléphone valide!`
    }
  },
  preferences: {
    type: [{
      type: String,
      enum: ['SMS', 'Email']
    }],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Au moins une préférence de notification doit être sélectionnée!'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

// Ensure either email or phone is provided
abonneSchema.pre('save', function(next) {
  if (!this.email && !this.telephone) {
    next(new Error('Au moins un moyen de contact (email ou téléphone) doit être fourni'));
  }
  next();
});

// Create indexes for faster queries
abonneSchema.index({ email: 1 });
abonneSchema.index({ telephone: 1 });
abonneSchema.index({ active: 1 });

module.exports = mongoose.model('Abonne', abonneSchema);
