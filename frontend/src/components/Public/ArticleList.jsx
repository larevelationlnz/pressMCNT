import { useEffect, useState, useMemo } from 'react'

const API = 'http://localhost:5000/api/publications'

const ArticleList = ({ onSelect }) => {
  const [articles,  setArticles]  = useState([])
  const [categories, setCats]     = useState([])
  const [activeCat,  setActiveCat] = useState(null)
  const [search,    setSearch]    = useState('')
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/public`).then(r => r.json()),
      fetch(`${API}/categories`).then(r => r.json()),
    ]).then(([arts, cats]) => { setArticles(arts); setCats(cats) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayed = useMemo(() => {
    let list = articles
    if (activeCat) list = list.filter(a => a.categorySlug === activeCat)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q)
      )
    }
    return list
  }, [articles, activeCat, search])

  if (loading) return (
    <div className="article-grid">
      {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
    </div>
  )

  return (
    <div>
      {/* Barre recherche */}
      <div className="public-search-bar">
        <input type="search" placeholder="Rechercher un article…"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filtres catégories */}
      <div className="category-pills">
        <button className={`category-pill ${!activeCat ? 'active' : ''}`}
          onClick={() => setActiveCat(null)}>Tous</button>
        {categories.map(c => (
          <button key={c.id}
            className={`category-pill ${activeCat === c.slug ? 'active' : ''}`}
            onClick={() => setActiveCat(activeCat === c.slug ? null : c.slug)}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Compteur */}
      <p className="public-count">
        {displayed.length} article{displayed.length !== 1 ? 's' : ''}
      </p>

      {/* Grille */}
      {displayed.length === 0
        ? <div className="public-empty">Aucun article publié pour le moment.</div>
        : (
          <div className="article-grid">
            {displayed.map(a => {
              const gradientMap = {
                'Diabète': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                'Hypertension': 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                'Obésité': 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                'Cancer': 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
                'Maladies cardiaques': 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
                'Général': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              };
              const fallbackBg = gradientMap[a.categoryName] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

              return (
                <article key={a.id} className="article-card" onClick={() => onSelect(a.id)} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 0 }}>
                  <div style={{ width: '100%', height: 140, background: a.imageUrl ? `url(${a.imageUrl}) center/cover no-repeat` : fallbackBg, position: 'relative', borderBottom: '1px solid var(--border-color)' }}>
                    {a.categoryName && (
                      <span className="article-card-badge" style={{ position: 'absolute', bottom: 10, left: 10, margin: 0 }}>
                        {a.categoryName}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <h3 className="article-card-title" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text-main)' }}>
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="article-card-excerpt" style={{ margin: '4px 0 12px 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>
                        {a.excerpt}
                      </p>
                    )}
                    <div className="article-card-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 10, marginTop: 'auto', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span className="article-card-author" style={{ color: 'var(--text-muted)' }}>✍ {a.authorName}</span>
                      <span className="article-card-date" style={{ color: 'var(--text-muted)' }}>
                        {new Date(a.publishedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )
      }
    </div>
  )
}
export default ArticleList
