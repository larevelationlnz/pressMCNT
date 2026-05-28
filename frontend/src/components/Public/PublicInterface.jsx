import { useState } from 'react'
import ArticleList   from './ArticleList'
import ArticleDetail from './ArticleDetail'

const PublicInterface = ({ onLogin }) => {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="public-layout">
      {/* Header public */}
      <header className="public-header">
        <div className="public-header-inner">
          <div className="public-logo">
            <span className="public-logo-dot" />
            Presse <strong>MCNT</strong>
          </div>
          <button className="btn btn-primary" onClick={onLogin}>
            Se connecter
          </button>
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
          <ArticleList onSelect={id => setSelectedId(id)} />
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
