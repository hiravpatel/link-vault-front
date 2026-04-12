import React from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { reportError } from '../utils/errorMonitoring';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    reportError(error, {
      source: 'react.error_boundary',
      componentStack: info.componentStack,
    });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-dark-800 text-dark-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full glass rounded-[2rem] p-8 border border-white/10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-coral/10 text-accent-coral flex items-center justify-center mb-5">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-sm text-dark-300 leading-relaxed mb-6">
            We hit an unexpected error. Your saved data is safe, and you can try again from here.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary flex-1 justify-center"
            >
              <RefreshCcw className="w-4 h-4" />
              Reload App
            </button>
            <button
              type="button"
              onClick={() => window.location.assign('/dashboard')}
              className="btn-secondary flex-1 justify-center"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AppErrorBoundary;
