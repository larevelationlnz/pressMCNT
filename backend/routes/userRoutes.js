const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

// Toutes les routes users sont réservées aux admins
router.get('/',     auth, adminOnly, ctrl.getUsers);
router.get('/:id',  auth, adminOnly, ctrl.getUserById);
router.post('/',    auth, adminOnly, ctrl.createUser);
router.put('/:id',  auth, adminOnly, ctrl.updateUser);
router.delete('/:id', auth, adminOnly, ctrl.deleteUser);

module.exports = router;
