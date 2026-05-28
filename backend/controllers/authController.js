const db     = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  try {
    const result = await db.query(
      `SELECT id, email, password_hash, role, is_active AS "isActive",
              first_name AS "firstName", last_name AS "lastName"
       FROM users WHERE email = $1`,
      [email.trim().toLowerCase()]
    );
    const user = result.rows[0];
    if (!user)        return res.status(401).json({ message: 'Identifiants invalides.' });
    if (!user.isActive) return res.status(403).json({ message: 'Compte désactivé.' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    delete user.password_hash;
    res.json({ token, user });   // { token, user: { id, email, role, firstName, lastName } }
  } catch (err) {
    console.error('[Auth] login:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
