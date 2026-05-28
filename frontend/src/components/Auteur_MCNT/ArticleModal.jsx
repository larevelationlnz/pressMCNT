import { useEffect, useState } from 'react'
import { api } from '../../utils/api'

const ArticleModal = ({ isOpen, onClose, onSave, item }) => {
  const [form, setForm]     = useState({ title:'', content:'', excerpt:'', categoryId:'', status:'draft', imageUrl:'' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cats,   setCats]   = useState([])

  // Charger les catégories (sans auth)
  useEffect(() => {
    fetch('http://localhost:5000/api/publications/categories')
      .then(r => r.json()).then(setCats).catch(console.error)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    setErrors({})
    if (item) {
      setForm({ title: item.title||'', content: item.content||'',
                excerpt: item.excerpt||'', categoryId: item.categoryId||'',
                status: item.status||'draft', imageUrl: item.imageUrl||'' })
    } else {
      setForm({ title:'', content:'', excerpt:'', categoryId:'', status:'draft', imageUrl:'' })
    }
  }, [isOpen, item])

  if (!isOpen) return null

  const validate = () => {
    const e = {}
    if (!form.title.trim() || form.title.trim().length < 3)
      e.title = 'Le titre doit faire au moins 3 caractères.'
    if (!form.content.trim())
      e.content = 'Le contenu est requis.'
    return e
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setErrors(p => ({ ...p, image: '' }))
    try {
      const data = await api.upload('/publications/upload', file)
      setForm(p => ({ ...p, imageUrl: data.imageUrl }))
    } catch (err) {
      setErrors(p => ({ ...p, image: err.message || "Erreur d'upload." }))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (uploading) return
    const v = validate()
    if (Object.keys(v).length) { setErrors(v); return }
    setSaving(true)
    try {
      await onSave({
        title:      form.title.trim(),
        content:    form.content.trim(),
        excerpt:    form.excerpt.trim(),
        categoryId: form.categoryId || null,
        status:     form.status,
        imageUrl:   form.imageUrl || null,
      })
      onClose()
    } catch (err) {
      setErrors({ api: err.message })
    } finally { setSaving(false) }
  }

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]:'' }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth:600 }} onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h3 id="article-modal-title" style={{ margin:0, fontSize:'1.1rem', fontWeight:700 }}>
            {item ? 'Modifier l\'article' : 'Nouvel article'}
          </h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Titre */}
          <div className="form-group">
            <label htmlFor="art-title">Titre *</label>
            <input id="art-title" type="text" className="form-input"
              value={form.title} onChange={set('title')} placeholder="Titre de l'article"
              style={errors.title ? { borderColor:'var(--accent-red)' } : {}} />
            {errors.title && <span style={{ color:'var(--accent-red)', fontSize:'0.8rem' }}>{errors.title}</span>}
          </div>

          {/* Catégorie + Statut côte à côte */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div className="form-group">
              <label htmlFor="art-cat">Catégorie</label>
              <select id="art-cat" className="form-input" value={form.categoryId} onChange={set('categoryId')}>
                <option value="">— Aucune —</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="art-status">Statut</label>
              <select id="art-status" className="form-input" value={form.status} onChange={set('status')}>
                <option value="draft">Brouillon</option>
                <option value="pending">En attente</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>

          {/* Image de l'article */}
          <div className="form-group">
            <label>Image de l'article</label>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 6, marginBottom: 6 }}>
              {form.imageUrl ? (
                <div style={{ position: 'relative', width: 120, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-main)' }}>
                  <img src={form.imageUrl} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" 
                    onClick={() => setForm(p => ({ ...p, imageUrl: '' }))}
                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 22, height: 22, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                    ✕
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 120, height: 80, border: '2px dashed var(--border-color)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem', background: 'var(--bg-card)', transition: 'border-color 0.2s', margin: 0 }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: 2 }}>📷</span>
                  <span>{uploading ? 'Upload…' : 'Choisir'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading || saving} />
                </label>
              )}
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  JPG, PNG ou WEBP conseillés. Taille max : 5 Mo.
                </p>
                {errors.image && (
                  <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem', display: 'block', marginTop: 4 }}>
                    ⚠️ {errors.image}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Résumé */}
          <div className="form-group">
            <label htmlFor="art-excerpt">Résumé (affiché dans la liste publique)</label>
            <textarea id="art-excerpt" className="form-input"
              value={form.excerpt} onChange={set('excerpt')}
              placeholder="Courte description de l'article…" rows={2}
              style={{ resize:'vertical' }} />
          </div>

          {/* Contenu */}
          <div className="form-group">
            <label htmlFor="art-content">Contenu *</label>
            <textarea id="art-content" className="form-input"
              value={form.content} onChange={set('content')}
              placeholder="Corps complet de l'article…" rows={6}
              style={{ resize:'vertical', ...(errors.content ? { borderColor:'var(--accent-red)' } : {}) }} />
            {errors.content && <span style={{ color:'var(--accent-red)', fontSize:'0.8rem' }}>{errors.content}</span>}
          </div>

          {errors.api && (
            <div style={{ background:'hsl(350,80%,96%)', border:'1px solid hsl(350,80%,88%)',
              color:'hsl(350,80%,35%)', borderRadius:'var(--radius-sm)',
              padding:'10px 12px', fontSize:'0.85rem', marginBottom:12 }}>
              ⚠️ {errors.api}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-submit" disabled={saving}>
              {saving ? 'Enregistrement…' : (item ? '💾 Enregistrer' : '✚ Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ArticleModal
