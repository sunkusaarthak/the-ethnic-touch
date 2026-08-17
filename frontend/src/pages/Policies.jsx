import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Policies = () => {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                // Give a slight delay for layout rendering
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '2.5rem 5% 4rem 5%',
            minHeight: '100vh'
        }}>
            <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--color-primary)',
                marginBottom: '3rem',
                textAlign: 'center'
            }}>Store Policies & Contact</h1>

            <section id="privacy" style={sectionStyle}>
                <h2 style={headingStyle}>Privacy Policy</h2>
                <div style={contentStyle}>
                    <p>At The Ethnic Touch, we value and respect your privacy. This policy outlines how we collect, use, and protect your personal information.</p>
                    <p><strong>Data Collection:</strong> We collect necessary information such as your name, email address, phone number, and shipping details when you create an account, place an order, or contact us.</p>
                    <p><strong>Data Sharing:</strong> We maintain strict confidentiality of your data. We <strong>do not</strong> sell or share your personal data with any external third parties for marketing purposes. Your data is only shared with our trusted operational partners specifically required to fulfill your order:</p>
                    <ul>
                        <li><strong>Razorpay:</strong> Our secure payment processor for securely handling your transactions.</li>
                        <li><strong>Shipping Partners:</strong> Only the necessary delivery details are provided to our shipping partners to ensure your order reaches you safely.</li>
                    </ul>
                    <p><strong>Data Security:</strong> We implement industry-standard security measures to ensure your personal information is kept safe from unauthorized access.</p>
                </div>
            </section>

            <section id="refund" style={sectionStyle}>
                <h2 style={headingStyle}>Refund & Cancellation Policy</h2>
                <div style={contentStyle}>
                    <p><strong>Returns & Refunds:</strong> Please note that we maintain a strict <strong>No Returns</strong> policy for all orders. We encourage you to review your cart and size selections carefully before completing your purchase.</p>
                    <p><strong>Cancellations:</strong> If you wish to cancel an order, cancellation requests must be submitted in writing to our support team.</p>
                    <p>You must write to us within <strong>6 hours</strong> of placing the order. Once the 6-hour window has passed, or if the order has already been processed for shipping, the order cannot be canceled.</p>
                </div>
            </section>

            <section id="contact" style={sectionStyle}>
                <h2 style={headingStyle}>Contact Us</h2>
                <div style={contentStyle}>
                    <p>Have questions, need help with a cancellation, or want to know more about our products? We're here to help.</p>
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.5rem',
                        backgroundColor: 'var(--color-bg-alt, #fdfbf7)',
                        border: '1px solid var(--color-border, #e5e5e5)',
                        borderRadius: '8px'
                    }}>
                        <p style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <strong>Email:</strong> <a href="mailto:theethnictouchsupport@gmail.com" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>theethnictouchsupport@gmail.com</a>
                        </p>
                        <p style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            <strong>Phone:</strong> <a href="tel:+917674855289" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>+91 7674855289</a>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Styles
const sectionStyle = {
    marginBottom: '4rem',
    scrollMarginTop: '100px' // For smooth anchor scrolling offset
};

const headingStyle = {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.75rem',
    color: 'var(--color-primary)',
    borderBottom: '1px solid var(--color-border, #e5e5e5)',
    paddingBottom: '0.5rem',
    marginBottom: '1.5rem'
};

const contentStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '1.05rem',
    lineHeight: '1.7',
    color: 'var(--color-text-light, #5c5c5c)'
};

export default Policies;
