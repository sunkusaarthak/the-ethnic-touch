document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadDashboard();
    
    // Form Submissions
    document.getElementById('productForm').addEventListener('submit', handleAddProduct);
    document.getElementById('couponForm').addEventListener('submit', handleAddCoupon);
    
    document.getElementById('logoutBtn').addEventListener('click', () => window.location.href = '/');
});

function initTabs() {
    const tabs = document.querySelectorAll('nav li');
    const contents = document.querySelectorAll('.tab-content');
    const headerActions = document.getElementById('headerActions');

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
            fetch('/api/admin/orders').then(r => r.json()),
            fetch('/api/admin/coupons').then(r => r.json())
        ]);

        const revenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        
        document.getElementById('stat-revenue').innerText = `₹${revenue.toLocaleString('en-IN')}`;
        document.getElementById('stat-orders').innerText = orders.length;
        document.getElementById('stat-coupons').innerText = coupons.length;
    } catch (err) {
        console.error("Dashboard load failed");
    }
}

async function loadProducts() {
    const body = document.querySelector('#productsTable tbody');
    body.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    
    const products = await fetch('/api/products').then(r => r.json());
    body.innerHTML = '';
    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.imageUrl}" style="width:40px; border-radius:4px;"></td>
            <td style="font-weight:500">${p.name}</td>
            <td>${p.category}</td>
            <td>₹${p.price.toLocaleString('en-IN')}</td>
            <td>${p.stock}</td>
            <td><button class="btn-secondary" style="padding:4px 12px; font-size:0.8rem">Edit</button></td>
        `;
        body.appendChild(tr);
    });
}

async function loadOrders() {
    const body = document.querySelector('#ordersTable tbody');
    body.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    
    const orders = await fetch('/api/admin/orders').then(r => r.json());
    body.innerHTML = '';
    orders.reverse().forEach(o => {
        const tr = document.createElement('tr');
        const date = new Date(o.createdAt).toLocaleDateString();
        tr.innerHTML = `
            <td style="font-weight:500">${o.id}</td>
            <td>${o.customerEmail}</td>
            <td>₹${o.totalAmount.toLocaleString('en-IN')}</td>
            <td><span style="padding:4px 8px; background:#e8f5e9; color:#2e7d32; border-radius:4px; font-size:0.8rem">${o.status}</span></td>
            <td>${date}</td>
        `;
        body.appendChild(tr);
    });
}

async function loadCoupons() {
    const body = document.querySelector('#couponsTable tbody');
    body.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
    
    const coupons = await fetch('/api/admin/coupons').then(r => r.json());
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        closeModals();
        loadProducts();
        document.getElementById('productForm').reset();
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        closeModals();
        loadCoupons();
        document.getElementById('couponForm').reset();
    }
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}
