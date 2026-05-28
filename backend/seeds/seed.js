// backend/seeds/seed.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'Larevelation1.0',
  database: process.env.PGDATABASE || 'presse_mcnt',
});

// ── Utilisateurs de test ──────────────────────────────────────
const users = [
  {
    lastName: 'Admin', firstName: 'Super', profession: 'Administrateur',
    cniNumber: 'ADMIN001', email: 'admin@mcnt.com',
    password: 'admin123', role: 'admin',
  },
  {
    lastName: 'Durand', firstName: 'Albert', profession: 'Écrivain',
    cniNumber: '109283746', email: 'albert.durand@mcnt.com',
    password: 'author123', role: 'author',
  },
  {
    lastName: 'Martin', firstName: 'Bernard', profession: 'Journaliste',
    cniNumber: '987654321', email: 'bernard.martin@mcnt.com',
    password: 'author123', role: 'author',
  },
];

// ── Publications de test ──────────────────────────────────────
const publications = [
  {
    authorEmail: 'albert.durand@mcnt.com', category: 'Diabète',
    title: 'Comprendre le diabète de type 2',
    content: 'Le diabète de type 2 est une maladie chronique caractérisée par une résistance à l\'insuline. Cela entraîne une accumulation de glucose dans le sang. Une alimentation équilibrée et une activité physique régulière sont indispensables pour le contrôler.',
    excerpt: 'Introduction au diabète de type 2 et ses mécanismes.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=60',
  },
  {
    authorEmail: 'albert.durand@mcnt.com', category: 'Hypertension',
    title: 'Hypertension : prévention et traitement',
    content: "L'hypertension artérielle touche une grande partie de la population adulte. Souvent silencieuse, elle peut causer de graves maladies cardiaques ou des AVC. Limiter le sel, gérer son stress et surveiller régulièrement sa tension sont des mesures de prévention clés.",
    excerpt: 'Guide pratique sur la prévention de l\'hypertension.',
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=800&auto=format&fit=crop&q=60',
  },
  {
    authorEmail: 'bernard.martin@mcnt.com', category: 'Obésité',
    title: "Les causes profondes de l'obésité",
    content: "L'obésité est une pathologie complexe qui ne se résume pas à un manque de volonté. Des facteurs génétiques, hormonaux, environnementaux et psychologiques entrent en jeu. Une approche multidisciplinaire est nécessaire pour aider les patients.",
    excerpt: 'Analyse des facteurs génétiques et environnementaux.',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60',
  },
  {
    authorEmail: 'bernard.martin@mcnt.com', category: 'Général',
    title: 'Vivre avec une maladie chronique',
    content: 'Les MCNT nécessitent une prise en charge à long terme et une adaptation du mode de vie. Le soutien de l\'entourage et un suivi médical régulier permettent aux patients de maintenir une bonne qualité de vie.',
    excerpt: 'Conseils pour améliorer la qualité de vie.',
    status: 'pending',
    imageUrl: 'https://images.unsplash.com/photo-1584515901367-f13470691e61?w=800&auto=format&fit=crop&q=60',
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    for (const u of users) {
      const hash = await bcrypt.hash(u.password, 10);
      await client.query(
        `INSERT INTO users (last_name, first_name, profession, cni_number, email, password_hash, role)
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (email) DO NOTHING`,
        [u.lastName, u.firstName, u.profession, u.cniNumber, u.email, hash, u.role]
      );
      console.log(`✅ User : ${u.email}  [${u.role}]`);
    }
    for (const p of publications) {
      const a = await client.query('SELECT id FROM users WHERE email=$1', [p.authorEmail]);
      const c = await client.query('SELECT id FROM categories WHERE name=$1', [p.category]);
      if (!a.rows.length || !c.rows.length) continue;
      await client.query(
        `INSERT INTO publications (author_id, category_id, title, content, excerpt, status, published_at, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [a.rows[0].id, c.rows[0].id, p.title, p.content, p.excerpt, p.status,
         p.status === 'published' ? new Date() : null, p.imageUrl]
      );
      console.log(`✅ Publication : "${p.title}"  [${p.status}]`);
    }
    console.log('\n🎉 Seed terminé.');
  } catch (err) {
    console.error('❌ Erreur :', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}
seed();
