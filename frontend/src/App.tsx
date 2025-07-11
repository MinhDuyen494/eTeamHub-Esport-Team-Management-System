import { AuthProvider } from './Context/AuthContext.tsx'
import './App.css'
import Auth from './pages/Auth/auth.tsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'

const Dashboard = () => <div style={{padding: 32, textAlign: 'center'}}><h2>Dashboard</h2><p>Chào mừng bạn đã đăng nhập!</p></div>;

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
