const { z } = require('zod');

module.exports = z.object({
  hasPassport: z.boolean().refine(v => v === true, { message: 'Le passeport est obligatoire.' }),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  whatsappNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ''))            // supprime les espaces
    .refine((val) => /^(\+229)?0[1-9]\d{7}$/.test(val), {
      message: 'Numéro Invalide (ex: 0156000000 ou +2290156000000)',
    }),
  cityOfResidence: z.string().min(2),
  visaType: z.enum(['VISITEUR', 'TRAVAIL', 'ETUDE']),
  destinationCountry: z.string().min(2),
  appointmentDate: z.string().refine(v => !isNaN(Date.parse(v)), 'Date invalide.'),
  appointmentTime: z.string().regex(/^(1[0-7]):(00|30)$|^18:00$/, 'Créneau entre 10h et 18h par tranches de 30 min.'),
});