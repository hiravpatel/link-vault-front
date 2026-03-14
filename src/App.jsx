import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!token) return <Navigate to="/login" replace />;
  if (!user?.profile_setup_done) return <Navigate to="/profile-setup" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { token, user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-dark-800 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (token && user?.profile_setup_done) return <Navigate to="/dashboard" replace />;
  if (token && !user?.profile_setup_done) return <Navigate to="/profile-setup" replace />;
  return children;
}

function ProfileSetupRoute({ children }) {
  const { token, user, loading } = useAuth();
  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  if (user?.profile_setup_done) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/profile-setup" element={<ProfileSetupRoute><ProfileSetup /></ProfileSetupRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
