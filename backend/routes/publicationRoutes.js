const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/publicationController');
const { auth } = require('../middleware/auth');
const multer  = require('multer');
const path    = require('path');

// ── Configuration de Multer pour le stockage local ────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'img-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 Mo
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers d\'images sont autorisés.'));
    }
  }
});

// ── Routes PUBLIQUES (0 token requis) ─────────────────────────
router.get('/public',      ctrl.getPublicArticles);     // liste publiés
router.get('/public/:id',  ctrl.getPublicArticleById);  // détail article
router.get('/categories',  ctrl.getCategories);         // liste catégories

// ── Routes PROTÉGÉES (token JWT requis) ───────────────────────
router.get('/',      auth, ctrl.getPublications);       // admin=tout, auteur=les siens
router.post('/',     auth, ctrl.createPublication);
router.put('/:id',   auth, ctrl.updatePublication);
router.delete('/:id', auth, ctrl.deletePublication);

// POST /api/publications/upload (JWT requis)
router.post('/upload', auth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Erreur d'upload : ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image reçue.' });
    }
    const protocol = req.protocol;
    const host = req.get('host');
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });
});

module.exports = router;
