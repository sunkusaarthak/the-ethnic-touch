import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const defaultReviews = [
    {
        id: 1,
        author: "Ananya R.",
        location: "Hyderabad",
        initials: "AR",
        productWorn: "Mustard Yellow Mandala Print Kurti",
        rating: 5,
        quote: "Visited their store near Khajaguda Lake and bought 2 cotton kurtis. The fabric is so soft and comfortable in the Hyderabad heat. Great prices too!"
    },
    {
        id: 2,
        author: "Sneha K.",
        location: "Hyderabad",
        initials: "SK",
        productWorn: "Pink Paisley Straight Kurti",
        rating: 5,
        quote: "Ordered online and received in 3 days. The pink paisley print looks even prettier in person. Perfect for office wear."
    },
    {
        id: 3,
        author: "Pooja M.",
        location: "Vizag",
        initials: "PM",
        productWorn: "Olive Green Floral Short Kurti",
        rating: 5,
        quote: "Finally found affordable pure cotton kurtis under ₹550 that don't shrink or fade after washing. Highly recommended!"
    }
];

const PatronReviews = ({ reviews: backendReviews }) => {
    const rawReviews = (backendReviews && backendReviews.length > 0) ? backendReviews : defaultReviews;
    const reviews = rawReviews.map(item => {
        let loc = item.location;
        if (item.author === 'Sneha K.' || item.id === 2) loc = 'Hyderabad';
        if (item.author === 'Pooja M.' || item.id === 3) loc = 'Vizag';
        if (item.author === 'Ananya R.' || item.id === 1) loc = 'Hyderabad';
        return { ...item, location: loc };
    });

    return (
        <section className="testimonials-section" aria-label="Customer Reviews">
            <div className="testimonials-header">
                <span>Customer Reviews</span>
                <h2>Loved By Our Customers</h2>
            </div>

            <div className="testimonials-grid">
                {reviews.map(item => (
                    <div key={item.id} className="testimonial-card">
                        <div>
                            <div className="testimonial-stars">
                                {[...Array(item.rating || 5)].map((_, i) => (
                                    <Star key={i} size={16} fill="#E29578" color="#E29578" />
                                ))}
                            </div>
                            <p className="testimonial-quote">"{item.quote}"</p>
                        </div>

                        <div className="testimonial-author-row">
                            <div className="testimonial-avatar">
                                {item.initials || (item.author ? item.author.charAt(0) : 'P')}
                            </div>
                            <div className="testimonial-author-meta">
                                <h4>
                                    {item.author}
                                    <CheckCircle2 size={14} className="verified-icon" />
                                </h4>
                                <span>{item.location} &bull; Wore {item.productWorn || item.product_worn || 'Jaipur Kurti'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PatronReviews;
