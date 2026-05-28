import { useEffect, useMemo, useState } from 'react'
import ArticleModal from './ArticleModal'
import {
  CheckedBoxIcon,
  DocPencilIcon,
  DocumentIcon,
  EyeIcon,
  HourglassIcon,
  PencilIcon,
  TrashIcon
} from '../icons/CustomIcons'
import { api } from '../../utils/api'

const STATUS_META = {
  published: {
    label: 'Publié',
    className: 'status-publie',
    icon: <CheckedBoxIcon size={14} />
  },
  draft: {
    label: 'Brouillon',
    className: 'status-brouillon',
    icon: <DocPencilIcon size={14} />
  },
  pending: {
    label: 'En attente',
    className: 'status-en-attente',
    icon: <HourglassIcon size={14} />
  }
}

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('fr-FR')
}

const AuthorPublications = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [previewItem, setPreviewItem] = useState(null)
  const [search, setSearch] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const data = await api.get('/publications')
      setItems(data)
    } catch (err) {
      console.error(err)
      alert('Erreur lors du chargement des publications : ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items

    return items.filter((item) => {
      const statusLabel = STATUS_META[item.status]?.label || item.status
      return [item.title, item.categoryName || '', item.status, statusLabel, formatDate(item.updatedAt)]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [items, search])

  const handleCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (item) => {
    setEditing(item)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette publication ?')) return
    try {
      await api.delete(`/publications/${id}`)
      setItems(items.filter((item) => item.id !== id))
    } catch (err) {
      console.error(err)
      alert('Impossible de supprimer : ' + err.message)
    }
  }

  const handleSave = async (payload) => {
    if (editing) {
      const updated = await api.put(`/publications/${editing.id}`, payload)
      // On recharge les publications pour avoir les infos enrichies (comme categoryName)
      fetchItems()
    } else {
      const created = await api.post('/publications', payload)
      fetchItems()
    }
    setModalOpen(false)
  }

  return (
    <div className="publications-panel">
      <div className="panel-header">
        <div className="panel-title-container">
          <span className="panel-title-icon"><DocumentIcon size={24} /></span>
          <h2 className="panel-title">MES PUBLICATIONS</h2>
        </div>
        <button className="btn-new-article" onClick={handleCreate}>
          + Nouvel article
        </button>
      </div>

      <div className="author-search">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un article par titre, catégorie, statut..."
        />
      </div>

      <div className="publications-table-container">
        <table className="publications-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Dernière modif</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-cell">Chargement...</td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">Aucune publication trouvée</td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const status = STATUS_META[item.status] || STATUS_META.draft

                return (
                  <tr key={item.id}>
                    <td className="article-title-cell" style={{ fontWeight: 600 }}>{item.title}</td>
                    <td className="article-category-cell" style={{ color: 'var(--text-muted)' }}>
                      {item.categoryName || '—'}
                    </td>
                    <td className="article-date-cell">{formatDate(item.updatedAt)}</td>
                    <td>
                      <span className={`status-badge ${status.className}`}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-wrapper">
                        <button className="btn-action-mock btn-action-pencil" onClick={() => handleEdit(item)} title="Modifier">
                          <PencilIcon size={16} />
                        </button>
                        <button className="btn-action-mock btn-action-trash" onClick={() => handleDelete(item.id)} title="Supprimer">
                          <TrashIcon size={16} />
                        </button>
                        <button className="btn-action-mock btn-action-eye" onClick={() => setPreviewItem(item)} title="Voir">
                          <EyeIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d'édition/création */}
      <ArticleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={editing}
      />

      {/* Modal de prévisualisation lecture seule */}
      {previewItem && (
        <div className="modal-overlay" onClick={() => setPreviewItem(null)}>
          <div className="modal-content" style={{ maxWidth: 650, maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {previewItem.categoryName && (
                  <span className="article-card-badge" style={{ alignSelf: 'flex-start', marginBottom: 4 }}>
                    {previewItem.categoryName}
                  </span>
                )}
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{previewItem.title}</h3>
              </div>
              <button className="modal-close" onClick={() => setPreviewItem(null)}>✕</button>
            </div>
            <div style={{ padding: '0 0 20px 0', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {previewItem.imageUrl && (
                <div style={{ width: '100%', height: 220, borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                  <img src={previewItem.imageUrl} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              {previewItem.excerpt && (
                <p style={{ fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: 12, marginBottom: 12 }}>
                  {previewItem.excerpt}
                </p>
              )}
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>
                {previewItem.content || 'Aucun contenu.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthorPublications
