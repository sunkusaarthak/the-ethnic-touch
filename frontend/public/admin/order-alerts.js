(() => {
    const button = document.getElementById('adminOrderAlertsButton');
    const status = document.getElementById('adminOrderAlertsStatus');
    let stop = () => {};

    window.configureAdminOrderAlerts = (user, apiBaseURL) => {
        stop();
        button.style.display = 'none';
        status.textContent = '';
        if (!user) return;
        if (!window.isSecureContext || !('Notification' in window) || !('serviceWorker' in navigator)) {
            status.textContent = 'Order alerts require a supported browser. On iPhone, open Admin from the Home Screen.';
            return;
        }

        const key = `adminOrderAlerts:${user.uid}`;
        let controller;
        let timer;

        stop = () => {
            controller?.abort();
            clearTimeout(timer);
            button.onclick = null;
        };

        function disable(message) {
            controller?.abort();
            clearTimeout(timer);
            localStorage.removeItem(key);
            button.textContent = 'Enable order alerts';
            status.textContent = message;
        }

        async function start() {
            controller = new AbortController();
            const { signal } = controller;
            let seen;
            button.textContent = 'Disable order alerts';
            status.textContent = 'Connecting order alerts…';
            let registration;
            try {
                await navigator.serviceWorker.register('/admin/order-alerts-worker.js');
                registration = await navigator.serviceWorker.ready;
            } catch (err) {
                if (!signal.aborted) disable('Could not start order alerts. Try enabling them again.');
                return;
            }
            if (signal.aborted) return;
            const activeMessage = 'Order alerts are on while Admin is open.';

            async function poll() {
                try {
                    const token = await user.getIdToken();
                    const response = await fetch(`${apiBaseURL}/api/admin/orders/alerts`, {
                        headers: { Authorization: `Bearer ${token}` },
                        cache: 'no-store',
                        signal
                    });
                    if (!response.ok) throw new Error('Could not check order alerts');
                    const ids = await response.json();
                    if (signal.aborted) return;
                    const newOrders = seen ? ids.filter(id => !seen.has(id)) : [];
                    if (newOrders.length > 0) {
                        await registration.showNotification('The Ethnic Touch', {
                            body: newOrders.length === 1 ? 'New confirmed order. Tap to open Admin.' : `${newOrders.length} new confirmed orders. Tap to open Admin.`,
                            icon: '/favicon-192x192.png',
                            tag: 'admin-order-alerts'
                        });
                    }
                    if (!signal.aborted) {
                        seen = new Set(ids);
                        status.textContent = activeMessage;
                    }
                } catch {
                    if (!signal.aborted) status.textContent = 'Could not check order alerts. Retrying…';
                } finally {
                    if (!signal.aborted) timer = setTimeout(poll, 30000);
                }
            }

            await poll();
        }

        button.hidden = false;
        button.style.display = '';
        button.textContent = 'Enable order alerts';
        button.onclick = async () => {
            if (localStorage.getItem(key) === 'on') {
                disable('Order alerts are off.');
                return;
            }
            try {
                const permission = await Notification.requestPermission();
                if (button.onclick !== toggleAlerts) return;
                if (permission !== 'granted') {
                    status.textContent = 'Allow notifications in your browser to receive order alerts.';
                    return;
                }
                localStorage.setItem(key, 'on');
                await start();
            } catch {
                if (button.onclick === toggleAlerts) disable('Could not enable order alerts.');
            }
        };
        const toggleAlerts = button.onclick;
        if (Notification.permission === 'granted' && localStorage.getItem(key) === 'on') {
            start();
        } else {
            localStorage.removeItem(key);
        }
    };
})();
