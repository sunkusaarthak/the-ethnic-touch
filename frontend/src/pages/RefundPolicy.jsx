import React, { useEffect } from 'react';

const RefundPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '2.5rem 5% 4rem 5%'
        }}>
            <h1 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                color: 'var(--color-primary)',
                marginBottom: '3rem',
                textAlign: 'center'
            }}>Refund & Cancellation Policy</h1>

            <section style={{
                marginBottom: '1rem'
            }}>
                <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.05rem',
                    lineHeight: '1.7',
                    color: 'var(--color-text-light, #5c5c5c)'
                }}>
                    <p><strong>Returns & Refunds:</strong> Please note that we maintain a strict <strong>No Returns</strong> policy for all orders. We encourage you to review your cart and size selections carefully before completing your purchase.</p>
                    <p><strong>Cancellations:</strong> If you wish to cancel an order, cancellation requests must be submitted in writing to our support team.</p>
                    <p>You must write to us within <strong>6 hours</strong> of placing the order. Once the 6-hour window has passed, or if the order has already been processed for shipping, the order cannot be canceled.</p>
                </div>
            </section>
        </div>
    );
};

export default RefundPolicy;
