import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-1">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-light-1 mb-4">Something went wrong</h2>
            <p className="text-dark-3 mb-6 max-w-md">
              There was an error loading the page. This might be due to a database schema issue.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-1 text-light-1 px-6 py-3 rounded-full hover:bg-purple-2 transition-colors"
              >
                Reload Page
              </button>
              <div className="text-sm text-dark-4">
                If the problem persists, please contact the admin to fix the backend.
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
