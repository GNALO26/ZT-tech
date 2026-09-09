const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer les dossiers nécessaires
const dirs = ['uploads/articles', 'uploads/formations'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Choisir le dossier selon le champ du fichier
    if (file.fieldname === 'featured_image') {
      cb(null, 'uploads/articles');
    } else if (file.fieldname === 'image') {
      cb(null, 'uploads/formations');
    } else {
      cb(new Error('Champ de fichier inattendu'), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;