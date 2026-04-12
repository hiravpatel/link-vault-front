import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './shared/context/AuthContext';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import ProfileSetup from './features/profile/pages/ProfileSetup';
import Security from './features/account/pages/Security';
import Dashboard from './pages/Dashboard';
import NotFound from './shared/pages/NotFound';

const FullScreenLoader = () => (
  <div className="min-h-screen bg-dark-800 text-dark-50 flex items-center justify-center">
    <div className="glass rounded-2xl px-5 py-4 border border-white/10 text-sm font-medium text-dark-200">
      Loading your vault...
    </div>
  </div>
);

const ProtectedRoute = ({ children, requireProfile = true }) => {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireProfile && !user.profile_setup_done) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (user) {
    return <Navigate to={user.profile_setup_done ? '/dashboard' : '/profile-setup'} replace />;
  }

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
            },
          }}
        />
        <Routes>
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
          <Route path="/reset-password" element={<AuthRoute><ResetPassword /></AuthRoute>} />

          <Route
            path="/profile-setup"
            element={(
              <ProtectedRoute requireProfile={false}>
                <ProfileSetup />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/security"
            element={(
              <ProtectedRoute>
                <Security />
              </ProtectedRoute>
            )}
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
