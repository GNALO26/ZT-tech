const Appointment = require('../models/Appointment');

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const existing = await Appointment.findOne({
      appointment_date: data.appointmentDate,
      appointment_time: data.appointmentTime,
    });
    if (existing) return res.status(409).json({ message: 'Créneau déjà réservé.' });

    const newAppointment = await Appointment.create({
      has_passport: data.hasPassport,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      whatsapp_number: data.whatsappNumber,
      city_of_residence: data.cityOfResidence,
      visa_type: data.visaType,
      destination_country: data.destinationCountry,
      appointment_date: new Date(data.appointmentDate),
      appointment_time: data.appointmentTime,
    });

    res.status(201).json({ success: true, appointmentId: newAppointment._id });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Créneau déjà réservé.' });
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getSlots = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'Date requise.' });
  try {
    const slots = await Appointment.find({ appointment_date: new Date(date) }).select('appointment_time');
    const booked = slots.map(s => s.appointment_time);
    res.json({ booked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};