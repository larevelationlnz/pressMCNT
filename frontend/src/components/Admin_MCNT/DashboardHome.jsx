import { useEffect, useState } from 'react'
import { ChartIcon } from '../icons/CustomIcons'
import { api } from '../../utils/api'

const STATUS_COLOR = {
  published: { bg:'#e8f5e9', color:'#2e7d32' },
  draft:     { bg:'#f5f5f5', color:'#616161' },
  pending:   { bg:'#fff3e0', color:'#e65100' },
}
const STATUS_LABEL = { published:'Publié', draft:'Brouillon', pending:'En attente' }

const DashboardHome = () => {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 5

  useEffect(() => {
    api.get('/admin/stats')
      .then(setStats)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="content-area fade-in"><p style={{color:'var(--text-muted)'}}>Chargement…</p></div>
  if (error)   return <div className="content-area fade-in"><p style={{color:'red'}}>{error}</p></div>

  const recentActivity = stats?.recentActivity || []
  const totalPages = Math.ceil(recentActivity.length / ITEMS_PER_PAGE)
  const displayedActivity = recentActivity.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="content-area fade-in">
      <div className="content-header">
        <div className="content-title-wrapper">
          <span className="content-title-icon"><ChartIcon size={28} /></span>
          <h2 className="content-title">Vue d'ensemble</h2>
        </div>
      </div>

      {/* KPIs */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.authorsCount}</div>
          <div className="stat-label">Auteurs Actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.publicationsCount}</div>
          <div className="stat-label">Publications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.engagementRate}%</div>
          <div className="stat-label">Taux de publication</div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="dashboard-placeholder" style={{ minHeight:'auto', marginTop:12, alignItems:'stretch', padding:20 }}>
        <h3 className="placeholder-title" style={{ textAlign:'left', marginBottom:12 }}>
          Rapport d'activité récent
        </h3>
        {recentActivity.length === 0
          ? <p className="placeholder-text">Aucune activité récente.</p>
          : (
            <>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
              <thead>
                <tr>
                  {['Titre','Auteur','Statut','Modifié le'].map(h => (
                    <th key={h} style={{ textAlign:'left', padding:'8px 10px',
                      borderBottom:'1px solid var(--border-color)', color:'var(--text-muted)',
                      fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.4px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedActivity.map(p => (
                  <tr key={p.id}>
                    <td style={{ padding:'8px 10px', fontWeight:600 }}>{p.title}</td>
                    <td style={{ padding:'8px 10px', color:'var(--text-muted)' }}>{p.authorName}</td>
                    <td style={{ padding:'8px 10px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:12, fontSize:'0.8rem',
                        fontWeight:600, ...STATUS_COLOR[p.status] }}>
                        {STATUS_LABEL[p.status] || p.status}
                      </span>
                    </td>
                    <td style={{ padding:'8px 10px', color:'var(--text-muted)', fontSize:'0.82rem' }}>
                      {new Date(p.updatedAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', margin: 0 }}>
                Affichage de {displayedActivity.length} sur {recentActivity.length} élément{recentActivity.length !== 1 ? 's' : ''}
              </p>
              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button className="btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Précédent</button>
                  <span style={{ fontSize: '0.8rem', padding: '4px 8px', display: 'flex', alignItems: 'center' }}>Page {currentPage} sur {totalPages}</span>
                  <button className="btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Suivant</button>
                </div>
              )}
            </div>
            </>
          )
        }
      </div>
    </div>
  )
}
export default DashboardHome
