import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import CopyButton from '../components/CopyButton';
import { auth, API_BASE_URL } from '../data/config';
import firebase from 'firebase/compat/app';

const ProfilePage = ({ authUser }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState('create');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [successVisible, setSuccessVisible] = useState(false);
    const redirectTimer = useRef(null);
    const profileRecaptchaRef = useRef(null);

    // Phone OTP Verification states for Google users linking/verifying phone
    const [phoneOtpStep, setPhoneOtpStep] = useState('idle'); // 'idle' | 'otp_sent' | 'verified'
    const [phoneOtp, setPhoneOtp] = useState('');
    const [phoneConfirmationResult, setPhoneConfirmationResult] = useState(null);
    const [phoneError, setPhoneError] = useState('');
    const [phoneSending, setPhoneSending] = useState(false);

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        preferredSize: '',
        styleNotes: ''
    });

    const [addresses, setAddresses] = useState([]);
    const [addressForm, setAddressForm] = useState({ id: 0, fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressMessage, setAddressMessage] = useState('');
    
    // New states for client tabbed dashboard
    const [orders, setOrders] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    const isPhoneUser = Boolean(authUser?.phoneNumber);
    const isGoogleUser = Boolean(authUser?.email && !authUser?.phoneNumber);

    const initProfileRecaptcha = () => {
        if (!profileRecaptchaRef.current) {
            try {
                profileRecaptchaRef.current = new firebase.auth.RecaptchaVerifier('profile-recaptcha-container', {
                    size: 'invisible',
                    'expired-callback': () => {
                        setPhoneError('reCAPTCHA expired. Please try sending OTP again.');
                    }
                });
            } catch (e) {
                console.error("Profile recaptcha init error:", e);
            }
        }
        return profileRecaptchaRef.current;
    };

    const handleSendProfilePhoneOTP = async () => {
        setPhoneError('');
        const cleanPhone = form.phone.trim().replace(/[\s-]/g, '');
        if (!cleanPhone || cleanPhone.length < 7) {
            setPhoneError('Please enter a valid mobile number first.');
            return;
        }
        const fullPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
        setPhoneSending(true);
        try {
            const verifier = initProfileRecaptcha();
            const result = await auth.signInWithPhoneNumber(fullPhone, verifier);
            setPhoneConfirmationResult(result);
            setPhoneOtpStep('otp_sent');
        } catch (err) {
            console.error("Profile Phone Verification Error:", err);
            setPhoneError(err.message || 'Failed to send OTP code.');
            if (profileRecaptchaRef.current) {
                profileRecaptchaRef.current.clear();
                profileRecaptchaRef.current = null;
            }
        } finally {
            setPhoneSending(false);
        }
    };

    const handleVerifyProfilePhoneOTP = async () => {
        setPhoneError('');
        if (!phoneOtp || phoneOtp.trim().length < 6) {
            setPhoneError('Please enter the 6-digit OTP code.');
            return;
        }
        setPhoneSending(true);
        try {
            if (!phoneConfirmationResult) {
                throw new Error("Session expired. Please click resend OTP.");
            }
            await phoneConfirmationResult.confirm(phoneOtp.trim());
            setPhoneOtpStep('verified');
            setPhoneError('');
        } catch (err) {
            console.error("OTP Verification Error:", err);
            setPhoneError(err.message || 'Invalid OTP code.');
        } finally {
            setPhoneSending(false);
        }
    };

    const validateProfileForm = (cleaned) => {
        if (!cleaned.fullName || !cleaned.email || !cleaned.phone || !cleaned.address || !cleaned.city || !cleaned.state || !cleaned.zipCode) {
            return 'Please complete all required fields.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
            return 'Please enter a valid email address.';
        }
        if (!/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(cleaned.fullName)) {
            return 'Please enter a valid full name.';
        }
        if (!/^\+?[0-9()\-\s]{8,15}$/.test(cleaned.phone)) {
            return 'Please enter a valid phone number.';
        }
        if (isGoogleUser && mode === 'create' && phoneOtpStep !== 'verified' && !form.phone) {
            return 'Please enter and verify your phone number via OTP.';
        }
        if (cleaned.address.length < 5) {
            return 'Please enter a complete address.';
        }
        if (cleaned.city.length < 2 || cleaned.state.length < 2) {
            return 'Please enter a valid city and state.';
        }
        if (!/^[A-Za-z0-9\-\s]{3,12}$/.test(cleaned.zipCode)) {
            return 'Please enter a valid ZIP or postal code.';
        }
        if (cleaned.styleNotes.length > 500) {
            return 'Style notes must be 500 characters or fewer.';
        }
        return '';
    };

    const loadAddresses = async () => {
        if (!authUser) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
                headers: { 'X-User-Id': authUser.uid }
            });
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadOrdersAndCoupons = async () => {
        if (!authUser) return;
        try {
            const ordResponse = await fetch(`${API_BASE_URL}/api/profile/orders`, {
                headers: { 'X-User-Id': authUser.uid }
            });
            if (ordResponse.ok) {
                const data = await ordResponse.json();
                setOrders(data);
            }
            
            const copResponse = await fetch(`${API_BASE_URL}/api/profile/coupons`, {
                headers: { 'X-User-Id': authUser.uid }
            });
            if (copResponse.ok) {
                const data = await copResponse.json();
                setCoupons(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setAddressMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': authUser.uid
                },
                body: JSON.stringify(addressForm)
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to save address');
            }
            setAddressForm({ id: 0, fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
            setShowAddressForm(false);
            loadAddresses();
        } catch (err) {
            setAddressMessage(err.message);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/addresses?id=${id}`, {
                method: 'DELETE',
                headers: { 'X-User-Id': authUser.uid }
            });
            if (response.ok) {
                loadAddresses();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetDefaultAddress = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/addresses?id=${id}`, {
                method: 'PATCH',
                headers: { 'X-User-Id': authUser.uid }
            });
            if (response.ok) {
                loadAddresses();
                // Also reload profile details since primary profile address is bidirectionally synced
                const profileRes = await fetch(`${API_BASE_URL}/api/profile/me`, {
                    headers: { 'X-User-Id': authUser.uid }
                });
                if (profileRes.ok) {
                    const profile = await profileRes.json();
                    setForm({
                        fullName: profile.fullName || '',
                        email: profile.email || authUser.email || '',
                        phone: profile.phone || '',
                        address: profile.address || '',
                        city: profile.city || '',
                        state: profile.state || '',
                        zipCode: profile.zipCode || '',
                        preferredSize: profile.preferredSize || '',
                        styleNotes: profile.styleNotes || ''
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!authUser) return;

        const loadProfile = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
                    headers: { 'X-User-Id': authUser.uid }
                });
                const authPhone = authUser.phoneNumber ? authUser.phoneNumber.replace(/^\+91/, '') : '';
                const authEmail = authUser.email || '';

                if (response.status === 404) {
                    setMode('create');
                    setForm(f => ({ 
                        ...f, 
                        fullName: authUser.displayName || '',
                        email: authEmail, 
                        phone: authPhone 
                    }));
                    setIsEditing(true);
                    setLoading(false);
                    return;
                }
                if (!response.ok) {
                    throw new Error('Unable to load profile');
                }
                const profile = await response.json();
                setForm({
                    fullName: profile.fullName || authUser.displayName || '',
                    email: profile.email || authEmail,
                    phone: profile.phone || authPhone,
                    address: profile.address || '',
                    city: profile.city || '',
                    state: profile.state || '',
                    zipCode: profile.zipCode || '',
                    preferredSize: profile.preferredSize || '',
                    styleNotes: profile.styleNotes || ''
                });
                if (profile.phone) {
                    setPhoneOtpStep('verified');
                }
                setMode('edit');
                setIsEditing(false);
            } catch (error) {
                setMessage({ type: 'error', text: 'We could not load your profile right now.' });
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
        loadAddresses();
        loadOrdersAndCoupons();
    }, [authUser]);

    useEffect(() => () => {
        if (redirectTimer.current) {
            window.clearTimeout(redirectTimer.current);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!authUser || saving) {
            return;
        }

        const cleaned = {
            fullName: form.fullName.trim(),
            email: form.email || authUser.email || '',
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            zipCode: form.zipCode.trim(),
            preferredSize: form.preferredSize.trim(),
            styleNotes: form.styleNotes.trim()
        };

        const validationError = validateProfileForm(cleaned);
        if (validationError) {
            setMessage({ type: 'error', text: validationError });
            setSuccessVisible(false);
            return;
        }

        setSaving(true);
        setSuccessVisible(false);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
                method: mode === 'create' ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': authUser.uid
                },
                body: JSON.stringify(cleaned)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Unable to save profile');
            }

            const profile = await response.json();
            setForm({
                fullName: profile.fullName || '',
                email: profile.email || authUser.email || '',
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                zipCode: profile.zipCode || '',
                preferredSize: profile.preferredSize || '',
                styleNotes: profile.styleNotes || ''
            });
            setMode('edit');
            setIsEditing(false);
            setSuccessVisible(true);
            loadAddresses();
            redirectTimer.current = window.setTimeout(() => {
                setSuccessVisible(false);
            }, 3000);
        } catch (error) {
            setSuccessVisible(false);
            setMessage({ type: 'error', text: error.message || 'Profile could not be saved.' });
        } finally {
            setSaving(false);
        }
    };

    if (!authUser) {
        return (
            <div className="profile-shell">
                <div className="profile-card">
                    <p className="profile-eyebrow">Account</p>
                    <h1>Please sign in to view your profile</h1>
                    <p className="profile-help">Use the Sign In button in the header to continue.</p>
                    <Link to="/auth" className="btn btn-primary" style={{display:'inline-block', marginTop:'1.5rem'}}>Go to Sign In</Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: '10rem 5%', textAlign:'center', minHeight:'50vh', color: '#666' }}>
                <p>Loading your profile dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '1100px',
            margin: '2.5rem auto 3rem',
            padding: '0 1.25rem',
            minHeight: '75vh',
            fontFamily: 'var(--font-body)'
        }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                marginBottom: '1.25rem',
                background: '#fff',
                padding: '1.25rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.04)'
            }}>
                <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50px',
                    background: 'linear-gradient(135deg, #e4b39b, #b97a66)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(185, 122, 102, 0.25)'
                }}>
                    {form.fullName ? form.fullName.trim().charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h1 style={{
                        fontSize: '1.4rem',
                        fontFamily: 'var(--font-title)',
                        margin: 0,
                        color: '#333'
                    }}>
                        {form.fullName || 'Welcome to The Ethnic Touch'}
                    </h1>
                    <p style={{ margin: '0.15rem 0 0', color: '#666', fontSize: '0.85rem' }}>
                        {authUser.email || authUser.phoneNumber || form.email || form.phone}
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr',
                gap: '1.25rem'
            }} className="profile-dashboard-grid">
                
                {/* Sidemenu Panel */}
                <div style={{
                    background: '#fff',
                    padding: '1rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    height: 'fit-content'
                }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li 
                            onClick={() => { setActiveTab('profile'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            style={{
                                padding: '0.65rem 0.9rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.88rem',
                                fontWeight: activeTab === 'profile' ? '600' : 'normal',
                                backgroundColor: activeTab === 'profile' ? '#fff0e9' : 'transparent',
                                color: activeTab === 'profile' ? '#b97a66' : '#555',
                                transition: 'all 0.2s',
                                marginBottom: '0.35rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem'
                            }}
                        >
                            My Profile
                        </li>
                        <li 
                            onClick={() => { setActiveTab('addresses'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            style={{
                                padding: '0.65rem 0.9rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.88rem',
                                fontWeight: activeTab === 'addresses' ? '600' : 'normal',
                                backgroundColor: activeTab === 'addresses' ? '#fff0e9' : 'transparent',
                                color: activeTab === 'addresses' ? '#b97a66' : '#555',
                                transition: 'all 0.2s',
                                marginBottom: '0.35rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem'
                            }}
                        >
                            Shipping Addresses
                        </li>
                        <li 
                            onClick={() => { setActiveTab('orders'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            style={{
                                padding: '0.65rem 0.9rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.88rem',
                                fontWeight: activeTab === 'orders' ? '600' : 'normal',
                                backgroundColor: activeTab === 'orders' ? '#fff0e9' : 'transparent',
                                color: activeTab === 'orders' ? '#b97a66' : '#555',
                                transition: 'all 0.2s',
                                marginBottom: '0.35rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem'
                            }}
                        >
                            Order History
                        </li>
                        <li 
                            onClick={() => { setActiveTab('coupons'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            style={{
                                padding: '0.65rem 0.9rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.88rem',
                                fontWeight: activeTab === 'coupons' ? '600' : 'normal',
                                backgroundColor: activeTab === 'coupons' ? '#fff0e9' : 'transparent',
                                color: activeTab === 'coupons' ? '#b97a66' : '#555',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem'
                            }}
                        >
                            My Coupons
                        </li>
                        <li 
                            onClick={() => {
                                if (auth) {
                                    auth.signOut().then(() => {
                                        window.location.hash = "#/";
                                    });
                                }
                            }}
                            style={{
                                padding: '0.65rem 0.9rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.88rem',
                                fontWeight: '500',
                                backgroundColor: 'transparent',
                                color: '#d32f2f',
                                transition: 'all 0.2s',
                                marginTop: '0.75rem',
                                borderTop: '1px solid #f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem'
                            }}
                            onMouseEnter={e => { e.target.style.backgroundColor = '#fdf2f2'; }}
                            onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; }}
                        >
                            Sign Out
                        </li>
                    </ul>
                </div>

                {/* Content Panel */}
                <div style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    minHeight: '380px'
                }}>
                    
                    {/* TAB: PROFILE */}
                    {activeTab === 'profile' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                <h2 style={{ fontFamily: 'var(--font-title)', margin: 0, fontSize: '1.4rem', color: '#333' }}>Account Profile</h2>
                                {mode === 'edit' && (
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="btn"
                                        style={{
                                            border: '1px solid #b97a66',
                                            color: '#b97a66',
                                            backgroundColor: isEditing ? '#fff0e9' : 'transparent',
                                            padding: '0.5rem 1.2rem',
                                            borderRadius: '6px',
                                            fontSize: '0.9rem',
                                            fontWeight: '500',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                    </button>
                                )}
                            </div>

                            {message.text && (
                                <div style={{
                                    padding: '1rem',
                                    borderRadius: '6px',
                                    backgroundColor: message.type === 'error' ? '#fde8e8' : '#eafaf1',
                                    color: message.type === 'error' ? '#9b1c1c' : '#0e6245',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.9rem'
                                }}>
                                    {message.text}
                                </div>
                            )}

                            {successVisible && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '2rem 1rem',
                                    background: '#f4fbf7',
                                    border: '1px solid #c8e6c9',
                                    borderRadius: '8px',
                                    marginBottom: '1.5rem'
                                }}>
                                    <span style={{ fontSize: '3rem', color: '#2e7d32' }}>✓</span>
                                    <h4 style={{ margin: '0.5rem 0 0.2rem', color: '#2e7d32' }}>Profile Updated Successfully!</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Your profile has been saved.</p>
                                </div>
                            )}

                            {(!isEditing && mode === 'edit') ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Full Name</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.fullName || '-'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Email Address</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.email || '-'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Phone Number</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>ZIP / Postal Code</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.zipCode || '-'}</p>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Primary Shipping Address</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>
                                            {form.address ? `${form.address}, ${form.city}, ${form.state} - ${form.zipCode}` : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Preferred Size</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', fontWeight: '500', margin: 0 }}>{form.preferredSize || 'Not set'}</p>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '0.2rem' }}>Style Preferences & Notes</label>
                                        <p style={{ fontSize: '1.05rem', color: '#333', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{form.styleNotes || 'None added'}</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div id="profile-recaptcha-container"></div>
                                    
                                    {/* Email Field */}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                            <label style={{ fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>
                                                Email Address * {isPhoneUser && '(Required for order receipts & invoices)'}
                                            </label>
                                            {isGoogleUser && (
                                                <span style={{ fontSize: '0.72rem', backgroundColor: '#eafaf1', color: '#0e6245', padding: '0.15rem 0.5rem', borderRadius: '50px', fontWeight: '600' }}>
                                                    ✓ Google Verified
                                                </span>
                                            )}
                                        </div>
                                        <input 
                                            type="email" 
                                            required
                                            value={form.email} 
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            readOnly={isGoogleUser} 
                                            placeholder="you@example.com"
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: isGoogleUser ? '#f9f9f9' : '#fff', color: isGoogleUser ? '#777' : '#333', outline: 'none' }}
                                        />
                                    </div>

                                    {/* Full Name Field */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555', fontWeight: '500' }}>Full Name *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="Enter your full name"
                                            value={form.fullName}
                                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                            <label style={{ fontSize: '0.9rem', color: '#555', fontWeight: '500' }}>Phone Number *</label>
                                            {isPhoneUser ? (
                                                <span style={{ fontSize: '0.72rem', backgroundColor: '#eafaf1', color: '#0e6245', padding: '0.15rem 0.5rem', borderRadius: '50px', fontWeight: '600' }}>
                                                    ✓ Mobile OTP Verified
                                                </span>
                                            ) : (phoneOtpStep === 'verified' || (mode === 'edit' && form.phone)) ? (
                                                <span style={{ fontSize: '0.72rem', backgroundColor: '#eafaf1', color: '#0e6245', padding: '0.15rem 0.5rem', borderRadius: '50px', fontWeight: '600' }}>
                                                    ✓ Phone Verified
                                                </span>
                                            ) : null}
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input 
                                                type="tel" 
                                                required 
                                                placeholder="10-digit number"
                                                value={form.phone}
                                                readOnly={isPhoneUser}
                                                onChange={e => {
                                                    setForm({ ...form, phone: e.target.value });
                                                    if (phoneOtpStep === 'verified') setPhoneOtpStep('idle');
                                                }}
                                                style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: isPhoneUser ? '#f9f9f9' : '#fff', color: isPhoneUser ? '#777' : '#333', outline: 'none' }}
                                            />
                                            {isGoogleUser && !isPhoneUser && phoneOtpStep !== 'verified' && (
                                                <button
                                                    type="button"
                                                    onClick={handleSendProfilePhoneOTP}
                                                    disabled={phoneSending || !form.phone}
                                                    style={{
                                                        padding: '0 0.85rem',
                                                        fontSize: '0.78rem',
                                                        fontWeight: '600',
                                                        backgroundColor: '#FAF7F2',
                                                        border: '1px solid #D4A373',
                                                        color: '#8F5E36',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {phoneSending ? 'Sending...' : 'Verify OTP'}
                                                </button>
                                            )}
                                        </div>

                                        {/* OTP Input Box if OTP Sent */}
                                        {phoneOtpStep === 'otp_sent' && (
                                            <div style={{ marginTop: '0.6rem', padding: '0.65rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid rgba(212, 163, 115, 0.4)' }}>
                                                <p style={{ margin: '0 0 0.4rem', fontSize: '0.78rem', color: '#8F5E36', fontWeight: '500' }}>
                                                    Enter 6-digit OTP code sent to +91 {form.phone}
                                                </p>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <input 
                                                        type="text" 
                                                        maxLength={6}
                                                        value={phoneOtp}
                                                        onChange={e => setPhoneOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                                        placeholder="• • • • • •"
                                                        style={{ width: '120px', padding: '0.4rem', fontSize: '0.95rem', letterSpacing: '3px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleVerifyProfilePhoneOTP}
                                                        disabled={phoneSending}
                                                        style={{ padding: '0 0.85rem', fontSize: '0.78rem', fontWeight: '600', backgroundColor: '#8F5E36', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                    >
                                                        {phoneSending ? 'Verifying...' : 'Confirm'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {phoneError && (
                                            <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#d32f2f' }}>{phoneError}</p>
                                        )}
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Shipping Address Line *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="Apartment, Street Address"
                                            value={form.address}
                                            onChange={e => setForm({ ...form, address: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>City *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="City Name"
                                            value={form.city}
                                            onChange={e => setForm({ ...form, city: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>State *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="State Name"
                                            value={form.state}
                                            onChange={e => setForm({ ...form, state: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>ZIP / Postal Code *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="6-digit PIN code"
                                            value={form.zipCode}
                                            onChange={e => setForm({ ...form, zipCode: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Preferred Sizing (Optional)</label>
                                        <select 
                                            value={form.preferredSize} 
                                            onChange={e => setForm({ ...form, preferredSize: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', backgroundColor: '#fff' }}
                                        >
                                            <option value="">Choose Sizing</option>
                                            <option value="XS">XS</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                        </select>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Style Preferences & Special Instructions</label>
                                        <textarea 
                                            rows="3" 
                                            placeholder="Tell us what fit, patterns or fabrics you love"
                                            value={form.styleNotes}
                                            onChange={e => setForm({ ...form, styleNotes: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', outline: 'none', resize: 'none' }}
                                        />
                                    </div>
                                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={saving}
                                            style={{ padding: '0.8rem 2.5rem', width: '100%' }}
                                        >
                                            {saving ? 'Saving...' : (mode === 'create' ? 'Create Profile' : 'Save Details')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* TAB: ADDRESSES */}
                    {activeTab === 'addresses' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                <h2 style={{ fontFamily: 'var(--font-title)', margin: 0, fontSize: '1.4rem', color: '#333' }}>Saved Addresses Book</h2>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setAddressForm({ id: 0, fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
                                        setAddressMessage('');
                                        setShowAddressForm(!showAddressForm);
                                    }}
                                    className="btn btn-primary" 
                                    style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', fontSize: '0.9rem' }}
                                >
                                    {showAddressForm ? 'Close Form' : '+ Add Address'}
                                </button>
                            </div>

                            {showAddressForm && (
                                <form onSubmit={handleAddressSubmit} style={{ 
                                    background: '#fafafa', 
                                    padding: '1.5rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid #eee',
                                    marginBottom: '2rem',
                                    display: 'grid', 
                                    gridTemplateColumns: '1fr 1fr', 
                                    gap: '1rem' 
                                }}>
                                    <h4 style={{ gridColumn: 'span 2', margin: '0 0 0.5rem', fontFamily: 'var(--font-title)', fontSize: '1.1rem' }}>
                                        {addressForm.id > 0 ? 'Edit Shipping Address' : 'New Shipping Address'}
                                    </h4>
                                    
                                    {addressMessage && <p style={{ gridColumn: 'span 2', color: 'red', margin: 0, fontSize: '0.85rem' }}>{addressMessage}</p>}

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Full Name *</label>
                                        <input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Contact Phone *</label>
                                        <input type="text" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>Address Line *</label>
                                        <input type="text" required value={addressForm.addressLine} onChange={e => setAddressForm({...addressForm, addressLine: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>City *</label>
                                        <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>State *</label>
                                        <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#666', marginBottom: '0.2rem' }}>ZIP Code *</label>
                                        <input type="text" required value={addressForm.zipCode} onChange={e => setAddressForm({...addressForm, zipCode: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem' }}>Cancel</button>
                                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem' }}>Save Address</button>
                                    </div>
                                </form>
                            )}

                            {addresses.length === 0 ? (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>No shipping addresses added yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    {addresses.map(addr => (
                                        <div key={addr.id} style={{
                                            border: '1px solid #eee',
                                            padding: '1.5rem',
                                            borderRadius: '8px',
                                            position: 'relative',
                                            backgroundColor: addr.isDefault ? '#fffcf9' : '#fff',
                                            borderColor: addr.isDefault ? '#e4b39b' : '#eee'
                                        }}>
                                            {addr.isDefault && (
                                                <span style={{
                                                    position: 'absolute', top: '12px', right: '12px',
                                                    fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px',
                                                    background: '#e4b39b', color: '#fff', padding: '2px 8px', borderRadius: '10px',
                                                    fontWeight: '600'
                                                }}>Default</span>
                                            )}
                                            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontFamily: 'var(--font-title)' }}>{addr.fullName}</h4>
                                            <p style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>{addr.addressLine}</p>
                                            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#666' }}>{addr.city}, {addr.state} - {addr.zipCode}</p>
                                            <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#555', fontWeight: '500' }}>Phone: {addr.phone}</p>
                                            
                                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', borderTop: '1px solid #f5f5f5', paddingTop: '0.8rem' }}>
                                                {!addr.isDefault && (
                                                    <button type="button" onClick={() => handleSetDefaultAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#b97a66', fontWeight: '500', cursor: 'pointer', padding: 0 }}>Set Default</button>
                                                )}
                                                <button type="button" onClick={() => {
                                                    setAddressForm({
                                                        id: addr.id,
                                                        fullName: addr.fullName,
                                                        phone: addr.phone,
                                                        addressLine: addr.addressLine,
                                                        city: addr.city,
                                                        state: addr.state,
                                                        zipCode: addr.zipCode
                                                    });
                                                    setAddressMessage('');
                                                    setShowAddressForm(true);
                                                }} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0 }}>Edit</button>
                                                <button type="button" onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', padding: 0 }}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: ORDERS */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.5rem', fontSize: '1.4rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>Order History</h2>
                            {orders.length === 0 ? (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>You have not placed any orders yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {orders.map(order => (
                                        <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fafafa' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>Order ID:</span>
                                                    <span style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: '0.95rem' }}>{order.id}</span>
                                                    <CopyButton text={order.id} label="Copy ID" />
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: '0.85rem', color: '#b97a66', fontWeight: '500', textTransform: 'uppercase' }}>{order.status}</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                                                <div>
                                                    <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>Items</h5>
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                        {order.items && order.items.map((it, idx) => {
                                                             const qty = it.quantity || 1;
                                                             const unitPrice = it.priceAtQty || 0;
                                                             const lineTotal = unitPrice * qty;
                                                             return (
                                                                 <li key={it.productId || idx} style={{ fontSize: '0.9rem', color: '#333', padding: '0.4rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                     <div>
                                                                         <span>{it.productName || it.productId}</span>
                                                                         {it.size && (
                                                                             <span style={{ fontSize: '0.75rem', background: '#fff0e9', color: '#b97a66', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px', fontWeight: '500' }}>
                                                                                 Size: {it.size}
                                                                             </span>
                                                                         )}
                                                                         <strong style={{ marginLeft: '6px', color: '#555' }}>x {qty}</strong>
                                                                     </div>
                                                                     <div style={{ textAlign: 'right' }}>
                                                                         <span style={{ fontWeight: '500' }}>₹{lineTotal.toLocaleString('en-IN')}</span>
                                                                         {qty > 1 && (
                                                                             <span style={{ display: 'block', fontSize: '0.75rem', color: '#888' }}>
                                                                                 (₹{unitPrice.toLocaleString('en-IN')} each)
                                                                             </span>
                                                                         )}
                                                                     </div>
                                                                 </li>
                                                             );
                                                         })}
                                                    </ul>
                                                </div>
                                                <div style={{ borderLeft: '1px solid #eee', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <div style={{ marginBottom: '0.5rem' }}>
                                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>Date:</span>
                                                        <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>Total Amount Paid:</span>
                                                        <span style={{ display: 'block', fontSize: '1.15rem', color: '#b97a66', fontWeight: '600' }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {order.trackingNumber && (
                                                <div style={{ marginTop: '1rem', background: '#eaf3fc', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#1a5695' }}>
                                                        Shipping Carrier Tracking Number: <strong style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</strong>
                                                    </span>
                                                    <CopyButton text={order.trackingNumber} label="Copy Tracking ID" />
                                                </div>
                                            )}

                                            {order.unlockedGift && (
                                                <div style={{ marginTop: '0.8rem', background: '#fff9e6', padding: '0.75rem 1rem', border: '1px dashed #fcd34d', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: '0.85rem', color: '#854d0e' }}>
                                                        Reward Unlocked: <strong>{order.unlockedGift}</strong>
                                                    </span>
                                                    <CopyButton text={order.unlockedGift} label="Copy Code" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: COUPONS */}
                    {activeTab === 'coupons' && (
                        <div>
                            <h2 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.5rem', fontSize: '1.4rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>My Loyalty Coupons</h2>
                            {coupons.length === 0 ? (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>No dynamic coupons issued to your email yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.4rem' }}>
                                    {coupons.map(c => (
                                        <div key={c.id} style={{
                                            border: '2px dashed #e4b39b',
                                            padding: '1.3rem 1rem',
                                            borderRadius: '12px',
                                            backgroundColor: '#fffcf9',
                                            textAlign: 'center',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                                        }}>
                                            <div style={{
                                                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                                                background: 'linear-gradient(90deg, #e4b39b, #b97a66)'
                                            }} />
                                            
                                            {/* Code & Icon-Only Copy Button Container */}
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                gap: '0.4rem',
                                                margin: '0.4rem 0 0.8rem',
                                                backgroundColor: '#ffffff',
                                                border: '1px dashed #e4b39b',
                                                borderRadius: '8px',
                                                padding: '0.4rem 0.6rem'
                                            }}>
                                                <strong style={{
                                                    fontSize: '1.05rem',
                                                    fontFamily: 'monospace',
                                                    color: '#b97a66',
                                                    letterSpacing: '1px',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {c.code}
                                                </strong>
                                                <CopyButton text={c.code} iconOnly={true} style={{ padding: '4px 6px', borderRadius: '4px' }} />
                                            </div>
                                            
                                            {/* Offer Amount */}
                                            <h4 style={{ margin: '0.5rem 0 0.2rem', fontSize: '1.35rem', fontFamily: 'var(--font-title)', color: '#2D2A26', fontWeight: '700' }}>
                                                {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                                            </h4>
                                            
                                            <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: '#777' }}>
                                                Min order of ₹{c.minOrder.toLocaleString('en-IN')}
                                            </p>

                                            {/* Expiry Badge */}
                                            {(() => {
                                                if (!c.expiryDate) return null;
                                                const expiryDate = new Date(c.expiryDate);
                                                const today = new Date();
                                                today.setHours(0,0,0,0);
                                                expiryDate.setHours(0,0,0,0);
                                                
                                                const diffTime = expiryDate.getTime() - today.getTime();
                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                
                                                let badgeColor = '#666';
                                                let text = '';
                                                
                                                if (diffDays < 0) {
                                                    badgeColor = '#ef4444';
                                                    text = `Expired on ${new Date(c.expiryDate).toLocaleDateString()}`;
                                                } else if (diffDays === 0) {
                                                    badgeColor = '#d97706';
                                                    text = 'Expires today!';
                                                } else if (diffDays === 1) {
                                                    badgeColor = '#d97706';
                                                    text = 'Expires tomorrow!';
                                                } else if (diffDays <= 7) {
                                                    badgeColor = '#d97706';
                                                    text = `Expires in ${diffDays} days`;
                                                } else {
                                                    badgeColor = '#15803d';
                                                    text = `Expires in ${diffDays} days`;
                                                }
                                                
                                                return (
                                                    <div style={{ 
                                                        margin: '0.3rem auto 0', 
                                                        fontSize: '0.72rem', 
                                                        padding: '3px 8px', 
                                                        borderRadius: '4px',
                                                        backgroundColor: badgeColor + '10',
                                                        color: badgeColor,
                                                        fontWeight: '600',
                                                        display: 'inline-block' 
                                                    }}>
                                                        {text}
                                                    </div>
                                                );
                                            })()}

                                            {/* Status & Usage Bar */}
                                            <div style={{
                                                marginTop: '0.8rem',
                                                paddingTop: '0.6rem',
                                                borderTop: '1px dashed #eee',
                                                fontSize: '0.78rem',
                                                color: '#555'
                                            }}>
                                                <div>Status: <strong style={{ color: c.isActive ? '#15803d' : '#b91c1c' }}>{c.isActive ? 'Active' : 'Redeemed'}</strong></div>
                                                <div style={{ fontSize: '0.74rem', color: '#777', marginTop: '0.15rem' }}>
                                                    Used: {c.usedCount} / {c.usageLimit} times
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

export default ProfilePage;
