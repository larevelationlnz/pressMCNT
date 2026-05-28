import { useState, useEffect } from 'react'
import Header              from './Header'
import Sidebar             from './Sidebar'
import DashboardHome       from './DashboardHome'
import AuthorsManager      from './AuthorsManager'
import AuthorModal         from './AuthorModal'
import PublicationsManager from './PublicationsManager'
import { api } from '../../utils/api'

const AdminLayout = ({ user, onLogout }) => {
  const [activeTab,        setActiveTab]        = useState('dashboard')
  const [authors,          setAuthors]          = useState([])
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false)
  const [selectedAuthor,   setSelectedAuthor]   = useState(null)

  // Charger la liste des auteurs (users avec role='author')
  const fetchAuthors = async () => {
    try {
      const data = await api.get('/users')
      setAuthors(data.filter(u => u.role === 'author'))
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchAuthors() }, [])

  // ── CRUD auteurs ──────────────────────────────────────────────
  const handleAddClick   = () => { setSelectedAuthor(null); setIsAuthorModalOpen(true) }
  const handleEditClick  = (a)  => { setSelectedAuthor(a);  setIsAuthorModalOpen(true) }

  const handleDeleteClick = async (id) => {
    const a = authors.find(x => x.id === id)
    if (!window.confirm(`Supprimer "${a?.firstName} ${a?.lastName}" ?`)) return
    try {
      await api.delete(`/users/${id}`)
      setAuthors(prev => prev.filter(x => x.id !== id))
    } catch (err) { alert(err.message) }
  }

  const handleModalSubmit = async (data) => {
    if (selectedAuthor) {
      const updated = await api.put(`/users/${selectedAuthor.id}`, data)
      setAuthors(prev => prev.map(a => a.id === selectedAuthor.id ? updated : a))
    } else {
      const created = await api.post('/users', { ...data, role: 'author' })
      setAuthors(prev => [...prev, created])
    }
  }

  return (
    <>
      <Header onLogout={onLogout} />
      <main className="app-container fade-in"
            style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:'24px', padding:'24px' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <section className="app-content" style={{ minWidth: 0 }}>
          {activeTab === 'dashboard'    && <DashboardHome authorsCount={authors.length} />}
          {activeTab === 'authors'      && (
            <AuthorsManager
              authors={authors}
              onAddClick={handleAddClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          )}
          {activeTab === 'publications' && <PublicationsManager />}
        </section>
      </main>
      <AuthorModal
        isOpen={isAuthorModalOpen}
        onClose={() => setIsAuthorModalOpen(false)}
        onSubmit={handleModalSubmit}
        author={selectedAuthor}
      />
    </>
  )
}
export default AdminLayout
