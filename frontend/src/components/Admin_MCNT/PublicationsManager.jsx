import { useEffect, useState } from 'react'
import { DocumentIcon, TrashIcon } from '../icons/CustomIcons'
import { api } from '../../utils/api'

const EyeIcon = ({ size=15 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const STATUS_META = {
  published: { label:'Publié',     className:'status-badge status-publie'     },
  draft:     { label:'Brouillon',  className:'status-badge status-brouillon'  },
  pending:   { label:'En attente', className:'status-badge status-en-attente' },
}

const PublicationsManager = () => {
  const [pubs,    setPubs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')  // 'all'|'published'|'draft'|'pending'
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewingArticle, setViewingArticle] = useState(null)
  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    api.get('/publications')
      .then(setPubs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = pubs.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || (p.authorName && p.authorName.toLowerCase().includes(q));
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => { setCurrentPage(1) }, [searchQuery, filter]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Supprimer "${title}" ?`)) return
    try {
      await api.delete(`/publications/${id}`)
      setPubs(prev => prev.filter(p => p.id !== id))
    } catch (err) { alert(err.message) }
  }

  return (
    <div className="content-area fade-in">
      <div className="content-header">
        <div className="content-title-wrapper">
          <span className="content-title-icon"><DocumentIcon size={28} /></span>
          <h2 className="content-title">Gestion des publications</h2>
        </div>
        <div style={{ display:'flex', gap:16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Barre de recherche collective */}
          <div style={{ position: 'relative', width: '250px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex' }}>
              <SearchIcon />
            </span>
            <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 10px 8px 34px', fontSize: '0.85rem', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
          </div>
          {/* Filtre par statut */}
          <div style={{ display:'flex', gap:8 }}>
            {['all','published','draft','pending'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="btn"
                style={{ fontWeight: filter===s ? 700 : 400,
                         borderColor: filter===s ? 'var(--primary-text)' : 'var(--border-color)' }}>
                {s==='all' ? 'Tous' : STATUS_META[s].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? <p style={{color:'var(--text-muted)'}}>Chargement…</p> : (
        <div className="table-container">
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
            <thead>
              <tr>
                {['Titre','Auteur','Catégorie','Statut','Date','Action'].map(h => (
                  <th key={h} style={{ padding:'10px 12px', background:'hsl(210,100%,98%)',
                    fontWeight:700, fontSize:'0.75rem', color:'var(--text-muted)',
                    textTransform:'uppercase', letterSpacing:'0.4px',
                    borderBottom:'1px solid var(--border-color)', textAlign:'left', whiteSpace:'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>
                  Aucune publication trouvée.
                </td></tr>
              ) : displayed.map(p => {
                const meta = STATUS_META[p.status] || STATUS_META.draft
                return (
                  <tr key={p.id}
                    onMouseEnter={e => e.currentTarget.style.background='hsl(210,20%,98%)'}
                    onMouseLeave={e => e.currentTarget.style.background=''}>
                    <td style={{ padding:'10px 12px', fontWeight:600, borderBottom:'1px solid var(--border-color)' }}>
                      {p.title}
                    </td>
                    <td style={{ padding:'10px 12px', color:'var(--text-muted)', borderBottom:'1px solid var(--border-color)' }}>
                      {p.authorName}
                    </td>
                    <td style={{ padding:'10px 12px', color:'var(--text-muted)', borderBottom:'1px solid var(--border-color)' }}>
                      {p.categoryName || '—'}
                    </td>
                    <td style={{ padding:'10px 12px', borderBottom:'1px solid var(--border-color)' }}>
                      <span className={meta.className}>{meta.label}</span>
                    </td>
                    <td style={{ padding:'10px 12px', color:'var(--text-muted)', fontSize:'0.82rem', borderBottom:'1px solid var(--border-color)', whiteSpace:'nowrap' }}>
                      {new Date(p.updatedAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding:'10px 12px', borderBottom:'1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-action btn-action-view"
                          onClick={() => setViewingArticle(p)} title="Visualiser" style={{ color: '#1877f2', border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}>
                          <EyeIcon size={15} />
                        </button>
                        <button className="btn-action btn-action-delete"
                          onClick={() => handleDelete(p.id, p.title)} title="Supprimer" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px' }}>
                          <TrashIcon size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', margin: 0 }}>
          Affichage de {displayed.length} sur {filtered.length} publication{filtered.length !== 1 ? 's' : ''}
        </p>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button className="btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Précédent</button>
            <span style={{ fontSize: '0.8rem', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>Page {currentPage} sur {totalPages}</span>
            <button className="btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Suivant</button>
          </div>
        )}
      </div>

      {viewingArticle && (
        <div className="modal-overlay" onClick={() => setViewingArticle(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: '8px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>{viewingArticle.title}</h2>
              <button className="modal-close" onClick={() => setViewingArticle(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            {viewingArticle.imageUrl && (
              <div style={{ width: '100%', height: '300px', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', background: '#f5f5f5' }}>
                <img src={viewingArticle.imageUrl} alt={viewingArticle.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span className={STATUS_META[viewingArticle.status]?.className} style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>{STATUS_META[viewingArticle.status]?.label}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><strong>Catégorie :</strong>&nbsp;{viewingArticle.categoryName || '—'}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><strong>Auteur :</strong>&nbsp;{viewingArticle.authorName}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><strong>Date :</strong>&nbsp;{new Date(viewingArticle.updatedAt).toLocaleDateString('fr-FR')}</span>
            </div>
            {viewingArticle.excerpt && (
              <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontStyle: 'italic', fontSize: '0.95rem', color: '#555', borderLeft: '4px solid #1877f2' }}>
                {viewingArticle.excerpt}
              </div>
            )}
            <div style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', color: '#333', fontSize: '1rem' }}>
              {viewingArticle.content}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default PublicationsManager
