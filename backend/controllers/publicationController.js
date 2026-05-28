const db = require('../config/db');

/**
 * Récupérer les publications d'un auteur (ou toutes si pas d'authorId)
 */
exports.getPublications = async (req, res) => {
  try {
    const { authorId } = req.query;
    let queryText = `SELECT id, author_id AS "authorId", title, status, updated_at AS "updatedAt" FROM publications`;
    const params = [];
    if (authorId) {
      queryText += ' WHERE author_id = $1 ORDER BY updated_at DESC';
      params.push(authorId);
    } else {
      queryText += ' ORDER BY updated_at DESC';
    }
    const result = await db.query(queryText, params);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('[Publication Controller] getPublications error:', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des publications.' });
  }
};

/**
 * Créer une publication
 */
exports.createPublication = async (req, res) => {
  try {
    const { authorId, title, status } = req.body;
    if (!authorId || !title) return res.status(400).json({ message: 'authorId et title requis.' });
    const insertText = `INSERT INTO publications (author_id, title, status, updated_at) VALUES ($1, $2, $3, NOW()) RETURNING id, author_id AS "authorId", title, status, updated_at AS "updatedAt"`;
    const result = await db.query(insertText, [authorId, title, status || 'draft']);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('[Publication Controller] createPublication error:', error);
    return res.status(500).json({ message: 'Erreur lors de la création de la publication.' });
  }
};

/**
 * Modifier une publication
 */
exports.updatePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    // Vérifier existence
    const check = await db.query('SELECT id FROM publications WHERE id = $1', [id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Publication non trouvée.' });

    const updateText = `UPDATE publications SET title = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING id, author_id AS "authorId", title, status, updated_at AS "updatedAt"`;
    const result = await db.query(updateText, [title || null, status || 'draft', id]);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('[Publication Controller] updatePublication error:', error);
    return res.status(500).json({ message: 'Erreur lors de la modification de la publication.' });
  }
};

/**
 * Supprimer une publication
 */
exports.deletePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await db.query('SELECT id FROM publications WHERE id = $1', [id]);
    if (check.rows.length === 0) return res.status(404).json({ message: 'Publication non trouvée.' });
    await db.query('DELETE FROM publications WHERE id = $1', [id]);
    return res.status(200).json({ message: 'Publication supprimée avec succès.', deletedId: Number(id) });
  } catch (error) {
    console.error('[Publication Controller] deletePublication error:', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de la publication.' });
  }
};
