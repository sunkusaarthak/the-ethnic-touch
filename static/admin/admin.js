document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadDashboard();
    
    // Form Submissions
    document.getElementById('productForm').addEventListener('submit', handleAddProduct);
    document.getElementById('couponForm').addEventListener('submit', handleAddCoupon);
    
    document.getElementById('logoutBtn').addEventListener('click', () => window.location.href = '/');
});

// Helper to assemble Auth headers dynamically
function getAuthHeader() {
    const token = localStorage.getItem('authToken') || 'admin_secret_token_123';
    return {
        'Authorization': `Bearer ${token}`
    };
}

function initTabs() {
    const tabs = document.querySelectorAll('nav li');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            contents.forEach(c => c.classList.remove('active'));
            document.getElementById(`tab-${target}`).classList.add('active');
            
            document.getElementById('pageTitle').innerText = tab.innerText;
            
            updateHeaderActions(target);
            loadTabData(target);
        });
    });
}

function updateHeaderActions(tab) {
    const container = document.getElementById('headerActions');
    container.innerHTML = '';
    
    if (tab === 'products') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.innerText = 'Add New Product';
        btn.onclick = () => document.getElementById('productModal').style.display = 'flex';
        container.appendChild(btn);
    } else if (tab === 'coupons') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.innerText = 'Create Coupon';
        btn.onclick = () => document.getElementById('couponModal').style.display = 'flex';
        container.appendChild(btn);
    }
}

async function loadTabData(tab) {
    if (tab === 'dashboard') loadDashboard();
    if (tab === 'products') loadProducts();
    if (tab === 'orders') loadOrders();
    if (tab === 'coupons') loadCoupons();
}

async function loadDashboard() {
    try {
        const [products, orders, coupons] = await Promise.all([
            fetch('/api/products').then(r => r.json()),
            fetch('/api/admin/orders', { headers: getAuthHeader() }).then(r => r.json()),
            fetch('/api/admin/coupons', { headers: getAuthHeader() }).then(r => r.json())
        ]);

        const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        document.getElementById('stat-revenue').innerText = `₹${revenue.toLocaleString('en-IN')}`;
        document.getElementById('stat-orders').innerText = orders.length;
        document.getElementById('stat-coupons').innerText = coupons.length;
    } catch (err) {
        console.error("Dashboard load failed", err);
    }
}

async function loadProducts() {
    const body = document.querySelector('#productsTable tbody');
    body.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    
    try {
        const products = await fetch('/api/products').then(r => r.json());
        body.innerHTML = '';
        products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.imageUrl}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;"></td>
                <td style="font-weight:500">${p.name}</td>
                <td>${p.category}</td>
                <td>₹${p.price.toLocaleString('en-IN')}</td>
                <td>${p.stock}</td>
                <td><button class="btn-secondary" style="padding:4px 12px; font-size:0.8rem">Edit</button></td>
            `;
            body.appendChild(tr);
        });
    } catch (err) {
        body.innerHTML = '<tr><td colspan="6" style="color:red">Failed to load products.</td></tr>';
    }
}

async function loadOrders() {
    const body = document.querySelector('#ordersTable tbody');
    body.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
    
    try {
        const orders = await fetch('/api/admin/orders', { headers: getAuthHeader() }).then(r => r.json());
        body.innerHTML = '';
        orders.forEach(o => {
            const tr = document.createElement('tr');
            const date = new Date(o.createdAt).toLocaleDateString();
            
            // Format order items list
            const itemsStr = o.items ? o.items.map(it => `${it.productName || it.productId} (x${it.quantity})`).join(', ') : 'No Details';
            
            // Determine tracking badge
            const trackingStr = o.trackingNumber 
                ? `<span style="font-family:monospace; color:#2e7d32">🚚 ${o.trackingNumber}</span>`
                : `<span style="color:#777; font-style:italic">Pending checkout / paid dispatch</span>`;

            // Status label style
            let badgeBg = '#ffe0b2';
            let badgeColor = '#e65100';
            if (o.status === 'shipped') {
                badgeBg = '#e8f5e9';
                badgeColor = '#2e7d32';
            } else if (o.status === 'paid') {
                badgeBg = '#e3f2fd';
                badgeColor = '#0d47a1';
            }

            tr.innerHTML = `
                <td style="font-weight:500">${o.id}</td>
                <td>${o.customerEmail}</td>
                <td>₹${o.totalAmount.toLocaleString('en-IN')}</td>
                <td style="font-size:0.9rem; color:#555; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${itemsStr}">${itemsStr}</td>
                <td><span style="padding:4px 8px; background:${badgeBg}; color:${badgeColor}; border-radius:4px; font-size:0.8rem; font-weight:500">${o.status}</span></td>
                <td>${trackingStr}</td>
                <td>${date}</td>
            `;
            body.appendChild(tr);
        });
    } catch (err) {
        body.innerHTML = '<tr><td colspan="7" style="color:red">Failed to load orders or Unauthorized. Error: ' + err.message + '</td></tr>';
    }
}

async function loadCoupons() {
    const body = document.querySelector('#couponsTable tbody');
    body.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    
    try {
        const coupons = await fetch('/api/admin/coupons', { headers: getAuthHeader() }).then(r => r.json());
        body.innerHTML = '';
        coupons.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:600">${c.code}</td>
                <td style="text-transform:capitalize">${c.type}</td>
                <td>${c.type === 'fixed' ? '₹' : ''}${c.value}${c.type === 'percentage' ? '%' : ''}</td>
                <td>≥ ₹${c.minOrder}</td>
                <td>${c.usedCount} / ${c.usageLimit}</td>
                <td><span style="color:${c.isActive ? 'green' : 'red'}">${c.isActive ? 'Active' : 'Expired'}</span></td>
            `;
            body.appendChild(tr);
        });
    } catch (err) {
        body.innerHTML = '<tr><td colspan="6" style="color:red">Failed to load coupons.</td></tr>';
    }
}

async function handleAddProduct(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('p_name').value,
        price: parseFloat(document.getElementById('p_price').value),
        stock: parseInt(document.getElementById('p_stock').value),
        category: document.getElementById('p_category').value,
        description: document.getElementById('p_desc').value,
        imageUrl: document.getElementById('p_image').value
    };

    const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        closeModals();
        loadProducts();
        document.getElementById('productForm').reset();
    } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create product");
    }
}

async function handleAddCoupon(e) {
    e.preventDefault();
    const data = {
        code: document.getElementById('c_code').value,
        type: document.getElementById('c_type').value,
        value: parseFloat(document.getElementById('c_value').value),
        minOrder: parseFloat(document.getElementById('c_min').value),
        usageLimit: parseInt(document.getElementById('c_limit').value)
    };

    const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        closeModals();
        loadCoupons();
        document.getElementById('couponForm').reset();
    } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create coupon");
    }
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}
