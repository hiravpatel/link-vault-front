import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './shared/context/AuthContext';

// Feature Pages
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ProfileSetup from './features/profile/pages/ProfileSetup';
import Dashboard from './pages/Dashboard';

/**
 * Protected Route wrapper
 */
const ProtectedRoute = ({ children, requireProfile = true }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen bg-dark-800" />;
  if (!user) return <Navigate to="/login" />;
  
  if (requireProfile && !user.profile_setup_done) {
    return <Navigate to="/profile-setup" />;
  }
  
  return children;
};

/**
 * Auth Route wrapper (redirect away from login/register if already logged in)
 */
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'glass text-dark-50 border border-white/10',
            duration: 4000,
            style: {
              background: 'rgba(30, 30, 50, 0.8)',
              backdropFilter: 'blur(10px)',
              color: '#f8fafc',
            }
          }}
        />
        <Routes>
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          
          <Route path="/profile-setup" element={
            <ProtectedRoute requireProfile={false}>
              <ProfileSetup />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

