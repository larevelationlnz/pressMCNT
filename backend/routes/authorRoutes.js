const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

// Routes pour la gestion des auteurs
// Préfixe dans server.js : /api/authors

// Route de connexion
router.post('/login', authorController.loginAuthor);

// Récupérer tous les auteurs (avec filtre q optionnel)
router.get('/', authorController.getAuthors);

// Récupérer un auteur spécifique par son ID
router.get('/:id', authorController.getAuthorById);

// Créer un nouvel auteur
router.post('/', authorController.createAuthor);

// Modifier un auteur existant
router.put('/:id', authorController.updateAuthor);

// Supprimer un auteur
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
