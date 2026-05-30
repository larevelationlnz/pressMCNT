import { useState } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = ({ onLogin }) => {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onLogin(email.trim(), password.trim())
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Section gauche — bleue (logo + slogan) */}
      <div className="left-section">
        <div className="left-content">
          <h1 className="facebook-logo">Presse MCNT</h1>
          <p className="explore-text">
            Plateforme d'édition d'articles sur les maladies chroniques non transmissibles.
          </p>
        </div>
      </div>

      {/* Section droite — formulaire */}
      <div className="right-section">
        <div className="right-content">
          <h2>Se connecter à Presse MCNT</h2>

          {error && (
            <div style={{ background:'#fff0f0', border:'1px solid #ffb3b3',
                          color:'#c00', borderRadius:8, padding:'10px 14px',
                          marginBottom:16, fontSize:'0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="email" placeholder="E-mail"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Mot de passe"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <div className="links">
            <Link to="/"
              style={{ color:'#1877f2', fontSize:15, textDecoration:'underline', display:'inline-block', marginTop:'10px' }}>
              Voir les articles publiés →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
