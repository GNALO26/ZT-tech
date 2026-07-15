const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  has_passport: { type: Boolean, default: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp_number: { type: String, required: true },
  city_of_residence: { type: String, required: true },
  visa_type: { type: String, enum: ['VISITEUR', 'TRAVAIL', 'ETUDE'], required: true },
  destination_country: { type: String, required: true },
  appointment_date: { type: Date, required: true },
  appointment_time: { type: String, required: true },
}, { timestamps: true });

appointmentSchema.index({ appointment_date: 1, appointment_time: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);