import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, API_BASE_URL } from '../data/config';
import { RecaptchaVerifier, linkWithPhoneNumber, GoogleAuthProvider, linkWithPopup } from 'firebase/auth';

const CompleteProfile = ({ authUser }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get('redirect') || location.state?.from || '/';

    const hasPhone = authUser?.providerData?.some(p => p.providerId === 'phone') || Boolean(authUser?.phoneNumber);
    const hasGoogle = authUser?.providerData?.some(p => p.providerId === 'google.com');
    const isGoogleUser = hasGoogle;
    const isPhoneUser = hasPhone;

    const [fullName, setFullName] = useState(authUser?.displayName || '');
    const [email, setEmail] = useState(authUser?.email || '');
    const [phone, setPhone] = useState(authUser?.phoneNumber ? authUser.phoneNumber.replace(/^\+91/, '') : '');
    


    // Phone verification state for Google users
    const [phoneStep, setPhoneStep] = useState(isPhoneUser ? 'verified' : 'input'); // 'input' | 'otp_sent' | 'verified'
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [phoneError, setPhoneError] = useState('');
    const [phoneLoading, setPhoneLoading] = useState(false);
    
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const recaptchaVerifierRef = useRef(null);

    const [linkLoading, setLinkLoading] = useState(false);
    
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

    // Compute updated identity states (in case they change after linking)
    const [currentEmail, setCurrentEmail] = useState(email);
    const [googleLinked, setGoogleLinked] = useState(hasGoogle);
    const [phoneLinked, setPhoneLinked] = useState(hasPhone);

    // DEBUG: trace auth state to understand email section rendering
    console.log('[CompleteProfile DEBUG]', {
        hasPhone, hasGoogle, phoneLinked, phoneStep,
        googleLinked, currentEmail,
        providerData: authUser?.providerData?.map(p => p.providerId),
        phoneNumber: authUser?.phoneNumber,
        email: authUser?.email,
        uid: authUser?.uid
    });

    const handleLinkGoogle = async () => {
        setFormError('');
        setLinkLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await linkWithPopup(auth.currentUser, provider);
            setGoogleLinked(true);
            setCurrentEmail(result.user.email || '');
            setEmail(result.user.email || '');
        } catch (err) {
            console.error("Google Link Error:", err);
            if (err.code === 'auth/credential-already-in-use') {
                setFormError('This Google account is already linked to another account. Please use a different Google account.');
            } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
                // User closed popup, do nothing
            } else {
                setFormError(err.message || 'Failed to link Google account.');
            }
        } finally {
            setLinkLoading(false);
        }
    };

    useEffect(() => {
        if (!authUser) {
            navigate('/auth');
            return;
        }

        // Auto-bypass complete-profile if user already has a saved profile
        const checkExistingProfile = async () => {
            try {
                const token = await authUser.getIdToken();
                const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
                    headers: {
                        'X-User-Id': authUser.uid,
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.email && (data.phone || data.fullName)) {
                        navigate(redirectPath);
                    }
                }
            } catch (e) {
                console.error("Profile check error:", e);
            }
        };

        checkExistingProfile();
    }, [authUser, navigate, redirectPath]);

    const initRecaptcha = () => {
        if (!recaptchaVerifierRef.current) {
            try {
                recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'complete-recaptcha-container', {
                    size: 'invisible',
                    'expired-callback': () => {
                        setPhoneError('reCAPTCHA expired. Please try sending OTP again.');
                    }
                });
            } catch (e) {
                console.error("Recaptcha error:", e);
            }
        }
        return recaptchaVerifierRef.current;
    };

    const handleSendPhoneOTP = async (e) => {
        if (e) e.preventDefault();
        setPhoneError('');
        const cleanPhone = phone.trim().replace(/[\s-]/g, '');
        if (!cleanPhone || cleanPhone.length < 7) {
            setPhoneError('Please enter a valid mobile number.');
            return;
        }

        const fullPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
        setPhoneLoading(true);
        try {
            const verifier = initRecaptcha();
            const result = await linkWithPhoneNumber(auth.currentUser, fullPhone, verifier);
            setConfirmationResult(result);
            setPhoneStep('otp_sent');
        } catch (err) {
            console.error("Phone verification error:", err);
            setPhoneError(err.message || 'Failed to send OTP code.');
            if (recaptchaVerifierRef.current) {
                try { recaptchaVerifierRef.current.clear(); } catch(e){}
                recaptchaVerifierRef.current = null;
            }
        } finally {
            setPhoneLoading(false);
        }
    };

    const handleVerifyPhoneOTP = async (e) => {
        if (e) e.preventDefault();
        setPhoneError('');
        if (!otp || otp.trim().length < 6) {
            setPhoneError('Please enter 6-digit OTP code.');
            return;
        }

        setPhoneLoading(true);
        try {
            if (!confirmationResult) {
                throw new Error("Session expired. Please click resend OTP.");
            }
            await confirmationResult.confirm(otp.trim());
            setPhoneStep('verified');
            setPhoneLinked(true);
            setPhoneError('');
        } catch (err) {
            console.error("OTP verification error:", err);
            if (err.code === 'auth/credential-already-in-use') {
                setPhoneError('This mobile number is already linked to another account.');
            } else {
                setPhoneError(err.message || 'Invalid OTP code.');
            }
        } finally {
            setPhoneLoading(false);
        }
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!fullName.trim()) return setFormError('Please enter your full name.');
        
        const cleanPhoneNum = phone.replace(/[^0-9]/g, '');
        if (cleanPhoneNum.length !== 10) {
            return setFormError('Please enter a valid 10-digit mobile number.');
        }

        if (googleLinked && phoneAuthEnabled && phoneStep !== 'verified') {
            return setFormError('Please verify your phone number via OTP.');
        }
        
        if (phoneLinked && !googleLinked && !currentEmail.trim()) {
            return setFormError('Please verify your Gmail account to continue.');
        }
        if (!currentEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail.trim())) {
            return setFormError('Please enter a valid email address.');
        }


        setSubmitting(true);
        try {
            const token = authUser ? await authUser.getIdToken() : '';
            const headers = {
                'Content-Type': 'application/json',
                'X-User-Id': authUser.uid,
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };

            const fullPhoneFormatted = phone.startsWith('+') ? phone : `+91${phone.trim()}`;

            const profilePayload = {
                fullName: fullName.trim(),
                email: currentEmail.trim(),
                phone: fullPhoneFormatted,
                address: '',
                city: '',
                state: '',
                zipCode: ''
            };

            const profRes = await fetch(`${API_BASE_URL}/api/profile/me`, {
                method: 'POST',
                headers,
                body: JSON.stringify(profilePayload)
            });

            if (!profRes.ok) {
                const text = await profRes.text();
                throw new Error(text || 'Failed to save profile');
            }

            try {
                localStorage.setItem(`tet_profile_${authUser.uid}`, JSON.stringify(profilePayload));
            } catch (e) {}



            // Redirect to destination
            navigate(redirectPath);
        } catch (err) {
            console.error("Profile Submit Error:", err);
            setFormError(err.message || 'Unable to save profile details. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 75px)',
            background: 'linear-gradient(135deg, #FCFBFA 0%, #F5EFE8 100%)',
            padding: '2.5rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div id="complete-recaptcha-container"></div>

            <div style={{
                maxWidth: '560px',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '2.5rem 2.25rem',
                boxShadow: '0 16px 45px rgba(212, 163, 115, 0.16)',
                border: '1.5px solid rgba(212, 163, 115, 0.35)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8F5E36', fontWeight: '700' }}>
                        ROYAL ONBOARDING
                    </span>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#2D2A26', margin: '0.3rem 0 0.4rem', fontWeight: '400' }}>
                        Complete Your Profile
                    </h1>
                    <p style={{ color: '#6C6863', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                        Provide your details & delivery address to enjoy seamless royal checkout and order tracking.
                    </p>
                </div>

                {formError && (
                    <div style={{ background: '#FDF1F0', color: 'var(--color-error)', padding: '0.65rem 0.85rem', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.82rem', textAlign: 'center', border: '1px solid rgba(217, 83, 79, 0.2)' }}>
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmitProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    
                    {/* Full Name */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: '500', fontSize: '0.8rem', color: '#444' }}>Full Name *</label>
                        <input 
                            type="text" 
                            required 
                            className="auth-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            style={{ height: '40px', fontSize: '0.88rem' }}
                        />
                    </div>

                    {/* Email Verification Field */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <label style={{ fontWeight: '500', fontSize: '0.8rem', color: '#444' }}>
                                Email Address *
                            </label>
                            {googleLinked && currentEmail && (
                                <span style={{ fontSize: '0.7rem', backgroundColor: '#eafaf1', color: '#0e6245', padding: '2px 8px', borderRadius: '50px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <svg viewBox="0 0 20 20" width="12" height="12" fill="#0e6245">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                    </svg>
                                    ✓ Email Verified
                                </span>
                            )}
                        </div>
                        
                        {phoneLinked && !googleLinked ? (
                            /* ── Prominent "Verify Your Email" card for phone-signup users ── */
                            <div style={{
                                background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF3EB 100%)',
                                border: '1.5px dashed #D4A373',
                                borderRadius: '14px',
                                padding: '1.1rem 1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    {/* Envelope icon */}
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                                            <path d="M22 4L12 13L2 4"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.82rem', color: '#5C3D2E' }}>
                                            Email Verification Required
                                        </p>
                                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: '#8F7A6A', lineHeight: '1.4' }}>
                                            Link your Google account to verify your email. This ensures you receive order confirmations &amp; prevents duplicates.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    id="verify-email-btn"
                                    onClick={handleLinkGoogle}
                                    disabled={linkLoading}
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        fontSize: '0.82rem',
                                        fontWeight: '600',
                                        backgroundColor: '#fff',
                                        border: '1.5px solid #D4A373',
                                        color: '#8F5E36',
                                        borderRadius: '10px',
                                        cursor: linkLoading ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.6rem',
                                        boxShadow: '0 2px 8px rgba(212, 163, 115, 0.15)',
                                        transition: 'all 0.2s ease',
                                        opacity: linkLoading ? 0.7 : 1
                                    }}
                                >
                                    {linkLoading ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                                                <circle cx="12" cy="12" r="10" stroke="#D4A373" strokeWidth="3" fill="none" strokeDasharray="30 70" strokeLinecap="round"/>
                                            </svg>
                                            Linking Google Account...
                                        </>
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 24 24" width="18" height="18">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                            </svg>
                                            Verify Email via Google
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : googleLinked && currentEmail ? (
                            /* ── Verified email display ── */
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: '#F4FBF7',
                                border: '1px solid #C6E9D6',
                                borderRadius: '10px',
                                padding: '0.55rem 0.75rem'
                            }}>
                                <svg viewBox="0 0 24 24" width="18" height="18">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                <span style={{ fontSize: '0.88rem', color: '#2D2A26', fontWeight: '500', flex: 1 }}>
                                    {currentEmail}
                                </span>
                            </div>
                        ) : (
                            /* ── Editable email input (fallback) ── */
                            <input 
                                type="email" 
                                required 
                                className="auth-input"
                                value={currentEmail}
                                readOnly={googleLinked}
                                onChange={(e) => {
                                    setCurrentEmail(e.target.value);
                                    setEmail(e.target.value);
                                }}
                                placeholder="you@example.com"
                                style={{ height: '40px', fontSize: '0.88rem', backgroundColor: googleLinked ? '#FAF8F5' : '#fff' }}
                            />
                        )}
                    </div>

                    {/* Phone Field + OTP Verification for Google Users */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <label style={{ fontWeight: '500', fontSize: '0.8rem', color: '#444' }}>Mobile Number *</label>
                            {phoneLinked ? (
                                <span style={{ fontSize: '0.7rem', backgroundColor: '#eafaf1', color: '#0e6245', padding: '2px 8px', borderRadius: '50px', fontWeight: '600' }}>
                                    ✓ Mobile OTP Verified
                                </span>
                            ) : phoneStep === 'verified' ? (
                                <span style={{ fontSize: '0.7rem', backgroundColor: '#eafaf1', color: '#0e6245', padding: '2px 8px', borderRadius: '50px', fontWeight: '600' }}>
                                    ✓ Phone Verified
                                </span>
                            ) : null}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{
                                height: '40px',
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
                                readOnly={phoneLinked}
                                onChange={(e) => {
                                    setPhone(e.target.value.replace(/[^0-9]/g, ''));
                                    if (phoneStep === 'verified') setPhoneStep('input');
                                }}
                                placeholder="98765 43210"
                                maxLength={10}
                                style={{ height: '40px', fontSize: '0.88rem', flex: 1, backgroundColor: phoneLinked ? '#FAF8F5' : '#fff' }}
                            />
                            {phoneAuthEnabled && googleLinked && !phoneLinked && phoneStep !== 'verified' && (
                                <button
                                    type="button"
                                    onClick={handleSendPhoneOTP}
                                    disabled={phoneLoading || !phone}
                                    style={{
                                        height: '40px',
                                        padding: '0 1rem',
                                        fontSize: '0.78rem',
                                        fontWeight: '600',
                                        backgroundColor: '#FAF7F2',
                                        border: '1.5px solid #D4A373',
                                        color: '#8F5E36',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {phoneLoading ? 'Sending...' : 'Verify OTP'}
                                </button>
                            )}
                        </div>

                        {/* OTP Verification Box for Google Users */}
                        {phoneAuthEnabled && phoneStep === 'otp_sent' && !phoneLinked && (
                            <div style={{ marginTop: '0.65rem', padding: '0.75rem 0.85rem', backgroundColor: '#FAF7F2', borderRadius: '12px', border: '1px solid rgba(212, 163, 115, 0.4)' }}>
                                <p style={{ margin: '0 0 0.4rem', fontSize: '0.78rem', color: '#8F5E36', fontWeight: '500' }}>
                                    Enter 6-digit OTP sent to +91 {phone}
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input 
                                        type="text" 
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder="• • • • • •"
                                        style={{ width: '130px', height: '36px', fontSize: '1rem', letterSpacing: '4px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyPhoneOTP}
                                        disabled={phoneLoading}
                                        style={{ height: '36px', padding: '0 1rem', fontSize: '0.78rem', fontWeight: '600', backgroundColor: '#8F5E36', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        {phoneLoading ? 'Verifying...' : 'Confirm'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {phoneError && (
                            <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#d32f2f' }}>{phoneError}</p>
                        )}
                    </div>


                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={submitting || (googleLinked && phoneAuthEnabled && phoneStep !== 'verified') || (phoneLinked && !googleLinked)}
                        style={{
                            width: '100%',
                            height: '42px',
                            marginTop: '0.5rem',
                            fontSize: '0.88rem',
                            borderRadius: '50px',
                            opacity: (submitting || (googleLinked && phoneAuthEnabled && phoneStep !== 'verified') || (phoneLinked && !googleLinked)) ? 0.65 : 1,
                            cursor: (submitting || (googleLinked && phoneAuthEnabled && phoneStep !== 'verified') || (phoneLinked && !googleLinked)) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)',
                            border: 'none',
                            color: '#FFF',
                            fontWeight: '600',
                            boxShadow: '0 4px 15px rgba(212, 163, 115, 0.25)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {submitting ? 'Saving Profile...' : 'Save Profile & Proceed \u2192'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
