const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// Configuration du pool de connexion
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false
    }
  : {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    };

const pool = new Pool(poolConfig);

// Fonction pour tester la connexion au démarrage
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    console.log(`[Database] Connexion réussie à PostgreSQL à ${res.rows[0].now}`);
    // Initialisation automatique de la table `publications`
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS publications (
          id SERIAL PRIMARY KEY,
          author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
          title TEXT NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'draft',
          updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
        )
      `);

      // Si la table est vide, insérer des exemples pour chaque auteur existant
      const countRes = await client.query('SELECT COUNT(*)::int AS cnt FROM publications');
      if (countRes.rows[0].cnt === 0) {
        const authorsRes = await client.query('SELECT id, email FROM authors ORDER BY id ASC');
        if (authorsRes.rows.length > 0) {
          const insertText = 'INSERT INTO publications (author_id, title, status, updated_at) VALUES ($1, $2, $3, NOW())';
          for (const author of authorsRes.rows) {
            await client.query(insertText, [author.id, 'Mon article 1', 'published']);
            await client.query(insertText, [author.id, 'Mon article 2', 'draft']);
            await client.query(insertText, [author.id, 'Mon article 3', 'pending']);
          }
          console.log('[Database] Table publications initialisée avec exemples.');
        }
      }
    } catch (initErr) {
      console.error('[Database Init] Erreur lors de l\'initialisation de la table publications:', initErr.message);
    }

    client.release();
    return true;
  } catch (err) {
    console.error('[Database Error] Impossible de se connecter à PostgreSQL !');
    console.error(`Détails de l'erreur : ${err.message}`);
    console.error('>> Veuillez vous assurer que PostgreSQL est démarré et que vos variables d\'environnement dans .env sont correctes.');
    return false;
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection
};
