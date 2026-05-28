import { useEffect, useState } from 'react'

const ArticleDetail = ({ articleId, onBack }) => {
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    fetch(`http://localhost:5000/api/publications/public/${articleId}`)
      .then(r => { if (!r.ok) throw new Error('Article introuvable.'); return r.json() })
      .then(setArticle)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [articleId])

  if (loading) return <div className="article-detail-loading">Chargement…</div>
  if (error)   return <div className="article-detail-error">{error}</div>

  return (
    <div className="article-detail-panel">
      <button className="article-detail-back" onClick={onBack}>
        ← Retour aux articles
      </button>

      {article.imageUrl && (
        <div style={{ width: '100%', height: 320, borderRadius: 12, overflow: 'hidden', marginTop: 16, marginBottom: 24, boxShadow: '0 8px 24px var(--shadow-sm)' }}>
          <img src={article.imageUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {article.categoryName && (
        <span className="article-card-badge">{article.categoryName}</span>
      )}

      <h1 className="article-detail-title">{article.title}</h1>

      <div className="article-detail-meta">
        <span>✍ {article.authorName}</span>
        {article.authorProfession && <span> · {article.authorProfession}</span>}
        <span> · {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
          year:'numeric', month:'long', day:'numeric'
        })}</span>
      </div>

      {article.excerpt && (
        <p className="article-detail-excerpt">{article.excerpt}</p>
      )}

      <div className="article-detail-content">
        {article.content.split('\n').map((para, i) =>
          para.trim() ? <p key={i}>{para}</p> : null
        )}
      </div>
    </div>
  )
}
export default ArticleDetail
