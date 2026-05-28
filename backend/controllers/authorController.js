const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper pour valider le format de l'email
const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

/**
 * Récupérer tous les auteurs (avec filtre optionnel de recherche)
 */
exports.getAuthors = async (req, res) => {
  try {
    const { q } = req.query;
    let queryText = `
      SELECT 
        id, 
        last_name AS "lastName", 
        first_name AS "firstName", 
        profession, 
        cni_number AS "cniNumber", 
        email, 
        created_at::date::text AS date 
      FROM authors
    `;
    const params = [];

    if (q && q.trim()) {
      const searchPattern = `%${q.trim()}%`;
      queryText += `
        WHERE 
          last_name ILIKE $1 OR 
          first_name ILIKE $1 OR 
          profession ILIKE $1 OR 
          cni_number ILIKE $1 OR 
          email ILIKE $1
      `;
      params.push(searchPattern);
    }

    queryText += ' ORDER BY id ASC';

    const result = await db.query(queryText, params);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('[Controller Error] Error in getAuthors:', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des auteurs.' });
  }
};

/**
 * Récupérer un auteur par son ID
 */
exports.getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;
    const queryText = `
      SELECT 
        id, 
        last_name AS "lastName", 
        first_name AS "firstName", 
        profession, 
        cni_number AS "cniNumber", 
        email, 
        created_at::date::text AS date 
      FROM authors 
      WHERE id = $1
    `;
    const result = await db.query(queryText, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Auteur non trouvé.' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('[Controller Error] Error in getAuthorById:', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération de l\'auteur.' });
  }
};

/**
 * Créer un nouvel auteur
 */
exports.createAuthor = async (req, res) => {
  try {
    const { lastName, firstName, profession, cniNumber, email, password } = req.body;

    // Validations de base
    if (!lastName || !lastName.trim()) return res.status(400).json({ message: 'Le nom est requis.' });
    if (!firstName || !firstName.trim()) return res.status(400).json({ message: 'Le prénom est requis.' });
    if (!profession || !profession.trim()) return res.status(400).json({ message: 'La profession est requise.' });
    if (!cniNumber || !cniNumber.trim()) return res.status(400).json({ message: 'Le numéro CNI est requis.' });
    if (!email || !email.trim()) return res.status(400).json({ message: 'L\'email est requis.' });
    if (!validateEmail(email)) return res.status(400).json({ message: 'Format d\'email invalide.' });
    if (!password || !password.trim()) {
      return res.status(400).json({ message: 'Le mot de passe est requis.' });
    }

    // Vérifier si l'email existe déjà
    const emailCheck = await db.query('SELECT id FROM authors WHERE email = $1', [email.trim()]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre auteur.' });
    }

    // Vérifier si le numéro CNI existe déjà
    const cniCheck = await db.query('SELECT id FROM authors WHERE cni_number = $1', [cniNumber.trim()]);
    if (cniCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Ce numéro CNI est déjà utilisé par un autre auteur.' });
    }

    // Insérer l'auteur
    const insertQuery = `
      INSERT INTO authors (last_name, first_name, profession, cni_number, email, password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id, 
        last_name AS "lastName", 
        first_name AS "firstName", 
        profession, 
        cni_number AS "cniNumber", 
        email, 
        created_at::date::text AS date
    `;

    const result = await db.query(insertQuery, [
      lastName.trim(),
      firstName.trim(),
      profession.trim(),
      cniNumber.trim(),
      email.toLowerCase().trim(),
      password.trim()
    ]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('[Controller Error] Error in createAuthor:', error);
    return res.status(500).json({ message: 'Erreur lors de la création de l\'auteur.' });
  }
};

/**
 * Mettre à jour un auteur existant
 */
exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { lastName, firstName, profession, cniNumber, email, password } = req.body;

    // Vérifier si l'auteur existe
    const authorCheck = await db.query('SELECT password FROM authors WHERE id = $1', [id]);
    if (authorCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Auteur non trouvé.' });
    }

    // Validations de base
    if (!lastName || !lastName.trim()) return res.status(400).json({ message: 'Le nom est requis.' });
    if (!firstName || !firstName.trim()) return res.status(400).json({ message: 'Le prénom est requis.' });
    if (!profession || !profession.trim()) return res.status(400).json({ message: 'La profession est requise.' });
    if (!cniNumber || !cniNumber.trim()) return res.status(400).json({ message: 'Le numéro CNI est requis.' });
    if (!email || !email.trim()) return res.status(400).json({ message: 'L\'email est requis.' });
    if (!validateEmail(email)) return res.status(400).json({ message: 'Format d\'email invalide.' });

    // Vérifier si le nouvel email est déjà utilisé par un AUTRE auteur
    const emailCheck = await db.query('SELECT id FROM authors WHERE email = $1 AND id <> $2', [email.trim(), id]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre auteur.' });
    }

    // Vérifier si le numéro CNI est déjà utilisé par un AUTRE auteur
    const cniCheck = await db.query('SELECT id FROM authors WHERE cni_number = $1 AND id <> $2', [cniNumber.trim(), id]);
    if (cniCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Ce numéro CNI est déjà utilisé par un autre auteur.' });
    }

    // Déterminer le mot de passe final
    let finalPassword = authorCheck.rows[0].password;
    if (password && password.trim()) {
      finalPassword = password.trim();
    }

    // Mettre à jour l'auteur
    const updateQuery = `
      UPDATE authors
      SET 
        last_name = $1, 
        first_name = $2, 
        profession = $3, 
        cni_number = $4, 
        email = $5, 
        password = $6
      WHERE id = $7
      RETURNING 
        id, 
        last_name AS "lastName", 
        first_name AS "firstName", 
        profession, 
        cni_number AS "cniNumber", 
        email, 
        created_at::date::text AS date
    `;

    const result = await db.query(updateQuery, [
      lastName.trim(),
      firstName.trim(),
      profession.trim(),
      cniNumber.trim(),
      email.toLowerCase().trim(),
      finalPassword,
      id
    ]);

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('[Controller Error] Error in updateAuthor:', error);
    return res.status(500).json({ message: 'Erreur lors de la modification de l\'auteur.' });
  }
};

/**
 * Supprimer un auteur
 */
exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'auteur existe
    const authorCheck = await db.query('SELECT id FROM authors WHERE id = $1', [id]);
    if (authorCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Auteur non trouvé.' });
    }

    // Supprimer
    await db.query('DELETE FROM authors WHERE id = $1', [id]);

    return res.status(200).json({ message: 'Auteur supprimé avec succès.', deletedId: Number(id) });
  } catch (error) {
    console.error('[Controller Error] Error in deleteAuthor:', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de l\'auteur.' });
  }
};

/**
 * Authentifier un auteur (login)
 */
exports.loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis.' });

    const result = await db.query('SELECT id, email, password, last_name AS "lastName", first_name AS "firstName" FROM authors WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const author = result.rows[0];
    const storedPassword = author.password || '';
    const isBcryptHash = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$');
    const match = isBcryptHash
      ? await bcrypt.compare(password, storedPassword)
      : password === storedPassword;
    if (!match) return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });

    // Retourner les informations publiques de l'auteur
    return res.status(200).json({
      id: author.id,
      email: author.email,
      firstName: author.firstName,
      lastName: author.lastName
    });
  } catch (error) {
    console.error('[Controller Error] Error in loginAuthor:', error);
    return res.status(500).json({ message: 'Erreur lors de l\'authentification.' });
  }
};
