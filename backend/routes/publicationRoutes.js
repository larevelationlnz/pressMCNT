const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');

// Préfixe attendu: /api/publications
router.get('/', publicationController.getPublications);
router.post('/', publicationController.createPublication);
router.put('/:id', publicationController.updatePublication);
router.delete('/:id', publicationController.deletePublication);

module.exports = router;
