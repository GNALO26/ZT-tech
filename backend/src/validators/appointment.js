const { z } = require('zod');

module.exports = z.object({
  hasPassport: z.boolean().refine(v => v === true, { message: 'Le passeport est obligatoire.' }),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  whatsappNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => /^(\+229)?0[1-9]\d{8}$/.test(val), {
      message: 'Numéro béninois invalide (ex: 0156030000)',
    }),
  cityOfResidence: z.string().min(2),
  visaType: z.enum(['VISITEUR', 'TRAVAIL', 'ETUDE']),
  destinationCountry: z.string().min(2),
  appointmentDate: z.string().refine(v => !isNaN(Date.parse(v)), 'Date invalide.'),
  appointmentTime: z.string().regex(/^(09|1[0-7]):(00|30)$|^18:00$/, 'Créneau entre 9h et 17h30 (ou 18h00)'),
  notificationMethod: z.enum(['email', 'whatsapp']).optional(),
});