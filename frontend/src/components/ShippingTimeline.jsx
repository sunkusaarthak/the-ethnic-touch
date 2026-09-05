import React, { useState, useEffect } from 'react';

const ShippingTimeline = ({ cutoffHour = 16 }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isToday, setIsToday] = useState(true);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            
            let cutoff = new Date();
            cutoff.setHours(cutoffHour, 0, 0, 0);

            let diffMs = cutoff.getTime() - now.getTime();

            // If past cutoff, next shipping is tomorrow
            if (diffMs <= 0) {
                // Next day's cutoff
                cutoff.setDate(cutoff.getDate() + 1);
                diffMs = cutoff.getTime() - now.getTime();
                setIsToday(false);
            } else {
                setIsToday(true);
            }

            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            if (isToday) {
                if (diffHrs < 3) {
                    setTimeLeft(`Order within ${diffHrs} hrs ${diffMins} mins for shipping today`);
                } else {
                    setTimeLeft(`Shipping today`);
                }
            } else {
                if (diffHrs < 24) {
                    setTimeLeft(`Order within ${diffHrs} hrs ${diffMins} mins for shipping tomorrow`);
                } else {
                    setTimeLeft(`Shipping tomorrow`);
                }
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [isToday, cutoffHour]);

    return (
        <div style={{marginTop: '0.3rem', padding: '0.5rem', backgroundColor: '#F5F9F1', borderRadius: '4px', fontSize: '0.75rem', color: '#2E7D32', border: '1px solid rgba(46, 125, 50, 0.2)'}}>
            <strong>Shipping Timeline:</strong> {timeLeft}
        </div>
    );
};

export default ShippingTimeline;
