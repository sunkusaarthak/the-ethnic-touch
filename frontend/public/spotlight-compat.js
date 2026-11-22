// Resolve older homepage payloads during a rolling frontend/backend deployment.
window.resolveLegacySpotlight = function (config, products, now = Date.now()) {
    const stock = product => !product.isPreorder && (Number(product.stock) > 0 ||
        Object.values(product.sizesStock || {}).some(qty => Number(qty) > 0));
    if (!config || config.next_change_at) return null;
    const expires = Date.parse(config.expires_at);
    const pinned = config.mode === 'manual' && expires > now;
    const pool = (products || []).filter(stock).sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const interval = (config.rotation_minutes || (Number(config.duration_hours) || 0) * 60 +
        (Number(config.duration_mins) || 0) || 360) * 60000;
    const anchor = config.mode === 'manual' && Number.isFinite(expires) && !pinned
        ? expires : Date.parse(config.cycle_started_at) || 0;
    const cycle = Math.max(0, Math.floor((now - anchor) / interval));
    const product = pinned ? pool.find(item => String(item.id) === String(config.product_id)) : pool[cycle % pool.length];
    return {
        ...config,
        mode: pinned ? 'manual' : 'random',
        featured_product_id: product?.id,
        next_change_at: new Date(pinned ? expires : anchor + (cycle + 1) * interval).toISOString()
    };
};
