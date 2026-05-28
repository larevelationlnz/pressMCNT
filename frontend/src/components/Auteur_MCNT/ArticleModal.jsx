import { useEffect, useState } from 'react'

const ArticleModal = ({ isOpen, onClose, onSave, item }) => {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('draft')

  useEffect(() => {
    if (item) {
      setTitle(item.title || '')
      setStatus(item.status || 'draft')
    } else {
      setTitle('')
      setStatus('draft')
    }
  }, [item, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ title, status })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 16, borderRadius: 8, width: 480 }}>
        <h3>{item ? 'Modifier l\'article' : 'Nouvel article'}</h3>
        <div style={{ marginBottom: 8 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" style={{ width: '100%' }} required />
        </div>
        <div style={{ marginBottom: 8 }}>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="pending">En attente</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" onClick={onClose}>Annuler</button>
          <button type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  )
}

export default ArticleModal
