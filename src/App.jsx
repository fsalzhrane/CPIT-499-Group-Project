import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Lawyers from './pages/Lawyers'
import Services from './pages/Services'
import About from './pages/About'
import Register from './pages/Register'
import Login from './pages/Login'
import ChatAI from './pages/ChatAI'
import Layout from './components/Layout'
import LawyerDashboard from './pages/LawyerDashboard'
import ClientDashboard from './pages/ClientDashboard'
import AdminPanel from './pages/AdminPanel'
import { useAuth } from './context/AuthContext'

function App() {
  const { userProfile } = useAuth()
  const isLawyer = userProfile?.user_type === 'lawyer'
  const isClient = userProfile?.user_type === 'client'
  const isAdmin = userProfile?.user_type === 'admin'
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="lawyers" element={isLawyer ? <LawyerDashboard /> : <Lawyers />} />
        <Route path="dashboard" element={isClient ? <ClientDashboard /> : <Home />} />
        <Route path="services" element={<Services />} />
        <Route path="chat-ai" element={<ChatAI />} />
        <Route path="about" element={<About />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        {isAdmin && <Route path="admin" element={<AdminPanel />} />}
      </Route>
    </Routes>
  )
}

export default App