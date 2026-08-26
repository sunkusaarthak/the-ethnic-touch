import React, { useState, useEffect, useRef } from 'react';
import { useAlert } from '../context/AlertContext';
import { User, Mail, Phone, Clipboard, CheckCircle, ChevronRight, Send } from 'lucide-react';
import './ContactUs.css';

const ContactUs = () => {
    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        orderId: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    
    // Animation states: 'idle' | 'launching' | 'flying' | 'delivered' | 'success'
    const [animState, setAnimState] = useState('idle');
    const [launchCoords, setLaunchCoords] = useState({ x: 0, y: 0 });
    const buttonRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        // Temporarily make the global footer seamless for this page
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.style.marginTop = '0';
            footer.style.borderTop = 'none';
            footer.style.backgroundColor = '#fdfbf7';
        }
        
        return () => {
            // Restore original styles on unmount
            if (footer) {
                footer.style.marginTop = '';
                footer.style.borderTop = '';
                footer.style.backgroundColor = '';
            }
        };
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Capture button coordinates relative to the animation wrapper
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const wrapperRect = document.querySelector('.form-animation-wrapper').getBoundingClientRect();
            setLaunchCoords({
                x: rect.left - wrapperRect.left + (rect.width / 2),
                y: rect.top - wrapperRect.top + (rect.height / 2)
            });
        } else {
            // Fallback default
            setLaunchCoords({ x: 100, y: 400 });
        }

        setAnimState('launching');
        setLoading(true);
        const startTime = Date.now();

        // 1. Transition to flying
        setTimeout(() => {
            setAnimState(prev => prev === 'launching' ? 'flying' : prev);
        }, 800);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Failed to send message. Please try again later.");
            
            // Calculate remaining minimum flight time (2500ms total)
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 2500 - elapsedTime);
            
            setTimeout(() => {
                setAnimState('delivered');
                setTimeout(() => {
                    setAnimState('success');
                    setFormData({ name: '', email: '', phone: '', orderId: '', message: '' });
                    setLoading(false);
                }, 800); // Wait for delivery animation to finish
            }, remainingTime);

        } catch (err) {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, 1000 - elapsedTime);
            setTimeout(() => {
                showAlert(err.message, "error");
                setAnimState('idle');
                setLoading(false);
            }, remainingTime);
        }
    };

    // SVG Ornament components for clean code
    const DividerOrnament = () => (
        <svg width="40" height="10" viewBox="0 0 40 10" fill="none" stroke="currentColor">
            <path d="M0 5h12M28 5h12" strokeWidth="1"/>
            <path d="M20 1l3 4-3 4-3-4 3-4z" strokeWidth="1.5"/>
        </svg>
    );

    return (
        <div className="contact-page-wrapper">
            {/* Silk Background Textures */}
            <div className="silk-bg-top-left"></div>
            <div className="silk-bg-bottom-right"></div>

            <div className="contact-container">
                
                {/* Header */}
                <div className="contact-header">
                    <h1 className="contact-title">Contact Us</h1>
                    <div className="ornament-divider">
                        <DividerOrnament />
                    </div>
                    <p className="contact-subtitle">
                        Have questions, need help with a cancellation, or want to know more about our products? We're here to help.
                    </p>
                </div>

                {/* Main Grid */}
                <div className="contact-grid">
                    
                    {/* SVG Embroidery Thread Connecting Card to Button */}
                    <svg className="embroidery-thread-svg" viewBox="0 0 450 500" preserveAspectRatio="none">
                        <path className="thread-path" d="M -50 0 C 150 10, 20 200, 150 350 S 350 350, 400 480" />
                        <circle className="thread-glow-dot" cx="400" cy="480" r="4" />
                        <path className="thread-path" style={{animationDelay: '1s'}} d="M 100 120 Q 90 100 110 90 Q 110 110 100 120" fill="none"/>
                        <path className="thread-path" style={{animationDelay: '1s'}} d="M 100 120 Q 120 110 130 130 Q 110 130 100 120" fill="none"/>
                    </svg>

                    {/* Left Contact Card */}
                    <div className="contact-card-mockup">
                        <div className="card-ornament">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2v6M12 16v6M2 12h6M16 12h6M8 8l8 8M16 8l-8 8" strokeWidth="1.5"/>
                            </svg>
                        </div>
                        <h2 className="contact-card-title">Get in Touch</h2>
                        <div className="ornament-divider" style={{justifyContent: 'flex-start', margin: '0.5rem 0 1.5rem 0', width: '50px'}}>
                            <svg width="30" height="6" viewBox="0 0 30 6" fill="none" stroke="currentColor">
                                <path d="M0 3h10M20 3h10" strokeWidth="1"/><circle cx="15" cy="3" r="2" fill="currentColor"/>
                            </svg>
                        </div>

                        <div className="contact-item" onClick={() => window.location.href='mailto:theethnictouchsupport@gmail.com'}>
                            <div className="icon-circle">
                                <Mail size={20} strokeWidth={1.5} />
                            </div>
                            <div className="contact-details">
                                <h4>Email</h4>
                                <p>theethnictouchsupport@gmail.com</p>
                            </div>
                            <ChevronRight size={18} className="arrow-right" />
                        </div>

                        <div className="contact-item" onClick={() => window.location.href='tel:+917674855289'}>
                            <div className="icon-circle">
                                <Phone size={20} strokeWidth={1.5} />
                            </div>
                            <div className="contact-details">
                                <h4>Phone</h4>
                                <p>+91 7674855289</p>
                            </div>
                            <ChevronRight size={18} className="arrow-right" />
                        </div>
                    </div>

                    {/* Right Form Area (Animation Wrapper) */}
                    <div className="form-animation-wrapper">
                        {animState === 'success' ? (
                            <div className="contact-form success-overlay fade-in">
                                <CheckCircle size={64} color="#B27B50" style={{marginBottom: '1rem'}} />
                                <h2 className="contact-title" style={{fontSize: '2.5rem'}}>Message Sent!</h2>
                                <p className="contact-subtitle" style={{marginBottom: '2rem'}}>
                                    Thank You!<br/>We've received your message and our team will get back to you soon.
                                </p>
                                <button onClick={() => setAnimState('idle')} className="btn-submit-mockup" style={{width: 'auto', display: 'inline-flex', padding: '1rem 2rem', margin: '0 auto'}}>
                                    Send Another Message <Send size={18} style={{marginLeft: '0.5rem'}} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <form className={`contact-form ${animState !== 'idle' ? 'fade-out' : ''}`} onSubmit={handleSubmit}>
                                    <div className="form-group-mockup">
                                        <label>Full Name *</label>
                                        <div className="input-wrapper">
                                            <User size={18} className="input-icon" />
                                            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
                                        </div>
                                    </div>
                                    
                                    <div className="form-group-mockup">
                                        <label>Email Address *</label>
                                        <div className="input-wrapper">
                                            <Mail size={18} className="input-icon" />
                                            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                                        </div>
                                    </div>

                                    <div className="form-group-mockup">
                                        <label>Phone Number</label>
                                        <div className="input-wrapper">
                                            <Phone size={18} className="input-icon" />
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
                                        </div>
                                    </div>

                                    <div className="form-group-mockup">
                                        <label>Order ID (Optional)</label>
                                        <div className="input-wrapper">
                                            <Clipboard size={18} className="input-icon" />
                                            <input type="text" name="orderId" value={formData.orderId} onChange={handleChange} placeholder="For cancellation requests" />
                                        </div>
                                    </div>

                                    <div className="form-group-mockup">
                                        <label>Message *</label>
                                        <div className="input-wrapper">
                                            <textarea name="message" required rows="5" value={formData.message} onChange={handleChange} placeholder="How can we help you?" style={{ resize: 'none' }}></textarea>
                                            <div className="textarea-icon">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M0 10L10 0v2L2 12H0v-2z"/></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="submit-area">
                                        <button ref={buttonRef} type="submit" disabled={loading} className={`btn-submit-mockup ${animState !== 'idle' ? 'button-launching' : ''}`}>
                                            <span className="btn-text">{loading ? 'Sending your message...' : 'Send Message'}</span>
                                            {!loading && <Send size={20} className="btn-icon-send" />}
                                        </button>
                                        <div className="reply-text">
                                            <CheckCircle size={14} /> We typically reply within 24 hours
                                        </div>
                                    </div>
                                </form>

                                {/* Airplane Delivery Animation Overlay */}
                                {animState !== 'idle' && (
                                    <div className={`airplane-scene state-${animState}`}>
                                        <div className="scene-text">
                                            {animState === 'launching' && 'Your message is on its way!'}
                                            {animState === 'flying' && 'Delivering...'}
                                            {animState === 'delivered' && 'Almost there!'}
                                        </div>

                                        <div className="airplane-container" style={{
                                            '--start-x': `${launchCoords.x}px`,
                                            '--start-y': `${launchCoords.y}px`
                                        }}>
                                            <svg className="paper-airplane" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="#fffcf8"/>
                                            </svg>
                                            <div className="trail-particles"></div>
                                        </div>
                                        
                                        <div className="destination-mailbox">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="1.5"/>
                                                <polyline points="22,6 12,13 2,6" strokeWidth="1.5"/>
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactUs;
