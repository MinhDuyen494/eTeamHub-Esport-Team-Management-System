import { AuthProvider } from './Context/AuthContext.tsx'
import './App.css'
import Auth from './pages/Auth/auth.tsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import AppLayout from './components/Layout'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'
import { SettingsProvider } from './Context/SettingsContext'
import EventPage from './pages/Events/EventPage'
import { EventProvider } from './Context/EventContext'
import PlayersPage from './pages/PlayersPage.tsx'
import UsersPage from './pages/UsersPage.tsx'
import Register from './pages/Auth/Register.tsx'
import TeamsPage from './pages/teams/TeamsPage.tsx'
import CreatePlayerProfilePage from './pages/Players/CreatePlayerProfilePage.tsx'
function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Navigate to="/auth" replace />
            } />
            <Route path="/auth" element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            } />
            <Route path="/auth/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsProvider>
                    <Settings />
                  </SettingsProvider>
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <AppLayout>
                  <EventProvider>
                    <EventPage />
                  </EventProvider>
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/players" element={
              <ProtectedRoute>
                <AppLayout>
                  <PlayersPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/players/create" element={
              <ProtectedRoute>
                <AppLayout>
                  <CreatePlayerProfilePage />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <AppLayout>
                  <UsersPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <AppLayout>
                  <TeamsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
