import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { getSession, saveSession, clearSession, api } from './utils/api'
import LoginPage         from './components/Login/LoginPage'
import AdminLayout       from './components/Admin_MCNT/AdminLayout'
import AuthorDashboard   from './components/Auteur_MCNT/AuthorDashboard'
import PublicInterface   from './components/Public/PublicInterface'
import './App.css'
import './index.css'

function App() {
  const [session, setSession] = useState(null)   // { token, user: { id, email, role, … } }
  const [loading, setLoading] = useState(true)   // vérifie session au démarrage
  const navigate = useNavigate()

  // ── Restaurer la session depuis localStorage au montage ──────
  useEffect(() => {
    const saved = getSession()
    if (saved) {
      setSession(saved)
    }
    setLoading(false)
  }, [])

  // ── Login ────────────────────────────────────────────────────
  const handleLogin = async (email, password) => {
    const data = await api.post('/auth/login', { email, password })
    // data = { token, user: { id, email, role, firstName, lastName } }
    saveSession(data.token, data.user)
    setSession({ token: data.token, user: data.user })
    if (data.user.role === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/auteur/publications')
    }
  }

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = () => {
    clearSession()
    setSession(null)
    navigate('/login')
  }

  if (loading) return null   // évite le flash de la page login

  return (
    <Routes>
      <Route path="/" element={<PublicInterface />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} onPublic={() => navigate('/')} />} />
      <Route path="/admin/*" element={
        session?.user?.role === 'admin' ? 
          <AdminLayout user={session?.user} onLogout={handleLogout} /> : 
          <Navigate to="/login" replace />
      } />
      <Route path="/auteur/*" element={
        session?.user?.role === 'author' ? 
          <AuthorDashboard user={session?.user} onLogout={handleLogout} /> : 
          <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
export default App
