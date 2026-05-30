import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArticleList   from './ArticleList'
import ArticleDetail from './ArticleDetail'

const PublicInterface = () => {
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')

  return (
    <div className="public-layout">
      {/* Header public */}
      <header className="public-header">
        <div className="public-header-inner">
          <div className="public-logo">
            <span className="public-logo-dot" />
            Presse <strong>MCNT</strong>
          </div>
          <div className="public-search-bar" style={{ width: '300px', maxWidth: '50%', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <input 
              type="search" 
              placeholder="Rechercher un article…"
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ marginBottom: 0, border: 'none', padding: '8px 16px', borderRadius: '20px', width: '100%' }}
            />
            <Link to="/login" title="Se connecter" style={{ textDecoration: 'none', fontSize: '1.2rem', color: '#1877f2' }}>
              👤
            </Link>
          </div>
        </div>
      </header>

      {/* Corps */}
      <main className="public-main">
        {selectedId ? (
          <ArticleDetail
            articleId={selectedId}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <ArticleList 
            onSelect={id => setSelectedId(id)} 
            searchQuery={search} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <p>© 2026 Presse MCNT — Plateforme d'édition médicale</p>
      </footer>
    </div>
  )
}
export default PublicInterface
