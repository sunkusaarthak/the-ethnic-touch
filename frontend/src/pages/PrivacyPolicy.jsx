import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
            }}>Privacy Policy</h1>

            <section style={{
                marginBottom: '4rem'
            }}>
                <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.05rem',
                    lineHeight: '1.7',
                    color: 'var(--color-text-light, #5c5c5c)'
                }}>
                    <p>At The Ethnic Touch, we value and respect your privacy. This policy outlines how we collect, use, and protect your personal information.</p>
                    <ul>
                        <li style={{ marginBottom: '1rem' }}><strong>Data Collection:</strong> We collect necessary information such as your name, email address, phone number, and shipping details when you create an account, place an order, or contact us.</li>
                        <li style={{ marginBottom: '1rem' }}><strong>Data Sharing:</strong> We maintain strict confidentiality of your data. We <strong>do not</strong> sell or share your personal data with any external third parties for marketing purposes. Your data is only shared with our trusted operational partners specifically required to fulfill your order:
                            <ul style={{ marginTop: '0.5rem', listStyleType: 'disc' }}>
                                <li style={{ marginBottom: '0.5rem' }}><strong>Razorpay:</strong> Our secure payment processor for securely handling your transactions.</li>
                                <li style={{ marginBottom: '0.5rem' }}><strong>Shipping Partners:</strong> Only the necessary delivery details are provided to our shipping partners to ensure your order reaches you safely.</li>
                            </ul>
                        </li>
                        <li><strong>Data Security:</strong> We implement industry-standard security measures to ensure your personal information is kept safe from unauthorized access.</li>
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
