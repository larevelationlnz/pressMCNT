import { useEffect, useState } from 'react'
import { DocumentIcon, TrashIcon } from '../icons/CustomIcons'
import { api } from '../../utils/api'

const STATUS_META = {
  published: { label:'Publié',     className:'status-badge status-publie'     },
  draft:     { label:'Brouillon',  className:'status-badge status-brouillon'  },
  pending:   { label:'En attente', className:'status-badge status-en-attente' },
}

const PublicationsManager = () => {
  const [pubs,    setPubs]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')  // 'all'|'published'|'draft'|'pending'

  useEffect(() => {
    api.get('/publications')
      .then(setPubs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayed = filter === 'all' ? pubs : pubs.filter(p => p.status === filter)

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
                      <button className="btn-action btn-action-delete"
                        onClick={() => handleDelete(p.id, p.title)} title="Supprimer">
                        <TrashIcon size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', textAlign:'right', marginTop:4 }}>
        {displayed.length} publication{displayed.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
export default PublicationsManager
