import { useState, useEffect } from 'react'
import { getSession, saveSession, clearSession, api } from './utils/api'
import LoginPage         from './components/Login/LoginPage'
import AdminLayout       from './components/Admin_MCNT/AdminLayout'
import AuthorDashboard   from './components/Auteur_MCNT/AuthorDashboard'
import PublicInterface   from './components/Public/PublicInterface'
import './App.css'
import './index.css'

function App() {
  // 'login' | 'admin' | 'author' | 'public'
  const [view,    setView]    = useState('login')
  const [session, setSession] = useState(null)   // { token, user: { id, email, role, … } }
  const [loading, setLoading] = useState(true)   // vérifie session au démarrage

  // ── Restaurer la session depuis localStorage au montage ──────
  useEffect(() => {
    const saved = getSession()
    if (saved) {
      setSession(saved)
      setView(saved.user.role === 'admin' ? 'admin' : 'author')
    }
    setLoading(false)
  }, [])

  // ── Login ────────────────────────────────────────────────────
  const handleLogin = async (email, password) => {
    const data = await api.post('/auth/login', { email, password })
    // data = { token, user: { id, email, role, firstName, lastName } }
    saveSession(data.token, data.user)
    setSession({ token: data.token, user: data.user })
    setView(data.user.role === 'admin' ? 'admin' : 'author')
  }

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = () => {
    clearSession()
    setSession(null)
    setView('login')
  }

  if (loading) return null   // évite le flash de la page login

  return (
    <>
      {view === 'login'  && (
        <LoginPage
          onLogin={handleLogin}
          onPublic={() => setView('public')}
        />
      )}
      {view === 'admin'  && (
        <AdminLayout
          user={session?.user}
          onLogout={handleLogout}
        />
      )}
      {view === 'author' && (
        <AuthorDashboard
          user={session?.user}
          onLogout={handleLogout}
        />
      )}
      {view === 'public' && (
        <PublicInterface
          onLogin={() => setView('login')}
        />
      )}
    </>
  )
}
export default App
