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
        console.error("[ErrorBoundary] Caught UI runtime exception:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '70vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                    color: '#333'
                }}>
                    <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#B97A66' }}>
                        Something went wrong
                    </h2>
                    <p style={{ maxWidth: '500px', marginBottom: '1.5rem', color: '#666', lineHeight: '1.6' }}>
                        An unexpected error occurred while loading this page. Please try refreshing or return to the storefront.
                    </p>
                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '0.75rem 1.75rem',
                            backgroundColor: '#B97A66',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '500'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
