import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import AuthorPublications from './AuthorPublications'
import AuthorStats from './AuthorStats'
import { ChartIcon, DocumentIcon } from '../icons/CustomIcons'

const AuthorDashboard = ({ user, onLogout }) => {

  return (
    <>
      <header className="app-header fade-in author-header">
        <div className="header-spacer-left" style={{ display: 'flex', alignItems: 'center', fontWeight: 600, color: '#5c6bc0', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
          {user ? `👤 ${user.firstName} ${user.lastName}` : ''}
        </div>
        <h1>TABLEAU DE BORD AUTEUR</h1>
        <button className="btn-deconnecter" onClick={onLogout}>
          deconnecter
        </button>
      </header>

      <main className="app-container author-container fade-in">
        <nav className="sidebar menu-auteur-panel">
          <h2>Menu auteur</h2>
          <div className="sidebar-menu">
            <NavLink
              to="/auteur/publications"
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            >
              <span className="menu-item-icon"><DocumentIcon size={18} /></span>
              Mes publications
            </NavLink>
            <NavLink
              to="/auteur/stats"
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            >
              <span className="menu-item-icon"><ChartIcon size={18} /></span>
              Statistiques
            </NavLink>
          </div>
        </nav>

        <section className="app-content">
          <Routes>
            <Route path="publications" element={<AuthorPublications user={user} />} />
            <Route path="stats" element={<AuthorStats user={user} />} />
            <Route path="*" element={<Navigate to="publications" replace />} />
          </Routes>
        </section>
      </main>
    </>
  )
}

export default AuthorDashboard
