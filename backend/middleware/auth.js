const jwt = require('jsonwebtoken');

// Vérifie le token JWT dans l'en-tête Authorization: Bearer <token>
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Accès non autorisé — token manquant.' });

  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    // req.user = { id, email, role }
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
};

// À placer après auth() pour les routes admin uniquement
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  next();
};

module.exports = { auth, adminOnly };
