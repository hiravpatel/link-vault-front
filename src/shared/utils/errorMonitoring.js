import { logger } from './logger';

function normalizeError(errorLike) {
  if (errorLike instanceof Error) return errorLike;
  return new Error(typeof errorLike === 'string' ? errorLike : 'Unexpected application error');
}

export function reportError(errorLike, context = {}) {
  const error = normalizeError(errorLike);

  logger.error('ui.error', {
    message: error.message,
    stack: error.stack,
    ...context,
  });
}

export function setupGlobalErrorMonitoring() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    reportError(event.error || event.message, { source: 'window.error' });
  });

  window.addEventListener('unhandledrejection', (event) => {
    reportError(event.reason, { source: 'window.unhandledrejection' });
  });
}
