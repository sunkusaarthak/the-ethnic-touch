export function isStorePickupOrder(order) {
    if (order.fulfilmentType) {
        return order.fulfilmentType === 'PREORDER_STORE_PICKUP' || order.fulfilmentType === 'STORE_PICKUP';
    }
    return order.checkoutType === 'pickup';
}
