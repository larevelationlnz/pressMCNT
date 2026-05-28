const db = require('../config/db');

// ── PUBLIQUES ──────────────────────────────────────────────────

// GET /api/publications/categories
exports.getCategories = async (req, res) => {
  try {
    const r = await db.query('SELECT id, name, slug FROM categories ORDER BY name');
    res.json(r.rows);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur.' }); }
};

// GET /api/publications/public?categoryId=&search=
exports.getPublicArticles = async (req, res) => {
  const { categoryId, search } = req.query;
  const params = []; let where = `WHERE p.status = 'published'`; let i = 1;
  if (categoryId) { where += ` AND p.category_id = $${i++}`; params.push(categoryId); }
  if (search)     { where += ` AND p.title ILIKE $${i++}`;   params.push(`%${search}%`); }
  try {
    const r = await db.query(`
      SELECT p.id, p.title, p.excerpt, p.image_url AS "imageUrl",
             p.published_at  AS "publishedAt",
             u.first_name || ' ' || u.last_name AS "authorName",
             c.name AS "categoryName", c.slug AS "categorySlug"
      FROM publications p
      JOIN users u ON u.id = p.author_id
      LEFT JOIN categories c ON c.id = p.category_id
      ${where}
      ORDER BY p.published_at DESC`, params);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur.' }); }
};

// GET /api/publications/public/:id
exports.getPublicArticleById = async (req, res) => {
  try {
    const r = await db.query(`
      SELECT p.id, p.title, p.content, p.excerpt, p.image_url AS "imageUrl",
             p.published_at AS "publishedAt",
             u.first_name || ' ' || u.last_name AS "authorName",
             u.profession   AS "authorProfession",
             c.name AS "categoryName", c.slug AS "categorySlug"
      FROM publications p
      JOIN users u ON u.id = p.author_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1 AND p.status = 'published'`, [req.params.id]);
    if (!r.rows.length)
      return res.status(404).json({ message: 'Article non trouvé ou non publié.' });
    res.json(r.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur.' }); }
};

// ── PROTÉGÉES ──────────────────────────────────────────────────

// GET /api/publications
exports.getPublications = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const params  = []; let where = ''; let i = 1;
  if (!isAdmin) { where = `WHERE p.author_id = $${i++}`; params.push(req.user.id); }
  try {
    const r = await db.query(`
      SELECT p.id, p.title, p.status, p.excerpt, p.image_url AS "imageUrl",
             p.author_id   AS "authorId",
             p.category_id AS "categoryId",
             p.published_at AS "publishedAt",
             p.created_at  AS "createdAt",
             p.updated_at  AS "updatedAt",
             u.first_name || ' ' || u.last_name AS "authorName",
             c.name AS "categoryName"
      FROM publications p
      JOIN users u ON u.id = p.author_id
      LEFT JOIN categories c ON c.id = p.category_id
      ${where}
      ORDER BY p.updated_at DESC`, params);
    res.json(r.rows);
  } catch (err) { res.status(500).json({ message: 'Erreur serveur.' }); }
};

// POST /api/publications
exports.createPublication = async (req, res) => {
  const { title, content, excerpt, status, categoryId, imageUrl } = req.body;
  if (!title?.trim())
    return res.status(400).json({ message: 'Le titre est requis.' });
  const finalStatus = ['draft','pending','published'].includes(status) ? status : 'draft';
  const publishedAt = finalStatus === 'published' ? new Date() : null;
  try {
    const r = await db.query(`
      INSERT INTO publications (author_id, category_id, title, content, excerpt, status, published_at, image_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id, title, status, excerpt, image_url AS "imageUrl",
                author_id AS "authorId", category_id AS "categoryId",
                published_at AS "publishedAt",
                created_at AS "createdAt", updated_at AS "updatedAt"`,
      [req.user.id, categoryId || null, title.trim(),
       content || '', excerpt || '', finalStatus, publishedAt, imageUrl || null]);
    res.status(201).json(r.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Erreur serveur.' }); }
};

// PUT /api/publications/:id
exports.updatePublication = async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user.role === 'admin';
  const { title, content, excerpt, status, categoryId, imageUrl } = req.body;
  try {
    const chk = await db.query('SELECT author_id FROM publications WHERE id=$1', [id]);
    if (!chk.rows.length)
      return res.status(404).json({ message: 'Publication non trouvée.' });
    if (!isAdmin && chk.rows[0].author_id !== req.user.id)
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres articles.' });

    const fields = [
      'title = COALESCE($1, title)',
      'content = COALESCE($2, content)',
      'excerpt = COALESCE($3, excerpt)',
      'status = COALESCE($4, status)',
      'category_id = COALESCE($5, category_id)',
      'updated_at = NOW()'
    ];
    const values = [title||null, content||null, excerpt||null, status||null, categoryId||null];
    let idx = 6;

    if (imageUrl !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(imageUrl);
    }

    // Gestion du published_at
    fields.push(`published_at = CASE WHEN $4 = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END`);

    values.push(id);
    const queryStr = `
      UPDATE publications SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING id, title, status, excerpt, image_url AS "imageUrl",
                author_id AS "authorId", category_id AS "categoryId",
                published_at AS "publishedAt", updated_at AS "updatedAt"
    `;

    const r = await db.query(queryStr, values);
    res.json(r.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Erreur serveur.' }); }
};

// DELETE /api/publications/:id
exports.deletePublication = async (req, res) => {
  const { id } = req.params;
  const isAdmin = req.user.role === 'admin';
  try {
    const chk = await db.query('SELECT author_id FROM publications WHERE id=$1', [id]);
    if (!chk.rows.length)
      return res.status(404).json({ message: 'Publication non trouvée.' });
    if (!isAdmin && chk.rows[0].author_id !== req.user.id)
      return res.status(403).json({ message: 'Vous ne pouvez supprimer que vos propres articles.' });
    await db.query('DELETE FROM publications WHERE id=$1', [id]);
    res.json({ message: 'Publication supprimée.', deletedId: Number(id) });
  } catch (err) { res.status(500).json({ message: 'Erreur serveur.' }); }
};
