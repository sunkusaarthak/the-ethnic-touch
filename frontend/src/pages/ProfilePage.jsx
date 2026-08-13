import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, Link, useLocation, useParams, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import CopyButton from '../components/CopyButton';
import { signOut } from 'firebase/auth';
import { auth, API_BASE_URL } from '../data/config';
import apiClient from '../utils/apiClient';

const ProfilePage = ({ authUser }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState('create');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [successVisible, setSuccessVisible] = useState(false);
    const redirectTimer = useRef(null);
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

    const validateProfileForm = (cleaned) => {
        if (!cleaned.fullName) {
            return 'Please enter your full name.';
        }
        if (!/^[A-Za-z][A-Za-z\s.'-]{1,79}$/.test(cleaned.fullName)) {
            return 'Please enter a valid full name.';
        }
        if (!cleaned.phone) {
            return 'Please enter your phone number.';
        }
        if (!/^\+?[0-9()\-\s]{8,15}$/.test(cleaned.phone)) {
            return 'Please enter a valid phone number.';
        }
        if (cleaned.address || cleaned.city || cleaned.state || cleaned.zipCode) {
            if (!cleaned.address || cleaned.address.length < 3) {
                return 'Please enter a complete address.';
            }
            if (!cleaned.city || cleaned.city.length < 2 || !cleaned.state || cleaned.state.length < 2) {
                return 'Please enter a valid city and state.';
            }
            if (!cleaned.zipCode || !/^[A-Za-z0-9\-\s]{3,12}$/.test(cleaned.zipCode)) {
                return 'Please enter a valid ZIP or postal code.';
            }
        }
        if (cleaned.styleNotes && cleaned.styleNotes.length > 500) {
            return 'Style notes must be 500 characters or fewer.';
        }
        return '';
    };

    const loadAddresses = async () => {
        if (!authUser) return;
        try {
            const data = await apiClient.get('/api/profile/addresses', { headers: { 'X-User-Id': authUser.uid } });
            if (Array.isArray(data)) {
                setAddresses(data);
                if (data.length > 0) {
                    const def = data.find(a => a.isDefault) || data[0];
                    setForm(prev => ({
                        ...prev,
                        fullName: prev.fullName || def.fullName || '',
                        phone: prev.phone || def.phone || '',
                        address: prev.address || def.addressLine || '',
                        city: prev.city || def.city || '',
                        state: prev.state || def.state || '',
                        zipCode: prev.zipCode || def.zipCode || ''
                    }));
                }
            }
        } catch (err) {
            console.error("[ProfilePage] loadAddresses error:", err);
        }
    };

    const loadOrdersAndCoupons = async () => {
        if (!authUser) return;
        try {
            const data = await apiClient.get('/api/profile/orders', { headers: { 'X-User-Id': authUser.uid } });
            if (Array.isArray(data)) {
                setOrders(data);
            }
            
            const cData = await apiClient.get('/api/profile/coupons', { headers: { 'X-User-Id': authUser.uid } });
            if (Array.isArray(cData)) {
                setCoupons(cData);
            }
        } catch (err) {
            console.error("[ProfilePage] loadOrdersAndCoupons error:", err);
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setAddressMessage('');
        try {
            await apiClient.post('/api/profile/addresses', addressForm, { headers: { 'X-User-Id': authUser.uid } });
            setAddressForm({ id: 0, fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
            setShowAddressForm(false);
            loadAddresses();
        } catch (err) {
            setAddressMessage(err.message || 'Failed to save address');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await apiClient.delete(`/api/profile/addresses?id=${id}`, { headers: { 'X-User-Id': authUser.uid } });
            loadAddresses();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetDefaultAddress = async (id) => {
        try {
            await apiClient.patch(`/api/profile/addresses?id=${id}`, {}, { headers: { 'X-User-Id': authUser.uid } });
            loadAddresses();
            // Also reload profile details since primary profile address is bidirectionally synced
            const profile = await apiClient.get('/api/profile/me', { headers: { 'X-User-Id': authUser.uid } });
            if (profile) {
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
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!authUser) return;

        const loadProfile = async () => {
            // Pre-fill fallback details from authUser and local storage
            let initial = {
                fullName: authUser.displayName || '',
                email: authUser.email || '',
                phone: authUser.phoneNumber ? authUser.phoneNumber.replace(/^\+91/, '') : '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                preferredSize: '',
                styleNotes: ''
            };

            try {
                const cached = localStorage.getItem(`tet_profile_${authUser.uid}`) || localStorage.getItem('tet_user_profile');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (parsed && typeof parsed === 'object') {
                        initial = {
                            fullName: parsed.fullName || initial.fullName,
                            email: parsed.email || initial.email,
                            phone: parsed.phone || initial.phone,
                            address: parsed.address || parsed.addressLine || initial.address,
                            city: parsed.city || initial.city,
                            state: parsed.state || initial.state,
                            zipCode: parsed.zipCode || initial.zipCode,
                            preferredSize: parsed.preferredSize || initial.preferredSize,
                            styleNotes: parsed.styleNotes || initial.styleNotes
                        };
                    }
                }
            } catch (e) {}

            let activeForm = { ...initial };
            let hasData = Boolean(activeForm.fullName || activeForm.email || activeForm.phone || activeForm.address);

            setForm(activeForm);
            if (hasData) {
                setMode('edit');
                setIsEditing(false);
            }

            try {
                const profile = await apiClient.get('/api/profile/me', { headers: { 'X-User-Id': authUser.uid } });
                if (profile) {
                    const updated = {
                        fullName: profile.fullName || activeForm.fullName,
                        email: profile.email || activeForm.email,
                        phone: profile.phone || activeForm.phone,
                        address: profile.address || activeForm.address,
                        city: profile.city || activeForm.city,
                        state: profile.state || activeForm.state,
                        zipCode: profile.zipCode || activeForm.zipCode,
                        preferredSize: profile.preferredSize || activeForm.preferredSize,
                        styleNotes: profile.styleNotes || activeForm.styleNotes
                    };
                    setForm(updated);
                    localStorage.setItem(`tet_profile_${authUser.uid}`, JSON.stringify(updated));
                    setMode('edit');
                    setIsEditing(false);
                }
            } catch (error) {
                if (error.status === 404) {
                    if (hasData) {
                        setMode('edit');
                        setIsEditing(false);
                    } else {
                        setMode('create');
                        setIsEditing(true);
                    }
                } else {
                    console.error("[ProfilePage] Load profile error:", error);
                }
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
            const profile = await apiClient.post('/api/profile/me', cleaned);

            if (cleaned.address && cleaned.city && cleaned.state && cleaned.zipCode) {
                try {
                    await apiClient.post('/api/profile/addresses', {
                        fullName: cleaned.fullName,
                        phone: cleaned.phone,
                        addressLine: cleaned.address,
                        city: cleaned.city,
                        state: cleaned.state,
                        zipCode: cleaned.zipCode,
                        isDefault: true
                    });
                } catch (addrErr) {
                    console.warn("[ProfilePage] Address sync notice:", addrErr);
                }
            }

            const updated = {
                fullName: profile.fullName || cleaned.fullName,
                email: profile.email || cleaned.email,
                phone: profile.phone || cleaned.phone,
                address: profile.address || cleaned.address,
                city: profile.city || cleaned.city,
                state: profile.state || cleaned.state,
                zipCode: profile.zipCode || cleaned.zipCode,
                preferredSize: profile.preferredSize || cleaned.preferredSize,
                styleNotes: profile.styleNotes || cleaned.styleNotes
            };
            setForm(updated);
            localStorage.setItem(`tet_profile_${authUser.uid}`, JSON.stringify(updated));
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
            <div style={{ maxWidth: '1100px', margin: '2.5rem auto 3rem', padding: '0 1.25rem', minHeight: '75vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="skeleton-box" style={{ height: '42px', width: '220px', borderRadius: '8px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        <div className="skeleton-box" style={{ height: '240px', borderRadius: '16px' }} />
                        <div className="skeleton-box" style={{ height: '240px', borderRadius: '16px' }} />
                        <div className="skeleton-box" style={{ height: '240px', borderRadius: '16px' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Header Section */}
            <div className="profile-header-card">
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
                    boxShadow: '0 4px 10px rgba(185, 122, 102, 0.25)',
                    flexShrink: 0
                }}>
                    {form.fullName ? form.fullName.trim().charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h1 className="page-title" style={{ margin: 0, color: 'var(--color-text)' }}>
                        {form.fullName || 'Welcome to The Ethnic Touch'}
                    </h1>
                    <p style={{ margin: '0.15rem 0 0', color: 'var(--color-text-light)', fontSize: 'var(--font-size-sm)' }}>{authUser.email}</p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="profile-dashboard-grid">
                
                {/* Sidemenu Panel */}
                <div className="profile-sidebar-panel">
                    <ul className="profile-nav-menu" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li 
                            onClick={() => { setActiveTab('profile'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                        >
                            My Profile
                        </li>
                        <li 
                            onClick={() => { setActiveTab('addresses'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            className={`profile-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                        >
                            Shipping Addresses
                        </li>
                        <li 
                            onClick={() => { setActiveTab('orders'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                        >
                            Order History
                        </li>
                        <li 
                            onClick={() => { setActiveTab('coupons'); setSuccessVisible(false); setMessage({ type: '', text: '' }); }}
                            className={`profile-nav-item ${activeTab === 'coupons' ? 'active' : ''}`}
                        >
                            My Coupons
                        </li>
                        <li 
                            onClick={() => {
                                if (auth) {
                                    signOut(auth).then(() => {
                                        window.location.hash = "#/";
                                    });
                                }
                            }}
                            className="profile-nav-item signout"
                        >
                            Sign Out
                        </li>
                    </ul>
                </div>

                {/* Content Panel */}
                <div className="profile-content-panel">
                    
                    {/* TAB: PROFILE */}
                    {activeTab === 'profile' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                <h2 className="section-title" style={{ margin: 0, color: 'var(--color-text)' }}>Account Profile</h2>
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
                                            fontSize: 'var(--font-size-sm)',
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
                                    fontSize: 'var(--font-size-sm)'
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
                                    <span style={{ fontSize: '2.5rem', color: '#2e7d32' }}>✓</span>
                                    <h4 className="subsection-title" style={{ margin: '0.5rem 0 0.2rem', color: '#2e7d32' }}>Profile Updated Successfully!</h4>
                                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-light)' }}>Your profile has been saved.</p>
                                </div>
                            )}

                            {(!isEditing && mode === 'edit') ? (
                                <div className="form-grid-2">
                                    <div className="profile-info-block">
                                        <span className="profile-info-label">Full Name</span>
                                        <p className="profile-info-value">{form.fullName || '-'}</p>
                                    </div>
                                    <div className="profile-info-block">
                                        <span className="profile-info-label">Email Address</span>
                                        <p className="profile-info-value">{form.email || '-'}</p>
                                    </div>
                                    <div className="profile-info-block">
                                        <span className="profile-info-label">Phone Number</span>
                                        <p className="profile-info-value">{form.phone || '-'}</p>
                                    </div>
                                    <div className="profile-info-block">
                                        <span className="profile-info-label">ZIP / Postal Code</span>
                                        <p className="profile-info-value">{form.zipCode || '-'}</p>
                                    </div>
                                    <div className="profile-info-block form-span-2">
                                        <span className="profile-info-label">Primary Shipping Address</span>
                                        <p className="profile-info-value">
                                            {form.address ? `${form.address}, ${form.city}, ${form.state} - ${form.zipCode}` : '-'}
                                        </p>
                                    </div>
                                    <div className="profile-info-block">
                                        <span className="profile-info-label">Preferred Size</span>
                                        <p className="profile-info-value">{form.preferredSize || 'Not set'}</p>
                                    </div>
                                    <div className="profile-info-block form-span-2">
                                        <span className="profile-info-label">Style Preferences & Notes</span>
                                        <p className="profile-info-value">{form.styleNotes || 'None added'}</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="form-grid-2">
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label">Email Address (Required)</label>
                                        <input 
                                            type="email" 
                                            value={form.email} 
                                            readOnly 
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Full Name *</label>
                                        <input 
                                            type="text" 
                                            required 
                                            placeholder="Enter your full name"
                                            value={form.fullName}
                                            onChange={e => setForm({ ...form, fullName: e.target.value })}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Phone Number *</label>
                                        <input 
                                            type="tel" 
                                            required 
                                            placeholder="10-digit number"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="form-control"
                                        />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>Shipping Address Line (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="Apartment, Street Address"
                                            value={form.address}
                                            onChange={e => setForm({ ...form, address: e.target.value })}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>City (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="City Name"
                                            value={form.city}
                                            onChange={e => setForm({ ...form, city: e.target.value })}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>State (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="State Name"
                                            value={form.state}
                                            onChange={e => setForm({ ...form, state: e.target.value })}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.4rem', color: '#555' }}>ZIP / Postal Code (Optional)</label>
                                        <input 
                                            type="text" 
                                            placeholder="6-digit PIN code"
                                            value={form.zipCode}
                                            onChange={e => setForm({ ...form, zipCode: e.target.value })}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Preferred Sizing (Optional)</label>
                                        <select 
                                            value={form.preferredSize} 
                                            onChange={e => setForm({ ...form, preferredSize: e.target.value })}
                                            className="form-control"
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
                                        <label className="form-label">Style Preferences & Special Instructions</label>
                                        <textarea 
                                            rows="3" 
                                            placeholder="Tell us what fit, patterns or fabrics you love"
                                            value={form.styleNotes}
                                            onChange={e => setForm({ ...form, styleNotes: e.target.value })}
                                            className="form-control"
                                        />
                                    </div>
                                    <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
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
                                <h2 className="section-title" style={{ margin: 0, color: 'var(--color-text)' }}>Saved Addresses Book</h2>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setAddressForm({ id: 0, fullName: '', phone: '', addressLine: '', city: '', state: '', zipCode: '' });
                                        setAddressMessage('');
                                        setShowAddressForm(!showAddressForm);
                                    }}
                                    className="btn btn-primary" 
                                    style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', fontSize: 'var(--font-size-sm)' }}
                                >
                                    {showAddressForm ? 'Close Form' : '+ Add Address'}
                                </button>
                            </div>

                            {showAddressForm && (
                                <form onSubmit={handleAddressSubmit} className="form-grid-2" style={{ 
                                    background: '#fafafa', 
                                    padding: '1.5rem', 
                                    borderRadius: '8px', 
                                    border: '1px solid #eee',
                                    marginBottom: '2rem' 
                                }}>
                                    <h4 className="subsection-title" style={{ gridColumn: 'span 2', margin: '0 0 0.5rem' }}>
                                        {addressForm.id > 0 ? 'Edit Shipping Address' : 'New Shipping Address'}
                                    </h4>
                                    
                                    {addressMessage && <p style={{ gridColumn: 'span 2', color: 'red', margin: 0, fontSize: 'var(--font-size-sm)' }}>{addressMessage}</p>}

                                    <div>
                                        <label className="form-label">Full Name *</label>
                                        <input type="text" required value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} className="form-control" />
                                    </div>
                                    <div>
                                        <label className="form-label">Contact Phone *</label>
                                        <input type="text" required value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="form-control" />
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label">Address Line *</label>
                                        <input type="text" required value={addressForm.addressLine} onChange={e => setAddressForm({...addressForm, addressLine: e.target.value})} className="form-control" />
                                    </div>
                                    <div>
                                        <label className="form-label">City *</label>
                                        <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="form-control" />
                                    </div>
                                    <div>
                                        <label className="form-label">State *</label>
                                        <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="form-control" />
                                    </div>
                                    <div>
                                        <label className="form-label">ZIP Code *</label>
                                        <input type="text" required value={addressForm.zipCode} onChange={e => setAddressForm({...addressForm, zipCode: e.target.value})} className="form-control" />
                                    </div>
                                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary" style={{ padding: '0.5rem 1rem', borderRadius: '4px', fontSize: 'var(--font-size-sm)' }}>Cancel</button>
                                        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '4px', fontSize: 'var(--font-size-sm)' }}>Save Address</button>
                                    </div>
                                </form>
                            )}

                            {addresses.length === 0 ? (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>No shipping addresses added yet.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                                    {addresses.map(addr => (
                                        <div key={addr.id} style={{
                                            border: '1px solid #eee',
                                            padding: '1.25rem',
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
                            <h2 className="section-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem', color: 'var(--color-text)' }}>Order History</h2>
                            {orders.length === 0 ? (
                                <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>You have not placed any orders yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {orders.map(order => (
                                        <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.25rem', backgroundColor: '#fafafa' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', borderBottom: '1px solid #eee', paddingBottom: '0.8rem', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                    <span style={{ fontSize: 'var(--font-size-sm)', color: '#888' }}>Order ID:</span>
                                                    <span style={{ fontWeight: '600', fontFamily: 'monospace', fontSize: 'var(--font-size-input)' }}>{order.id}</span>
                                                    <CopyButton text={order.id} label="Copy ID" />
                                                </div>
                                                <div>
                                                    <span style={{ fontSize: 'var(--font-size-sm)', color: '#b97a66', fontWeight: '500', textTransform: 'uppercase' }}>{order.status}</span>
                                                </div>
                                            </div>

                                            <div className="form-grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                                                <div>
                                                    <h5 style={{ margin: '0 0 0.5rem', fontSize: 'var(--font-size-xs)', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items</h5>
                                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                        {order.items && order.items.map((it, idx) => {
                                                             const qty = it.quantity || 1;
                                                             const unitPrice = it.priceAtQty || 0;
                                                             const lineTotal = unitPrice * qty;
                                                             return (
                                                                 <li key={it.productId || idx} style={{ fontSize: 'var(--font-size-sm)', color: '#333', padding: '0.4rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                     <div>
                                                                         <span>{it.productName || it.productId}</span>
                                                                         {it.size && (
                                                                             <span style={{ fontSize: 'var(--font-size-xs)', background: '#fff0e9', color: '#b97a66', padding: '1px 6px', borderRadius: '4px', marginLeft: '6px', fontWeight: '500' }}>
                                                                                 Size: {it.size}
                                                                             </span>
                                                                         )}
                                                                         <strong style={{ marginLeft: '6px', color: '#555' }}>x {qty}</strong>
                                                                     </div>
                                                                     <div style={{ textAlign: 'right' }}>
                                                                         <span style={{ fontWeight: '500' }}>₹{lineTotal.toLocaleString('en-IN')}</span>
                                                                         {qty > 1 && (
                                                                             <span style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: '#888' }}>
                                                                                 (₹{unitPrice.toLocaleString('en-IN')} each)
                                                                             </span>
                                                                         )}
                                                                     </div>
                                                                 </li>
                                                             );
                                                         })}
                                                    </ul>
                                                </div>
                                                <div style={{ borderLeft: '1px solid #eee', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <div style={{ marginBottom: '0.5rem' }}>
                                                        <span style={{ fontSize: 'var(--font-size-xs)', color: '#888' }}>Date:</span>
                                                        <span style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                                                    </div>
                                                    <div>
                                                        <span style={{ fontSize: 'var(--font-size-xs)', color: '#888' }}>Total Amount Paid:</span>
                                                        <span style={{ display: 'block', fontSize: 'var(--font-size-h3)', color: '#b97a66', fontWeight: '600' }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {order.trackingNumber && (
                                                <div style={{ marginTop: '1rem', background: '#eaf3fc', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: 'var(--font-size-sm)', color: '#1a5695' }}>
                                                        Carrier Tracking Number: <strong style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</strong>
                                                    </span>
                                                    <CopyButton text={order.trackingNumber} label="Copy Tracking ID" />
                                                </div>
                                            )}

                                            {order.unlockedGift && (
                                                <div style={{ marginTop: '0.8rem', background: '#fff9e6', padding: '0.75rem 1rem', border: '1px dashed #fcd34d', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    <span style={{ fontSize: 'var(--font-size-sm)', color: '#854d0e' }}>
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
                            <h2 className="section-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem', color: 'var(--color-text)' }}>My Loyalty Coupons</h2>
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
