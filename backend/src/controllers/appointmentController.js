const Appointment = require('../models/Appointment');
const { generateConfirmationPDF } = require('../services/pdfGenerator');
const { sendConfirmationEmail } = require('../services/emailService');

// ---------------------------------------------------------------------------
// Templates d'emails HTML
// ---------------------------------------------------------------------------
const buildClientEmail = (appointment) => {
  const dateFr = new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; background: #F9FAFB; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
      .header { background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); color: #fff; padding: 30px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
      .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
      .content { padding: 30px; color: #1F2937; }
      .greeting { font-size: 18px; font-weight: 600; margin-bottom: 15px; }
      .info-box { background: #F9FAFB; border-left: 4px solid #DC2626; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; }
      .info-row:last-child { border-bottom: none; }
      .info-label { color: #6B7280; font-weight: 500; }
      .info-value { color: #1F2937; font-weight: 600; text-align: right; }
      .cta { display: inline-block; background: #DC2626; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
      .footer { background: #1F2937; color: #9CA3AF; padding: 20px; text-align: center; font-size: 12px; }
      .footer a { color: #F87171; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>✅ Rendez-vous confirmé</h1>
        <p>ZT-Voyage vous remercie de votre confiance</p>
      </div>
      <div class="content">
        <p class="greeting">Bonjour ${appointment.first_name},</p>
        <p>Nous avons bien reçu votre demande de rendez-vous. Voici un récapitulatif :</p>

        <div class="info-box">
          <div class="info-row"><span class="info-label">📅 Date</span><span class="info-value">${dateFr}</span></div>
          <div class="info-row"><span class="info-label">⏰ Heure</span><span class="info-value">${appointment.appointment_time}</span></div>
          <div class="info-row"><span class="info-label">🛂 Type de visa</span><span class="info-value">${appointment.visa_type}</span></div>
          <div class="info-row"><span class="info-label">🌍 Destination</span><span class="info-value">${appointment.destination_country}</span></div>
          <div class="info-row"><span class="info-label">🏙️ Ville</span><span class="info-value">${appointment.city_of_residence}</span></div>
        </div>

        <p>📎 <strong>Votre document PDF de confirmation est joint à cet email.</strong> Merci de le présenter (imprimé ou sur votre téléphone) lors de votre visite à l'agence.</p>

        <p>📍 <strong>Adresse :</strong> Cotonou, Quartier Zongo<br>
        📱 <strong>WhatsApp :</strong> +229 01 52 43 17 17</p>

        <div style="text-align:center;">
          <a href="https://zt-voyage.com" class="cta">Visiter notre site</a>
        </div>

        <p style="font-size: 13px; color: #6B7280; margin-top: 30px;">
          ⚠️ <strong>Rappel important :</strong> ZT-Voyage ne demande <em>jamais</em> d'argent en ligne. Tous les paiements se font directement à l'agence.
        </p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} ZT-Voyage — Tous droits réservés<br>
        <a href="https://zt-voyage.com">zt-voyage.com</a> • Cotonou, Bénin
      </div>
    </div>
  </body>
  </html>`;
};

const buildAdminEmail = (appointment) => {
  const dateFr = new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; background: #F9FAFB; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
      .header { background: linear-gradient(135deg, #1F2937 0%, #111827 100%); color: #fff; padding: 25px; }
      .header h1 { margin: 0; font-size: 20px; }
      .header p { margin: 5px 0 0; opacity: 0.8; font-size: 13px; }
      .content { padding: 30px; color: #1F2937; }
      .client-card { background: #FEF2F2; border-left: 4px solid #DC2626; border-radius: 8px; padding: 20px; margin: 20px 0; }
      .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #E5E7EB; font-size: 14px; }
      .info-row:last-child { border-bottom: none; }
      .info-label { width: 150px; color: #6B7280; font-weight: 500; }
      .info-value { color: #1F2937; font-weight: 600; flex: 1; }
      .cta { display: inline-block; background: #DC2626; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
      .footer { background: #1F2937; color: #9CA3AF; padding: 15px; text-align: center; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🆕 Nouveau rendez-vous</h1>
        <p>Un client vient de réserver un créneau</p>
      </div>
      <div class="content">
        <p>Un nouveau rendez-vous vient d'être pris sur le site.</p>

        <div class="client-card">
          <div class="info-row"><span class="info-label">👤 Client</span><span class="info-value">${appointment.first_name} ${appointment.last_name}</span></div>
          <div class="info-row"><span class="info-label">📧 Email</span><span class="info-value">${appointment.email}</span></div>
          <div class="info-row"><span class="info-label">📱 WhatsApp</span><span class="info-value">${appointment.whatsapp_number}</span></div>
          <div class="info-row"><span class="info-label">🏙️ Ville</span><span class="info-value">${appointment.city_of_residence}</span></div>
          <div class="info-row"><span class="info-label">📅 Date</span><span class="info-value">${dateFr}</span></div>
          <div class="info-row"><span class="info-label">⏰ Heure</span><span class="info-value">${appointment.appointment_time}</span></div>
          <div class="info-row"><span class="info-label">🛂 Type de visa</span><span class="info-value">${appointment.visa_type}</span></div>
          <div class="info-row"><span class="info-label">🌍 Destination</span><span class="info-value">${appointment.destination_country}</span></div>
        </div>

        <p>📎 Le PDF de confirmation est joint à cet email.</p>

        <div style="text-align:center;">
          <a href="https://zt-voyage.com/admin/appointments" class="cta">Voir dans l'administration</a>
        </div>
      </div>
      <div class="footer">
        Notification automatique — ZT-Voyage Admin
      </div>
    </div>
  </body>
  </html>`;
};

// ---------------------------------------------------------------------------
// CRÉATION D'UN RENDEZ-VOUS
// ---------------------------------------------------------------------------
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

    // Règle des 4 heures à l'avance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = appointmentDate.toDateString() === today.toDateString();
    if (isToday && diffMs < fourHoursMs) {
      return res.status(400).json({ message: 'Vous devez prendre rendez-vous au moins 4 heures à l\'avance.' });
    }

    // Horaires d'ouverture
    const dayOfWeek = appointmentDate.getDay();
    const isSaturday = dayOfWeek === 6;
    const isSunday = dayOfWeek === 0;

    if (isSunday) {
      return res.status(400).json({ message: 'Aucun rendez-vous le dimanche.' });
    }

    if (isSaturday) {
      if (hours < 9 || hours > 13 || (hours === 13 && minutes > 0)) {
        return res.status(400).json({ message: 'Le samedi, les rendez-vous sont de 9h à 13h.' });
      }
      const startMinutes = hours * 60 + minutes;
      if (startMinutes > 12 * 60 + 30) {
        return res.status(400).json({ message: 'Le samedi, le dernier créneau est 12h30.' });
      }
    } else {
      if (hours < 9 || hours > 18 || (hours === 18 && minutes > 0)) {
        return res.status(400).json({ message: 'Les rendez-vous sont de 9h à 18h (dernier créneau 17h30).' });
      }
      const startMinutes = hours * 60 + minutes;
      if (startMinutes > 17 * 60 + 30) {
        return res.status(400).json({ message: 'Le dernier créneau est 17h30.' });
      }
    }

    // Vérifier si le créneau est déjà pris
    const existing = await Appointment.findOne({
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
    });
    if (existing) return res.status(409).json({ message: 'Créneau déjà réservé.' });

    // Créer le rendez-vous
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

    // ✅ Réponse immédiate au client (avant l'envoi des emails)
    res.status(201).json({ success: true, appointmentId: newAppointment._id });

    // 🔄 Envoi des emails en arrière-plan (n'affecte pas la réponse)
    (async () => {
      try {
        let pdfBuffer = null;
        try {
          pdfBuffer = await generateConfirmationPDF(newAppointment);
        } catch (err) {
          console.error('Erreur génération PDF:', err);
        }

        // 1) Email au client
        try {
          await sendConfirmationEmail(
            data.email,
            `✅ Votre RDV ZT-Voyage est confirmé – ${appointmentDate.toLocaleDateString('fr-FR')} à ${appointmentTime}`,
            buildClientEmail(newAppointment),
            pdfBuffer
          );
          newAppointment.confirmation_sent = true;
          await newAppointment.save();
          console.log(`✅ Confirmation envoyée à ${data.email}`);
        } catch (err) {
          console.error('Erreur envoi confirmation client:', err.message);
        }

        // 2) Notification au(x) gérant(s)
        try {
          const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'ztvoyage@gmail.com')
            .split(',')
            .map(e => e.trim())
            .filter(Boolean);

          for (const email of adminEmails) {
            try {
              await sendConfirmationEmail(
                email,
                `🆕 Nouveau RDV – ${newAppointment.first_name} ${newAppointment.last_name} (${newAppointment.visa_type})`,
                buildAdminEmail(newAppointment),
                pdfBuffer
              );
              console.log(`✅ Notification admin envoyée à ${email}`);
            } catch (e) {
              console.error(`Erreur notification admin (${email}):`, e.message);
            }
          }
        } catch (err) {
          console.error('Erreur notification admin :', err.message);
        }
      } catch (err) {
        console.error('Erreur traitement emails:', err.message);
      }
    })();

  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Créneau déjà réservé.' });
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// ---------------------------------------------------------------------------
// CRÉNEAUX RÉSERVÉS POUR UNE DATE
// ---------------------------------------------------------------------------
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