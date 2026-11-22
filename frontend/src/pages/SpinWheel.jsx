import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Gift, Copy, X, ArrowLeft, Loader2 } from 'lucide-react';
import { auth, API_BASE_URL } from '../data/config';
import { formatError } from '../utils/errors';

const logicalSegments = [
    { label: 'Free Kurthi', color: '#D4A373' }, // index 0
    { label: '5% OFF', color: '#FAEDCD' },     // index 1
    { label: '10% OFF', color: '#E9EDC9' },    // index 2
    { label: 'Better Luck Next Time', color: '#FEFAE0' }, // index 3
];

const segmentWidth = 360 / logicalSegments.length;
const wheelColors = logicalSegments.map(({ color }, index) =>
    color + ' ' + index * segmentWidth + 'deg ' + (index + 1) * segmentWidth + 'deg'
).join(', ');

const SpinWheel = () => {
    const navigate = useNavigate();
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [rotation, setRotation] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const [config, setConfig] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loadingConfig, setLoadingConfig] = useState(true);

    useEffect(() => {
        // Fetch config
        fetch(`${API_BASE_URL}/api/config/spin-wheel`)
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setLoadingConfig(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingConfig(false);
            });

        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                // If not logged in, prompt or redirect
                setError('Please log in to spin the wheel.');
                setProfile(null);
            } else {
                setError('');
                // Fetch profile to get spins
                user.getIdToken().then(token => {
                    fetch(`${API_BASE_URL}/api/profile/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-User-Id': user.uid
                        }
                    })
                    .then(res => res.json())
                    .then(data => setProfile(data))
                    .catch(console.error);
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSpin = async () => {
        if (isSpinning) return;
        if (!auth.currentUser) {
            navigate('/auth', { state: { returnUrl: '/spin-and-win' } });
            return;
        }

        setIsSpinning(true);
        setError('');
        setResult(null);

        try {
            const token = await auth.currentUser.getIdToken();
            const res = await fetch(`${API_BASE_URL}/api/spin-wheel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-User-Id': auth.currentUser.uid
                }
            });

            if (!res.ok) {
                throw new Error('Failed to spin. Please try again later.');
            }

            const data = await res.json();
            const targetSegment = data.segmentIndex;
            if (!Number.isInteger(targetSegment) || !logicalSegments[targetSegment]) {
                throw new Error('The spin result could not be displayed.');
            }
            const targetAngle = 360 - ((targetSegment + 0.5) * segmentWidth);
            // Keep the pointer away from the edge of the winning slice.
            const randomOffset = (Math.random() - 0.5) * (segmentWidth - 10);
            
            // Calculate absolute rotation so subsequent spins work correctly
            const currentSpins = Math.floor(rotation / 360);
            const baseRotation = (currentSpins + 5) * 360; // Add 5 full spins from current base
            
            const newRotation = baseRotation + targetAngle + randomOffset;
            setRotation(newRotation);

            // Wait for animation to finish (CSS transition is 4 seconds)
            setTimeout(() => {
                setIsSpinning(false);
                setResult(data);
                
                if (data.coupon) {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#D4A373', '#FAEDCD', '#E9EDC9']
                    });
                }
                
                // Deduct spin visually
                if (profile) {
                    setProfile({...profile, availableSpins: Math.max(0, profile.availableSpins - 1)});
                }

                setShowModal(true);
            }, 4000);

        } catch (err) {
            console.error(err);
            setError(formatError(err, 'An error occurred.'));
            setIsSpinning(false);
        }
    };

    const copyCoupon = () => {
        if (result?.coupon) {
            navigator.clipboard.writeText(result.coupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div style={{minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem'}}>
            <div style={{width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem'}}>
                <Link to="/" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-light)', textDecoration: 'none'}}>
                    <ArrowLeft size={20} /> Back to Home
                </Link>
            </div>

            <h1 style={{fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '0.5rem'}}>Spin & Win!</h1>
            
            {loadingConfig ? (
                <div style={{textAlign: 'center', padding: '2rem'}}><Loader2 className="spinner" size={32} color="var(--color-primary)" /></div>
            ) : config && !config.enabled ? (
                <div style={{textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '500px', width: '100%', margin: '0 auto'}}>
                    <h2 style={{color: 'var(--color-text)', marginBottom: '1rem'}}>Currently Unavailable</h2>
                    <p style={{color: 'var(--color-text-light)'}}>The Spin & Win feature is taking a short break. Please check back later!</p>
                </div>
            ) : (
                <>
                    <p style={{color: 'var(--color-text-light)', textAlign: 'center', marginBottom: '1rem', maxWidth: '500px'}}>
                        Spin for a free Kurthi or a discount on your next order. The slices show possible outcomes and do not represent the odds.
                    </p>
                    
                    {profile && (
                        <div style={{textAlign: 'center', marginBottom: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#FAEDCD', borderRadius: '50px', display: 'inline-block', fontWeight: 'bold', color: 'var(--color-primary)', border: '2px solid var(--color-primary)'}}>
                            Available Spins: {profile.availableSpins || 0}
                        </div>
                    )}

            {error && (
                <div style={{backgroundColor: '#ffebee', color: '#c62828', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <span>{error}</span>
                    {error.includes('log in') && (
                        <button onClick={() => navigate('/auth', { state: { returnUrl: '/spin-and-win' } })} style={{padding: '0.5rem 1rem', background: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                            Login Now
                        </button>
                    )}
                </div>
            )}

            <div style={{position: 'relative', width: '300px', height: '300px', margin: '0 auto'}}>
                {/* The Pointer */}
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderTop: '30px solid var(--color-primary)',
                    zIndex: 10,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}></div>

                {/* The Wheel */}
                <div 
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
                        transform: `rotate(${rotation}deg)`,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        border: '5px solid white',
                        background: 'conic-gradient(' + wheelColors + ')'
                    }}
                >
                    {logicalSegments.map((segment, index) => {
                        const angle = (index + 0.5) * segmentWidth;
                        return (
                            <div key={index} style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-95px)`,
                                textAlign: 'center',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                color: segment.color === '#D4A373' ? 'white' : 'var(--color-text)',
                                width: '100px',
                                textShadow: segment.color === '#D4A373' ? '0 1px 2px rgba(0,0,0,0.3)' : 'none',
                                lineHeight: '1.2'
                            }}>
                                {segment.label}
                            </div>
                        );
                    })}
                </div>
                
                {/* Center dot */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '30px',
                    height: '30px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    zIndex: 5
                }}></div>
            </div>

            <button 
                onClick={handleSpin} 
                disabled={isSpinning || !!error || (profile && profile.availableSpins <= 0)}
                style={{
                    marginTop: '3rem',
                    padding: '1rem 3rem',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: isSpinning || error || (profile && profile.availableSpins <= 0) ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(212, 163, 115, 0.4)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: isSpinning || error || (profile && profile.availableSpins <= 0) ? 0.7 : 1
                }}
            >
                {isSpinning ? (
                    <><Loader2 size={20} className="spinner" /> Spinning...</>
                ) : 'SPIN THE WHEEL'}
            </button>
            
            {profile && profile.availableSpins <= 0 && !error && !isSpinning && (
                <p style={{marginTop: '1rem', color: '#c62828', fontWeight: '500'}}>You have 0 spins left. Place an order to earn more!</p>
            )}

            {/* Result Modal */}
            {showModal && result && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2.5rem',
                        borderRadius: '20px',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center',
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
                    }}>
                        <button 
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute', top: '15px', right: '15px',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--color-text-light)'
                            }}
                        >
                            <X size={24} />
                        </button>

                        {result.coupon ? (
                            <>
                                <div style={{width: '80px', height: '80px', backgroundColor: '#FAEDCD', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'}}>
                                    <Gift size={40} color="var(--color-primary)" />
                                </div>
                                <h2 style={{fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '0.5rem'}}>Congratulations!</h2>
                                <p style={{color: 'var(--color-text)', marginBottom: '0.5rem', fontSize: '1.1rem'}}>
                                    You won <strong>{logicalSegments[result.segmentIndex].label}</strong>!
                                </p>
                                <p style={{color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem', fontStyle: 'italic'}}>
                                    {result.coupon.code.includes('KURTHI') ? 
                                        "(This discount is exclusively applicable to a single Kurthi in your cart.)" : 
                                        "(This discount is applicable to your entire cart total!)"}
                                </p>
                                
                                <div style={{
                                    backgroundColor: '#f5f5f5', border: '2px dashed var(--color-primary)',
                                    padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <span style={{fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--color-text)'}}>
                                        {result.coupon.code}
                                    </span>
                                    <button 
                                        onClick={copyCoupon}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem'
                                        }}
                                        title="Copy to clipboard"
                                    >
                                        <Copy size={20} /> {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                
                                <Link 
                                    to="/shop"
                                    style={{
                                        display: 'inline-block', padding: '0.8rem 2rem',
                                        backgroundColor: 'var(--color-primary)', color: 'white',
                                        textDecoration: 'none', borderRadius: '8px', fontWeight: '600'
                                    }}
                                >
                                    Shop Now
                                </Link>
                            </>
                        ) : (
                            <>
                                <h2 style={{fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '1rem'}}>Aww!</h2>
                                <p style={{color: 'var(--color-text)', marginBottom: '2rem', fontSize: '1.1rem'}}>
                                    {logicalSegments[result.segmentIndex].label}. Don't worry, you can try again later!
                                </p>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '0.8rem 2rem', backgroundColor: 'var(--color-primary)', 
                                        color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
                                    }}
                                >
                                    Continue Shopping
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
            </>
            )}
        </div>
    );
};

export default SpinWheel;
