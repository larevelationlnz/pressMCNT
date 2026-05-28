-- Script d'initialisation de la base de donnees pour Presse MCNT
-- Gestion des auteurs

-- Supprimer la table si elle existe (pour reinitialisation facile)
DROP TABLE IF EXISTS authors;

-- Creer la table des auteurs
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    profession VARCHAR(150) NOT NULL,
    cni_number VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser la recherche et les contraintes d'unicite
CREATE INDEX idx_authors_email ON authors(email);
CREATE INDEX idx_authors_cni ON authors(cni_number);
CREATE INDEX idx_authors_names ON authors(last_name, first_name);

-- Insertion de donnees de test initiales
-- Les mots de passe sont enregistres normalement, sans cryptage.
INSERT INTO authors (last_name, first_name, profession, cni_number, email, password, created_at)
VALUES
('Durand', 'Albert', 'Ecrivain', '109283746', 'd@email.com', 'password123', '2025-01-10T12:00:00Z'),
('Martin', 'Bernard', 'Journaliste', '987654321', 'm@email.com', 'password123', '2025-02-15T12:00:00Z'),
('Sophie', 'Claire', 'Editrice', '564738291', 's@email.com', 'password123', '2025-03-01T12:00:00Z');
