import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Reverted to class property state initialization. The constructor-based
  // approach was causing type errors where `this.state` and `this.props` were
  // not being recognized. Class property initialization is a standard and widely-supported
  // feature in React class components that resolves these typing issues.
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'white', backgroundColor: '#1F2328', minHeight: '100vh' }}>
          <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong.</h1>
          <p className="text-gray-300 mb-2">There was an error in the application. Please check the console for details.</p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ff8a8a', backgroundColor: '#2d2d2d', padding: '1rem', borderRadius: '8px' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;