import { useState, useEffect } from 'react'
import Loginadmin from './components/Login/AdminLogin'
import './App.css'
import Header from './components/Admin_MCNT/Header'
import Sidebar from './components/Admin_MCNT/Sidebar';
import AuthorsManager from './components/Admin_MCNT/AuthorsManager';
import DashboardHome from './components/Admin_MCNT/DashboardHome';
import PublicationsManager from './components/Admin_MCNT/PublicationsManager';
import AuthorModal from './components/Admin_MCNT/AuthorModal';
import AuthorDashboard from './components/Auteur_MCNT/AuthorDashboard';

const API_URL = 'http://localhost:5000/api/authors';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Charger les auteurs depuis le backend
  const fetchAuthors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur lors du chargement des auteurs');
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la connexion au serveur API. Veuillez vérifier que le backend est démarré.');
    } finally {
      setIsLoading(false);
    }
  };

  // Recharger les auteurs quand l'utilisateur est connecté
  useEffect(() => {
    if (isLoggedIn && role === 'admin') {
      fetchAuthors();
    }
  }, [isLoggedIn, role]);

  const handleLogin = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (cleanEmail === 'yan@gmail.com' && cleanPassword === '1234') {
      setIsLoggedIn(true);
      setRole('admin');
      setUser({ email: cleanEmail });
      setActiveTab('dashboard');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/authors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

        if (!res.ok) throw new Error('Identifiants invalides');
      const data = await res.json();
      setIsLoggedIn(true);
      setRole('author');
      setUser(data);
    } catch (err) {
      console.error(err);
      alert('Email ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    setActiveTab('dashboard');
  };

  // Modal States
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // CRUD Actions
  const handleAddClick = () => {
    setSelectedAuthor(null);
    setIsAuthorModalOpen(true);
  };

  const handleEditClick = (author) => {
    setSelectedAuthor(author);
    setIsAuthorModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    const authorToDelete = authors.find(a => a.id === id);
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer l'auteur "${authorToDelete ? `${authorToDelete.firstName} ${authorToDelete.lastName}` : ''}" ?`;
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Erreur de suppression');
        }
        setAuthors(authors.filter((author) => author.id !== id));
      } catch (error) {
        console.error(error);
        alert(`Impossible de supprimer l'auteur : ${error.message}`);
      }
    }
  };

  const handleModalSubmit = async (authorData) => {
    if (selectedAuthor) {
      // Edit mode (PUT)
      const response = await fetch(`${API_URL}/${selectedAuthor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authorData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Erreur de modification');
      }
      const updatedAuthor = await response.json();
      setAuthors(authors.map((author) => (author.id === selectedAuthor.id ? updatedAuthor : author)));
    } else {
      // Add mode (POST)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authorData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Erreur de création');
      }
      const newAuthor = await response.json();
      setAuthors([...authors, newAuthor]);
    }
  };

  return (
    <>
      {isLoggedIn && role === 'admin' ? (
        <>
          <Header onLogout={handleLogout} />
          <main className="app-container fade-in" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', padding: '24px' }}>
             {/* Left Admin Sidebar */}
              <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                  {/* Right Content Panel */}
              <section className="app-content" style={{ minWidth: 0 }}>
                {activeTab === 'dashboard' && (
                  <DashboardHome authorsCount={authors.length} />
                )}
                {activeTab === 'authors' && (
                  <AuthorsManager
                    authors={authors}
                    onAddClick={handleAddClick}
                    onEditClick={handleEditClick}
                    onDeleteClick={handleDeleteClick}
                  />
                )}
                {activeTab === 'publications' && (
                  <PublicationsManager />
                )}
              </section>
          </main>
          
            {/* Author Creation/Edition Modal */}
              <AuthorModal
                isOpen={isAuthorModalOpen}
                onClose={() => setIsAuthorModalOpen(false)}
                onSubmit={handleModalSubmit}
                author={selectedAuthor}
              />

        </>
      ) : isLoggedIn && role === 'author' ? (
        <AuthorDashboard user={user} onLogout={handleLogout} />
      ) : (
        <Loginadmin onLogin={handleLogin} />
      )}
    </>
  )
}

export default App
