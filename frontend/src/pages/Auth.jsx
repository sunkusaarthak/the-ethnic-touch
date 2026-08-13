import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../data/config';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect') || location.state?.from || '/';

    // Interactive Handcrafted Silk Textile & Gemini-style Shimmer Waves Canvas Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width = (canvas.width = container.offsetWidth);
        let height = (canvas.height = container.offsetHeight);

        const handleResize = () => {
            if (!canvas || !container) return;
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
        };

        window.addEventListener('resize', handleResize);

        // Interactive Mouse Position for Liquid Fabric Ripples
        let mouse = { x: width * 0.4, y: height * 0.5, targetX: width * 0.4, targetY: height * 0.5 };

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Handcrafted Floating Gold & Terracotta Yarn Thread Fibers
        const threads = Array.from({ length: 32 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            length: 25 + Math.random() * 45,
            speed: 0.25 + Math.random() * 0.45,
            amplitude: 2 + Math.random() * 3.5,
            size: 0.8 + Math.random() * 1.4,
            color: [
                'rgba(212, 163, 115, 0.65)', 
                'rgba(143, 94, 54, 0.5)', 
                'rgba(244, 211, 146, 0.75)', 
                'rgba(255, 229, 217, 0.85)'
            ][Math.floor(Math.random() * 4)]
        }));

        let step = 0;

        const render = () => {
            step += 0.012;
            
            // Smooth mouse interpolation
            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            ctx.clearRect(0, 0, width, height);

            // 1. Draw Liquid Fabric Silk Gradient Waves (Gemini Shimmer Effect)
            const waveCount = 5;
            for (let i = 0; i < waveCount; i++) {
                ctx.beginPath();
                const grad = ctx.createLinearGradient(0, 0, width, height);
                if (i % 3 === 0) {
                    grad.addColorStop(0, 'rgba(212, 163, 115, 0.22)');
                    grad.addColorStop(0.5, 'rgba(255, 229, 217, 0.38)');
                    grad.addColorStop(1, 'rgba(143, 94, 54, 0.18)');
                } else if (i % 3 === 1) {
                    grad.addColorStop(0, 'rgba(244, 211, 146, 0.25)');
                    grad.addColorStop(0.5, 'rgba(212, 163, 115, 0.32)');
                    grad.addColorStop(1, 'rgba(255, 248, 240, 0.22)');
                } else {
                    grad.addColorStop(0, 'rgba(143, 94, 54, 0.15)');
                    grad.addColorStop(0.5, 'rgba(212, 163, 115, 0.28)');
                    grad.addColorStop(1, 'rgba(255, 229, 217, 0.25)');
                }

                ctx.fillStyle = grad;

                ctx.moveTo(0, height);
                for (let x = 0; x <= width + 20; x += 15) {
                    // Calculate interactive cursor deflection
                    const dx = x - mouse.x;
                    const dist = Math.abs(dx);
                    const mouseDeflect = Math.max(0, 1 - dist / 320) * 40;

                    const y = Math.sin(x * 0.0028 + step + i * 0.75) * (35 + i * 12) +
                              Math.cos(x * 0.0055 - step * 0.4) * 18 +
                              (height * 0.48) + (i * 38 - 80) -
                              (Math.sin((x + mouse.x) * 0.0018) * mouseDeflect);

                    ctx.lineTo(x, y);
                }
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();
                ctx.fill();
            }

            // 2. Draw Floating Handcrafted Textile Fibers & Yarn Threads
            threads.forEach(t => {
                t.y -= t.speed;
                t.x += Math.sin(step + t.y * 0.01) * 0.4;

                if (t.y < -60) {
                    t.y = height + 60;
                    t.x = Math.random() * width;
                }

                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = t.color;
                ctx.lineWidth = t.size;
                ctx.lineCap = 'round';

                // Curved thread wave line
                ctx.moveTo(t.x, t.y);
                const cpX = t.x + Math.sin(step * 2 + t.y * 0.02) * t.amplitude;
                const cpY = t.y - t.length * 0.5;
                const endX = t.x + Math.cos(step + t.y * 0.01) * (t.amplitude * 0.8);
                const endY = t.y - t.length;

                ctx.quadraticCurveTo(cpX, cpY, endX, endY);
                ctx.stroke();

                // Small thread knot dot
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.size * 0.8, 0, Math.PI * 2);
                ctx.fillStyle = t.color;
                ctx.fill();

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate(redirectPath);
        } catch (err) {
            console.error('[AUTH ERROR] Google Sign-In failed:', err);
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
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (userCredential.user) {
                    await updateProfile(userCredential.user, {
                        displayName: fullName
                    });
                }
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate(redirectPath);
        } catch (err) {
            console.error('[AUTH ERROR] Email Authentication failed:', err);
            setError(err.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            ref={containerRef}
            style={{
                position: 'relative',
                minHeight: 'calc(100vh - 75px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1.5rem',
                background: 'linear-gradient(135deg, #FCFBFA 0%, #F5EFE8 100%)',
                overflow: 'hidden'
            }}
        >
            {/* Interactive Handcrafted Silk Textile & Gemini Shimmer Canvas Animation */}
            <canvas 
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    pointerEvents: 'none'
                }}
            />

            {/* Responsive Flexbox Container: Brand Hero Text + Right-Aligned Login Card */}
            <div 
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '1100px',
                    margin: '0 auto',
                    gap: '2.5rem',
                    zIndex: 2,
                    position: 'relative'
                }}
            >
                {/* Ambient Jaipur Craftsmanship Story Showcase (Seamless Typography Flow) */}
                <div 
                    className="auth-background-artwork" 
                    style={{
                        flex: '1 1 420px',
                        maxWidth: '460px'
                    }}
                >
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8F5E36', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8F5E36" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        ROYAL JAIPUR CRAFTSMANSHIP
                    </span>
                    
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.1rem', fontWeight: '400', color: '#2D2A26', marginBottom: '0.7rem', lineHeight: '1.25' }}>
                        Handcrafted Ethnic Elegance
                    </h2>

                    <p style={{ color: '#5C5853', fontSize: '0.88rem', lineHeight: '1.65', marginBottom: '1.4rem', fontWeight: '400' }}>
                        Every Kurthi in our wardrobe is slow-crafted from pure Jaipur cotton, natural mineral dyes, and hand-embroidered motifs by master weavers.
                    </p>

                    {/* Floating Jaipur Artisanal Banner */}
                    <div style={{
                        position: 'relative',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        height: '160px',
                        marginBottom: '1.3rem',
                        boxShadow: '0 12px 30px rgba(212, 163, 115, 0.18)',
                        border: '1.5px solid rgba(212, 163, 115, 0.3)'
                    }}>
                        <img 
                            src="./images/login_art.png" 
                            alt="Jaipur Handcrafted Block-Print Artwork" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(45,42,38,0.35) 100%)' }} />
                    </div>

                    {/* Floating Badges Row with Premium Vector Icons */}
                    <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                        <span className="auth-showcase-badge-1" style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#8F5E36', padding: '5px 12px', borderRadius: '50px', fontWeight: '600', border: '1px solid rgba(212, 163, 115, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v20M17 5H7M19 19H5M9 9h6M8 14h8"></path>
                            </svg>
                            100% Handcrafted
                        </span>
                        <span className="auth-showcase-badge-2" style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#8F5E36', padding: '5px 12px', borderRadius: '50px', fontWeight: '600', border: '1px solid rgba(212, 163, 115, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"></path>
                            </svg>
                            Pure Mineral Dyes
                        </span>
                        <span className="auth-showcase-badge-3" style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', color: '#8F5E36', padding: '5px 12px', borderRadius: '50px', fontWeight: '600', border: '1px solid rgba(212, 163, 115, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
                            </svg>
                            Bespoke Cuts
                        </span>
                    </div>
                </div>

                {/* Elevated Login Card (Right-Aligned in Flex Container) */}
                <div 
                    className="auth-card-wrapper"
                    style={{
                        position: 'relative',
                        zIndex: 3,
                        maxWidth: '380px',
                        width: '100%',
                        flexShrink: 0
                    }} 
                >
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.72)',
                        backdropFilter: 'blur(22px)',
                        WebkitBackdropFilter: 'blur(22px)',
                        padding: '2.2rem 2rem',
                        borderRadius: '24px',
                        boxShadow: '0 16px 45px rgba(212, 163, 115, 0.14)',
                        border: '1.5px solid rgba(212, 163, 115, 0.35)'
                    }}>
                        {/* Clean Static Header */}
                        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                            <h1 className="section-title" style={{ color: 'var(--color-text)', marginBottom: '0.3rem', fontWeight: '500' }}>
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </h1>
                            
                            <p style={{ color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)', lineHeight: '1.4', margin: '0 auto', maxWidth: '300px' }}>
                                {isSignUp ? 'Join The Ethnic Touch to enjoy personalized royal rewards.' : 'Sign in to access your handcrafted Jaipur collection, wishlist, & orders.'}
                            </p>
                        </div>

                        {redirectPath.includes('checkout') && (
                            <div style={{
                                background: '#FAF7F2',
                                border: '1px solid rgba(212, 163, 115, 0.4)',
                                color: '#8F5E36',
                                padding: '0.65rem 0.85rem',
                                borderRadius: '12px',
                                marginBottom: '1rem',
                                fontSize: 'var(--font-size-xs)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.55rem',
                                fontWeight: '500',
                                lineHeight: '1.35'
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8F5E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <span>Please <strong>Sign In</strong> or <strong>Register</strong> to place your order. You will return to checkout automatically!</span>
                            </div>
                        )}

                        {error && (
                            <div style={{ background: '#FDF1F0', color: 'var(--color-error)', padding: '0.55rem', borderRadius: '10px', marginBottom: '1rem', fontSize: 'var(--font-size-sm)', textAlign: 'center', border: '1px solid rgba(217, 83, 79, 0.2)' }}>
                                {error}
                            </div>
                        )}

                        {/* Sign In / Register Pill Switcher */}
                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.1rem', background: '#FAF9F8', padding: '4px', borderRadius: '50px', border: '1px solid rgba(212, 163, 115, 0.25)' }}>
                            <button 
                                onClick={() => { setIsSignUp(false); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.42rem',
                                    background: !isSignUp ? 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)' : 'transparent',
                                    color: !isSignUp ? '#fff' : '#6C6863',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: '600',
                                    fontSize: 'var(--font-size-sm)',
                                    boxShadow: !isSignUp ? '0 4px 12px rgba(212, 163, 115, 0.25)' : 'none'
                                }}
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => { setIsSignUp(true); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.42rem',
                                    background: isSignUp ? 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)' : 'transparent',
                                    color: isSignUp ? '#fff' : '#6C6863',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    fontWeight: '600',
                                    fontSize: 'var(--font-size-sm)',
                                    boxShadow: isSignUp ? '0 4px 12px rgba(212, 163, 115, 0.25)' : 'none'
                                }}
                            >
                                Register
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {isSignUp && (
                                <div>
                                    <label className="form-label">Full Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="form-control"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="form-label">Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                                    {!isSignUp && <a href="#" style={{ fontSize: 'var(--font-size-xs)', color: '#8F5E36', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</a>}
                                </div>
                                <input 
                                    type="password" 
                                    required 
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={isSignUp ? "Create password (min. 6 chars)" : "Enter your password"}
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn btn-primary" 
                                style={{
                                    width: '100%',
                                    padding: '0',
                                    marginTop: '0.35rem',
                                    fontSize: '0.85rem',
                                    height: '38px',
                                    borderRadius: '50px',
                                    opacity: loading ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)',
                                    border: 'none',
                                    color: '#FFF',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 15px rgba(212, 163, 115, 0.25)'
                                }}
                            >
                                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </button>
                        </form>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', gap: '0.6rem' }}>
                            <div style={{ flex: 1, height: '1px', background: '#EAE6E1' }}></div>
                            <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or continue with</span>
                            <div style={{ flex: 1, height: '1px', background: '#EAE6E1' }}></div>
                        </div>

                        <button 
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            type="button"
                            style={{
                                width: '100%',
                                height: '38px',
                                padding: '0',
                                background: '#fff',
                                border: '1px solid rgba(212, 163, 115, 0.35)',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s ease',
                                fontWeight: '500',
                                fontSize: '0.82rem',
                                color: '#333'
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Google
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Auth;
