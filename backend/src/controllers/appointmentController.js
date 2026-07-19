const Appointment = require('../models/Appointment');
const { generateConfirmationPDF } = require('../services/pdfGenerator');
const { sendConfirmationEmail } = require('../services/emailService');

exports.create = async (req, res) => {
  try {
    const data = req.body;

    const appointmentDate = new Date(data.appointmentDate);
    const appointmentTime = data.appointmentTime;
    const [hours, minutes] = appointmentTime.split(':').map(Number);
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    const fourHoursMs = 4 * 60 * 60 * 1000;

    // Vérification si la date est aujourd'hui et que le créneau est dans moins de 4 heures
    const today = new Date();
    today.setHours(0,0,0,0);
    const isToday = appointmentDate.toDateString() === today.toDateString();
    if (isToday && diffMs < fourHoursMs) {
      return res.status(400).json({ message: 'Vous devez prendre rendez-vous au moins 4 heures à l\'avance.' });
    }

    // Validation des horaires d'ouverture selon le jour
    const dayOfWeek = appointmentDate.getDay(); // 0 = dimanche, 6 = samedi
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;

    if (isSunday) {
      return res.status(400).json({ message: 'Aucun rendez-vous le dimanche.' });
    }

    if (isSaturday) {
      // Samedi : 9h-13h, dernier créneau 12h30
      if (hours < 9 || hours > 13 || (hours === 13 && minutes > 0)) {
        return res.status(400).json({ message: 'Le samedi, les rendez-vous sont de 9h à 13h.' });
      }
      const startMinutes = hours * 60 + minutes;
      if (startMinutes > 12 * 60 + 30) {
        return res.status(400).json({ message: 'Le samedi, le dernier créneau est 12h30.' });
      }
    } else {
      // Lundi à vendredi : 9h-18h, dernier créneau 17h30
      if (hours < 9 || hours > 18 || (hours === 18 && minutes > 0)) {
        return res.status(400).json({ message: 'Les rendez-vous sont de 9h à 18h (dernier créneau 17h30).' });
      }
      const startMinutes = hours * 60 + minutes;
      if (startMinutes > 17 * 60 + 30) {
        return res.status(400).json({ message: 'Le dernier créneau est 17h30.' });
      }
    }

    // Vérifier si le créneau est déjà réservé
    const existing = await Appointment.findOne({
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
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
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      notification_method: data.notificationMethod || 'email',
    });

    // Envoyer la confirmation (email avec PDF)
    try {
      const pdfBuffer = await generateConfirmationPDF(newAppointment);
      await sendConfirmationEmail(
        data.email,
        'Confirmation de votre rendez-vous ZT Voyage',
        'Veuillez trouver ci-joint votre confirmation de rendez-vous.',
        pdfBuffer
      );
      newAppointment.confirmation_sent = true;
      await newAppointment.save();
    } catch (err) {
      console.error('Erreur envoi confirmation:', err);
      // On continue même si l'email échoue
    }

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