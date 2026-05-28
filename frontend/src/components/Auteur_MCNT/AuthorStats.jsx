import { useEffect, useMemo, useState } from 'react'
import { ChartIcon, CheckedBoxIcon, DocumentIcon, HourglassIcon } from '../icons/CustomIcons'
import { api } from '../../utils/api'

const AuthorStats = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/publications')
        setItems(data)
        setIsConnected(true)
      } catch (err) {
        console.error(err)
        setIsConnected(false)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const stats = useMemo(() => {
    const total = items.length
    const published = items.filter((item) => item.status === 'published').length
    const draft = items.filter((item) => item.status === 'draft').length
    const pending = items.filter((item) => item.status === 'pending').length
    const percent = total ? Math.round((published / total) * 100) : 0

    // Calculer le nombre d'articles révisés (updatedAt différent de createdAt)
    const modifiedCount = items.filter((item) => {
      if (!item.createdAt || !item.updatedAt) return false
      return new Date(item.createdAt).getTime() !== new Date(item.updatedAt).getTime()
    }).length

    return { total, published, draft, pending, percent, modifiedCount }
  }, [items])

  const progressRows = [
    { label: `Publié (${stats.published})`, value: stats.published, className: 'fill-published' },
    { label: `Brouillon (${stats.draft})`, value: stats.draft, className: 'fill-draft' },
    { label: `En attente (${stats.pending})`, value: stats.pending, className: 'fill-pending' }
  ]

  const getPercent = (value) => (stats.total ? Math.round((value / stats.total) * 100) : 0)

  if (loading) return <div className="stats-panel"><p style={{ color: 'var(--text-muted)' }}>Chargement des statistiques...</p></div>

  return (
    <div className="stats-panel">
      <div className="panel-header">
        <div className="panel-title-container">
          <span className="panel-title-icon"><ChartIcon size={24} /></span>
          <h2 className="panel-title">Statistiques d'Activité</h2>
        </div>
      </div>

      <div className="stats-cards-grid">
        <div className="stats-kpi-card">
          <span className="kpi-icon-wrapper kpi-all"><ChartIcon size={20} /></span>
          <span className="kpi-details">
            <strong className="kpi-value">{stats.total}</strong>
            <span className="kpi-label">Publications totales</span>
          </span>
        </div>
        <div className="stats-kpi-card">
          <span className="kpi-icon-wrapper kpi-published"><CheckedBoxIcon size={20} /></span>
          <span className="kpi-details">
            <strong className="kpi-value">{stats.published}</strong>
            <span className="kpi-label">Articles publiés</span>
          </span>
        </div>
        <div className="stats-kpi-card">
          <span className="kpi-icon-wrapper kpi-draft"><DocumentIcon size={20} /></span>
          <span className="kpi-details">
            <strong className="kpi-value">{stats.draft}</strong>
            <span className="kpi-label">Brouillons actifs</span>
          </span>
        </div>
        <div className="stats-kpi-card">
          <span className="kpi-icon-wrapper kpi-pending"><HourglassIcon size={20} /></span>
          <span className="kpi-details">
            <strong className="kpi-value">{stats.pending}</strong>
            <span className="kpi-label">En attente de validation</span>
          </span>
        </div>
      </div>

      <div className="analytics-layout">
        <div className="analytics-card">
          <h3 className="analytics-title">Répartition des publications</h3>
          <div className="progress-list">
            {progressRows.map((row) => {
              const percent = getPercent(row.value)
              return (
                <div className="progress-item-group" key={row.label}>
                  <div className="progress-labels">
                    <span>{row.label}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className={`progress-bar-fill ${row.className}`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="analytics-card performance-card">
          <h3 className="analytics-title">Indicateurs de Performance</h3>
          <div className="performance-row">
            <span>Taux de Publication :</span>
            <strong>{stats.percent}%</strong>
          </div>
          <div className="performance-row">
            <span>Articles modifiés :</span>
            <strong>{stats.modifiedCount} / {stats.total}</strong>
          </div>
          <div className="performance-row">
            <span>Statut du système :</span>
            <strong className={isConnected ? "sync-badge" : "sync-badge sync-offline"} 
                    style={isConnected ? {} : { background: '#ffebee', color: '#c62828' }}>
              {isConnected ? "Connecté & Synchro" : "Hors ligne (Erreur)"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorStats
