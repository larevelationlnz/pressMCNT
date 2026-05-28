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

const API = 'http://localhost:5000/api/publications'

const STATUS_META = {
  published: {
    label: 'Publie',
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
  return new Date(value).toISOString().slice(0, 10)
}

const AuthorPublications = ({ user }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}?authorId=${user.id}`)
      if (!res.ok) throw new Error('Erreur chargement')
      const data = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
      alert('Erreur lors du chargement des publications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchItems()
  }, [user])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items

    return items.filter((item) => {
      const statusLabel = STATUS_META[item.status]?.label || item.status
      return [item.title, item.status, statusLabel, formatDate(item.updatedAt)]
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
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erreur suppression')
      setItems(items.filter((item) => item.id !== id))
    } catch (err) {
      console.error(err)
      alert('Impossible de supprimer')
    }
  }

  const handleSave = async (payload) => {
    try {
      if (editing) {
        const res = await fetch(`${API}/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Erreur modification')
        const updated = await res.json()
        setItems(items.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const res = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, authorId: user.id })
        })
        if (!res.ok) throw new Error('Erreur creation')
        const created = await res.json()
        setItems([created, ...items])
      }
      setModalOpen(false)
    } catch (err) {
      console.error(err)
      alert('Erreur sauvegarde')
    }
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
          placeholder="Rechercher un article par titre, statut ou date..."
        />
      </div>

      <div className="publications-table-container">
        <table className="publications-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Derniere modif</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="empty-cell">Chargement...</td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-cell">Aucune publication trouvee</td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const status = STATUS_META[item.status] || STATUS_META.draft

                return (
                  <tr key={item.id}>
                    <td className="article-title-cell">{item.title}</td>
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
                        <button className="btn-action-mock btn-action-eye" title="Voir">
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

      <ArticleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={editing}
      />
    </div>
  )
}

export default AuthorPublications
