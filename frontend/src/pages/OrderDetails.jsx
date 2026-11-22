import { useEffect, useId, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Gift, MapPin, Package, Truck } from 'lucide-react';
import CopyButton from '../components/CopyButton';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../utils/apiClient';
import { getOptimizedImageUrl } from '../utils/imageHelper';
import { createProductSlug } from '../utils/slugHelper';
import { isStorePickupOrder } from '../utils/orderFulfilment';
import './OrderDetails.css';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
const shortDate = new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeZone: 'Asia/Kolkata' });
const eventDate = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });
const historyPath = '/profile?tab=orders';

const statusLabels = {
    pending: 'Awaiting payment', pending_payment: 'Payment due at pickup', paid: 'Order confirmed',
    payment_review: 'Payment under review', dispatching: 'Preparing your shipment', dispatch_review: 'Preparing your shipment',
    shipped: 'Shipment booked', delivered: 'Delivered', picked_up: 'Collected', dispatched_instant: 'Dispatched',
    cancelled: 'Cancelled', payment_failed: 'Payment failed', AWAITING_PICKUP: 'Preparing for pickup',
    READY_FOR_PICKUP: 'Ready for pickup', ready_for_pickup: 'Ready for pickup', COLLECTED: 'Collected',
    waybill_created: 'Waybill created', pickup_scheduled: 'Pickup scheduled', in_transit: 'In transit',
    out_for_delivery: 'Out for delivery', return_in_progress: 'Return in progress', returned: 'Returned to store',
};

const labelForStatus = status => statusLabels[status] || 'Order received';

function formatOrderDate(value, formatter) {
    const date = new Date(value);
    return value && Number.isFinite(date.getTime()) ? formatter.format(date) : '';
}

function pickupInstructions(order) {
    if (order.pickupLocationSnapshot) {
        try {
            const location = JSON.parse(order.pickupLocationSnapshot);
            if (location && typeof location === 'object') return location;
        } catch { }
    }
    return { address: order.shippingAddress, city: order.shippingCity, state: order.shippingState, zipCode: order.shippingZipCode };
}

function OrderDelivery({ order }) {
    const headingId = useId();
    const isPickup = isStorePickupOrder(order);
    const events = order.trackingEvents || [];
    const address = isPickup ? pickupInstructions(order) : {
        locationName: order.shippingName, address: order.shippingAddress, city: order.shippingCity,
        state: order.shippingState, zipCode: order.shippingZipCode, contactInfo: order.shippingPhone,
    };
    const locality = [address.city, address.state, address.zipCode].filter(Boolean).join(', ');
    const tracking = order.trackingNumber;
    const hasWaybill = tracking && /^[a-z0-9-]{8,64}$/i.test(tracking) &&
        !['DLV_UPDATE', 'DUMMY_TRACKING', 'DELHIVERY_DISPATCHED', 'STORE-PICKUP'].includes(tracking);
    const mapsLink = isPickup && /^https?:\/\//i.test(address.mapsLink || '') ? address.mapsLink : '';

    return (
        <section className="order-detail-card" aria-labelledby={headingId}>
            <h2 id={headingId}>{isPickup ? <MapPin size={20} aria-hidden="true" /> : <Truck size={20} aria-hidden="true" />}{isPickup ? 'Store pickup' : 'Delivery'}</h2>
            <address className="order-detail-address">
                {address.locationName && <strong>{address.locationName}</strong>}
                {address.address && <span>{address.address}</span>}
                {locality && <span>{locality}</span>}
                {address.contactInfo && <span>{address.contactInfo}</span>}
            </address>
            {isPickup && address.availability && <p className="order-detail-muted">Pickup hours: {address.availability}</p>}
            {isPickup && address.estimatedPickupDate && <p className="order-detail-muted">Estimated pickup: {address.estimatedPickupDate}</p>}
            {isPickup && address.instructions && <p className="order-detail-muted">{address.instructions}</p>}
            {mapsLink && <a className="order-history-link" href={mapsLink} target="_blank" rel="noopener noreferrer">View pickup location on map</a>}
            {!isPickup && hasWaybill && (
                <div className="order-detail-waybill">
                    <span>Tracking number <strong>{tracking}</strong></span>
                    <CopyButton text={tracking} label="Copy tracking number" />
                </div>
            )}
            {!isPickup && events.length > 0 && (
                <ol className="order-detail-timeline" aria-label="Delivery tracking history">
                    {events.map(event => (
                        <li key={`${event.occurredAt}:${event.status}`}>
                            <strong>{labelForStatus(event.status)}</strong>
                            <span>{[event.location, formatOrderDate(event.occurredAt, eventDate)].filter(Boolean).join(' · ')} IST</span>
                        </li>
                    ))}
                </ol>
            )}
            {!isPickup && !events.length && order.checkoutType !== 'hyderabad_instant' && !['delivered', 'cancelled'].includes(order.status) && (
                <p className="order-detail-muted">{hasWaybill ? 'Tracking will appear here after the carrier’s first scan.' : 'Tracking will appear here after a shipment is booked.'}</p>
            )}
        </section>
    );
}

function OrderRewards({ order }) {
    const headingId = useId();
    if (!order.spinTicketsAwarded && !order.earnedCoupon && !order.unlockedGift) return null;
    return (
        <section className="order-detail-card order-detail-rewards" aria-labelledby={headingId}>
            <h2 id={headingId}><Gift size={20} aria-hidden="true" /> Rewards earned</h2>
            {order.spinTicketsAwarded > 0 && (
                <p><strong>{order.spinTicketsAwarded} {order.spinTicketsAwarded === 1 ? 'spin ticket' : 'spin tickets'}</strong> earned on this order. <Link to="/spin-and-win">Visit Spin &amp; Win</Link></p>
            )}
            {order.earnedCoupon ? (
                <div className="order-detail-waybill">
                    <span>Coupon earned <strong>{order.earnedCoupon}</strong></span>
                    <CopyButton text={order.earnedCoupon} label="Copy coupon" />
                </div>
            ) : order.unlockedGift && <p>Order reward <strong>{order.unlockedGift}</strong></p>}
        </section>
    );
}

export default function OrderDetails() {
    const { orderId } = useParams();
    const { authUser, authLoading } = useAuth();
    const requestKey = authUser && `${authUser.uid}:${orderId}`;
    const [result, setResult] = useState(null);
    const [attempt, setAttempt] = useState(0);
    const current = !authLoading && requestKey && result?.key === requestKey ? result : null;

    useEffect(() => {
        if (authLoading || !requestKey) return;
        let active = true;
        let timer;
        const load = async () => {
            try {
                const order = await apiClient.get(`/api/orders?orderId=${encodeURIComponent(orderId)}&details=1`, { cache: 'no-store' });
                if (!active) return;
                setResult({ key: requestKey, order });
                const shipmentStatus = order.trackingStatus || order.status;
                if (order.checkoutType === 'delivery' && !['delivered', 'returned', 'cancelled', 'payment_failed'].includes(shipmentStatus)) {
                    timer = setTimeout(load, 60000);
                }
            } catch (err) {
                if (active) setResult({ key: requestKey, error: err.status || 500 });
            }
        };
        load();
        return () => { active = false; clearTimeout(timer); };
    }, [authLoading, orderId, requestKey, attempt]);

    const retry = () => { setResult(null); setAttempt(value => value + 1); };

    const order = current?.order;
    const orderDate = order && formatOrderDate(order.createdAt, shortDate);
    return (
        <main className="order-details-page">
            <Link className="order-details-back" to={historyPath}><ArrowLeft size={16} aria-hidden="true" /> Order history</Link>
            {!order ? (
                <section className="order-detail-card" aria-labelledby="order-details-heading">
                    <h1 id="order-details-heading">Order details</h1>
                    {authLoading || (authUser && !current) ? <p role="status">Loading your order…</p> : !authUser ? (
                        <Link className="btn btn-primary" to={`/auth?redirect=${encodeURIComponent(`/profile/orders/${orderId}`)}`}>Sign in to view this order</Link>
                    ) : current.error === 404 ? <p role="alert">This order wasn’t found in your account.</p> : current.error === 403 ? (
                        <p role="alert">Please verify your email to view your orders.</p>
                    ) : <><p role="alert">We couldn’t load this order.</p><button type="button" className="btn" onClick={retry}>Try again</button></>}
                </section>
            ) : (
                <>
                    <header className="order-details-heading">
                        <div>
                            <h1>Order details</h1>
                            <div className="order-detail-reference"><strong>#{order.id}</strong><CopyButton text={order.id} label="Copy order number" iconOnly /></div>
                            {orderDate && <p className="order-detail-muted">Placed on {orderDate}</p>}
                        </div>
                        <span className="order-detail-status" aria-live="polite">{labelForStatus(order.trackingStatus || order.status)}</span>
                    </header>
                    <div className="order-details-grid">
                        <section className="order-detail-card" aria-labelledby="order-items-heading">
                            <h2 id="order-items-heading"><Package size={20} aria-hidden="true" /> Items ordered</h2>
                            {order.items?.length ? (
                                <ul className="order-detail-items">
                                    {order.items.map((item, index) => {
                                        const name = item.productName || 'Product';
                                        const slug = createProductSlug(name);
                                        const href = item.productId && `/product/${encodeURIComponent(item.productId)}${slug ? `/${slug}` : ''}`;
                                        return (
                                            <li key={`${item.productId}:${item.size}:${index}`}>
                                                {item.imageUrl && <img src={getOptimizedImageUrl(item.imageUrl)} alt="" loading="lazy" />}
                                                <div>
                                                    {href ? <Link to={href}>{name}</Link> : <strong>{name}</strong>}
                                                    <p className="order-detail-muted">{item.size && `Size ${item.size} · `}Qty {item.quantity}</p>
                                                </div>
                                                <strong>{money.format(item.priceAtQty * item.quantity)}</strong>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : <p className="order-detail-muted">Item details are unavailable.</p>}
                            <dl className="order-detail-totals">
                                {order.discountAmt > 0 && <div><dt>Discount{order.couponCode && ` (${order.couponCode})`}</dt><dd>−{money.format(order.discountAmt)}</dd></div>}
                                <div><dt>Order total</dt><dd>{money.format(order.totalAmount)}</dd></div>
                            </dl>
                        </section>
                        <div className="order-detail-side">
                            <OrderDelivery order={order} />
                            <OrderRewards order={order} />
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
