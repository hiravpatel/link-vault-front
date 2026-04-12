import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-800 text-dark-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full glass rounded-[2rem] p-8 border border-white/10 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-5">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-sm text-dark-300 leading-relaxed mb-6">
          The page you requested does not exist or may have moved.
        </p>
        <Link to="/dashboard" className="btn-primary justify-center">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
