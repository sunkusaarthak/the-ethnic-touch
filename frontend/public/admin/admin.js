let currentUserRole = null;
let currentUserEmail = null;

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSrS3zywg8ao1lvK9NWmy1RDR33Nim2h8",
    authDomain: "the-ethnic-touch.firebaseapp.com",
    projectId: "the-ethnic-touch",
    storageBucket: "the-ethnic-touch.firebasestorage.app",
    messagingSenderId: "565024605742",
    appId: "1:565024605742:web:0452b9b88a65be9d67c1bf"
};

const API_BASE_URL = window.location.hostname.includes('onrender.com') ? 'https://the-ethnic-touch-backend.onrender.com' : '';

let auth;

document.addEventListener('DOMContentLoaded', () => {
    console.log("[SETTINGS DIAG] Page Loaded. Initializing tabs and listeners.");
    
    // Initialize Firebase
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        initAuthFlow();
    } else {
        console.error("Firebase SDK not loaded!");
    }

    initTabs();
    loadDashboard();
    initProductModal(); // Build size checkboxes on load
    
    // Form Submissions
    console.log("[SETTINGS DIAG] Hooking submit events...");
    const pf = document.getElementById('productForm');
    if (pf) pf.addEventListener('submit', handleAddProduct);
    
    const cf = document.getElementById('couponForm');
    if (cf) cf.addEventListener('submit', handleAddCoupon);
    
    const tf = document.getElementById('tierForm');
    if (tf) {
        console.log("[SETTINGS DIAG] Found tierForm. Binding submit listener.");
        tf.addEventListener('submit', handleSaveTier);
    } else {
        console.error("[SETTINGS DIAG] ERROR: Could not find tierForm by ID!");
    }

    const swf = document.getElementById('spinWinForm');
    if (swf) {
        swf.addEventListener('submit', handleSaveSpinWinConfig);
    }
    
    const staffF = document.getElementById('staffForm');
    if (staffF) {
        staffF.addEventListener('submit', handleAddStaff);
    }
    
    const logoutAdmin = document.getElementById('logoutAdminBtn');
    if (logoutAdmin) {
        logoutAdmin.addEventListener('click', () => {
            if (auth) auth.signOut();
            localStorage.removeItem('adminToken');
            window.location.reload();
        });
    }

    const logout = document.getElementById('logoutBtn');
    if (logout) {
        logout.addEventListener('click', () => {
            // "Back to store" shouldn't necessarily log them out of the frontend, just redirect.
            // But if they want it to, we leave it. Let's just redirect to home.
            window.location.href = '/';
        });
    }

    // Monitor url hashes for scanner scanning trigger
    handleUrlHashChange();
    window.addEventListener('hashchange', handleUrlHashChange);
});

// ==========================================
// STAFF MANAGEMENT (RBAC)
// ==========================================
async function loadStaff() {
    const tbody = document.querySelector('#staffTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Loading...</td></tr>';
    
    try {
        const res = await fetch('/api/admin/staff', { headers: getAuthHeader() });
        if (!res.ok) throw new Error("Failed to load staff");
        const staff = await res.json();
        
        tbody.innerHTML = '';
        if (!staff || staff.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No staff members found.</td></tr>';
            return;
        }
        
        staff.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${s.email}</strong></td>
                <td><span style="background: ${s.role === 'admin' ? '#e1f5fe' : '#f5f5f5'}; color: ${s.role === 'admin' ? '#0277bd' : '#666'}; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; font-weight: 500;">${s.role.toUpperCase()}</span></td>
                <td>${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                <td style="text-align:right;">
                    <button class="btn-sm" style="background:#e53e3e; color:#fff; border:none; padding:4px 12px; border-radius:6px; cursor:pointer;" onclick="deleteStaff('${s.email}')">Remove</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">${err.message}</td></tr>`;
    }
}

async function handleAddStaff(e) {
    e.preventDefault();
    const email = document.getElementById('staffEmail').value.trim();
    const role = document.getElementById('staffRole').value;
    
    try {
        const res = await fetch('/api/admin/staff', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ email, role })
        });
        
        if (!res.ok) throw new Error("Failed to add/update staff");
        showAdminAlert('Team member added successfully', 'Success', 'success');
        document.getElementById('staffForm').reset();
        loadStaff();
    } catch (err) {
        showAdminAlert(err.message, 'Error', 'error');
    }
}

async function deleteStaff(email) {
    if (!confirm(`Are you sure you want to remove access for ${email}?`)) return;
    
    try {
        const res = await fetch(`/api/admin/staff?email=${encodeURIComponent(email)}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        if (!res.ok) throw new Error("Failed to remove staff");
        showAdminAlert('Team member removed', 'Success', 'success');
        loadStaff();
    } catch (err) {
        showAdminAlert(err.message, 'Error', 'error');
    }
}

window.deleteStaff = deleteStaff;

function copyTextToClipboard(text, btnElement) {
    if (!text) return;
    const textToCopy = String(text).trim();
    const onSuccess = () => {
        if (btnElement) {
            const originalHTML = btnElement.innerHTML;
            btnElement.innerHTML = `✓ Copied!`;
            btnElement.style.backgroundColor = '#e8f5e9';
            btnElement.style.color = '#2e7d32';
            btnElement.style.borderColor = '#81c784';
            setTimeout(() => {
                if (btnElement) {
                    btnElement.innerHTML = originalHTML;
                    btnElement.style.backgroundColor = '';
                    btnElement.style.color = '';
                    btnElement.style.borderColor = '';
                }
            }, 2000);
        }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(err => console.error("Copy failed", err));
    } else {
        fallbackCopyAdmin(textToCopy, onSuccess);
    }
}

function fallbackCopyAdmin(str, cb) {
    try {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        if (cb) cb();
    } catch (e) {
        console.error(e);
    }
}

function showAdminAlert(message, title = "Admin Notice", type = "warning") {
    let modal = document.getElementById('adminCustomAlertModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'adminCustomAlertModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(6px);
            display: flex; align-items: center; justify-content: center;
            z-index: 999999; padding: 1.5rem;
        `;
        document.body.appendChild(modal);
    }

    const iconColor = type === 'error' ? '#d32f2f' : type === 'success' ? '#2e7d32' : '#b97a66';
    const iconBg = type === 'error' ? '#ffebee' : type === 'success' ? '#e8f5e9' : '#fff0e9';

    modal.innerHTML = `
        <div style="background: #ffffff; border-radius: 16px; max-width: 440px; width: 100%; padding: 2rem 1.8rem; box-shadow: 0 25px 60px rgba(0,0,0,0.2); text-align: center; position: relative; font-family: inherit;">
            <button onclick="document.getElementById('adminCustomAlertModal').style.display='none'" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.2rem; color: #aaa; cursor: pointer; padding: 0.3rem;">✕</button>
            <div style="width: 60px; height: 60px; border-radius: 50%; background-color: ${iconBg}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.2rem; font-size: 1.8rem; font-weight: bold;">
                ${type === 'error' ? '✕' : type === 'success' ? '✓' : '!'}
            </div>
            <h3 style="font-size: 1.3rem; font-weight: 600; color: #2D2A26; margin: 0 0 0.6rem;">${title}</h3>
            <p style="font-size: 0.95rem; color: #6C6863; line-height: 1.6; margin: 0 0 1.5rem;">${message}</p>
            <button onclick="document.getElementById('adminCustomAlertModal').style.display='none'" style="width: 100%; padding: 0.8rem; font-size: 0.95rem; font-weight: 600; background: #2D2A26; color: #ffffff; border: none; border-radius: 8px; cursor: pointer;">Acknowledge</button>
        </div>
    `;
    modal.style.display = 'flex';
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function initProductModal() {
    const grid = document.getElementById('sizesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    AVAILABLE_SIZES.forEach(size => {
        const card = document.createElement('div');
        card.style.cssText = 'display:flex; flex-direction:column; gap:0.5rem; padding:0.8rem; background:#fff; border:1px solid #e0e0e0; border-radius:8px; transition:all 0.2s;';
        card.innerHTML = `
            <label style="display:flex; align-items:center; gap:0.6rem; cursor:pointer; margin:0;">
                <input type="checkbox" class="size-check" value="${size}" style="width:16px;height:16px;accent-color:var(--color-primary);">
                <span style="font-weight:600; font-size:0.95rem;">${size}</span>
            </label>
            <div class="size-stock-wrapper" style="display:none; align-items:center; gap:0.4rem; margin-top:0.2rem;">
                <span style="font-size:0.8rem; color:#666;">Stock:</span>
                <input type="number" class="size-stock-input" value="10" min="0" style="width:100%; padding:0.4rem; border:1px solid #ccc; border-radius:4px; font-size:0.85rem; box-sizing:border-box;">
            </div>
        `;
        const checkbox = card.querySelector('.size-check');
        const wrapper = card.querySelector('.size-stock-wrapper');
        const stockInput = card.querySelector('.size-stock-input');

        checkbox.addEventListener('change', () => {
            card.style.borderColor = checkbox.checked ? 'var(--color-primary)' : '#e0e0e0';
            card.style.backgroundColor = checkbox.checked ? '#fffdf9' : '#fff';
            wrapper.style.display = checkbox.checked ? 'flex' : 'none';
            updateTotalStockFallback();
        });

        stockInput.addEventListener('input', () => {
            updateTotalStockFallback();
        });

        grid.appendChild(card);
    });
    updateTotalStockFallback();
}

function updateTotalStockFallback() {
    const totalInput = document.getElementById('p_stock');
    if (!totalInput) return;
    
    let sum = 0;
    const checks = document.querySelectorAll('.size-check');
    checks.forEach(cb => {
        if (cb.checked) {
            const card = cb.closest('div');
            const stockInput = card.querySelector('.size-stock-input');
            const val = parseInt(stockInput.value) || 0;
            sum += val;
        }
    });

    totalInput.value = sum;
}

function addGalleryImageField() {
    const container = document.getElementById('galleryImagesContainer');
    const existingInputs = container.querySelectorAll('.gallery-img-input');
    if (existingInputs.length >= 5) {
        showAdminAlert('Maximum 5 extra gallery images allowed.', 'Limit Exceeded', 'warning');
        return;
    }
    const idx = existingInputs.length + 2;

    const row = document.createElement('div');
    row.className = 'gallery-img-row';
    row.style.cssText = 'display: flex; gap: 0.8rem; align-items: center; margin-bottom: 0.5rem;';
    row.innerHTML = `
        <input type="text" class="gallery-img-input" placeholder="./images/angle${idx}.png" style="flex: 1; padding: 0.7rem; border: 1px solid #eee; border-radius: 6px; box-sizing: border-box;">
        <div style="position: relative;">
            <button type="button" class="btn-secondary" style="padding: 0.7rem 1rem; font-size:0.85rem; cursor: pointer;">Upload</button>
            <input type="file" accept="image/*" onchange="uploadGalleryRowFile(event, this)" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
        </div>
    `;
    container.appendChild(row);
}

async function uploadImageFile(event, targetInputId) {
    const file = event.target.files[0];
    if (!file) return;

    const btn = event.target.previousElementSibling;
    const oldText = btn.innerText;
    btn.innerText = 'Uploading...';
    btn.disabled = true;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: {
                ...getAuthHeader()
            },
            body: formData
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        document.getElementById(targetInputId).value = data.url;
        btn.innerText = 'Success!';
        setTimeout(() => { btn.innerText = 'Upload File'; btn.disabled = false; }, 2000);
    } catch (err) {
        showAdminAlert('File upload failed: ' + err.message, 'Upload Error', 'error');
        btn.innerText = 'Failed';
        setTimeout(() => { btn.innerText = 'Upload File'; btn.disabled = false; }, 3000);
    }
}

async function uploadGalleryRowFile(event, fileInputElement) {
    const file = event.target.files[0];
    if (!file) return;

    const btn = fileInputElement.previousElementSibling;
    const oldText = btn.innerText;
    btn.innerText = '...';
    btn.disabled = true;

    // Find the text input in the same row
    const row = fileInputElement.closest('.gallery-img-row');
    const textInput = row.querySelector('.gallery-img-input');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: {
                ...getAuthHeader()
            },
            body: formData
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        textInput.value = data.url;
        btn.innerText = '✓';
        setTimeout(() => { btn.innerText = 'Upload'; btn.disabled = false; }, 2000);
    } catch (err) {
        showAdminAlert('File upload failed: ' + err.message, 'Upload Error', 'error');
        btn.innerText = '✗';
        setTimeout(() => { btn.innerText = 'Upload'; btn.disabled = false; }, 3000);
    }
}

// ==========================================
// AUTHENTICATION & RBAC LOGIC
// ==========================================
function getAuthHeader() {
    const token = localStorage.getItem('adminToken') || '';
    return { 'Authorization': `Bearer ${token}` };
}

async function fetchJsonSafe(url, options = {}) {
    try {
        const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
        const res = await fetch(fullUrl, options);
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok) {
            let errText = `HTTP ${res.status}`;
            if (contentType.includes('application/json')) {
                try {
                    const j = await res.json();
                    if (j && (j.error || j.message)) errText = j.error || j.message;
                } catch (_) {}
            }
            throw new Error(errText);
        }
        if (contentType.includes('application/json')) {
            return res.json();
        }
        const text = await res.text();
        if (text.trim().startsWith('<')) {
            throw new Error('Backend server is not updated or running. Please restart the backend server (go run main.go).');
        }
        try {
            return JSON.parse(text);
        } catch (_) {
            return [];
        }
    } catch (err) {
        throw err;
    }
}

function initAuthFlow() {
    const loginBtn = document.getElementById('adminGoogleLoginBtn');
    const overlay = document.getElementById('adminLoginOverlay');
    const errorMsg = document.getElementById('loginErrorMsg');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const token = await user.getIdToken();
                localStorage.setItem('adminToken', token);
                
                // Verify with backend and get role
                const fullUrl = `${API_BASE_URL}/api/admin/me`;
                const res = await fetch(fullUrl, { headers: getAuthHeader() });
                if (res.ok) {
                    const data = await res.json();
                    currentUserRole = data.role;
                    currentUserEmail = data.email;
                    
                    // Hide overlay
                    overlay.style.display = 'none';
                    
                    // Apply RBAC UI
                    applyRoleBasedUI();
                    
                    // Load default tab
                    loadDashboard();
                } else {
                    // Unauthorized
                    auth.signOut();
                    localStorage.removeItem('adminToken');
                    errorMsg.innerText = "Access Denied. You do not have permission to view the Admin Portal.";
                    errorMsg.style.display = 'block';
                    overlay.style.display = 'flex';
                }
            } catch (err) {
                console.error("Auth error", err);
                errorMsg.innerText = "An error occurred during authentication.";
                errorMsg.style.display = 'block';
                overlay.style.display = 'flex';
            }
        } else {
            // Not logged in
            localStorage.removeItem('adminToken');
            overlay.style.display = 'flex';
        }
    });

    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            try {
                await auth.signInWithPopup(provider);
            } catch (err) {
                console.error("Google Login Failed", err);
                errorMsg.innerText = err.message;
                errorMsg.style.display = 'block';
            }
        });
    }
}

function applyRoleBasedUI() {
    if (currentUserRole === 'employee') {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => el.style.display = 'none');
        
        // Force them to a safe tab if they were on an admin-only tab
        const activeTab = document.querySelector('.nav-menu li.active');
        if (activeTab && activeTab.classList.contains('admin-only')) {
            const dashboardTab = document.querySelector('.nav-menu li[data-tab="dashboard"]');
            if (dashboardTab) dashboardTab.click();
        }
    }
}

// ==========================================
// TABS & NAVIGATION
// ==========================================
function initTabs() {
    const tabs = document.querySelectorAll('nav li');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const target = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            contents.forEach(c => c.classList.remove('active'));
            document.getElementById(`tab-${target}`).classList.add('active');
            
            document.getElementById('pageTitle').innerText = e.target.innerText;
            
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
        btn.onclick = () => openAddProductModal();
        container.appendChild(btn);
    } else if (tab === 'coupons') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.innerText = 'Create Coupon';
        btn.onclick = () => document.getElementById('couponModal').style.display = 'flex';
        container.appendChild(btn);
    }
}

async function loadTabData(target) {
    if (target === 'dashboard') loadDashboard();
    if (target === 'products') loadProducts();
    if (target === 'orders') loadOrders();
    if (target === 'coupons') loadCoupons();
    if (target === 'settings') loadSettings();
    if (target === 'spinwin') loadSpinWin();
    if (target === 'profiles') loadProfiles();
    if (target === 'staff') loadStaff();
    if (target === 'pickup-scanner') {
        const card = document.getElementById('pickupOrderCard');
        const msg = document.getElementById('scannerMessage');
        const inp = document.getElementById('scannerOrderIdInput');
        if (card) card.style.display = 'none';
        if (msg) msg.style.display = 'none';
        if (inp) inp.value = '';
    }
}

async function loadDashboard() {
    try {
        const [products, orders, coupons] = await Promise.all([
            fetchJsonSafe('/api/products').catch(() => []),
            fetchJsonSafe('/api/admin/orders', { headers: getAuthHeader() }).catch(() => []),
            fetchJsonSafe('/api/admin/coupons', { headers: getAuthHeader() }).catch(() => [])
        ]);

        const orderList = Array.isArray(orders) ? orders : [];
        const couponList = Array.isArray(coupons) ? coupons : [];

        const revenue = orderList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        document.getElementById('stat-revenue').innerText = `₹${revenue.toLocaleString('en-IN')}`;
        document.getElementById('stat-orders').innerText = orderList.length;
        document.getElementById('stat-coupons').innerText = couponList.length;
        
        const pendingPickups = orderList.filter(o => o.checkoutType === 'pickup' && o.paymentMethod === 'offline_qr' && o.status === 'pending_payment').length;
        const pendingEl = document.getElementById('stat-pending-pickups');
        if (pendingEl) pendingEl.innerText = pendingPickups;
    } catch (err) {
        console.error("Dashboard load failed", err);
    }
}

let loadedProductsMap = {};

async function loadProducts() {
    const body = document.querySelector('#productsTable tbody');
    body.innerHTML = '<tr><td colspan="8">Loading...</td></tr>';
    
    try {
        const products = await fetch('/api/products').then(r => r.json());
        loadedProductsMap = {};
        body.innerHTML = '';
        products.forEach(p => {
            loadedProductsMap[p.id] = p;
            let sizesDisplay = '<span style="color:#bbb">—</span>';
            if (p.sizes && p.sizes.length) {
                sizesDisplay = p.sizes.map(sz => {
                    const stk = (p.sizesStock && p.sizesStock[sz] !== undefined) ? p.sizesStock[sz] : 0;
                    return `<span class="size-badge" style="display:inline-block; background:#fbf5eb; border:1px solid #f6dcb6; color:#a05d2c; margin:2px; padding:2px 6px; border-radius:4px; font-size:0.75rem; font-weight:600;">${sz} (${stk})</span>`;
                }).join(' ');
            }
            const imageCount = (p.galleryImages && p.galleryImages.length) ? p.galleryImages.length : 1;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.imageUrl}" style="width:44px; height:52px; border-radius:4px; object-fit:cover;"></td>
                <td style="font-weight:500">${p.name}</td>
                <td><span style="background:#f5f5f5; padding:2px 8px; border-radius:4px; font-size:0.8rem;">${p.category}</span></td>
                <td>₹${p.price.toLocaleString('en-IN')}</td>
                <td>${p.stock}</td>
                <td style="font-size:0.85rem; color:#666;">${sizesDisplay}</td>
                <td style="font-size:0.8rem; color:#888;">${imageCount} photo${imageCount !== 1 ? 's' : ''}</td>
                <td style="text-align:right;">
                    <button type="button" class="btn-sm" style="background:#2D2A26; color:#fff; border:none; padding:4px 12px; border-radius:6px; cursor:pointer; font-weight:500; font-size:0.76rem;" onclick="openEditProductModal('${p.id}')">Edit</button>
                    <button type="button" class="btn-sm" style="background:#e53e3e; color:#fff; border:none; padding:4px 12px; border-radius:6px; cursor:pointer; font-weight:500; font-size:0.76rem; margin-left: 0.5rem;" onclick="deleteProduct('${p.id}')">Delete</button>
                </td>
            `;
            body.appendChild(tr);
        });
    } catch (err) {
        body.innerHTML = '<tr><td colspan="8" style="color:red">Failed to load products.</td></tr>';
    }
}

async function loadOrders() {
    const body = document.querySelector('#ordersTable tbody');
    body.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
    
    try {
        const orders = await fetchJsonSafe('/api/admin/orders', { headers: getAuthHeader() });
        body.innerHTML = '';
        if (!Array.isArray(orders) || orders.length === 0) {
            body.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999">No orders placed yet.</td></tr>';
            return;
        }
        orders.forEach(o => {
            const tr = document.createElement('tr');
            const date = new Date(o.createdAt).toLocaleDateString();
            
            // Format order items list
            const itemsStr = o.items ? o.items.map(it => `${it.productName || it.productId} (x${it.quantity})`).join(', ') : 'No Details';
            
            // Determine tracking badge
            let trackingStr = o.trackingNumber 
                ? `<span style="font-family:monospace; color:#2e7d32">🚚 ${o.trackingNumber}</span>`
                : `<span style="color:#777; font-style:italic">Pending checkout / paid dispatch</span>`;
            
            if (o.checkoutType === 'pickup') {
                trackingStr = `<span style="font-family:monospace; color:#6b4c35; font-weight:600">🏪 Store Pickup</span>` + (o.paymentMethod === 'offline_qr' ? ` <span style="font-size:0.75rem; background:#fff3cd; color:#856404; padding:2px 4px; border-radius:3px;">Offline QR</span>` : ' (Online)');
            } else if (o.checkoutType === 'hyderabad_instant') {
                trackingStr = `<div style="font-family:monospace; color:#bf7c00; font-weight:600">⚡ Hyderabad Instant</div>` + 
                    (o.trackingNumber ? `<span style="font-size:0.75rem; font-family:monospace; color:#555">${o.trackingNumber}</span>` : '');
            }

            // Status label style
            let badgeBg = '#ffe0b2';
            let badgeColor = '#e65100';
            if (o.status === 'shipped') {
                badgeBg = '#e8f5e9';
                badgeColor = '#2e7d32';
            } else if (o.status === 'ready_for_pickup') {
                badgeBg = '#fff8e1';
                badgeColor = '#f57f17';
            } else if (o.status === 'picked_up') {
                badgeBg = '#e8f5e9';
                badgeColor = '#1b5e20';
            } else if (o.status === 'dispatched_instant') {
                badgeBg = '#efebe9';
                badgeColor = '#4e342e';
            } else if (o.status === 'paid') {
                badgeBg = '#e3f2fd';
                badgeColor = '#0d47a1';
            } else if (o.status === 'pending_payment') {
                badgeBg = '#ffebee';
                badgeColor = '#c62828';
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

function resetProductFormState() {
    const form = document.getElementById('productForm');
    if (form) form.reset();
    
    const pIdInput = document.getElementById('p_id');
    if (pIdInput) pIdInput.value = '';

    const modalTitle = document.getElementById('productModalTitle');
    if (modalTitle) modalTitle.innerText = 'Add New Product';

    const submitBtn = document.getElementById('productModalSubmitBtn');
    if (submitBtn) submitBtn.innerText = 'Save Product';

    initProductModal();

    const container = document.getElementById('galleryImagesContainer');
    if (container) {
        container.innerHTML = `
            <div class="gallery-img-row" style="display: flex; gap: 0.8rem; align-items: center; margin-bottom: 0.5rem;">
                <input type="text" class="gallery-img-input" placeholder="./images/angle2.png" style="flex: 1; padding: 0.7rem; border: 1px solid #eee; border-radius: 6px; box-sizing: border-box;">
                <div style="position: relative;">
                    <button type="button" class="btn-secondary" style="padding: 0.7rem 1rem; font-size:0.85rem; cursor: pointer;">Upload</button>
                    <input type="file" accept="image/*" onchange="uploadGalleryRowFile(event, this)" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                </div>
            </div>
        `;
    }
}

function openAddProductModal() {
    resetProductFormState();
    document.getElementById('productModal').style.display = 'flex';
}

function openEditProductModal(productId) {
    const p = loadedProductsMap[productId];
    if (!p) {
        showAdminAlert('Product details not found', 'Edit Error', 'error');
        return;
    }

    resetProductFormState();

    document.getElementById('p_id').value = p.id;
    document.getElementById('productModalTitle').innerText = `Edit Product: ${p.name}`;
    document.getElementById('productModalSubmitBtn').innerText = 'Update Product';

    document.getElementById('p_name').value = p.name || '';
    document.getElementById('p_category').value = p.category || 'Anarkali';
    document.getElementById('p_desc').value = p.description || '';
    document.getElementById('p_price').value = p.price || 0;
    document.getElementById('p_orig_price').value = p.originalPrice || '';
    document.getElementById('p_stock').value = p.stock || 0;
    document.getElementById('p_image').value = p.imageUrl || '';
    document.getElementById('p_collection').value = p.collection || '';
    document.getElementById('p_sku').value = p.sku || '';
    document.getElementById('p_color').value = p.color || '';
    document.getElementById('p_fabric').value = p.fabric || '';
    document.getElementById('p_sleeve').value = p.sleeveType || '';
    document.getElementById('p_neck').value = p.neckType || '';
    document.getElementById('p_pattern').value = p.pattern || '';
    document.getElementById('p_occasion').value = p.occasion || '';
    document.getElementById('p_tags').value = p.tags || '';
    document.getElementById('p_new_arrival').checked = !!p.isNewArrival;
    document.getElementById('p_best_seller').checked = !!p.isBestSeller;
    document.getElementById('p_featured').checked = !!p.isFeatured;

    // Populate sizes & stock values
    const sizeChecks = document.querySelectorAll('.size-check');
    sizeChecks.forEach(cb => {
        const sz = cb.value;
        const card = cb.closest('div');
        const wrapper = card.querySelector('.size-stock-wrapper');
        const stockInput = card.querySelector('.size-stock-input');

        if (p.sizes && p.sizes.includes(sz)) {
            cb.checked = true;
            card.style.borderColor = 'var(--color-primary)';
            card.style.backgroundColor = '#fffdf9';
            wrapper.style.display = 'flex';
            const stk = (p.sizesStock && p.sizesStock[sz] !== undefined) ? p.sizesStock[sz] : (p.stock || 10);
            stockInput.value = stk;
        } else {
            cb.checked = false;
            card.style.borderColor = '#e0e0e0';
            card.style.backgroundColor = '#fff';
            wrapper.style.display = 'none';
        }
    });
    updateTotalStockFallback();

    // Populate extra gallery images
    const container = document.getElementById('galleryImagesContainer');
    container.innerHTML = '';
    const extraImages = (p.galleryImages || []).filter(img => img !== p.imageUrl);
    if (extraImages.length === 0) {
        addGalleryImageField();
    } else {
        extraImages.forEach((imgUrl, idx) => {
            const row = document.createElement('div');
            row.className = 'gallery-img-row';
            row.style.cssText = 'display: flex; gap: 0.8rem; align-items: center; margin-bottom: 0.5rem;';
            row.innerHTML = `
                <input type="text" class="gallery-img-input" value="${imgUrl}" placeholder="./images/angle${idx+2}.png" style="flex: 1; padding: 0.7rem; border: 1px solid #eee; border-radius: 6px; box-sizing: border-box;">
                <div style="position: relative;">
                    <button type="button" class="btn-secondary" style="padding: 0.7rem 1rem; font-size:0.85rem; cursor: pointer;">Upload</button>
                    <input type="file" accept="image/*" onchange="uploadGalleryRowFile(event, this)" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                </div>
            `;
            container.appendChild(row);
        });
    }

    document.getElementById('productModal').style.display = 'flex';
}

async function handleAddProduct(e) {
    e.preventDefault();

    const productId = document.getElementById('p_id').value;
    const isEdit = !!productId;
    const primaryImage = document.getElementById('p_image').value.trim();

    // Collect gallery images: primary first, then extras
    const galleryInputs = document.querySelectorAll('.gallery-img-input');
    const galleryImages = [primaryImage];
    galleryInputs.forEach(input => {
        const val = input.value.trim();
        if (val) galleryImages.push(val);
    });

    // Collect checked sizes and their stock inputs
    const sizeChecks = document.querySelectorAll('.size-check:checked');
    const sizes = [];
    const sizesStock = {};
    sizeChecks.forEach(cb => {
        const sizeVal = cb.value;
        sizes.push(sizeVal);
        const card = cb.closest('div');
        const stockInput = card.querySelector('.size-stock-input');
        const qty = parseInt(stockInput.value) || 0;
        sizesStock[sizeVal] = qty;
    });

    if (sizes.length === 0) {
        showAdminAlert('Please select at least one available size.', 'Size Required', 'warning');
        return;
    }

    const data = {
        id: productId || undefined,
        name: document.getElementById('p_name').value.trim(),
        price: parseFloat(document.getElementById('p_price').value),
        stock: parseInt(document.getElementById('p_stock').value) || 0,
        category: document.getElementById('p_category').value,
        description: document.getElementById('p_desc').value.trim(),
        imageUrl: primaryImage,
        galleryImages: galleryImages,
        sizes: sizes,
        sizesStock: sizesStock,
        collection: document.getElementById('p_collection').value.trim(),
        sku: document.getElementById('p_sku').value.trim(),
        originalPrice: parseFloat(document.getElementById('p_orig_price').value) || 0,
        color: document.getElementById('p_color').value.trim(),
        fabric: document.getElementById('p_fabric').value,
        sleeveType: document.getElementById('p_sleeve').value,
        neckType: document.getElementById('p_neck').value,
        pattern: document.getElementById('p_pattern').value,
        occasion: document.getElementById('p_occasion').value,
        tags: document.getElementById('p_tags').value.trim(),
        isNewArrival: document.getElementById('p_new_arrival').checked,
        isBestSeller: document.getElementById('p_best_seller').checked,
        isFeatured: document.getElementById('p_featured').checked
    };

    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch('/api/products', {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        closeModals();
        loadProducts();
        resetProductFormState();
        showAdminAlert(isEdit ? 'Product updated successfully!' : 'Product created successfully!', 'Success', 'success');
    } else {
        const errData = await res.json().catch(() => ({}));
        showAdminAlert(errData.error || (isEdit ? 'Failed to update product' : 'Failed to create product'), 'Product Error', 'error');
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
        showAdminAlert(errData.error || "Failed to create coupon", 'Coupon Error', 'error');
    }
}

function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}

let currentTiers = [];

async function loadSettings() {
    console.log("[SETTINGS DIAG] loadSettings function started execution.");
    
    // Load auth settings
    await loadAuthConfig();
    
    const body = document.querySelector('#tiersTable tbody');
    if (!body) {
        console.error("[SETTINGS DIAG] ERROR: Element '#tiersTable tbody' not found in DOM!");
        showAdminAlert("[JS Error] Element '#tiersTable tbody' not found in DOM!", 'DOM Error', 'error');
        return;
    }
    
    body.innerHTML = '<tr><td colspan="5">Loading tiers...</td></tr>';
    
    try {
        console.log("[SETTINGS DIAG] Fetching /api/gift-tiers...");
        const res = await fetch('/api/gift-tiers');
        console.log("[SETTINGS DIAG] Fetch /api/gift-tiers completed. Status:", res.status);
        if (!res.ok) throw new Error("Failed to load tiers (HTTP " + res.status + ")");
        
        const data = await res.json();
        console.log("[SETTINGS DIAG] Received JSON data from server:", data);
        currentTiers = Array.isArray(data) ? data : [];
        
        console.log("[SETTINGS DIAG] Rendering tiers table...");
        renderTiersTable();
    } catch (err) {
        console.error("[SETTINGS DIAG] Catch block: Failed to load gift tiers:", err);
        body.innerHTML = `<tr><td colspan="5" style="color:red">Failed to load gift tiers: ${err.message}</td></tr>`;
    }
}

function renderTiersTable() {
    const body = document.querySelector('#tiersTable tbody');
    body.innerHTML = '';
    
    if (currentTiers.length === 0) {
        body.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;padding: 2rem;">No gift tiers configured.</td></tr>';
        return;
    }
    
    // Sort tiers by threshold ascending
    currentTiers.sort((a, b) => a.threshold - b.threshold);
    
    currentTiers.forEach((tier, idx) => {
        const tr = document.createElement('tr');
        
        let detailsStr = '';
        if (tier.rewardType === 'coupon') {
            detailsStr = `<strong>${tier.discountType === 'percentage' ? tier.discountValue + '%' : '₹' + tier.discountValue} Off</strong> Coupon (Pattern: <code>${tier.couponFormat}</code>, Expiry: ${tier.couponExpiryDays || 30} days)`;
        } else {
            detailsStr = `Physical item: <strong>${tier.physicalName}</strong>`;
        }
        
        tr.innerHTML = `
            <td style="font-weight: 500;">${tier.name}</td>
            <td>₹${parseFloat(tier.threshold).toLocaleString('en-IN')}</td>
            <td style="text-transform: capitalize;">${tier.rewardType}</td>
            <td>${detailsStr}</td>
            <td style="text-align: right; white-space: nowrap; width: 160px;">
                <div style="display: inline-flex; align-items: center; justify-content: flex-end; gap: 0.5rem;">
                    <button type="button" onclick="editTier(${idx})" style="display: inline-flex; align-items: center; gap: 0.35rem; background: #FAF7F2; color: #8F5E36; border: 1px solid rgba(212, 163, 115, 0.4); padding: 5px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                    </button>
                    <button type="button" onclick="deleteTier(${idx})" style="display: inline-flex; align-items: center; gap: 0.35rem; background: #FFF5F5; color: #E53E3E; border: 1px solid rgba(229, 62, 62, 0.3); padding: 5px 12px; border-radius: 6px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        Delete
                    </button>
                </div>
            </td>
        `;
        body.appendChild(tr);
    });
}

function toggleRewardTypeInputs() {
    const type = document.getElementById('t_reward_type').value;
    if (type === 'coupon') {
        document.getElementById('couponRewardConfig').style.display = 'block';
        document.getElementById('physicalRewardConfig').style.display = 'none';
        document.getElementById('t_physical_name').removeAttribute('required');
    } else {
        document.getElementById('couponRewardConfig').style.display = 'none';
        document.getElementById('physicalRewardConfig').style.display = 'block';
        document.getElementById('t_physical_name').setAttribute('required', 'true');
    }
}

function editTier(idx) {
    const tier = currentTiers[idx];
    document.getElementById('t_edit_idx').value = idx;
    document.getElementById('t_name').value = tier.name;
    document.getElementById('t_threshold').value = tier.threshold;
    document.getElementById('t_reward_type').value = tier.rewardType;
    
    toggleRewardTypeInputs();
    
    if (tier.rewardType === 'coupon') {
        document.getElementById('t_discount_type').value = tier.discountType;
        document.getElementById('t_discount_value').value = tier.discountValue;
        document.getElementById('t_coupon_format').value = tier.couponFormat;
        document.getElementById('t_coupon_expiry_days').value = tier.couponExpiryDays !== undefined ? tier.couponExpiryDays : 30;
        document.getElementById('t_physical_name').value = '';
    } else {
        document.getElementById('t_physical_name').value = tier.physicalName;
        document.getElementById('t_discount_value').value = '';
        document.getElementById('t_coupon_format').value = '';
        document.getElementById('t_coupon_expiry_days').value = 0;
    }
    
    document.getElementById('formTitle').innerText = "Edit Reward Tier";
    document.getElementById('cancelBtn').style.display = 'inline-block';
}

function deleteTier(idx) {
    if (confirm("Are you sure you want to delete this reward tier?")) {
        currentTiers.splice(idx, 1);
        saveTiersToServer();
    }
}

function resetTierForm() {
    document.getElementById('tierForm').reset();
    document.getElementById('t_edit_idx').value = '';
    document.getElementById('formTitle').innerText = "Add New Reward Tier";
    document.getElementById('cancelBtn').style.display = 'none';
    document.getElementById('t_coupon_expiry_days').value = 30;
    toggleRewardTypeInputs();
}

async function handleSaveTier(e) {
    try {
        console.log("[SETTINGS DIAG] handleSaveTier submit event intercepted!");
        e.preventDefault();
        
        const editIdxStr = document.getElementById('t_edit_idx').value;
        const tierName = document.getElementById('t_name').value;
        const thresholdVal = document.getElementById('t_threshold').value;
        const rewardType = document.getElementById('t_reward_type').value;
        
        console.log("[SETTINGS DIAG] Input Values:", { editIdxStr, tierName, thresholdVal, rewardType });
        
        const threshold = parseFloat(thresholdVal);
        if (isNaN(threshold)) {
            throw new Error("Threshold must be a valid number");
        }
        
        let tier = {
            name: tierName,
            threshold: threshold,
            rewardType: rewardType
        };
        
        if (rewardType === 'coupon') {
            const discType = document.getElementById('t_discount_type').value;
            const discValStr = document.getElementById('t_discount_value').value;
            const copFormat = document.getElementById('t_coupon_format').value;
            const expDaysStr = document.getElementById('t_coupon_expiry_days').value;
            
            console.log("[SETTINGS DIAG] Coupon Input Values:", { discType, discValStr, copFormat, expDaysStr });
            
            tier.discountType = discType;
            tier.discountValue = parseFloat(discValStr || 0);
            tier.couponFormat = copFormat || "GFT-[RAND]";
            tier.couponExpiryDays = parseInt(expDaysStr || 0);
            tier.physicalName = "";
        } else {
            const physName = document.getElementById('t_physical_name').value;
            console.log("[SETTINGS DIAG] Physical Input Values:", { physName });
            
            tier.discountType = "";
            tier.discountValue = 0;
            tier.couponFormat = "";
            tier.couponExpiryDays = 0;
            tier.physicalName = physName;
        }
        
        console.log("[SETTINGS DIAG] Final Tier Object Details:", tier);
        
        if (editIdxStr !== "") {
            const idx = parseInt(editIdxStr);
            console.log("[SETTINGS DIAG] Editing existing tier at index:", idx);
            currentTiers[idx] = tier;
        } else {
            console.log("[SETTINGS DIAG] Appending new tier to configuration array.");
            currentTiers.push(tier);
        }
        
        console.log("[SETTINGS DIAG] currentTiers array updated. Invoking saveTiersToServer...");
        await saveTiersToServer();
        
        console.log("[SETTINGS DIAG] Resetting form...");
        resetTierForm();
    } catch (err) {
        console.error("[SETTINGS DIAG] JS Error caught in handleSaveTier:", err);
        showAdminAlert("[JS Error] " + err.message, 'Save Error', 'error');
    }
}

async function saveTiersToServer() {
    console.log("[SETTINGS DIAG] saveTiersToServer started. Payload stringified:", JSON.stringify(currentTiers));
    try {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        };
        console.log("[SETTINGS DIAG] Request Headers:", headers);
        
        const res = await fetch('/api/admin/gift-tiers', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(currentTiers)
        });
        
        console.log("[SETTINGS DIAG] Request completed. Response status code:", res.status);
        
        if (res.ok) {
            console.log("[SETTINGS DIAG] Save successful. Reloading settings list.");
            await loadSettings();
        } else {
            const text = await res.text();
            console.error("[SETTINGS DIAG] Save failed with response text:", text);
            let errMsg = text;
            try {
                const json = JSON.parse(text);
                errMsg = json.error || text;
            } catch(e) {}
            showAdminAlert("Error saving settings: " + errMsg, 'Settings Error', 'error');
        }
    } catch(err) {
        console.error("[SETTINGS DIAG] Fetch request connection failed:", err);
        showAdminAlert("Failed to connect to server: " + err.message, 'Network Error', 'error');
    }
}

async function loadProfiles() {
    const body = document.querySelector('#profilesTable tbody');
    body.innerHTML = '<tr><td colspan="6">Loading profiles...</td></tr>';
    
    try {
        const data = await fetchJsonSafe('/api/admin/profiles', { headers: getAuthHeader() });
        body.innerHTML = '';
        
        if (!Array.isArray(data) || data.length === 0) {
            body.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999">No user profiles completed yet.</td></tr>';
            return;
        }
        
        data.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight: 500">${p.fullName || 'No Name'}</td>
                <td>${p.email || 'No Email'}</td>
                <td>${p.phone || 'No Phone'}</td>
                <td>${p.zipCode || 'No ZIP'}</td>
                <td>${p.preferredSize || 'N/A'}</td>
                <td>
                    <button class="btn-primary" style="padding: 4px 10px; font-size: 0.8rem; border-radius: 4px; margin-right: 5px;" onclick="viewProfileDetails('${p.userId}')">View Details</button>
                    <button class="btn-primary" style="padding: 4px 10px; font-size: 0.8rem; border-radius: 4px; background: #e53e3e; border: none; color: white;" onclick="deleteProfile('${p.userId}', '${p.email}')">Delete</button>
                </td>
            `;
            body.appendChild(tr);
        });
    } catch (err) {
        console.warn("Profiles load notice:", err);
        body.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#777; padding: 1.5rem;">No user profiles found or backend API server needs to be restarted.<br><small style="color:#999">Run: go run main.go</small></td></tr>`;
    }
}

async function deleteProfile(userId, email) {
    if (!confirm(`Are you sure you want to permanently delete the profile for ${email || userId}? This cannot be undone.`)) return;
    
    try {
        const res = await fetch(`/api/admin/profiles/delete?userId=${encodeURIComponent(userId)}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to delete profile');
        }
        showAdminAlert('Profile deleted successfully', 'Success', 'success');
        loadProfiles(); // Refresh table
    } catch (err) {
        showAdminAlert(err.message, 'Error', 'error');
    }
}
window.deleteProfile = deleteProfile;

async function viewProfileDetails(userId) {
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileModalContent');
    content.innerHTML = '<p>Loading details...</p>';
    modal.style.display = 'flex';
    
    try {
        const res = await fetch(`/api/admin/profiles/details?userId=${userId}`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error("HTTP Status " + res.status);
        const data = await res.json();
        
        const p = data.profile;
        const addrs = data.addresses || [];
        const orders = data.orders || [];
        const coupons = data.coupons || [];
        
        let ordersHtml = '';
        if (orders.length === 0) {
            ordersHtml = '<p style="color: #999; font-size: 0.9rem;">No orders placed.</p>';
        } else {
            ordersHtml = `
                <table style="width:100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.9rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid #eee; text-align: left;">
                            <th style="padding: 0.5rem 0;">Order ID</th>
                            <th style="padding: 0.5rem 0;">Amount</th>
                            <th style="padding: 0.5rem 0;">Coupon</th>
                            <th style="padding: 0.5rem 0;">Gift</th>
                            <th style="padding: 0.5rem 0;">Status</th>
                            <th style="padding: 0.5rem 0;">Tracking</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.map(o => `
                            <tr style="border-bottom: 1px dashed #f5f5f5;">
                                <td style="padding: 0.5rem 0; font-weight: 500;">${o.id}</td>
                                <td style="padding: 0.5rem 0;">₹${o.totalAmount.toLocaleString('en-IN')}</td>
                                <td style="padding: 0.5rem 0; font-family: monospace;">${o.couponCode || '-'}</td>
                                <td style="padding: 0.5rem 0; color: #b97a66;">${o.unlockedGift || '-'}</td>
                                <td style="padding: 0.5rem 0;"><span style="font-weight:500;">${o.status}</span></td>
                                <td style="padding: 0.5rem 0; font-size:0.8rem; font-family: monospace;">${o.trackingNumber || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        let couponsHtml = '';
        if (coupons.length === 0) {
            couponsHtml = '<p style="color: #999; font-size: 0.9rem;">No coupons issued yet.</p>';
        } else {
            couponsHtml = `
                <div style="display:flex; flex-wrap:wrap; gap: 0.8rem; margin-top: 0.5rem;">
                    ${coupons.map(c => `
                        <div style="border: 1px dashed #b97a66; padding: 0.6rem 1rem; border-radius: 6px; background:#fffcfc;">
                            <strong style="color: #b97a66; font-family: monospace; font-size: 1rem;">${c.code}</strong>
                            <div style="font-size:0.85rem; color:#666; margin-top:0.25rem;">
                                ${c.type === 'percentage' ? c.value + '%' : '₹' + c.value} off &bull; Uses: ${c.usedCount}/${c.usageLimit}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        let addrsHtml = '';
        if (addrs.length === 0) {
            addrsHtml = '<p style="color: #999; font-size: 0.9rem;">No saved shipping addresses.</p>';
        } else {
            addrsHtml = `
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; margin-top:0.5rem;">
                    ${addrs.map(a => `
                        <div style="border: 1px solid #eee; padding: 1rem; border-radius: 6px; background: ${a.isDefault ? '#fffcf9' : '#fff'}; border-color: ${a.isDefault ? '#e4b39b' : '#eee'}; position:relative;">
                            ${a.isDefault ? '<span style="position:absolute; top:8px; right:8px; background:#e4b39b; color:#fff; font-size:0.65rem; padding: 1px 6px; border-radius:10px; font-weight:bold;">Default</span>' : ''}
                            <h4 style="margin:0 0 0.4rem; font-size:0.9rem;">${a.fullName}</h4>
                            <p style="font-size:0.8rem; color:#666; margin:0 0 0.2rem; line-height:1.3;">${a.addressLine}</p>
                            <p style="font-size:0.8rem; color:#666; margin:0 0 0.2rem; line-height:1.3;">${a.city}, ${a.state} - ${a.zipCode}</p>
                            <p style="font-size:0.8rem; color:#666; margin:0;">Phone: ${a.phone}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        content.innerHTML = `
            <form id="adminProfileEditForm" onsubmit="saveProfileFromAdmin(event, '${userId}')">
                <h3 style="margin-bottom:1rem; font-size: 1.1rem; border-bottom: 2px solid #ddd; padding-bottom: 0.4rem;">Customer Profile</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">Full Name *</label>
                        <input type="text" id="ap_name" value="${p.fullName || ''}" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">Phone Number *</label>
                        <input type="text" id="ap_phone" value="${p.phone || ''}" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div style="grid-column: span 2;">
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">Primary Address *</label>
                        <input type="text" id="ap_address" value="${p.address || ''}" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">City *</label>
                        <input type="text" id="ap_city" value="${p.city || ''}" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">State *</label>
                        <input type="text" id="ap_state" value="${p.state || ''}" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">ZIP / Postal Code *</label>
                        <input type="text" id="ap_zip" value="${p.zipCode || ''}" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">Preferred Size</label>
                        <select id="ap_size" style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                            <option value="" ${!p.preferredSize ? 'selected' : ''}>N/A</option>
                            <option value="XS" ${p.preferredSize === 'XS' ? 'selected' : ''}>XS</option>
                            <option value="S" ${p.preferredSize === 'S' ? 'selected' : ''}>S</option>
                            <option value="M" ${p.preferredSize === 'M' ? 'selected' : ''}>M</option>
                            <option value="L" ${p.preferredSize === 'L' ? 'selected' : ''}>L</option>
                            <option value="XL" ${p.preferredSize === 'XL' ? 'selected' : ''}>XL</option>
                        </select>
                    </div>
                    <div style="grid-column: span 2;">
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">Style Notes</label>
                        <textarea id="ap_notes" rows="2" style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">${p.styleNotes || ''}</textarea>
                    </div>
                </div>
                <button type="submit" class="btn-primary" style="margin-top:1rem; padding: 0.6rem 1.5rem; float:right; border-radius:4px;">Update Profile Details</button>
                <div style="clear:both; height:1.5rem;"></div>
            </form>
            
            <h3 style="margin: 2rem 0 1rem; font-size: 1.1rem; border-bottom: 2px solid #ddd; padding-bottom: 0.4rem;">Shipping Addresses Book</h3>
            ${addrsHtml}

            <h3 style="margin: 2rem 0 1rem; font-size: 1.1rem; border-bottom: 2px solid #ddd; padding-bottom: 0.4rem;">Order History</h3>
            ${ordersHtml}

            <h3 style="margin: 2rem 0 1rem; font-size: 1.1rem; border-bottom: 2px solid #ddd; padding-bottom: 0.4rem;">Issued Loyalty Coupons</h3>
            ${couponsHtml}
        `;
    } catch (err) {
        content.innerHTML = `<p style="color:red">Failed to load details: ${err.message}</p>`;
    }
}

async function saveProfileFromAdmin(e, userId) {
    e.preventDefault();
    const data = {
        userId: userId,
        fullName: document.getElementById('ap_name').value,
        phone: document.getElementById('ap_phone').value,
        address: document.getElementById('ap_address').value,
        city: document.getElementById('ap_city').value,
        state: document.getElementById('ap_state').value,
        zipCode: document.getElementById('ap_zip').value,
        preferredSize: document.getElementById('ap_size').value,
        styleNotes: document.getElementById('ap_notes').value
    };
    
    try {
        const res = await fetch('/api/admin/profiles/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            showAdminAlert('Profile updated successfully!', 'Profile Updated', 'success');
            viewProfileDetails(userId);
            loadProfiles();
        } else {
            const errData = await res.json();
            showAdminAlert(errData.error || 'Failed to update profile', 'Update Failed', 'error');
        }
    } catch (err) {
        showAdminAlert('Failed to connect to server: ' + err.message, 'Network Error', 'error');
    }
}

// ----------------------------------------------------
// Spin & Win Settings Logic
// ----------------------------------------------------

async function loadSpinWin() {
    try {
        const res = await fetch('/api/config/spin-wheel');
        if (!res.ok) throw new Error("Failed to load Spin & Win config");
        const data = await res.json();
        
        document.getElementById('sw_enabled').checked = data.enabled || false;
        
        document.getElementById('sw_new_user_threshold').value = data.new_user_kurthi_threshold || 10;
        document.getElementById('sw_order_threshold').value = data.order_kurthi_threshold || 50;
        
        const ft = data.first_time_probs || {};
        document.getElementById('sw_ft_5').value = ft.prob_5_off || 50;
        document.getElementById('sw_ft_10').value = ft.prob_10_off || 30;
        document.getElementById('sw_ft_fail').value = ft.prob_better_luck || 20;
        
        const ret = data.returning_probs || {};
        document.getElementById('sw_ret_5').value = ret.prob_5_off || 30;
        document.getElementById('sw_ret_10').value = ret.prob_10_off || 10;
        document.getElementById('sw_ret_fail').value = ret.prob_better_luck || 60;
        
    } catch (err) {
        showAdminAlert(err.message, 'Config Error', 'error');
    }
}

async function handleSaveSpinWinConfig(e) {
    e.preventDefault();
    
    const payload = {
        enabled: document.getElementById('sw_enabled').checked,
        new_user_kurthi_threshold: parseInt(document.getElementById('sw_new_user_threshold').value) || 0,
        order_kurthi_threshold: parseInt(document.getElementById('sw_order_threshold').value) || 0,
        first_time_probs: {
            prob_5_off: parseInt(document.getElementById('sw_ft_5').value) || 0,
            prob_10_off: parseInt(document.getElementById('sw_ft_10').value) || 0,
            prob_better_luck: parseInt(document.getElementById('sw_ft_fail').value) || 0
        },
        returning_probs: {
            prob_5_off: parseInt(document.getElementById('sw_ret_5').value) || 0,
            prob_10_off: parseInt(document.getElementById('sw_ret_10').value) || 0,
            prob_better_luck: parseInt(document.getElementById('sw_ret_fail').value) || 0
        }
    };
    
    try {
        const res = await fetch('/api/admin/config/spin-wheel', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error("Failed to update config");
        showAdminAlert('Spin & Win settings updated!', 'Success', 'success');
    } catch (err) {
        showAdminAlert(err.message, 'Save Error', 'error');
    }
}

// Bind to window context for raw inline onclick HTML elements
window.toggleRewardTypeInputs = toggleRewardTypeInputs;
window.editTier = editTier;
window.deleteTier = deleteTier;
window.resetTierForm = resetTierForm;
window.handleSaveTier = handleSaveTier;
window.viewProfileDetails = viewProfileDetails;
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

    try {
        const res = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        if (res.ok) {
            showAdminAlert('Product deleted successfully', 'Deleted', 'success');
            loadProducts();
        } else {
            const errData = await res.json().catch(() => ({}));
            showAdminAlert(errData.error || 'Failed to delete product', 'Delete Error', 'error');
        }
    } catch (err) {
        showAdminAlert('Network error while deleting product', 'Error', 'error');
    }
}

window.deleteProduct = deleteProduct;
window.saveProfileFromAdmin = saveProfileFromAdmin;
window.loadProfiles = loadProfiles;
window.addGalleryImageField = addGalleryImageField;
window.initProductModal = initProductModal;
window.uploadImageFile = uploadImageFile;
window.uploadGalleryRowFile = uploadGalleryRowFile;

// --- VERIFY & CONFIRM STORE PICKUPS ---
function triggerSearchPickupOrder() {
    const input = document.getElementById('scannerOrderIdInput');
    if (!input) return;
    const orderId = input.value.trim();
    if (!orderId) {
        showScannerMessage("Please enter a valid Order ID.", "red", "#fff5f5");
        return;
    }
    searchPickupOrder(orderId);
}

function showScannerMessage(text, color, bgColor) {
    const msgEl = document.getElementById('scannerMessage');
    if (!msgEl) return;
    msgEl.innerText = text;
    msgEl.style.color = color;
    msgEl.style.backgroundColor = bgColor || '#fff';
    msgEl.style.border = `1px solid ${color}40`;
    msgEl.style.display = 'block';
}

let html5QrcodeScanner = null;

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startQrScanBtn');
    const stopBtn = document.getElementById('stopQrScanBtn');
    const container = document.getElementById('qrReaderContainer');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            container.style.display = 'block';
            if (!html5QrcodeScanner) {
                html5QrcodeScanner = new Html5Qrcode("qr-reader");
            }
            html5QrcodeScanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText, decodedResult) => {
                    // Success!
                    console.log(`Scan result: ${decodedText}`);
                    document.getElementById('scannerOrderIdInput').value = decodedText;
                    
                    html5QrcodeScanner.stop().then(() => {
                        container.style.display = 'none';
                        triggerSearchPickupOrder();
                    }).catch(err => {
                        console.error("Failed to stop scanner", err);
                    });
                },
                (errorMessage) => {
                    // parse error, ignore
                }
            ).catch(err => {
                showScannerMessage(`Unable to start camera: ${err}`, "red", "#fff5f5");
            });
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            if (html5QrcodeScanner) {
                html5QrcodeScanner.stop().then(() => {
                    container.style.display = 'none';
                }).catch(err => console.error(err));
            } else {
                container.style.display = 'none';
            }
        });
    }
});

async function searchPickupOrder(orderId) {
    const msgEl = document.getElementById('scannerMessage');
    const cardEl = document.getElementById('pickupOrderCard');
    if (msgEl) msgEl.style.display = 'none';
    if (cardEl) cardEl.style.display = 'none';

    try {
        const res = await fetch(`/api/admin/orders?orderId=${encodeURIComponent(orderId)}`, {
            headers: getAuthHeader()
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            showScannerMessage(errData.error || `Failed to fetch order. Status: ${res.status}`, "red", "#fff5f5");
            return;
        }

        const data = await res.json();
        if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && !data.id)) {
            showScannerMessage(`Order Reference "${orderId}" not found in database.`, "red", "#fff5f5");
            return;
        }

        const order = Array.isArray(data) ? data[0] : data;
        displayPickupOrderDetails(order);

    } catch (err) {
        showScannerMessage(`Connection error: ${err.message}`, "red", "#fff5f5");
    }
}

function displayPickupOrderDetails(order) {
    const cardEl = document.getElementById('pickupOrderCard');
    if (!cardEl) return;

    // Fill fields
    document.getElementById('poCardOrderId').innerHTML = `Order #${order.id} <button type="button" onclick="copyTextToClipboard('${order.id}', this)" style="margin-left:8px; padding:2px 8px; font-size:0.75rem; border-radius:4px; border:1px solid #ddd; background:#fff; cursor:pointer">Copy ID</button>`;
    document.getElementById('poCardCustomer').innerText = order.customerEmail;
    document.getElementById('poCardCheckoutType').innerText = order.checkoutType === 'pickup' ? '🏪 Boutique Pickup' : order.checkoutType;
    document.getElementById('poCardPaymentMethod').innerText = order.paymentMethod === 'offline_qr' ? '💳 Offline UPI QR Pass' : '🌐 Paid Online (RazorPay)';
    document.getElementById('poCardDate').innerText = new Date(order.createdAt).toLocaleString();
    document.getElementById('poCardAmount').innerText = `₹${order.totalAmount.toLocaleString('en-IN')}`;

    // Status Badge
    const badge = document.getElementById('poCardStatusBadge');
    badge.innerText = order.status;
    
    let badgeBg = '#ffe0b2';
    let badgeColor = '#e65100';
    if (order.status === 'picked_up') {
        badgeBg = '#e8f5e9';
        badgeColor = '#2e7d32';
    } else if (order.status === 'ready_for_pickup') {
        badgeBg = '#fff8e1';
        badgeColor = '#f57f17';
    } else if (order.status === 'pending_payment') {
        badgeBg = '#ffebee';
        badgeColor = '#c62828';
    } else if (order.status === 'paid') {
        badgeBg = '#e3f2fd';
        badgeColor = '#0d47a1';
    }
    badge.style.backgroundColor = badgeBg;
    badge.style.color = badgeColor;

    // Items list
    const itemsList = document.getElementById('poCardItemsList');
    itemsList.innerHTML = '';
    if (order.items && order.items.length > 0) {
        order.items.forEach(it => {
            const qty = it.quantity || 1;
            const unitPrice = it.priceAtQty || 0;
            const lineTotal = unitPrice * qty;
            const li = document.createElement('li');
            li.innerHTML = `<strong>${it.productName || it.productId}</strong> ${it.size ? `<span style="font-size:0.8rem; background:#fff0e9; color:#b97a66; padding:1px 5px; border-radius:3px; margin-left:4px">Size: ${it.size}</span>` : ''} &times; <strong>${qty}</strong> — <strong>₹${lineTotal.toLocaleString('en-IN')}</strong> ${qty > 1 ? `<small style="color:#888">(₹${unitPrice.toLocaleString('en-IN')} each)</small>` : ''}`;
            itemsList.appendChild(li);
        });
    } else {
        itemsList.innerHTML = '<li style="color:#999; font-style:italic">No items logged for this order.</li>';
    }

    // Actions Container
    const actions = document.getElementById('poCardActionsContainer');
    actions.innerHTML = '';

    if (order.status === 'picked_up') {
        const infoMsg = document.createElement('div');
        infoMsg.style.cssText = 'padding: 0.8rem; background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32; border-radius: 8px; font-weight: 500; font-size: 0.9rem; flex: 1; text-align: center;';
        infoMsg.innerText = '✓ Order is already Picked Up & Fulfilled.';
        actions.appendChild(infoMsg);
    } else if (order.checkoutType !== 'pickup') {
        const warnMsg = document.createElement('div');
        warnMsg.style.cssText = 'padding: 0.8rem; background: #fff3cd; border: 1px solid #ffeeba; color: #856404; border-radius: 8px; font-size: 0.9rem; flex: 1;';
        warnMsg.innerHTML = `⚠️ <strong>Warning:</strong> This order fulfillment method is <strong>${order.checkoutType}</strong>. Verify dispatch details instead.`;
        actions.appendChild(warnMsg);
    } else {
        // Render verification details & Action button!
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.style.cssText = 'padding: 0.85rem 2rem; border-radius: 8px; font-weight: 600; flex: 1;';
        
        if (order.paymentMethod === 'offline_qr' && order.status === 'pending_payment') {
            btn.innerText = 'Verify Offline UPI Payment & Complete Pickup';
            btn.style.backgroundColor = '#d0883b';
        } else {
            btn.innerText = 'Confirm Store Pickup & Release Items';
        }

        btn.onclick = () => confirmStorePickup(order.id);
        actions.appendChild(btn);
    }

    cardEl.style.display = 'block';
}

async function confirmStorePickup(orderId) {
    if (!confirm(`Are you sure you want to confirm pickup for Order #${orderId}?`)) return;

    try {
        const res = await fetch('/api/admin/orders/confirm-pickup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify({ orderId: orderId })
        });

        if (res.ok) {
            showScannerMessage(`Order #${orderId} has been successfully verified, payment confirmed/checked, and marked as picked_up!`, "green", "#f4fbf7");
            // Reload order details
            searchPickupOrder(orderId);
            // Refresh order list if general table is open
            loadOrders();
        } else {
            const errData = await res.json().catch(() => ({}));
            showScannerMessage(`Failed to confirm pickup: ${errData.error || 'Server error'}`, "red", "#fff5f5");
        }
    } catch (err) {
        showScannerMessage(`Connection error: ${err.message}`, "red", "#fff5f5");
    }
}

function handleUrlHashChange() {
    const hash = window.location.hash || '';
    if (hash.startsWith('#pickup-scanner') || hash.startsWith('#confirm-pickup')) {
        const qIdx = hash.indexOf('?');
        let orderId = '';
        if (qIdx !== -1) {
            const params = new URLSearchParams(hash.slice(qIdx));
            orderId = params.get('orderId') || '';
        }
        
        // Find matching li in navigation
        const pickupTab = document.querySelector('nav li[data-tab="pickup-scanner"]');
        if (pickupTab) {
            const tabs = document.querySelectorAll('nav li');
            const contents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(t => t.classList.remove('active'));
            pickupTab.classList.add('active');
            
            contents.forEach(c => c.classList.remove('active'));
            const targetEl = document.getElementById('tab-pickup-scanner');
            if (targetEl) targetEl.classList.add('active');
            
            document.getElementById('pageTitle').innerText = pickupTab.innerText;
            updateHeaderActions('pickup-scanner');
            
            if (orderId) {
                const inputEl = document.getElementById('scannerOrderIdInput');
                if (inputEl) {
                    inputEl.value = orderId;
                    searchPickupOrder(orderId);
                }
            }
        }
    }
}

window.triggerSearchPickupOrder = triggerSearchPickupOrder;
window.searchPickupOrder = searchPickupOrder;
window.confirmStorePickup = confirmStorePickup;
window.handleUrlHashChange = handleUrlHashChange;

async function loadAuthConfig() {
    try {
        const res = await fetch('/api/config/auth');
        if (res.ok) {
            const data = await res.json();
            document.getElementById('auth_phone_enabled').checked = data.phone_auth_enabled;
        }
    } catch (err) {
        console.error("Failed to load auth config:", err);
    }
}

async function saveAuthConfig() {
    try {
        const payload = {
            phone_auth_enabled: document.getElementById('auth_phone_enabled').checked
        };
        const res = await fetch('/api/admin/config/auth', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error("Failed to update auth config");
        showAdminAlert('Authentication settings updated!', 'Success', 'success');
    } catch (err) {
        console.error("Failed to save auth config:", err);
        showAdminAlert(err.message, 'Error', 'error');
    }
}

window.loadAuthConfig = loadAuthConfig;
window.saveAuthConfig = saveAuthConfig;
