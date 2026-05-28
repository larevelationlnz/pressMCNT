import { useState } from 'react'
import AuthorPublications from './AuthorPublications'
import AuthorStats from './AuthorStats'
import { ChartIcon, DocumentIcon } from '../icons/CustomIcons'

const AuthorDashboard = ({ user, onLogout }) => {
  const [tab, setTab] = useState('publications')

  return (
    <>
      <header className="app-header fade-in author-header">
        <div className="header-spacer-left"></div>
        <h1>TABLEAU DE BORD AUTEUR</h1>
        <button className="btn-deconnecter" onClick={onLogout}>
          deconnecter
        </button>
      </header>

      <main className="app-container author-container fade-in">
        <nav className="sidebar menu-auteur-panel">
          <h2>Menu auteur</h2>
          <div className="sidebar-menu">
            <button
              className={`menu-item ${tab === 'publications' ? 'active' : ''}`}
              onClick={() => setTab('publications')}
            >
              <span className="menu-item-icon"><DocumentIcon size={18} /></span>
              Mes publications
            </button>
            <button
              className={`menu-item ${tab === 'stats' ? 'active' : ''}`}
              onClick={() => setTab('stats')}
            >
              <span className="menu-item-icon"><ChartIcon size={18} /></span>
              Statistiques
            </button>
          </div>
        </nav>

        <section className="app-content">
          {tab === 'publications' && <AuthorPublications user={user} />}
          {tab === 'stats' && <AuthorStats user={user} />}
        </section>
      </main>
    </>
  )
}

export default AuthorDashboard
