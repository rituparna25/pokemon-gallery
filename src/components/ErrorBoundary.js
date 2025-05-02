import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h1>Something went wrong</h1>
            <p>We're sorry, but there was a problem loading this page.</p>
            <div className="error-details">
              <p>{this.state.error && this.state.error.toString()}</p>
              <button 
                className="reload-button"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
              <button 
                className="home-button"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </button>
            </div>
            
            {this.props.showDetails && this.state.errorInfo && (
              <details className="error-stack">
                <summary>Error Details</summary>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;