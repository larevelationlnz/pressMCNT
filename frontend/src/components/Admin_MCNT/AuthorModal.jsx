import { useState, useEffect } from 'react';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const AuthorModal = ({ isOpen, onClose, onSubmit, author }) => {
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    profession: '',
    cniNumber: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (author) {
        setForm({
          lastName: author.lastName || '',
          firstName: author.firstName || '',
          profession: author.profession || '',
          cniNumber: author.cniNumber || '',
          email: author.email || '',
          password: author.password || '',
        });
      } else {
        setForm({ lastName: '', firstName: '', profession: '', cniNumber: '', email: '', password: '' });
      }
      setErrors({});
      setShowPassword(false);
      setSubmitting(false);
    }
  }, [author, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.lastName.trim()) newErrors.lastName = 'Le nom est requis.';
    if (!form.firstName.trim()) newErrors.firstName = 'Le prénom est requis.';
    if (!form.profession.trim()) newErrors.profession = 'La profession est requise.';
    if (!form.cniNumber.trim()) newErrors.cniNumber = 'Le numéro CNI est requis.';
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format d'email invalide.";
    }
    if (!author && !form.password.trim()) {
      newErrors.password = 'Le mot de passe est requis.';
    } else if (!author && form.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères.';
    }
    return newErrors;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        lastName: form.lastName.trim(),
        firstName: form.firstName.trim(),
        profession: form.profession.trim(),
        cniNumber: form.cniNumber.trim(),
        email: form.email.trim(),
      };
      if (form.password.trim()) {
        payload.password = form.password.trim();
      }
      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setErrors(prev => ({ ...prev, api: err.message }));
      setSubmitting(false);
    }
  };

  const fields = [
    { id: 'lastName', label: 'Nom', placeholder: 'Ex: Durand', type: 'text' },
    { id: 'firstName', label: 'Prénom', placeholder: 'Ex: Albert', type: 'text' },
    { id: 'profession', label: 'Profession', placeholder: 'Ex: Écrivain', type: 'text' },
    { id: 'cniNumber', label: 'Numéro CNI', placeholder: 'Ex: 109283746', type: 'text' },
    { id: 'email', label: 'Email', placeholder: 'Ex: a.durand@email.com', type: 'email' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true"
      aria-labelledby="author-modal-title">
      <div className="modal-content" style={{ maxWidth: '560px', width: '95%' }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'hsl(215, 60%, 25%)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px'
            }}>👤</span>
            <h3 id="author-modal-title" style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
              {author ? "Modifier l'auteur" : "Créer un auteur"}
            </h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fermer la fenêtre">
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            {fields.slice(0, 4).map(({ id, label, placeholder, type }) => (
              <div key={id} className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor={`author-${id}`}>{label}</label>
                <input
                  id={`author-${id}`}
                  type={type}
                  className={`form-input${errors[id] ? ' input-error' : ''}`}
                  value={form[id]}
                  onChange={handleChange(id)}
                  placeholder={placeholder}
                  style={errors[id] ? { borderColor: 'var(--accent-red)' } : {}}
                />
                {errors[id] && (
                  <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem', marginTop: '2px' }}>
                    {errors[id]}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Email - full width */}
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label htmlFor="author-email">Email</label>
            <input
              id="author-email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="Ex: a.durand@email.com"
              style={errors.email ? { borderColor: 'var(--accent-red)' } : {}}
            />
            {errors.email && (
              <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>{errors.email}</span>
            )}
          </div>

          {/* Password with toggle */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="author-password">
              Mot de passe {author && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(laisser vide pour conserver)</span>}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="author-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                style={{
                  paddingRight: '44px',
                  ...(errors.password ? { borderColor: 'var(--accent-red)' } : {})
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', padding: '4px'
                }}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>{errors.password}</span>
            )}
          </div>

          {errors.api && (
            <div style={{
              padding: '10px 12px',
              background: 'hsl(350, 80%, 96%)',
              border: '1px solid hsl(350, 80%, 88%)',
              color: 'hsl(350, 80%, 35%)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '16px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ⚠️ {errors.api}
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-submit" disabled={submitting}>
              {author ? '💾 Enregistrer' : '✚ Créer l\'auteur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorModal;
