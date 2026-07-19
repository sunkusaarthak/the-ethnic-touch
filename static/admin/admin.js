document.addEventListener('DOMContentLoaded', () => {
    console.log("[SETTINGS DIAG] Page Loaded. Initializing tabs and listeners.");
    initTabs();
    loadDashboard();
    
    // Form Submissions
    console.log("[SETTINGS DIAG] Hooking submit events...");
    document.getElementById('productForm').addEventListener('submit', handleAddProduct);
    document.getElementById('couponForm').addEventListener('submit', handleAddCoupon);
    
    const tf = document.getElementById('tierForm');
    if (tf) {
        console.log("[SETTINGS DIAG] Found tierForm. Binding submit listener.");
        tf.addEventListener('submit', handleSaveTier);
    } else {
        console.error("[SETTINGS DIAG] ERROR: Could not find tierForm by ID!");
    }
    
    const logout = document.getElementById('logoutBtn');
    if (logout) {
        logout.addEventListener('click', () => window.location.href = '/');
    }
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
    if (tab === 'settings') loadSettings();
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

let currentTiers = [];

async function loadSettings() {
    console.log("[SETTINGS DIAG] loadSettings function started execution.");
    const body = document.querySelector('#tiersTable tbody');
    if (!body) {
        console.error("[SETTINGS DIAG] ERROR: Element '#tiersTable tbody' not found in DOM!");
        alert("[JS Error] Element '#tiersTable tbody' not found in DOM!");
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
            detailsStr = `<strong>${tier.discountType === 'percentage' ? tier.discountValue + '%' : '₹' + tier.discountValue} Off</strong> Coupon (Pattern: <code>${tier.couponFormat}</code>)`;
        } else {
            detailsStr = `Physical item: <strong>${tier.physicalName}</strong>`;
        }
        
        tr.innerHTML = `
            <td style="font-weight: 500;">${tier.name}</td>
            <td>₹${parseFloat(tier.threshold).toLocaleString('en-IN')}</td>
            <td style="text-transform: capitalize;">${tier.rewardType}</td>
            <td>${detailsStr}</td>
            <td style="text-align: right;">
                <button class="btn-secondary" style="padding: 4px 12px; font-size: 0.8rem; margin-right: 0.5rem;" onclick="editTier(${idx})">Edit</button>
                <button class="btn-secondary" style="padding: 4px 12px; font-size: 0.8rem; color: #ef4444; border-color: #ffeaea;" onclick="deleteTier(${idx})">Delete</button>
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
        document.getElementById('t_physical_name').value = '';
    } else {
        document.getElementById('t_physical_name').value = tier.physicalName;
        document.getElementById('t_discount_value').value = '';
        document.getElementById('t_coupon_format').value = '';
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
            
            console.log("[SETTINGS DIAG] Coupon Input Values:", { discType, discValStr, copFormat });
            
            tier.discountType = discType;
            tier.discountValue = parseFloat(discValStr || 0);
            tier.couponFormat = copFormat || "GFT-[RAND]";
            tier.physicalName = "";
        } else {
            const physName = document.getElementById('t_physical_name').value;
            console.log("[SETTINGS DIAG] Physical Input Values:", { physName });
            
            tier.discountType = "";
            tier.discountValue = 0;
            tier.couponFormat = "";
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
        alert("[JS Error] " + err.message);
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
            alert("Error saving settings: " + errMsg);
        }
    } catch(err) {
        console.error("[SETTINGS DIAG] Fetch request connection failed:", err);
        alert("Failed to connect to server: " + err.message);
    }
}

// Bind to window context for raw inline onclick HTML elements
window.toggleRewardTypeInputs = toggleRewardTypeInputs;
window.editTier = editTier;
window.deleteTier = deleteTier;
window.resetTierForm = resetTierForm;
window.handleSaveTier = handleSaveTier;
