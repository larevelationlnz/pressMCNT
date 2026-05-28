const db     = require('../config/db');
const bcrypt = require('bcryptjs');

// Fragment SQL réutilisé dans tous les SELECT
const SELECT_FIELDS = `
  SELECT id, email,
         first_name  AS "firstName",
         last_name   AS "lastName",
         profession,
         cni_number  AS "cniNumber",
         role,
         is_active   AS "isActive",
         created_at  AS "createdAt"
  FROM users
`;

// GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const r = await db.query(`${SELECT_FIELDS} ORDER BY created_at DESC`);
    res.json(r.rows);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Erreur serveur.' }); }
};

// GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const r = await db.query(`${SELECT_FIELDS} WHERE id = $1`, [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(r.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Erreur serveur.' }); }
};

// POST /api/users
exports.createUser = async (req, res) => {
  const { email, password, firstName, lastName, profession, cniNumber, role } = req.body;
  if (!email || !password || !firstName || !lastName || !cniNumber)
    return res.status(400).json({ message: 'Champs obligatoires : email, mot de passe, prénom, nom, CNI.' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const r = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, profession, cni_number, role)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, email,
                 first_name AS "firstName", last_name AS "lastName",
                 profession, cni_number AS "cniNumber",
                 role, created_at AS "createdAt"`,
      [email.trim().toLowerCase(), hash, firstName.trim(), lastName.trim(),
       profession || '', cniNumber.trim(), role || 'author']
    );
    res.status(201).json(r.rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ message: 'Cet email ou ce numéro CNI est déjà utilisé.' });
    console.error(err); res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// PUT /api/users/:id
exports.updateUser = async (req, res) => {
  const { email, firstName, lastName, profession, cniNumber, password, role, isActive } = req.body;
  const fields = []; const values = []; let i = 1;
  if (email)      { fields.push(`email=$${i++}`);       values.push(email.trim().toLowerCase()); }
  if (firstName)  { fields.push(`first_name=$${i++}`);  values.push(firstName.trim()); }
  if (lastName)   { fields.push(`last_name=$${i++}`);   values.push(lastName.trim()); }
  if (profession !== undefined) { fields.push(`profession=$${i++}`); values.push(profession); }
  if (cniNumber)  { fields.push(`cni_number=$${i++}`);  values.push(cniNumber.trim()); }
  if (role)       { fields.push(`role=$${i++}`);        values.push(role); }
  if (isActive !== undefined) { fields.push(`is_active=$${i++}`); values.push(isActive); }
  if (password)   {
    const hash = await bcrypt.hash(password, 10);
    fields.push(`password_hash=$${i++}`); values.push(hash);
  }
  if (!fields.length)
    return res.status(400).json({ message: 'Aucun champ à mettre à jour.' });
  values.push(req.params.id);
  try {
    const r = await db.query(
      `UPDATE users SET ${fields.join(',')} WHERE id=$${i}
       RETURNING id, email,
                 first_name AS "firstName", last_name AS "lastName",
                 profession, cni_number AS "cniNumber",
                 role, is_active AS "isActive", created_at AS "createdAt"`,
      values
    );
    if (!r.rows.length) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json(r.rows[0]);
  } catch (err) {
    if (err.code === '23505')
      return res.status(409).json({ message: 'Cet email ou ce numéro CNI est déjà utilisé.' });
    console.error(err); res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const r = await db.query('DELETE FROM users WHERE id=$1 RETURNING id', [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: 'Auteur supprimé.', deletedId: Number(req.params.id) });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Erreur serveur.' }); }
};
