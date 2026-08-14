import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, API_BASE_URL } from '../data/config';
import { 
    RecaptchaVerifier, 
    signInWithPhoneNumber, 
    GoogleAuthProvider, 
    signInWithPopup 
} from 'firebase/auth';

const Auth = () => {
    const [step, setStep] = useState('phone'); // 'phone' | 'otp'
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [phoneAuthEnabled, setPhoneAuthEnabled] = useState(true);
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/config/auth`)
            .then(res => res.json())
            .then(data => {
                if (data && typeof data.phone_auth_enabled === 'boolean') {
                    setPhoneAuthEnabled(data.phone_auth_enabled);
                }
            })
            .catch(err => console.error('Failed to load auth config:', err));
    }, []);
    
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const recaptchaVerifierRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect') || location.state?.from || '/';

    // If user is already logged in, navigate directly to destination immediately
    useEffect(() => {
        if (auth && auth.currentUser) {
            navigate(redirectPath);
        }
    }, [navigate, redirectPath]);

    // Interactive Handcrafted Silk Textile & Gemini-style Shimmer Waves Canvas Animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let width, height;

        const resize = () => {
            if (!containerRef.current) return;
            width = canvas.width = containerRef.current.clientWidth;
            height = canvas.height = containerRef.current.clientHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        let stepTime = 0;

        const render = () => {
            stepTime += 0.008;
            ctx.clearRect(0, 0, width, height);

            const numLines = 14;
            for (let i = 0; i < numLines; i++) {
                ctx.beginPath();
                ctx.lineWidth = 1.2 + (i % 3) * 0.4;
                
                const alpha = 0.08 + Math.sin(stepTime * 1.5 + i * 0.4) * 0.04;
                ctx.strokeStyle = i % 2 === 0 
                    ? `rgba(212, 163, 115, ${alpha})` 
                    : `rgba(196, 147, 99, ${alpha * 0.8})`;

                const yOffset = (height / numLines) * i;
                ctx.moveTo(0, yOffset);

                for (let x = 0; x < width; x += 15) {
                    const wave1 = Math.sin(x * 0.004 + stepTime + i * 0.3) * 25;
                    const wave2 = Math.cos(x * 0.008 - stepTime * 0.8) * 15;
                    ctx.lineTo(x, yOffset + wave1 + wave2);
                }

                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    const initRecaptcha = () => {
        if (!recaptchaVerifierRef.current) {
            try {
                recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    size: 'invisible',
                    callback: () => {},
                    'expired-callback': () => {
                        setError('reCAPTCHA expired. Please try sending OTP again.');
                    }
                });
            } catch (e) {
                console.error("Recaptcha init error:", e);
            }
        }
        return recaptchaVerifierRef.current;
    };

    const checkNewUserAndNavigate = async (userCredential) => {
        if (!userCredential || !userCredential.user) {
            navigate(redirectPath);
            return;
        }

        const user = userCredential.user;

        // Always check backend DB for an existing profile before deciding
        try {
            const token = await user.getIdToken();
            const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
                headers: {
                    'X-User-Id': user.uid,
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.email && (data.phone || data.fullName)) {
                    // Profile with verified email exists in DB — go directly to destination
                    navigate(redirectPath);
                    return;
                }
            }
        } catch (e) {
            console.error("Profile DB check error:", e);
        }

        // No profile found in DB — send to onboarding
        navigate(`/complete-profile?redirect=${encodeURIComponent(redirectPath)}`);
    };

    const handleSendOTP = async (e) => {
        if (e) e.preventDefault();
        setError('');
        
        const cleanPhone = phone.trim().replace(/[\s-]/g, '');
        if (!cleanPhone || cleanPhone.length < 7) {
            setError('Please enter a valid mobile number.');
            return;
        }

        const fullPhoneNumber = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;

        setLoading(true);
        try {
            const appVerifier = initRecaptcha();
            const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
            setConfirmationResult(result);
            setStep('otp');
        } catch (err) {
            console.error("Phone Auth Error:", err);
            setError(err.message || 'Failed to send OTP. Please check your phone number and try again.');
            if (recaptchaVerifierRef.current) {
                try { recaptchaVerifierRef.current.clear(); } catch(e){}
                recaptchaVerifierRef.current = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        if (e) e.preventDefault();
        setError('');

        if (!otp || otp.trim().length < 6) {
            setError('Please enter the 6-digit OTP code sent to your phone.');
            return;
        }

        setLoading(true);
        try {
            if (!confirmationResult) {
                throw new Error("Session expired. Please request a new OTP.");
            }
            const userCredential = await confirmationResult.confirm(otp.trim());
            await checkNewUserAndNavigate(userCredential);
        } catch (err) {
            console.error("OTP Verification Error:", err);
            setError(err.message || 'Invalid OTP code. Please check and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setError('');
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const userCredential = await signInWithPopup(auth, provider);
            await checkNewUserAndNavigate(userCredential);
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google');
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
            {/* Invisible Recaptcha Container */}
            <div id="recaptcha-container"></div>

            {/* Canvas Animation */}
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

            {/* Responsive Flexbox Container */}
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
                {/* Story Section */}
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

                    {/* Floating Badges */}
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

                {/* Login Card */}
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
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', color: '#2D2A26', marginBottom: '0.3rem', fontWeight: '400' }}>
                                {step === 'phone' ? 'Sign In' : 'Verify OTP'}
                            </h1>
                            
                            <p style={{ color: '#6C6863', fontSize: '0.8rem', lineHeight: '1.4', margin: '0 auto', maxWidth: '300px' }}>
                                {step === 'phone' 
                                    ? (phoneAuthEnabled ? 'Enter your mobile number to receive a 6-digit OTP code.' : 'Continue with Google to access your account.') 
                                    : `Enter the OTP code sent to +91 ${phone.replace(/^\+91/, '')}`}
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
                                <span>Please <strong>Sign In</strong> to complete your order. You will return to checkout automatically!</span>
                            </div>
                        )}

                        {error && (
                            <div style={{ background: '#FDF1F0', color: 'var(--color-error)', padding: '0.55rem', borderRadius: '10px', marginBottom: '1rem', fontSize: 'var(--font-size-sm)', textAlign: 'center', border: '1px solid rgba(217, 83, 79, 0.2)' }}>
                                {error}
                            </div>
                        )}

                        {/* Step 1: Phone Input Form */}
                        {phoneAuthEnabled && step === 'phone' && (
                            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: '500', fontSize: '0.78rem', color: '#444' }}>Mobile Number</label>
                                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                        <span style={{
                                            height: '38px',
                                            padding: '0 0.65rem',
                                            background: '#FAF7F2',
                                            border: '1px solid rgba(212, 163, 115, 0.4)',
                                            borderRadius: '8px',
                                            fontSize: '0.82rem',
                                            fontWeight: '600',
                                            color: '#8F5E36',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            +91
                                        </span>
                                        <input 
                                            type="tel" 
                                            required 
                                            className="auth-input"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                                            placeholder="98765 43210"
                                            maxLength={13}
                                            style={{ height: '38px', fontSize: '0.88rem', flex: 1, letterSpacing: '0.5px' }}
                                        />
                                    </div>
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
                                    {loading ? 'Sending OTP...' : 'Send OTP Code'}
                                </button>
                            </form>
                        )}

                        {/* Step 2: OTP Code Verification Form */}
                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                        <label style={{ fontWeight: '500', fontSize: '0.78rem', color: '#444' }}>6-Digit OTP Code</label>
                                        <button 
                                            type="button"
                                            onClick={() => { setStep('phone'); setError(''); setOtp(''); }}
                                            style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#8F5E36', cursor: 'pointer', padding: 0, fontWeight: '500' }}
                                        >
                                            Change Number
                                        </button>
                                    </div>
                                    <input 
                                        type="text" 
                                        required 
                                        autoFocus
                                        className="auth-input"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="• • • • • •"
                                        maxLength={6}
                                        style={{ height: '42px', fontSize: '1.1rem', letterSpacing: '8px', textAlign: 'center', fontWeight: '600' }}
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
                                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                                </button>
                            </form>
                        )}

                        {phoneAuthEnabled && (
                            <div style={{ display: 'flex', alignItems: 'center', margin: '1.1rem 0', gap: '0.6rem' }}>
                                <div style={{ flex: 1, height: '1px', background: '#EAE6E1' }}></div>
                                <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or continue with</span>
                                <div style={{ flex: 1, height: '1px', background: '#EAE6E1' }}></div>
                            </div>
                        )}

                        {/* Google Sign-In */}
                        <button 
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
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
