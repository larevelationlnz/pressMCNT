const db = require('../config/db');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [authorsRes, pubsRes, recentRes] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS count FROM users
                WHERE role='author' AND is_active=true`),
      db.query(`SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status='published')::int AS published,
          COUNT(*) FILTER (WHERE status='draft')::int     AS draft,
          COUNT(*) FILTER (WHERE status='pending')::int   AS pending
        FROM publications`),
      db.query(`
        SELECT p.id, p.title, p.status,
               p.updated_at AS "updatedAt",
               u.first_name || ' ' || u.last_name AS "authorName"
        FROM publications p
        JOIN users u ON u.id = p.author_id
        ORDER BY p.updated_at DESC LIMIT 5`),
    ]);

    const p = pubsRes.rows[0];
    res.json({
      authorsCount:     authorsRes.rows[0].count,
      publicationsCount: p.total,
      publishedCount:   p.published,
      draftCount:       p.draft,
      pendingCount:     p.pending,
      engagementRate:   p.total > 0 ? Math.round((p.published / p.total) * 100) : 0,
      recentActivity:   recentRes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
