import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../data/config';
import firebase from 'firebase/compat/app';

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await auth.signInWithPopup(provider);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignUp) {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                // Update profile with full name
                await userCredential.user.updateProfile({
                    displayName: fullName
                });
            } else {
                await auth.signInWithEmailAndPassword(email, password);
            }
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ maxWidth: '450px', width: '100%', background: 'var(--color-bg)', padding: '3rem 2.5rem', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(212, 163, 115, 0.2)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p style={{ color: 'var(--color-text-light)', fontSize: '1rem' }}>
                        {isSignUp ? 'Join The Ethnic Touch to enjoy personalized collections & boutique rewards.' : 'Sign in to access your curated collection, wishlist, and orders.'}
                    </p>
                </div>

                {error && (
                    <div style={{ background: '#FDF1F0', color: 'var(--color-error)', padding: '1rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(217, 83, 79, 0.2)' }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button 
                        onClick={() => { setIsSignUp(false); setError(''); }}
                        style={{ flex: 1, padding: '0.8rem', background: !isSignUp ? 'var(--color-primary)' : 'transparent', color: !isSignUp ? '#fff' : 'var(--color-text)', border: !isSignUp ? 'none' : '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: '500' }}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => { setIsSignUp(true); setError(''); }}
                        style={{ flex: 1, padding: '0.8rem', background: isSignUp ? 'var(--color-primary)' : 'transparent', color: isSignUp ? '#fff' : 'var(--color-text)', border: isSignUp ? 'none' : '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: '500' }}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {isSignUp && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Full Name</label>
                            <input 
                                type="text" 
                                required 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', outline: 'none', background: '#fff' }}
                                placeholder="Enter your full name"
                            />
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', outline: 'none', background: '#fff' }}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
                            {!isSignUp && <a href="#" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none' }}>Forgot password?</a>}
                        </div>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', outline: 'none', background: '#fff' }}
                            placeholder={isSignUp ? "Create a password (min. 6 characters)" : "Enter your password"}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>Or continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
                </div>

                <button 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    type="button"
                    style={{ width: '100%', padding: '0.9rem', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', transition: 'all 0.3s ease', fontWeight: '500', color: 'var(--color-text)' }}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                </button>
            </div>
        </div>
    );
};

export default Auth;
