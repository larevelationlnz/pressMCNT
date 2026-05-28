const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const fs      = require('fs');
const path    = require('path');
require('dotenv').config();
const { testConnection } = require('./config/db');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

// ── Service de fichiers statiques pour les images téléversées ──────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/users',        require('./routes/userRoutes'));
app.use('/api/publications',  require('./routes/publicationRoutes'));
app.use('/api/admin',        require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

testConnection().then(() => {
  app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
});
