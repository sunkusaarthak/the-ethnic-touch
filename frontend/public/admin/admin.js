let currentUserRole = null;
let currentUserEmail = null;
let scannerOrderRequest = null;

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSrS3zywg8ao1lvK9NWmy1RDR33Nim2h8",
    authDomain: "the-ethnic-touch.firebaseapp.com",
    projectId: "the-ethnic-touch",
    storageBucket: "the-ethnic-touch.firebasestorage.app",
    messagingSenderId: "565024605742",
    appId: "1:565024605742:web:0452b9b88a65be9d67c1bf"
};

const getApiBaseUrl = () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const backendParam = urlParams.get('backend');
        if (backendParam) {
            localStorage.setItem('ADMIN_API_BASE_URL', backendParam);
            return backendParam.replace(/\/+$/, '');
        }
    } catch (_) { }

    try {
        const stored = localStorage.getItem('ADMIN_API_BASE_URL');
        if (stored) {
            return stored.replace(/\/+$/, '');
        }
    } catch (_) { }

    // 3. Render environment variable (injected at build time into window.__ENV__)
    if (window.__ENV__ && window.__ENV__.VITE_API_BASE_URL) {
        return window.__ENV__.VITE_API_BASE_URL.replace(/\/+$/, '');
    }

    if (window.location.hostname.includes('onrender.com') || window.location.hostname.includes('theethnictouch.com')) {
        return 'https://tet-backend-1.onrender.com';
    }

    return '';
};

const API_BASE_URL = getApiBaseUrl();

window.escapeHTML = function (str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

let auth;

function initAdminApp() {

    // Initialize Firebase
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        initAuthFlow();
    } else {
        console.error("Firebase SDK not loaded!");
    }

    initTabs();
    initMobileNav();
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
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminApp);
} else {
    initAdminApp();
}

// ==========================================
// STAFF MANAGEMENT (RBAC)
// ==========================================
async function loadStaff() {
    const tbody = document.querySelector('#staffTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Loading...</td></tr>';

    try {
        const res = await fetch(API_BASE_URL + '/api/admin/staff', { headers: getAuthHeader() });
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
                <td data-label="Staff Email"><strong>${s.email}</strong></td>
                <td data-label="Role"><span style="background: ${s.role === 'admin' ? '#e1f5fe' : '#f5f5f5'}; color: ${s.role === 'admin' ? '#0277bd' : '#666'}; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; font-weight: 500;">${s.role.toUpperCase()}</span></td>
                <td data-label="Added On">${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                <td data-label="Actions" style="text-align:right;">
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
        const res = await fetch(API_BASE_URL + '/api/admin/staff', {
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
    const confirmed = await showAdminConfirm(`Are you sure you want to remove access for ${email}?`, 'Remove Staff Member', 'Remove', 'Cancel', true);
    if (!confirmed) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/staff?email=${encodeURIComponent(email)}`, {
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
        modal.className = 'admin-ui-modal-backdrop';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(5px);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000000; padding: 1.25rem; box-sizing: border-box;
        `;
        document.body.appendChild(modal);
    }

    const iconColor = type === 'error' ? '#dc2626' : (type === 'success' ? '#16a34a' : (type === 'info' ? '#2563eb' : '#d97706'));
    const iconBg = type === 'error' ? '#fee2e2' : (type === 'success' ? '#dcfce7' : (type === 'info' ? '#dbeafe' : '#fef3c7'));
    const iconSymbol = type === 'error' ? '✕' : (type === 'success' ? '✓' : (type === 'info' ? 'ℹ' : '!'));

    modal.innerHTML = `
        <div style="background: #ffffff; border-radius: 18px; max-width: 440px; width: 100%; padding: 2rem 1.8rem; box-shadow: 0 20px 45px rgba(0,0,0,0.22); text-align: center; position: relative; font-family: inherit; box-sizing: border-box; animation: adminModalFadeIn 0.22s ease-out;">
            <button onclick="document.getElementById('adminCustomAlertModal').style.display='none'" aria-label="Close" style="position: absolute; top: 1.1rem; right: 1.1rem; background: transparent; border: none; font-size: 1.25rem; color: #94a3b8; cursor: pointer; padding: 0.3rem; line-height: 1; border-radius: 6px;">✕</button>
            <div style="width: 58px; height: 58px; border-radius: 50%; background-color: ${iconBg}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.1rem; font-size: 1.6rem; font-weight: bold;">
                ${iconSymbol}
            </div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0 0 0.6rem;">${escapeHTML(title)}</h3>
            <div style="font-size: 0.94rem; color: #475569; line-height: 1.55; margin: 0 0 1.6rem; word-break: break-word; white-space: pre-line; max-height: 60vh; overflow-y: auto;">${escapeHTML(message)}</div>
            <button onclick="document.getElementById('adminCustomAlertModal').style.display='none'" style="width: 100%; padding: 0.8rem 1rem; font-size: 0.94rem; font-weight: 600; background: #8C5835; color: #ffffff; border: none; border-radius: 10px; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">Acknowledge</button>
        </div>
    `;
    modal.style.display = 'flex';
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}

function showAdminConfirm(message, title = "Confirm Action", confirmText = "Confirm", cancelText = "Cancel", isDestructive = false) {
    return new Promise((resolve) => {
        let modal = document.getElementById('adminCustomConfirmModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'adminCustomConfirmModal';
            modal.className = 'admin-ui-modal-backdrop';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(5px);
                display: flex; align-items: center; justify-content: center;
                z-index: 1000000; padding: 1.25rem; box-sizing: border-box;
            `;
            document.body.appendChild(modal);
        }

        const confirmBg = isDestructive ? '#dc2626' : '#8C5835';
        const iconBg = isDestructive ? '#fee2e2' : '#fef3c7';
        const iconColor = isDestructive ? '#dc2626' : '#d97706';
        const iconChar = isDestructive ? '🗑' : '?';

        modal.innerHTML = `
            <div style="background: #ffffff; border-radius: 18px; max-width: 440px; width: 100%; padding: 2rem 1.8rem; box-shadow: 0 20px 45px rgba(0,0,0,0.22); text-align: center; position: relative; font-family: inherit; box-sizing: border-box; animation: adminModalFadeIn 0.22s ease-out;">
                <button id="adminConfirmCloseBtn" aria-label="Close" style="position: absolute; top: 1.1rem; right: 1.1rem; background: transparent; border: none; font-size: 1.25rem; color: #94a3b8; cursor: pointer; padding: 0.3rem; line-height: 1; border-radius: 6px;">✕</button>
                <div style="width: 58px; height: 58px; border-radius: 50%; background-color: ${iconBg}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.1rem; font-size: 1.6rem; font-weight: bold;">
                    ${iconChar}
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0 0 0.6rem;">${escapeHTML(title)}</h3>
                <div style="font-size: 0.94rem; color: #475569; line-height: 1.55; margin: 0 0 1.6rem; word-break: break-word; white-space: pre-line;">${escapeHTML(message)}</div>
                <div style="display: flex; gap: 0.75rem; justify-content: center;">
                    <button id="adminConfirmCancelBtn" style="flex: 1; padding: 0.8rem 1rem; font-size: 0.92rem; font-weight: 600; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; border-radius: 10px; cursor: pointer; transition: background 0.15s;">${escapeHTML(cancelText)}</button>
                    <button id="adminConfirmOkBtn" style="flex: 1; padding: 0.8rem 1rem; font-size: 0.92rem; font-weight: 600; background: ${confirmBg}; color: #ffffff; border: none; border-radius: 10px; cursor: pointer; transition: background 0.15s; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">${escapeHTML(confirmText)}</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';

        let isResolved = false;
        const close = (result) => {
            if (isResolved) return;
            isResolved = true;
            modal.style.display = 'none';
            resolve(result);
        };

        document.getElementById('adminConfirmOkBtn').onclick = () => close(true);
        document.getElementById('adminConfirmCancelBtn').onclick = () => close(false);
        document.getElementById('adminConfirmCloseBtn').onclick = () => close(false);
        modal.onclick = (e) => {
            if (e.target === modal) close(false);
        };
    });
}

function showAdminPrompt(message, defaultValue = "", title = "Input Required", confirmText = "Submit", cancelText = "Cancel") {
    return new Promise((resolve) => {
        let modal = document.getElementById('adminCustomPromptModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'adminCustomPromptModal';
            modal.className = 'admin-ui-modal-backdrop';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(5px);
                display: flex; align-items: center; justify-content: center;
                z-index: 1000000; padding: 1.25rem; box-sizing: border-box;
            `;
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div style="background: #ffffff; border-radius: 18px; max-width: 440px; width: 100%; padding: 2rem 1.8rem; box-shadow: 0 20px 45px rgba(0,0,0,0.22); text-align: left; position: relative; font-family: inherit; box-sizing: border-box; animation: adminModalFadeIn 0.22s ease-out;">
                <button id="adminPromptCloseBtn" aria-label="Close" style="position: absolute; top: 1.1rem; right: 1.1rem; background: transparent; border: none; font-size: 1.25rem; color: #94a3b8; cursor: pointer; padding: 0.3rem; line-height: 1; border-radius: 6px;">✕</button>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0 0 0.6rem;">${escapeHTML(title)}</h3>
                <div style="font-size: 0.94rem; color: #475569; line-height: 1.55; margin: 0 0 1.2rem; word-break: break-word; white-space: pre-line;">${escapeHTML(message)}</div>
                <input type="text" id="adminPromptInput" value="${escapeHTML(defaultValue || '')}" style="width: 100%; box-sizing: border-box; padding: 0.8rem 0.9rem; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; margin-bottom: 1.4rem; font-family: inherit; outline: none; transition: border-color 0.15s;" />
                <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                    <button id="adminPromptCancelBtn" style="padding: 0.75rem 1.25rem; font-size: 0.92rem; font-weight: 600; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; border-radius: 10px; cursor: pointer;">${escapeHTML(cancelText)}</button>
                    <button id="adminPromptOkBtn" style="padding: 0.75rem 1.25rem; font-size: 0.92rem; font-weight: 600; background: #8C5835; color: #ffffff; border: none; border-radius: 10px; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">${escapeHTML(confirmText)}</button>
                </div>
            </div>
        `;
        modal.style.display = 'flex';
        const input = document.getElementById('adminPromptInput');
        input.focus();
        input.select();

        let isResolved = false;
        const close = (val) => {
            if (isResolved) return;
            isResolved = true;
            modal.style.display = 'none';
            resolve(val);
        };

        document.getElementById('adminPromptOkBtn').onclick = () => close(input.value);
        document.getElementById('adminPromptCancelBtn').onclick = () => close(null);
        document.getElementById('adminPromptCloseBtn').onclick = () => close(null);
        input.onkeydown = (e) => {
            if (e.key === 'Enter') close(input.value);
            if (e.key === 'Escape') close(null);
        };
        modal.onclick = (e) => {
            if (e.target === modal) close(null);
        };
    });
}

window.showAdminAlert = showAdminAlert;
window.showAdminConfirm = showAdminConfirm;
window.showAdminPrompt = showAdminPrompt;

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
        const res = await fetch(API_BASE_URL + '/api/admin/upload', {
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
        const res = await fetch(API_BASE_URL + '/api/admin/upload', {
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
                } catch (_) { }
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

    console.log("[Admin Auth] Initializing auth flow. Button found:", !!loginBtn);

    if (auth.getRedirectResult) {
        auth.getRedirectResult().catch(err => {
            if (err && err.code) {
                console.error("[Admin Auth] Redirect login error:", err);
                if (errorMsg) {
                    errorMsg.innerText = err.message || "Authentication failed.";
                    errorMsg.style.display = 'block';
                }
            }
        });
    }

    auth.onAuthStateChanged(async (user) => {
        window.configureAdminOrderAlerts?.(null);
        if (user) {
            console.log("[Admin Auth] User detected:", user.email);
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
                    console.log("[Admin Auth] Verified with backend, role:", currentUserRole);

                    // Hide overlay
                    if (overlay) overlay.style.display = 'none';

                    // Apply RBAC UI
                    applyRoleBasedUI();
                    window.configureAdminOrderAlerts?.(user, API_BASE_URL);

                    if (window.location.hash === '#orders') {
                        handleUrlHashChange();
                    } else {
                        loadDashboard();
                    }
                } else {
                    const errText = await res.text();
                    console.warn("[Admin Auth] Backend rejected user:", user.email, errText);
                    if (res.status === 403) {
                        auth.signOut();
                        localStorage.removeItem('adminToken');
                    }
                    if (errorMsg) {
                        if (res.status === 403) {
                            errorMsg.innerText = `Access Denied for ${user.email}. You do not have admin permissions in the database.`;
                        } else {
                            errorMsg.innerText = `Backend communication error (${res.status}). The Go backend server may be restarting or unreachable. Please try refreshing.`;
                        }
                        errorMsg.style.display = 'block';
                    }
                    if (overlay) overlay.style.display = 'flex';
                }
            } catch (err) {
                console.error("[Admin Auth] Auth verification error", err);
                if (errorMsg) {
                    errorMsg.innerText = "An error occurred during authentication: " + err.message;
                    errorMsg.style.display = 'block';
                }
                if (overlay) overlay.style.display = 'flex';
            }
        } else {
            localStorage.removeItem('adminToken');
            if (overlay) overlay.style.display = 'flex';
        }
    });

    if (loginBtn) {
        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log("[Admin Auth] Sign in button clicked!");
            if (errorMsg) errorMsg.style.display = 'none';

            if (!auth) {
                if (errorMsg) {
                    errorMsg.innerText = "Firebase Auth is not ready. Please refresh the page.";
                    errorMsg.style.display = 'block';
                }
                return;
            }

            const provider = new firebase.auth.GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });

            try {
                loginBtn.disabled = true;
                const oldContent = loginBtn.innerHTML;
                loginBtn.innerText = "Opening Google Sign-In...";
                await auth.signInWithPopup(provider);
                loginBtn.innerHTML = oldContent;
            } catch (err) {
                console.error("[Admin Auth] Google Login Failed", err);
                if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
                    try {
                        await auth.signInWithRedirect(provider);
                        return;
                    } catch (redirectErr) { }
                }
                if (errorMsg) {
                    let userFriendlyMsg = err.message;
                    if (err.code === 'auth/popup-blocked') {
                        userFriendlyMsg = "Popup was blocked by your browser. Please allow popups for this site.";
                    } else if (err.code === 'auth/unauthorized-domain') {
                        userFriendlyMsg = `Domain (${window.location.hostname}) is not authorized in Firebase Console -> Authentication -> Settings -> Authorized domains.`;
                    }
                    errorMsg.innerText = userFriendlyMsg;
                    errorMsg.style.display = 'block';
                }
            } finally {
                loginBtn.disabled = false;
                loginBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg><span>Sign in with Google</span>`;
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
            const contentEl = document.getElementById(`tab-${target}`);
            if (contentEl) contentEl.classList.add('active');

            const tabTitle = tab.getAttribute('data-title') || tab.querySelector('.nav-label')?.innerText || tab.innerText;
            document.getElementById('pageTitle').innerText = (tabTitle || '').trim();

            // Sync mobile bottom navigation bar active state
            const bottomNavItems = document.querySelectorAll('.mobile-bottom-nav .bottom-nav-item');
            bottomNavItems.forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-bottom-tab') === target);
            });

            // Close mobile off-canvas drawer
            document.body.classList.remove('sidebar-open');

            updateHeaderActions(target);
            loadTabData(target);
        });
    });
}

function initMobileNav() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const bottomNavMenuBtn = document.getElementById('bottomNavMenuBtn');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const mobileQuickScanBtn = document.getElementById('mobileQuickScanBtn');

    const toggleSidebar = (show) => {
        const isOpen = show !== undefined ? show : !document.body.classList.contains('sidebar-open');
        document.body.classList.toggle('sidebar-open', isOpen);
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => toggleSidebar(true));
    }
    if (bottomNavMenuBtn) {
        bottomNavMenuBtn.addEventListener('click', () => toggleSidebar(true));
    }
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', () => toggleSidebar(false));
    }
    if (mobileQuickScanBtn) {
        mobileQuickScanBtn.addEventListener('click', () => {
            const scanTab = document.querySelector('nav li[data-tab="pickup-scanner"]');
            if (scanTab) scanTab.click();
            toggleSidebar(false);
        });
    }

    // Bind bottom navigation items to switch tabs
    const bottomNavItems = document.querySelectorAll('.mobile-bottom-nav .bottom-nav-item[data-bottom-tab]');
    bottomNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-bottom-tab');
            const targetTab = document.querySelector(`nav li[data-tab="${target}"]`);
            if (targetTab) {
                targetTab.click();
            }
            toggleSidebar(false);
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
    } else if (tab === 'reels') {
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.innerText = '+ Add New Reel';
        btn.onclick = () => openAddReelModal();
        container.appendChild(btn);
    }
}


async function loadSiteSale() {
    const form = document.getElementById('siteSaleForm');
    const fields = form.elements;
    const status = document.getElementById('siteSaleStatus');
    const formatIST = value => !value || value.startsWith('0001-') ? '' :
        new Date(Date.parse(value) + 330 * 60000).toISOString().slice(0, 16);
    const iso = value => value ? new Date(value + ':00+05:30').toISOString() : '0001-01-01T00:00:00Z';
    const read = () => ({
        enabled: fields.enabled.checked,
        name: fields.name.value.trim(),
        percent: Number(fields.percent.value),
        collections: fields.collections.value.split(',').map(name => name.trim()).filter(Boolean),
        startsAt: iso(fields.startsAt.value),
        endsAt: iso(fields.endsAt.value)
    });
    let savedSale;
    const write = async sale => {
        try {
            const token = await auth.currentUser.getIdToken();
            const data = await fetchJsonSafe('/api/admin/config/sale', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
                body: JSON.stringify(sale)
            });
            fields.enabled.checked = data.enabled;
            savedSale = data;
            status.textContent = data.enabled ? 'Sale saved. The schedule controls when it appears.' : 'Sale is off.';
        } catch (err) {
            status.textContent = err.message;
        }
    };
    form.onsubmit = event => { event.preventDefault(); write(read()); };
    document.getElementById('endSiteSale').onclick = async () => {
        if (!savedSale) return;
        const confirmed = await showAdminConfirm('End the current sale now?', 'End Sale', 'End Sale', 'Keep Running', true);
        if (confirmed) write({ ...savedSale, enabled: false });
    };
    document.getElementById('previewSiteSale').onclick = () => {
        const sale = read();
        const scope = sale.collections.length ? sale.collections.join(', ') : 'all eligible styles';
        status.textContent = (sale.name || 'Unnamed sale') + ' · ' + sale.percent + '% off · ' + scope +
            ' · ' + (fields.startsAt.value || 'No start time') + ' to ' + (fields.endsAt.value || 'No end time') + ' IST';
    };
    try {
        const token = await auth.currentUser.getIdToken();
        const data = await fetchJsonSafe('/api/admin/config/sale', { headers: { Authorization: 'Bearer ' + token } });
        savedSale = data;
        fields.enabled.checked = data.enabled;
        fields.name.value = data.name || '';
        fields.percent.value = data.percent || '';
        fields.collections.value = (data.collections || []).join(', ');
        fields.startsAt.value = formatIST(data.startsAt);
        fields.endsAt.value = formatIST(data.endsAt);
        status.textContent = !data.enabled ? 'Sale is off.' : Date.now() < Date.parse(data.startsAt) ? 'Sale is scheduled.' :
            Date.now() < Date.parse(data.endsAt) ? 'Sale is live.' : 'Sale has ended.';
    } catch (err) {
        status.textContent = err.message;
    }
}

async function loadTabData(target) {
    if (target === 'sales') loadSiteSale();
    if (target === 'dashboard') loadDashboard();
    if (target === 'products') loadProducts();
    if (target === 'orders') loadOrders();
    if (target === 'support') loadSupport();
    if (target === 'coupons') loadCoupons();
    if (target === 'reels') loadInstagramReels();
    if (target === 'flashdrop') loadFlashDropConfig();
    if (target === 'settings') loadSettings();
    if (target === 'spinwin') loadSpinWin();
    if (target === 'profiles') loadProfiles();
    if (target === 'staff') loadStaff();
    if (target === 'preorder') {
        loadPreorderPickupConfig();
        loadPreorderOrders('');
    }
    if (target === 'pickup-scanner') {
        scannerOrderRequest?.abort();
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

        // Realized settled revenue only: exclude abandoned, cancelled, and unpaid orders
        const settledStatuses = ['paid', 'shipped', 'picked_up', 'dispatched_instant'];
        const settledOrders = orderList.filter(o => settledStatuses.includes(o.status));
        const revenue = settledOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        document.getElementById('stat-revenue').innerText = `₹${revenue.toLocaleString('en-IN')}`;
        document.getElementById('stat-orders').innerText = settledOrders.length;
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
        const products = await fetch(API_BASE_URL + '/api/products').then(r => r.json());
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
                <td data-label="Image"><img src="${p.imageUrl}" style="width:44px; height:52px; border-radius:4px; object-fit:cover;"></td>
                <td data-label="Product" style="font-weight:500">${p.name}${p.isPreorder ? ' <span style="display:inline-block; margin-left:6px; background:#f3e8ff; color:#7e22ce; padding:2px 7px; border-radius:12px; font-size:0.7rem; font-weight:700; border:1px solid #d8b4fe;">PREORDER</span>' : ''}</td>
                <td data-label="Category"><span style="background:#f5f5f5; padding:2px 8px; border-radius:4px; font-size:0.8rem;">${p.category}</span></td>
                <td data-label="Price">₹${p.price.toLocaleString('en-IN')}</td>
                <td data-label="Stock">${p.stock}</td>
                <td data-label="Sizes" style="font-size:0.85rem; color:#666;">${sizesDisplay}</td>
                <td data-label="Photos" style="font-size:0.8rem; color:#888;">${imageCount} photo${imageCount !== 1 ? 's' : ''}</td>
                <td data-label="Actions" style="text-align:right;">
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

let allAdminOrders = [];
let ordersOffset = 0;
const ORDERS_LIMIT = 25;
let hasMoreOrders = true;
let isLoadingOrders = false;
let ordersObserver = null;
let orderSearchDebounceTimer = null;

function handleOrderSearchInput(val) {
    clearTimeout(orderSearchDebounceTimer);
    orderSearchDebounceTimer = setTimeout(() => {
        loadOrders(true);
    }, 300);
}

function dispatchNeedsReview(order) {
    return order.status === 'dispatch_review' || (order.status === 'dispatching' &&
        (!order.dispatchStartedAt || Date.now() - Date.parse(order.dispatchStartedAt) >= 120000));
}

function isHomeDeliveryOrder(order) {
    if (order.fulfilmentType === 'PREORDER_STORE_PICKUP') return false;
    return order.fulfilmentType === 'PREORDER_HOME_DELIVERY' || order.checkoutType === 'delivery';
}

function renderSingleOrderRow(o, body) {
    const tr = document.createElement('tr');
    const date = new Date(o.createdAt).toLocaleDateString();

    // Format order items list
    const itemsStr = o.items ? o.items.map(it => `${it.productName || it.productId} (x${it.quantity})`).join(', ') : 'No Details';

    // Determine tracking badge
    let trackingStr = o.trackingNumber ? '' : `<span style="color:#777; font-style:italic">Pending checkout / paid dispatch</span>`;

    if (o.checkoutType === 'pickup') {
        trackingStr = `<span style="font-family:monospace; color:#6b4c35; font-weight:600">🏪 Store Pickup</span>` + (o.paymentMethod === 'offline_qr' ? ` <span style="font-size:0.75rem; background:#fff3cd; color:#856404; padding:2px 4px; border-radius:3px;">Offline QR</span>` : ' (Online)');
    } else if (o.checkoutType === 'hyderabad_instant') {
        trackingStr = `<div style="font-family:monospace; color:#bf7c00; font-weight:600">⚡ Hyderabad Instant</div>`;
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
    } else if (o.status === 'pending_payment' || o.status === 'payment_review') {
        badgeBg = '#ffebee';
        badgeColor = '#c62828';
    }
    const needsDispatchReview = dispatchNeedsReview(o);
    const statusLabel = needsDispatchReview ? 'Verify carrier booking' :
        o.status === 'payment_review' ? 'Payment received — review required' : o.status;

    const tdId = document.createElement('td');
    tdId.setAttribute('data-label', 'Order ID');
    tdId.style.fontWeight = '500';
    tdId.textContent = o.id || '';
    tr.appendChild(tdId);

    const tdActions = document.createElement('td');
    tdActions.setAttribute('data-label', 'Actions');
    const details = document.createElement('button');
    details.type = 'button';
    details.className = 'btn-secondary order-details-button';
    details.textContent = 'More details';
    details.setAttribute('aria-label', `More details for order ${o.id}`);
    details.addEventListener('click', () => openOrderInScanner(o.id));
    tdActions.appendChild(details);
    tr.appendChild(tdActions);

    const tdEmail = document.createElement('td');
    tdEmail.setAttribute('data-label', 'Customer');
    tdEmail.textContent = o.customerEmail || '';
    tr.appendChild(tdEmail);

    const tdAmt = document.createElement('td');
    tdAmt.setAttribute('data-label', 'Amount');
    tdAmt.textContent = '₹' + (o.totalAmount || 0).toLocaleString('en-IN');
    tr.appendChild(tdAmt);

    const tdItems = document.createElement('td');
    tdItems.setAttribute('data-label', 'Items');
    tdItems.style.cssText = 'font-size:0.9rem; color:#555; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';
    tdItems.title = itemsStr;
    tdItems.textContent = itemsStr;
    tr.appendChild(tdItems);

    const tdStatus = document.createElement('td');
    tdStatus.setAttribute('data-label', 'Status');
    const spanStatus = document.createElement('span');
    spanStatus.style.cssText = `padding:4px 8px; background:${badgeBg}; color:${badgeColor}; border-radius:4px; font-size:0.8rem; font-weight:500`;
    spanStatus.textContent = statusLabel;
    tdStatus.appendChild(spanStatus);
    tr.appendChild(tdStatus);

    const tdTracking = document.createElement('td');
    tdTracking.setAttribute('data-label', 'Tracking');
    tdTracking.innerHTML = trackingStr;
    if (o.checkoutType !== 'pickup' && o.trackingNumber) {
        const tracking = document.createElement('span');
        tracking.textContent = o.trackingNumber;
        tdTracking.appendChild(tracking);
    }
    if (o.dispatchError) {
        const error = document.createElement('div');
        error.textContent = o.dispatchError;
        tdTracking.appendChild(error);
    }
    if (currentUserRole === 'admin' && needsDispatchReview) {
        const review = document.createElement('button');
        review.type = 'button';
        review.textContent = 'Review dispatch';
        review.addEventListener('click', () => resolveDelhiveryDispatch(o.id));
        tdTracking.appendChild(review);
    }
    if (currentUserRole === 'admin' && o.status === 'paid' && o.fulfilmentType === 'PREORDER_HOME_DELIVERY' && !o.trackingNumber) {
        const dispatch = document.createElement('button');
        dispatch.type = 'button';
        dispatch.textContent = 'Dispatch ready preorder';
        dispatch.addEventListener('click', () => triggerDelhiveryBatchPickup(o.id, dispatch));
        tdTracking.appendChild(dispatch);
    }
    tr.appendChild(tdTracking);

    const tdDate = document.createElement('td');
    tdDate.setAttribute('data-label', 'Date');
    tdDate.textContent = date;
    tr.appendChild(tdDate);

    body.appendChild(tr);
}

async function loadOrders(reset = true) {
    if (isLoadingOrders) return;
    isLoadingOrders = true;

    const body = document.querySelector('#ordersTable tbody');
    const loadMoreBtn = document.getElementById('btnLoadMoreOrders');
    const spinner = document.getElementById('ordersLoadingSpinner');
    const endMsg = document.getElementById('ordersEndMessage');

    if (reset) {
        ordersOffset = 0;
        hasMoreOrders = true;
        allAdminOrders = [];
        body.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:1.8rem; color:#8C5835;"><span style="display:inline-block; width:16px; height:16px; border:2px solid #D4A373; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; vertical-align:middle; margin-right:8px;"></span>Loading orders...</td></tr>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        if (endMsg) endMsg.style.display = 'none';
    }

    if (spinner) spinner.style.display = 'inline-block';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';

    try {
        const filterEl = document.getElementById('ordersFilter');
        const filterValue = filterEl ? filterEl.value : 'actual';

        const typeFilterEl = document.getElementById('ordersTypeFilter');
        const typeFilterValue = typeFilterEl ? typeFilterEl.value : 'all';

        const searchEl = document.getElementById('orderSearchInput');
        const searchValue = searchEl ? searchEl.value.trim() : '';

        const params = new URLSearchParams({
            limit: ORDERS_LIMIT.toString(),
            offset: ordersOffset.toString(),
            status: filterValue,
            type: typeFilterValue,
            search: searchValue
        });

        const batch = await fetchJsonSafe(`/api/admin/orders?${params.toString()}`, { headers: getAuthHeader() });
        const orders = Array.isArray(batch) ? batch : [];

        if (reset) {
            body.innerHTML = '';
            if (orders.length === 0) {
                body.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#999; padding:2rem;">No orders match the selected filter.</td></tr>';
                hasMoreOrders = false;
            }
        }

        orders.forEach(o => {
            allAdminOrders.push(o);
            renderSingleOrderRow(o, body);
        });

        ordersOffset += orders.length;
        if (orders.length < ORDERS_LIMIT) {
            hasMoreOrders = false;
        }

        if (endMsg) {
            endMsg.style.display = (!hasMoreOrders && allAdminOrders.length > 0) ? 'block' : 'none';
            if (!hasMoreOrders && allAdminOrders.length > 0) {
                endMsg.textContent = `All ${allAdminOrders.length} orders loaded`;
            }
        }
        if (loadMoreBtn) {
            loadMoreBtn.style.display = hasMoreOrders ? 'inline-block' : 'none';
        }

        setupOrdersIntersectionObserver();
    } catch (err) {
        if (reset) {
            body.innerHTML = '<tr><td colspan="8" style="color:red; text-align:center; padding:1.5rem;">Failed to load orders or Unauthorized. Error: ' + window.escapeHTML(err.message) + '</td></tr>';
        }
    } finally {
        isLoadingOrders = false;
        if (spinner) spinner.style.display = 'none';
    }
}

async function loadMoreOrders() {
    if (hasMoreOrders && !isLoadingOrders) {
        await loadOrders(false);
    }
}

function setupOrdersIntersectionObserver() {
    if (ordersObserver) {
        ordersObserver.disconnect();
    }
    const sentinel = document.getElementById('ordersScrollSentinel');
    if (!sentinel || !hasMoreOrders) return;

    if ('IntersectionObserver' in window) {
        ordersObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMoreOrders && !isLoadingOrders) {
                loadMoreOrders();
            }
        }, { rootMargin: '200px' });
        ordersObserver.observe(sentinel);
    }
}

function renderOrders() {
    loadOrders(true);
}

window.loadOrders = loadOrders;
window.loadMoreOrders = loadMoreOrders;
window.renderOrders = renderOrders;
window.handleOrderSearchInput = handleOrderSearchInput;

async function triggerDelhiveryBatchPickup(orderId, rowButton) {
    const btn = rowButton || document.getElementById('btnDelhiveryBatch');
    const originalText = btn ? btn.innerHTML : '🚚 Dispatch Delhivery Batch';
    const confirmPrompt = orderId ? `Is preorder ${orderId} ready to ship?` : 'Dispatch the next batch of paid delivery orders?';
    const confirmed = await showAdminConfirm(confirmPrompt, 'Dispatch Delivery Orders', 'Dispatch', 'Cancel');
    if (!confirmed) {
        return;
    }
    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '🚚 Dispatching...';
        }
        const query = orderId ? `?orderId=${encodeURIComponent(orderId)}` : '';
        const res = await fetchJsonSafe(`/api/admin/delhivery/batch-pickup${query}`, {
            method: 'POST',
            headers: getAuthHeader()
        });
        showAdminAlert(`Dispatched ${res.dispatched || 0}. Need attention: ${res.failed || 0}.`, 'Dispatch Complete', 'info');
    } catch (err) {
        showAdminAlert("Failed to trigger Delhivery batch: " + (err.message || err), 'Dispatch Error', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
        await loadOrders();
    }
}
window.triggerDelhiveryBatchPickup = triggerDelhiveryBatchPickup;

async function resolveDelhiveryDispatch(orderId) {
    const value = await showAdminPrompt(
        `Look up ${orderId} in Delhivery One. Enter its waybill if booked. Leave blank only if you verified that no booking exists.`,
        '',
        'Resolve Delhivery Dispatch',
        'Continue',
        'Cancel'
    );
    if (value === null) return;
    const waybill = value.trim();
    if (!waybill) {
        const confirmed = await showAdminConfirm(
            'Confirm you verified that Delhivery has no booking for this order. The order will be eligible to dispatch again.',
            'Confirm No Booking',
            'Confirm No Booking',
            'Cancel',
            true
        );
        if (!confirmed) return;
    }
    try {
        await fetchJsonSafe('/api/admin/delhivery/resolve-dispatch', {
            method: 'POST',
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, waybill, confirmedNoBooking: !waybill })
        });
        await loadOrders();
    } catch (err) {
        showAdminAlert(err.message || 'Could not save the dispatch review.', 'Review Error', 'error');
    }
}


function resetProductFormState() {
    if (document.getElementById('p_is_preorder')) document.getElementById('p_is_preorder').checked = false;
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
    if (document.getElementById('p_is_preorder')) document.getElementById('p_is_preorder').checked = !!p.isPreorder;

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
                <input type="text" class="gallery-img-input" value="${imgUrl}" placeholder="./images/angle${idx + 2}.png" style="flex: 1; padding: 0.7rem; border: 1px solid #eee; border-radius: 6px; box-sizing: border-box;">
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
        isFeatured: document.getElementById('p_featured').checked,
        isPreorder: document.getElementById('p_is_preorder') ? document.getElementById('p_is_preorder').checked : false
    };

    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(API_BASE_URL + '/api/products', {
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
    const code = (document.getElementById('c_code').value || '').trim().toUpperCase();
    const data = {
        id: 'cp_' + code.toLowerCase() + '_' + Date.now(),
        code: code,
        type: document.getElementById('c_type').value,
        value: parseFloat(document.getElementById('c_value').value),
        minOrder: parseFloat(document.getElementById('c_min').value) || 0,
        usageLimit: parseInt(document.getElementById('c_limit').value) || 100,
        isActive: true
    };

    const res = await fetch(API_BASE_URL + '/api/admin/coupons', {
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
        showAdminAlert(`Coupon ${code} created successfully!`, "Coupon Created", "success");
    } else {
        const errData = await res.json().catch(() => ({}));
        showAdminAlert(errData.error || "Failed to create coupon", 'Coupon Error', 'error');
    }
}

async function loadCoupons() {
    const tbody = document.querySelector('#couponsTable tbody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 1.5rem; color: #888;">Loading store coupons...</td></tr>';
    }

    // 1. Load Homepage Coupon (VIP Voucher) from Homepage Config
    try {
        const hpRes = await fetch(API_BASE_URL + '/api/config/homepage');
        if (hpRes.ok) {
            const hpData = await hpRes.json();
            const voucher = hpData.vip_voucher || {};
            const codeInput = document.getElementById('vip_code');
            const discInput = document.getElementById('vip_discount_percent');
            const titleInput = document.getElementById('vip_title');
            const descInput = document.getElementById('vip_desc');

            if (codeInput) codeInput.value = voucher.code || 'WELCOME10';
            if (discInput) discInput.value = voucher.discount_percent || 10;
            if (titleInput) titleInput.value = voucher.title || 'Get 10% Off Your First Order';
            if (descInput) descInput.value = voucher.desc || 'Use code WELCOME10 at checkout to get an extra 10% off on your first kurti order today!';
        }
    } catch (e) {
        console.error("Failed to load homepage voucher config:", e);
    }

    // 2. Load Store Coupons Table
    try {
        const res = await fetch(API_BASE_URL + '/api/admin/coupons', { headers: getAuthHeader() });
        if (!res.ok) throw new Error("Failed to load coupons (HTTP " + res.status + ")");
        const coupons = await res.json();

        if (!tbody) return;
        tbody.innerHTML = '';

        if (!Array.isArray(coupons) || coupons.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 2rem; color: #888;">No coupons found. Click "+ Create New Coupon" to add one.</td></tr>';
            return;
        }

        coupons.forEach(c => {
            const tr = document.createElement('tr');
            const isPercentage = c.type === 'percentage';
            const valDisplay = isPercentage ? `${c.value}%` : `₹${parseFloat(c.value).toLocaleString('en-IN')}`;
            const minDisplay = c.minOrder > 0 ? `₹${parseFloat(c.minOrder).toLocaleString('en-IN')}` : 'No Min';
            const usageDisplay = `${c.usedCount || 0} / ${c.usageLimit > 0 ? c.usageLimit : '∞'}`;
            const statusBadge = (c.isActive !== false)
                ? `<span style="background: #E8F5E9; color: #2E7D32; padding: 3px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 600;">Active</span>`
                : `<span style="background: #FFEBEE; color: #C62828; padding: 3px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 600;">Inactive</span>`;

            tr.innerHTML = `
                <td data-label="Coupon Code"><code style="font-weight: 700; color: #C49363; background: #FAF7F2; padding: 3px 8px; border-radius: 4px;">${c.code}</code></td>
                <td data-label="Discount Type" style="text-transform: capitalize;">${c.type || 'Percentage'}</td>
                <td data-label="Discount" style="font-weight: 600;">${valDisplay}</td>
                <td data-label="Min Spend">${minDisplay}</td>
                <td data-label="Usage">${usageDisplay}</td>
                <td data-label="Status">${statusBadge}</td>
                <td data-label="Actions">
                    <button type="button" onclick="deleteCoupon('${c.code}')" style="background: #FFF5F5; color: #C62828; border: 1px solid #FFCDD2; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 0.78rem; font-weight: 600;">
                        Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Failed to load coupons:", err);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: #E53E3E; padding: 1.5rem;">Failed to load coupons: ${err.message}</td></tr>`;
        }
    }
}

async function deleteCoupon(code) {
    const confirmed = await showAdminConfirm(`Are you sure you want to delete coupon code "${code}"?`, 'Delete Coupon', 'Delete', 'Cancel', true);
    if (!confirmed) return;
    try {
        const res = await fetch(API_BASE_URL + `/api/admin/coupons?code=${encodeURIComponent(code)}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        if (res.ok) {
            showAdminAlert(`Coupon ${code} removed successfully.`, "Coupon Deleted", "success");
            loadCoupons();
        } else {
            const err = await res.json().catch(() => ({}));
            showAdminAlert(err.error || 'Failed to delete coupon', 'Error', 'error');
        }
    } catch (e) {
        showAdminAlert(e.message, 'Error', 'error');
    }
}

async function saveHomepageCouponConfig() {
    const code = (document.getElementById('vip_code')?.value || 'WELCOME10').trim().toUpperCase();
    const discount = parseInt(document.getElementById('vip_discount_percent')?.value || '10');
    const title = (document.getElementById('vip_title')?.value || 'Get 10% Off Your First Order').trim();
    const desc = (document.getElementById('vip_desc')?.value || '').trim();

    if (!code) {
        showAdminAlert("Please enter a valid coupon code", "Validation Error", "error");
        return;
    }

    try {
        const hpRes = await fetch(API_BASE_URL + '/api/config/homepage');
        if (!hpRes.ok) throw new Error("Could not fetch current homepage configuration");
        const hpData = await hpRes.json();

        hpData.vip_voucher = {
            code: code,
            discount_percent: discount > 0 ? discount : 10,
            title: title,
            desc: desc
        };

        const updateRes = await fetch(API_BASE_URL + '/api/admin/config/homepage', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
            },
            body: JSON.stringify(hpData)
        });

        if (!updateRes.ok) {
            const errText = await updateRes.text();
            throw new Error(errText || "Failed to update homepage config");
        }

        // Also ensure the coupon exists in coupons database so it works at checkout!
        try {
            await fetch(API_BASE_URL + '/api/admin/coupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({
                    id: 'cp_' + code.toLowerCase(),
                    code: code,
                    type: 'percentage',
                    value: discount > 0 ? discount : 10,
                    minOrder: 0,
                    usageLimit: 100000,
                    isActive: true
                })
            });
        } catch (couponErr) {
            console.log("Coupon already exists or created:", couponErr);
        }

        showAdminAlert(`Homepage Welcome Coupon (${code}) updated and published successfully!`, "Coupon UI Saved", "success");
        await loadCoupons();
    } catch (err) {
        console.error("Failed to save homepage coupon UI:", err);
        showAdminAlert(err.message, "Error Saving Coupon UI", "error");
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
        const res = await fetch(API_BASE_URL + '/api/gift-tiers');
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
            <td data-label="Tier Name" style="font-weight: 500;">${tier.name}</td>
            <td data-label="Min Spent">₹${parseFloat(tier.threshold).toLocaleString('en-IN')}</td>
            <td data-label="Reward Type" style="text-transform: capitalize;">${tier.rewardType}</td>
            <td data-label="Reward Details">${detailsStr}</td>
            <td data-label="Actions" style="text-align: right; white-space: nowrap; width: 160px;">
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
    const formElem = document.getElementById('tierForm');
    if (formElem) {
        formElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

async function deleteTier(idx) {
    const confirmed = await showAdminConfirm("Are you sure you want to delete this reward tier?", "Delete Reward Tier", "Delete", "Cancel", true);
    if (confirmed) {
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

        let existingId = 0;
        if (editIdxStr !== "") {
            const idx = parseInt(editIdxStr);
            if (currentTiers[idx] && currentTiers[idx].id) {
                existingId = currentTiers[idx].id;
            }
        }

        let tier = {
            id: existingId,
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

        const res = await fetch(API_BASE_URL + '/api/admin/gift-tiers', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(currentTiers)
        });

        console.log("[SETTINGS DIAG] Request completed. Response status code:", res.status);
        const contentType = res.headers.get('content-type') || '';

        if (contentType.includes('text/html')) {
            throw new Error("Backend server returned HTML fallback. The backend server must be restarted to apply the new endpoint.");
        }

        if (res.ok) {
            console.log("[SETTINGS DIAG] Save successful. Reloading settings list.");
            await loadSettings();
            showAdminAlert("Reward tier saved and updated successfully!", 'Success', 'success');
        } else {
            const text = await res.text();
            console.error("[SETTINGS DIAG] Save failed with response text:", text);
            let errMsg = text;
            try {
                const json = JSON.parse(text);
                errMsg = json.error || text;
            } catch (e) { }
            showAdminAlert("Error saving settings: " + errMsg, 'Settings Error', 'error');
        }
    } catch (err) {
        console.error("[SETTINGS DIAG] Fetch request connection failed:", err);
        showAdminAlert("Failed to save reward tiers: " + err.message, 'Network Error', 'error');
    }
}

let allAdminProfiles = [];
let profilesOffset = 0;
const PROFILES_LIMIT = 25;
let hasMoreProfiles = true;
let isLoadingProfiles = false;
let profilesObserver = null;
let profileSearchDebounceTimer = null;

function handleCustomerSearchInput(val) {
    clearTimeout(profileSearchDebounceTimer);
    profileSearchDebounceTimer = setTimeout(() => {
        loadProfiles(true);
    }, 300);
}

function renderSingleProfileRow(p, body) {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.setAttribute('data-label', 'Customer');
    tdName.style.fontWeight = '500';
    tdName.textContent = p.fullName || 'No Name';
    tr.appendChild(tdName);

    const tdEmail = document.createElement('td');
    tdEmail.setAttribute('data-label', 'Email');
    tdEmail.textContent = p.email || 'No Email';
    tr.appendChild(tdEmail);

    const tdPhone = document.createElement('td');
    tdPhone.setAttribute('data-label', 'Phone');
    tdPhone.textContent = p.phone || 'No Phone';
    tr.appendChild(tdPhone);

    const tdZip = document.createElement('td');
    tdZip.setAttribute('data-label', 'ZIP Code');
    tdZip.textContent = p.zipCode || 'No ZIP';
    tr.appendChild(tdZip);

    const tdSize = document.createElement('td');
    tdSize.setAttribute('data-label', 'Preferred Size');
    tdSize.textContent = p.preferredSize || 'N/A';
    tr.appendChild(tdSize);

    const tdActions = document.createElement('td');
    tdActions.setAttribute('data-label', 'Actions');
    const btnView = document.createElement('button');
    btnView.className = 'btn-primary';
    btnView.style.cssText = 'padding: 4px 10px; font-size: 0.8rem; border-radius: 4px; margin-right: 5px;';
    btnView.textContent = 'View Details';
    btnView.addEventListener('click', () => viewProfileDetails(p.userId));
    tdActions.appendChild(btnView);

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-primary';
    btnDelete.style.cssText = 'padding: 4px 10px; font-size: 0.8rem; border-radius: 4px; background: #e53e3e; border: none; color: white;';
    btnDelete.textContent = 'Delete';
    btnDelete.addEventListener('click', () => deleteProfile(p.userId, p.email));
    tdActions.appendChild(btnDelete);

    tr.appendChild(tdActions);
    body.appendChild(tr);
}

async function loadProfiles(reset = true) {
    if (isLoadingProfiles) return;
    isLoadingProfiles = true;

    const body = document.querySelector('#profilesTable tbody');
    const loadMoreBtn = document.getElementById('btnLoadMoreProfiles');
    const spinner = document.getElementById('profilesLoadingSpinner');
    const endMsg = document.getElementById('profilesEndMessage');
    const countBadge = document.getElementById('profilesCountBadge');

    if (reset) {
        profilesOffset = 0;
        hasMoreProfiles = true;
        allAdminProfiles = [];
        body.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.8rem; color:#8C5835;"><span style="display:inline-block; width:16px; height:16px; border:2px solid #D4A373; border-top-color:transparent; border-radius:50%; animation:spin 0.8s linear infinite; vertical-align:middle; margin-right:8px;"></span>Loading customer profiles...</td></tr>';
        if (loadMoreBtn) loadMoreBtn.style.display = 'none';
        if (endMsg) endMsg.style.display = 'none';
    }

    if (spinner) spinner.style.display = 'inline-block';
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';

    try {
        const searchEl = document.getElementById('customerSearchInput');
        const searchVal = searchEl ? searchEl.value.trim() : '';

        const params = new URLSearchParams({
            limit: PROFILES_LIMIT.toString(),
            offset: profilesOffset.toString(),
            search: searchVal
        });

        const batch = await fetchJsonSafe(`/api/admin/profiles?${params.toString()}`, { headers: getAuthHeader() });
        const profiles = Array.isArray(batch) ? batch : [];

        if (reset) {
            body.innerHTML = '';
            if (profiles.length === 0) {
                body.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#999; padding:2rem;">No customer profiles match your search.</td></tr>';
                hasMoreProfiles = false;
            }
        }

        profiles.forEach(p => {
            allAdminProfiles.push(p);
            renderSingleProfileRow(p, body);
        });

        profilesOffset += profiles.length;
        if (profiles.length < PROFILES_LIMIT) {
            hasMoreProfiles = false;
        }

        if (countBadge) {
            countBadge.textContent = allAdminProfiles.length > 0 ? `Showing ${allAdminProfiles.length} customer${allAdminProfiles.length === 1 ? '' : 's'}` : '';
        }
        if (endMsg) {
            endMsg.style.display = (!hasMoreProfiles && allAdminProfiles.length > 0) ? 'block' : 'none';
            if (!hasMoreProfiles && allAdminProfiles.length > 0) {
                endMsg.textContent = `All ${allAdminProfiles.length} customer profiles loaded`;
            }
        }
        if (loadMoreBtn) {
            loadMoreBtn.style.display = hasMoreProfiles ? 'inline-block' : 'none';
        }

        setupProfilesIntersectionObserver();
    } catch (err) {
        console.warn("Profiles load notice:", err);
        if (reset) {
            body.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#777; padding: 1.5rem;">No user profiles found or backend API server needs to be restarted.<br><small style="color:#999">Run: go run main.go</small></td></tr>`;
        }
    } finally {
        isLoadingProfiles = false;
        if (spinner) spinner.style.display = 'none';
    }
}

async function loadMoreProfiles() {
    if (hasMoreProfiles && !isLoadingProfiles) {
        await loadProfiles(false);
    }
}

function setupProfilesIntersectionObserver() {
    if (profilesObserver) {
        profilesObserver.disconnect();
    }
    const sentinel = document.getElementById('profilesScrollSentinel');
    if (!sentinel || !hasMoreProfiles) return;

    if ('IntersectionObserver' in window) {
        profilesObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMoreProfiles && !isLoadingProfiles) {
                loadMoreProfiles();
            }
        }, { rootMargin: '200px' });
        profilesObserver.observe(sentinel);
    }
}

window.loadProfiles = loadProfiles;
window.loadMoreProfiles = loadMoreProfiles;
window.handleCustomerSearchInput = handleCustomerSearchInput;

async function deleteProfile(userId, email) {
    const confirmed = await showAdminConfirm(`Are you sure you want to permanently delete the profile for ${email || userId}? This cannot be undone.`, 'Delete Profile', 'Delete Permanently', 'Cancel', true);
    if (!confirmed) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/profiles/delete?userId=${encodeURIComponent(userId)}`, {
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
        const res = await fetch(`${API_BASE_URL}/api/admin/profiles/details?userId=${encodeURIComponent(userId)}`, { headers: getAuthHeader() });
        if (!res.ok) throw new Error("HTTP Status " + res.status);
        const data = await res.json();

        const p = data.profile;
        const addrs = data.addresses || [];
        const orders = data.orders || [];
        const coupons = data.coupons || [];
        const asText = value => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

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
                                <td style="padding: 0.5rem 0; font-weight: 500;">${asText(o.id)}</td>
                                <td style="padding: 0.5rem 0;">₹${o.totalAmount.toLocaleString('en-IN')}</td>
                                <td style="padding: 0.5rem 0; font-family: monospace;">${asText(o.couponCode || '-')}</td>
                                <td style="padding: 0.5rem 0; color: #b97a66;">${asText(o.unlockedGift || '-')}</td>
                                <td style="padding: 0.5rem 0;"><span style="font-weight:500;">${asText(o.status)}</span></td>
                                <td style="padding: 0.5rem 0; font-size:0.8rem; font-family: monospace;">${asText(o.trackingNumber || '-')}</td>
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
                            <strong style="color: #b97a66; font-family: monospace; font-size: 1rem;">${asText(c.code)}</strong>
                            <div style="font-size:0.85rem; color:#666; margin-top:0.25rem;">
                                ${asText(c.type === 'percentage' ? c.value + '%' : '₹' + c.value)} off &bull; Uses: ${asText(c.usedCount)}/${asText(c.usageLimit)}
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
                            <h4 style="margin:0 0 0.4rem; font-size:0.9rem;">${asText(a.fullName)}</h4>
                            <p style="font-size:0.8rem; color:#666; margin:0 0 0.2rem; line-height:1.3;">${asText(a.addressLine)}</p>
                            <p style="font-size:0.8rem; color:#666; margin:0 0 0.2rem; line-height:1.3;">${asText(a.city)}, ${asText(a.state)} - ${asText(a.zipCode)}</p>
                            <p style="font-size:0.8rem; color:#666; margin:0;">Phone: ${asText(a.phone)}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        content.innerHTML = `
            <form id="adminProfileEditForm">
                <h3 style="margin-bottom:1rem; font-size: 1.1rem; border-bottom: 2px solid #ddd; padding-bottom: 0.4rem;">Customer Profile</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">Full Name *</label>
                        <input type="text" id="ap_name" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">Phone Number *</label>
                        <input type="text" id="ap_phone" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div style="grid-column: span 2;">
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">Primary Address *</label>
                        <input type="text" id="ap_address" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">City *</label>
                        <input type="text" id="ap_city" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">State *</label>
                        <input type="text" id="ap_state" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:0.85rem; color:#666; margin-bottom: 4px;">ZIP / Postal Code *</label>
                        <input type="text" id="ap_zip" required style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;">
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
                        <textarea id="ap_notes" rows="2" style="width:100%; padding:0.6rem; border:1px solid #ccc; border-radius:4px; box-sizing:border-box;"></textarea>
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
        const form = content.querySelector('#adminProfileEditForm');
        form.addEventListener('submit', event => saveProfileFromAdmin(event, userId));
        const fields = { name: p.fullName, phone: p.phone, address: p.address, city: p.city, state: p.state, zip: p.zipCode, notes: p.styleNotes };
        for (const [name, value] of Object.entries(fields)) {
            form.querySelector(`#ap_${name}`).value = value ?? '';
        }
    } catch (err) {
        content.textContent = `Failed to load details: ${err.message}`;
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
        const res = await fetch(API_BASE_URL + '/api/admin/profiles/edit', {
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
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(API_BASE_URL + '/api/admin/config/spin-wheel', {
            headers: { Authorization: 'Bearer ' + token },
            cache: 'no-store'
        });
        if (!res.ok) throw new Error("Failed to load Spin & Win config");
        const data = await res.json();

        document.getElementById('sw_enabled').checked = data.enabled || false;

        document.getElementById('sw_new_user_threshold').value = data.new_user_kurthi_threshold ?? 10;
        document.getElementById('sw_order_threshold').value = data.order_kurthi_threshold ?? 50;

        const ft = data.first_time_probs || {};
        document.getElementById('sw_ft_5').value = ft.prob_5_off ?? 50;
        document.getElementById('sw_ft_10').value = ft.prob_10_off ?? 30;
        document.getElementById('sw_ft_fail').value = ft.prob_better_luck ?? 20;

        const ret = data.returning_probs || {};
        document.getElementById('sw_ret_5').value = ret.prob_5_off ?? 30;
        document.getElementById('sw_ret_10').value = ret.prob_10_off ?? 10;
        document.getElementById('sw_ret_fail').value = ret.prob_better_luck ?? 60;

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
        const res = await fetch(API_BASE_URL + '/api/admin/config/spin-wheel', {
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
    const confirmed = await showAdminConfirm('Are you sure you want to delete this product? This action cannot be undone.', 'Delete Product', 'Delete Product', 'Cancel', true);
    if (!confirmed) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
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

// --- LOOK UP ORDERS & CONFIRM STORE PICKUPS ---
function openOrderInScanner(orderId) {
    document.querySelector('nav li[data-tab="pickup-scanner"]').click();
    const input = document.getElementById('scannerOrderIdInput');
    input.value = orderId;
    input.focus();
    return searchPickupOrder(orderId);
}

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
                { fps: 15, disableFlip: false },
                (decodedText, decodedResult) => {
                    // Success!
                    console.log(`Scan result: ${decodedText}`);
                    let finalOrderId = decodedText;
                    if (decodedText.includes('orderId=')) {
                        finalOrderId = decodedText.split('orderId=')[1].split('&')[0];
                    }
                    document.getElementById('scannerOrderIdInput').value = finalOrderId;

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
    scannerOrderRequest?.abort();
    const request = new AbortController();
    scannerOrderRequest = request;
    const cardEl = document.getElementById('pickupOrderCard');
    if (cardEl) cardEl.style.display = 'none';
    showScannerMessage('Loading order details…', '#6b4c35', '#faf7f2');

    try {
        const res = await fetch(`${API_BASE_URL}/api/admin/orders?orderId=${encodeURIComponent(orderId)}`, {
            headers: getAuthHeader(),
            signal: request.signal
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            if (request.signal.aborted) return;
            showScannerMessage(errData.error || `Failed to fetch order. Status: ${res.status}`, "red", "#fff5f5");
            return;
        }

        const data = await res.json();
        if (request.signal.aborted) return;
        if (!data || (Array.isArray(data) && data.length === 0) || (!Array.isArray(data) && !data.id)) {
            showScannerMessage(`Order Reference "${orderId}" not found in database.`, "red", "#fff5f5");
            return;
        }

        const order = Array.isArray(data) ? data[0] : data;
        document.getElementById('scannerMessage').style.display = 'none';
        displayPickupOrderDetails(order);

    } catch (err) {
        if (!request.signal.aborted) {
            showScannerMessage(`Connection error: ${err.message}`, "red", "#fff5f5");
        }
    } finally {
        if (scannerOrderRequest === request) scannerOrderRequest = null;
    }
}

function displayPickupOrderDetails(order) {
    const cardEl = document.getElementById('pickupOrderCard');
    if (!cardEl) return;

    // Fill fields
    document.getElementById('poCardOrderId').textContent = `Order #${order.id}`;
    const copyButton = document.getElementById('poCardCopyId');
    copyButton.onclick = () => copyTextToClipboard(order.id, copyButton);
    document.getElementById('poCardCustomer').innerText = order.customerEmail;

    const isHomeDelivery = isHomeDeliveryOrder(order);
    let coTypeLabel = order.checkoutType;
    if (order.fulfilmentType === 'PREORDER_STORE_PICKUP') {
        coTypeLabel = '🏪 Preorder Store Pickup';
    } else if (order.fulfilmentType === 'PREORDER_HOME_DELIVERY') {
        coTypeLabel = '🚚 Preorder Home Delivery';
    } else if (isHomeDelivery) {
        coTypeLabel = '🚚 Home Delivery';
    } else if (order.checkoutType === 'pickup') {
        coTypeLabel = '🏪 Store Pickup';
    } else if (order.checkoutType === 'hyderabad_instant') {
        coTypeLabel = '⚡ Hyderabad Instant';
    }
    document.getElementById('poCardCheckoutType').innerText = coTypeLabel;
    document.getElementById('poCardPaymentMethod').innerText = order.paymentMethod === 'offline_qr' ? '💳 Offline UPI QR Pass' : '🌐 Paid Online (RazorPay)';
    document.getElementById('poCardDate').innerText = new Date(order.createdAt).toLocaleString();
    document.getElementById('poCardAmount').innerText = `₹${order.totalAmount.toLocaleString('en-IN')}`;

    const showShippingAddress = isHomeDelivery || (order.checkoutType === 'hyderabad_instant' && order.fulfilmentType !== 'PREORDER_STORE_PICKUP');
    document.getElementById('poCardShipping').hidden = !showShippingAddress;
    const shippingAddress = document.getElementById('poCardShippingAddress');
    const shippingContact = document.getElementById('poCardShippingContact');
    shippingAddress.textContent = '';
    shippingContact.textContent = '';
    if (showShippingAddress) {
        const locality = [order.shippingCity, order.shippingState, order.shippingZipCode].filter(Boolean).join(', ');
        shippingAddress.textContent = [order.shippingAddress, locality].filter(Boolean).join('\n') || 'Address unavailable';
        shippingContact.textContent = [order.shippingName, order.shippingPhone].filter(Boolean).join(' · ');
    }

    // Status Badge
    const badge = document.getElementById('poCardStatusBadge');
    badge.innerText = order.status;

    let badgeBg = '#ffe0b2';
    let badgeColor = '#e65100';
    if (order.status === 'picked_up' || order.status === 'COLLECTED') {
        badgeBg = '#e8f5e9';
        badgeColor = '#2e7d32';
    } else if (order.status === 'ready_for_pickup' || order.status === 'READY_FOR_PICKUP') {
        badgeBg = '#dcfce7';
        badgeColor = '#15803d';
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
            li.innerHTML = `<strong>${window.escapeHTML(it.productName || it.productId)}</strong> ${it.size ? `<span style="font-size:0.8rem; background:#fff0e9; color:#b97a66; padding:1px 5px; border-radius:3px; margin-left:4px">Size: ${window.escapeHTML(it.size)}</span>` : ''} &times; <strong>${window.escapeHTML(qty)}</strong> — <strong>₹${lineTotal.toLocaleString('en-IN')}</strong> ${qty > 1 ? `<small style="color:#888">(₹${unitPrice.toLocaleString('en-IN')} each)</small>` : ''}`;
            itemsList.appendChild(li);
        });
    } else {
        itemsList.innerHTML = '<li style="color:#999; font-style:italic">No items logged for this order.</li>';
    }

    // Actions Container
    const actions = document.getElementById('poCardActionsContainer');
    actions.innerHTML = '';

    if (order.status === 'picked_up' || order.status === 'COLLECTED') {
        const infoMsg = document.createElement('div');
        infoMsg.style.cssText = 'padding: 0.8rem; background: #e8f5e9; border: 1px solid #c8e6c9; color: #2e7d32; border-radius: 8px; font-weight: 500; font-size: 0.9rem; flex: 1; text-align: center;';
        infoMsg.innerText = '✓ Order is already Picked Up & Fulfilled.';
        actions.appendChild(infoMsg);
    } else if (isHomeDelivery || (order.checkoutType !== 'pickup' && order.fulfilmentType !== 'PREORDER_STORE_PICKUP')) {
        const warnMsg = document.createElement('div');
        warnMsg.style.cssText = 'padding: 0.8rem; background: #fff3cd; border: 1px solid #ffeeba; color: #856404; border-radius: 8px; font-size: 0.9rem; flex: 1;';
        warnMsg.textContent = `⚠️ ${coTypeLabel} order. Verify dispatch details in Orders & Fulfillment.`;
        actions.appendChild(warnMsg);
    } else {
        // Render verification details & Action button!
        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.style.cssText = 'padding: 0.85rem 2rem; border-radius: 8px; font-weight: 600; flex: 1;';

        if (order.fulfilmentType === 'PREORDER_STORE_PICKUP') {
            btn.innerText = 'Confirm Preorder Collection & Release Items';
            btn.style.backgroundColor = '#7c3aed';
            btn.onclick = () => confirmPreorderPickup(order.id);
        } else if (order.paymentMethod === 'offline_qr' && order.status === 'pending_payment') {
            btn.innerText = 'Verify Offline UPI Payment & Complete Pickup';
            btn.style.backgroundColor = '#d0883b';
            btn.onclick = () => confirmStorePickup(order.id);
        } else {
            btn.innerText = 'Confirm Store Pickup & Release Items';
            btn.onclick = () => confirmStorePickup(order.id);
        }

        actions.appendChild(btn);
    }

    cardEl.style.display = 'block';
}

async function confirmStorePickup(orderId) {
    const confirmed = await showAdminConfirm(`Are you sure you want to confirm pickup for Order #${orderId}?`, 'Confirm Store Pickup', 'Confirm Pickup', 'Cancel');
    if (!confirmed) return;

    try {
        const res = await fetch(API_BASE_URL + '/api/admin/orders/confirm-pickup', {
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
                if (hash === '#orders') {
                    if (currentUserRole) document.querySelector('nav li[data-tab="orders"]')?.click();
                    return;
                }
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

                        const pickupTitle = pickupTab.getAttribute('data-title') || pickupTab.querySelector('.nav-label')?.innerText || pickupTab.innerText;
                        document.getElementById('pageTitle').innerText = (pickupTitle || '').trim();
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
                    const res = await fetch(API_BASE_URL + '/api/config/auth');
                    if (res.ok) {
                        const data = await res.json();
                        document.getElementById('auth_phone_enabled').checked = data.phone_auth_enabled;
                    }

                    loadCheckoutConfig();
                } catch (err) {
                    console.error("Failed to load auth config:", err);
                }
            }

            async function saveAuthConfig() {
                try {
                    const payload = {
                        phone_auth_enabled: document.getElementById('auth_phone_enabled').checked
                    };
                    const res = await fetch(API_BASE_URL + '/api/admin/config/auth', {
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

            async function loadCheckoutConfig() {
                try {
                    const res = await fetch(API_BASE_URL + '/api/config/checkout');
                    if (res.ok) {
                        const data = await res.json();
                        document.getElementById('chk_standard_delivery').checked = data.standard_delivery_enabled;
                        document.getElementById('chk_hyderabad_instant').checked = data.hyderabad_instant_enabled;
                        document.getElementById('chk_store_pickup_prepay').checked = data.store_pickup_prepay_enabled;
                        document.getElementById('chk_store_pickup_instore').checked = data.store_pickup_pay_in_store_enabled;
                    }
                } catch (err) {
                    console.error("Failed to load checkout config:", err);
                }
            }

            async function saveCheckoutConfig() {
                try {
                    const payload = {
                        standard_delivery_enabled: document.getElementById('chk_standard_delivery').checked,
                        hyderabad_instant_enabled: document.getElementById('chk_hyderabad_instant').checked,
                        store_pickup_prepay_enabled: document.getElementById('chk_store_pickup_prepay').checked,
                        store_pickup_pay_in_store_enabled: document.getElementById('chk_store_pickup_instore').checked
                    };
                    const res = await fetch(API_BASE_URL + '/api/admin/config/checkout', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!res.ok) throw new Error("Failed to update checkout config");
                    showAdminAlert('Checkout settings updated!', 'Success', 'success');
                } catch (err) {
                    console.error("Failed to save checkout config:", err);
                    showAdminAlert(err.message, 'Error', 'error');
                }
            }

            window.loadCheckoutConfig = loadCheckoutConfig;
            window.saveCheckoutConfig = saveCheckoutConfig;

            // --- Support Tab Logic ---

            async function loadSupport() {
                const tbody = document.querySelector('#supportTable tbody');
                if (!tbody) return;
                tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    const res = await fetch(API_BASE_URL + '/api/admin/contact', {
                        headers: { 'Authorization': 'Bearer ' + idToken }
                    });
                    if (!res.ok) throw new Error("Failed to load support requests");

                    const data = await res.json();
                    const messages = data.messages || [];
                    updateSupportBadge(data.unreadCount || 0);

                    if (messages.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7">No support requests found.</td></tr>';
                        return;
                    }

                    const rows = document.createDocumentFragment();
                    for (const msg of messages) {
                        const row = rows.appendChild(document.createElement('tr'));
                        const unread = msg.status === 'unread';
                        if (unread) row.style.background = '#fff6f6';
                        const cDate = row.insertCell();
                        cDate.setAttribute('data-label', 'Date');
                        cDate.textContent = new Date(msg.createdAt).toLocaleString();

                        const cCust = row.insertCell();
                        cCust.setAttribute('data-label', 'Customer');
                        cCust.appendChild(document.createElement('strong')).textContent = msg.name;

                        const contact = row.insertCell();
                        contact.setAttribute('data-label', 'Contact Info');
                        const email = String(msg.email ?? '').trim();
                        if (/^[^\s@?&#%]+@[^\s@?&#%]+\.[^\s@?&#%]+$/.test(email)) {
                            const link = contact.appendChild(document.createElement('a'));
                            link.href = 'mailto:' + email;
                            link.textContent = email;
                        } else {
                            contact.append(document.createTextNode(email || 'N/A'));
                        }
                        contact.appendChild(document.createElement('br'));
                        const phone = String(msg.phone ?? '').trim();
                        const number = phone.replace(/[\s().-]/g, '');
                        if (/^\+?\d{7,15}$/.test(number)) {
                            const link = contact.appendChild(document.createElement('a'));
                            link.href = 'tel:' + number;
                            link.textContent = phone;
                        } else {
                            contact.append(document.createTextNode(phone || 'N/A'));
                        }

                        const cOrder = row.insertCell();
                        cOrder.setAttribute('data-label', 'Order ID');
                        cOrder.textContent = msg.orderId || 'N/A';

                        const cMsg = row.insertCell();
                        cMsg.setAttribute('data-label', 'Message');
                        const message = cMsg.appendChild(document.createElement('div'));
                        message.style.cssText = 'max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
                        message.textContent = message.title = msg.message;

                        const cStatus = row.insertCell();
                        cStatus.setAttribute('data-label', 'Status');
                        const badge = cStatus.appendChild(document.createElement('span'));
                        badge.className = unread ? 'badge danger' : 'badge success';
                        badge.textContent = msg.status;

                        const cAction = row.insertCell();
                        cAction.setAttribute('data-label', 'Actions');
                        const button = cAction.appendChild(document.createElement('button'));
                        button.className = unread ? 'btn-primary' : 'btn-secondary';
                        button.textContent = unread ? 'Mark Read' : 'Read';
                        button.disabled = !unread;
                        if (unread) button.addEventListener('click', () => markSupportRead(msg.id));
                    }
                    tbody.replaceChildren(rows);
                } catch (err) {
                    tbody.replaceChildren();
                    const cell = tbody.insertRow().insertCell();
                    cell.colSpan = 7;
                    cell.style.color = 'red';
                    cell.textContent = 'Error: ' + err.message;
                }
            }

            async function markSupportRead(id) {
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    const res = await fetch(`${API_BASE_URL}/api/admin/contact/${id}/read`, {
                        method: 'PUT',
                        headers: { 'Authorization': 'Bearer ' + idToken }
                    });
                    if (!res.ok) throw new Error("Failed to mark as read");
                    loadSupport();
                } catch (err) {
                    showAdminAlert(err.message, 'Error', 'error');
                }
            }

            function updateSupportBadge(count) {
                const badge = document.getElementById('support-badge');
                if (badge) {
                    if (count > 0) {
                        badge.style.display = 'inline-block';
                        badge.innerText = count;
                    } else {
                        badge.style.display = 'none';
                    }
                }
            }

            async function pollUnreadSupportCount() {
                if (!auth || !auth.currentUser) return;
                try {
                    const idToken = await auth.currentUser.getIdToken();
                    const res = await fetch(API_BASE_URL + '/api/admin/contact', {
                        headers: { 'Authorization': 'Bearer ' + idToken }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        updateSupportBadge(data.unreadCount || 0);
                    }
                } catch (err) { }
            }

            // Poll every 60 seconds
            setInterval(pollUnreadSupportCount, 60000);
            window.markSupportRead = markSupportRead;

            // ==========================================
            // INSTAGRAM REELS & SHOPPABLE SHOWCASE LOGIC
            // ==========================================

            let currentHomepageConfig = null;
            let currentReelsList = [];
            let allStoreProducts = [];

            async function loadInstagramReels() {
                const container = document.getElementById('reelsCardsContainer');
                if (container) {
                    container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #888;">Loading Instagram Reels & Store Catalog...</div>';
                }

                try {
                    // Fetch homepage config and store products in parallel
                    const [hpRes, prodRes] = await Promise.all([
                        fetch(API_BASE_URL + '/api/config/homepage', { cache: 'no-store' }),
                        fetch(API_BASE_URL + '/api/products', { cache: 'no-store' })
                    ]);

                    if (hpRes.ok) {
                        currentHomepageConfig = await hpRes.json();
                        const insta = currentHomepageConfig.instagram || {};

                        const handleEl = document.getElementById('insta_handle');
                        if (handleEl) handleEl.value = (insta.handle || 'theethnictouch.co').replace('@', '');

                        const profileEl = document.getElementById('insta_profile_url');
                        if (profileEl) profileEl.value = insta.profile_url || 'https://www.instagram.com/theethnictouch.co';

                        currentReelsList = Array.isArray(insta.reels) ? insta.reels : [];
                    }

                    if (prodRes.ok) {
                        const prods = await prodRes.json();
                        allStoreProducts = Array.isArray(prods) ? prods : [];
                    }

                    renderReelsList();
                } catch (err) {
                    console.error("Failed to load Instagram reels:", err);
                    if (container) {
                        container.innerHTML = `<div style="grid-column: 1 / -1; color: #e53e3e; padding: 2rem;">Error loading Instagram reels: ${err.message}</div>`;
                    }
                }
            }

            function renderReelsList() {
                const container = document.getElementById('reelsCardsContainer');
                const badge = document.getElementById('reelsCountBadge');
                if (badge) badge.innerText = currentReelsList.length;

                if (!container) return;
                container.innerHTML = '';

                if (currentReelsList.length === 0) {
                    container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: #FAF8F5; border: 2px dashed #DCD5CB; border-radius: 12px;">
                <p style="color: #6C6863; font-size: 1rem; margin-bottom: 1rem;">No shoppable reels configured yet.</p>
                <button type="button" class="btn-primary" onclick="openAddReelModal()">+ Add Your First Reel</button>
            </div>
        `;
                    return;
                }

                currentReelsList.forEach((reel, index) => {
                    const prod = allStoreProducts.find(p => String(p.id) === String(reel.product_id || (reel.product ? reel.product.id : '')));
                    const cardThumb = reel.thumbnail || (prod ? prod.imageUrl : './images/kurthi_peach.png');
                    const isHit = reel.is_hit_reel || reel.isHitReel;
                    const badgeLabel = isHit ? '⭐ Hit Reel' : (reel.views || 'Latest Drop');

                    const card = document.createElement('div');
                    card.style.cssText = `
            background: #FFFFFF;
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 12px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            transition: transform 0.2s, box-shadow 0.2s;
        `;

                    card.innerHTML = `
            <!-- Visual Reel Header & Thumbnail Preview -->
            <div style="position: relative; height: 260px; background: #2D2A26; overflow: hidden;">
                <img src="${cardThumb}" alt="${reel.title || 'Reel'}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;">
                
                <!-- Badge Overlay -->
                <div style="position: absolute; top: 12px; left: 12px; z-index: 2;">
                    <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 0.74rem; font-weight: 700; background: ${isHit ? 'linear-gradient(135deg, #D4A373 0%, #C49363 100%)' : 'rgba(0,0,0,0.6)'}; color: #FFF; backdrop-filter: blur(4px); box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
                        ${badgeLabel}
                    </span>
                </div>

                <!-- Instagram Watermark Icon -->
                <div style="position: absolute; top: 12px; right: 12px; z-index: 2; background: rgba(0,0,0,0.4); border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FAF8F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </div>

                <!-- Center Play Watermark -->
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; border: 1.5px solid rgba(255,255,255,0.3);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFF">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                </div>

                <!-- Bottom stats bar on thumbnail -->
                <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 12px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: #FFF; font-size: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                    <span>${reel.author || '@theethnictouch.co'}</span>
                    <span>❤️ ${reel.likes || 'Trending'}</span>
                </div>
            </div>

            <!-- Card Content Body -->
            <div style="padding: 1.25rem; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                <div>
                    <h4 style="font-size: 1rem; font-weight: 600; color: #2D2A26; margin: 0 0 0.4rem; line-height: 1.3;">
                        ${reel.title || 'Untitled Reel'}
                    </h4>
                    <p style="font-size: 0.8rem; color: #6C6863; margin: 0 0 1rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${reel.caption || 'No caption entered.'}
                    </p>

                    <!-- Linked Product Details Box -->
                    <div style="background: #FAF8F5; border: 1px solid #EAE3D9; border-radius: 8px; padding: 0.75rem; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 10px;">
                        ${prod ? `
                            <img src="${prod.imageUrl}" alt="${prod.name}" style="width: 44px; height: 56px; object-fit: cover; border-radius: 4px; border: 1px solid #DDD;">
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-size: 0.68rem; text-transform: uppercase; color: #5B8E7D; font-weight: 700; letter-spacing: 0.5px;">✓ Linked Product</div>
                                <div style="font-size: 0.82rem; font-weight: 600; color: #2D2A26; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${prod.name}</div>
                                <div style="font-size: 0.78rem; font-weight: 700; color: #A06C3E;">₹${Number(prod.price).toLocaleString('en-IN')}</div>
                            </div>
                        ` : `
                            <div style="width: 44px; height: 56px; background: #EEE; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #999;">⚠️</div>
                            <div style="flex: 1;">
                                <div style="font-size: 0.75rem; color: #e53e3e; font-weight: 600;">No Product Linked</div>
                                <div style="font-size: 0.72rem; color: #888;">Select a product so users can shop this reel.</div>
                            </div>
                        `}
                    </div>

                    ${reel.instagram_url ? `
                        <div style="font-size: 0.75rem; margin-bottom: 1rem;">
                            <a href="${reel.instagram_url}" target="_blank" rel="noopener noreferrer" style="color: #A06C3E; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; word-break: break-all;">
                                <span>🔗 View Reel on Instagram</span> ↗
                            </a>
                        </div>
                    ` : ''}
                </div>

                <!-- Action Buttons & Reordering -->
                <div style="border-top: 1px solid #F0ECE6; padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                    <!-- Order Reorder Buttons -->
                    <div style="display: flex; gap: 4px;">
                        <button type="button" onclick="moveReel(${index}, -1)" ${index === 0 ? 'disabled style="opacity: 0.4; cursor: not-allowed; padding: 4px 8px; background: #FAF8F5; border: 1px solid #DDD; border-radius: 4px;"' : 'style="cursor: pointer; padding: 4px 8px; background: #FAF8F5; border: 1px solid #DDD; border-radius: 4px;"'} title="Move Left / Prioritize" class="btn-sm">
                            ←
                        </button>
                        <button type="button" onclick="moveReel(${index}, 1)" ${index === currentReelsList.length - 1 ? 'disabled style="opacity: 0.4; cursor: not-allowed; padding: 4px 8px; background: #FAF8F5; border: 1px solid #DDD; border-radius: 4px;"' : 'style="cursor: pointer; padding: 4px 8px; background: #FAF8F5; border: 1px solid #DDD; border-radius: 4px;"'} title="Move Right" class="btn-sm">
                            →
                        </button>
                    </div>

                    <!-- Edit and Delete Buttons -->
                    <div style="display: flex; gap: 6px;">
                        <button type="button" class="btn-sm" onclick="openEditReelModal('${reel.id}')" style="background: #2D2A26; color: #FFF; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.78rem; font-weight: 600;">
                            Edit Reel
                        </button>
                        <button type="button" class="btn-sm" onclick="deleteReel('${reel.id}')" style="background: #FFF; color: #E53E3E; border: 1px solid #FEB2B2; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.78rem;" title="Delete Reel">
                            🗑
                        </button>
                    </div>
                </div>
            </div>
        `;

                    container.appendChild(card);
                });
            }

            function populateReelProductSelect(selectedProductId = '') {
                const select = document.getElementById('reel_product_id');
                if (!select) return;

                select.innerHTML = '<option value="">-- Choose Product from Store Catalog --</option>';

                allStoreProducts.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.id;
                    opt.innerText = `${p.name} - ₹${Number(p.price).toLocaleString('en-IN')} (${p.category || 'Silhouettes'})`;
                    if (String(p.id) === String(selectedProductId)) {
                        opt.selected = true;
                    }
                    select.appendChild(opt);
                });

                handleReelProductSelect(selectedProductId);
            }

            function handleReelProductSelect(productId) {
                const previewBox = document.getElementById('reelSelectedProductPreview');
                const nameEl = document.getElementById('reelPreviewProdName');
                const priceEl = document.getElementById('reelPreviewProdPrice');
                const imgEl = document.getElementById('reelPreviewProdImg');

                const prod = allStoreProducts.find(p => String(p.id) === String(productId));
                if (prod && previewBox) {
                    previewBox.style.display = 'flex';
                    if (nameEl) nameEl.innerText = prod.name;
                    if (priceEl) priceEl.innerText = `₹${Number(prod.price).toLocaleString('en-IN')} (${prod.category || 'Straight Cut'})`;
                    if (imgEl) imgEl.src = prod.imageUrl;

                    // If thumbnail input is empty, auto-populate with product image
                    const thumbInput = document.getElementById('reel_thumbnail');
                    if (thumbInput && !thumbInput.value.trim()) {
                        thumbInput.value = prod.imageUrl;
                        updateReelThumbPreview(prod.imageUrl);
                    }
                } else if (previewBox) {
                    previewBox.style.display = 'none';
                }
            }

            function useProductImageAsThumbnail() {
                const prodId = document.getElementById('reel_product_id').value;
                const prod = allStoreProducts.find(p => String(p.id) === String(prodId));
                if (prod) {
                    document.getElementById('reel_thumbnail').value = prod.imageUrl;
                    updateReelThumbPreview(prod.imageUrl);
                    showAdminAlert('Using product photo as reel thumbnail', 'Thumbnail Updated', 'success');
                }
            }

            function updateReelThumbPreview(url) {
                const box = document.getElementById('reelThumbImgPreviewBox');
                const img = document.getElementById('reelThumbImgPreview');
                if (!box || !img) return;

                if (url && url.trim()) {
                    img.src = url.trim();
                    box.style.display = 'block';
                } else {
                    box.style.display = 'none';
                }
            }

            let reelFetchDebounceTimer = null;
            function handleReelUrlInput(url) {
                const codeInput = document.getElementById('reel_code');
                if (!url || !codeInput) return;

                // Pattern matches /reel/CODE/ or /reel/CODE
                const match = url.match(/\/reel\/([A-Za-z0-9_-]+)/);
                if (match && match[1]) {
                    codeInput.value = match[1];

                    // Automatically trigger Instagram thumbnail fetch if thumbnail input is empty or using a fallback image
                    const thumbInput = document.getElementById('reel_thumbnail');
                    if (thumbInput && (!thumbInput.value.trim() || thumbInput.value.includes('/images/kurthi'))) {
                        clearTimeout(reelFetchDebounceTimer);
                        reelFetchDebounceTimer = setTimeout(() => {
                            fetchReelThumbnailFromInsta();
                        }, 500);
                    }
                }
            }

            function openAddReelModal() {
                document.getElementById('reelModalTitle').innerText = 'Add New Shoppable Reel';
                document.getElementById('reelSubmitBtn').innerText = 'Save & Publish Reel';

                document.getElementById('reel_id').value = `reel-${Date.now()}`;
                document.getElementById('reel_title').value = '';
                document.getElementById('reel_instagram_url').value = '';
                document.getElementById('reel_code').value = '';
                document.getElementById('reel_thumbnail').value = '';
                document.getElementById('reel_caption').value = '';
                document.getElementById('reel_is_hit').checked = false;
                document.getElementById('reel_views').value = 'Latest Drop';
                document.getElementById('reel_likes').value = 'Trending Hit';

                updateReelThumbPreview('');
                populateReelProductSelect('');

                document.getElementById('reelModal').style.display = 'flex';
            }

            function openEditReelModal(reelIdOrIndex) {
                let reel = currentReelsList.find(r => String(r.id) === String(reelIdOrIndex));
                if (!reel && typeof reelIdOrIndex === 'number') {
                    reel = currentReelsList[reelIdOrIndex];
                }
                if (!reel && !isNaN(Number(reelIdOrIndex))) {
                    reel = currentReelsList[Number(reelIdOrIndex)];
                }
                if (!reel) {
                    showAdminAlert('Reel configuration not found', 'Error', 'error');
                    return;
                }

                const titleEl = document.getElementById('reelModalTitle');
                if (titleEl) titleEl.innerText = `Edit Reel: ${reel.title || 'Shoppable Video'}`;

                const submitBtn = document.getElementById('reelSubmitBtn');
                if (submitBtn) submitBtn.innerText = 'Update Reel';

                const idInput = document.getElementById('reel_id');
                if (idInput) idInput.value = reel.id || `reel-${Date.now()}`;

                const titleInput = document.getElementById('reel_title');
                if (titleInput) titleInput.value = reel.title || '';

                const urlInput = document.getElementById('reel_instagram_url');
                if (urlInput) urlInput.value = reel.instagram_url || reel.instagramUrl || '';

                const codeInput = document.getElementById('reel_code');
                if (codeInput) codeInput.value = reel.reel_code || reel.reelCode || '';

                const thumbInput = document.getElementById('reel_thumbnail');
                if (thumbInput) thumbInput.value = reel.thumbnail || '';

                const captionInput = document.getElementById('reel_caption');
                if (captionInput) captionInput.value = reel.caption || '';

                const isHitInput = document.getElementById('reel_is_hit');
                if (isHitInput) isHitInput.checked = !!(reel.is_hit_reel || reel.isHitReel);

                const viewsInput = document.getElementById('reel_views');
                if (viewsInput) viewsInput.value = reel.views || '';

                const likesInput = document.getElementById('reel_likes');
                if (likesInput) likesInput.value = reel.likes || '';

                updateReelThumbPreview(reel.thumbnail || '');
                populateReelProductSelect(reel.product_id || (reel.product ? reel.product.id : ''));

                const modal = document.getElementById('reelModal');
                if (modal) {
                    modal.style.display = 'flex';
                }
            }

            async function handleSaveReel(event) {
                event.preventDefault();

                const reelId = document.getElementById('reel_id').value;
                const title = document.getElementById('reel_title').value.trim();
                const instaUrl = document.getElementById('reel_instagram_url').value.trim();
                let reelCode = document.getElementById('reel_code').value.trim();
                const prodId = document.getElementById('reel_product_id').value;
                let thumbnail = document.getElementById('reel_thumbnail').value.trim();
                const caption = document.getElementById('reel_caption').value.trim();
                const isHit = document.getElementById('reel_is_hit').checked;
                const views = document.getElementById('reel_views').value.trim() || (isHit ? 'Hit Reel' : 'Latest Drop');
                const likes = document.getElementById('reel_likes').value.trim() || 'Trending Hit';

                if (!reelCode && instaUrl) {
                    const match = instaUrl.match(/\/reel\/([A-Za-z0-9_-]+)/);
                    if (match && match[1]) reelCode = match[1];
                }

                // If thumbnail is still empty, attempt automatic fetch from Instagram before saving
                if (!thumbnail && instaUrl && instaUrl.includes('/reel/')) {
                    try {
                        const res = await fetch(API_BASE_URL + '/api/reels/fetch-thumbnail', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: instaUrl })
                        });
                        if (res.ok) {
                            const data = await res.json();
                            if (data.thumbnail) {
                                thumbnail = data.thumbnail;
                                if (data.reelCode && !reelCode) reelCode = data.reelCode;
                            }
                        }
                    } catch (e) {
                        console.warn("Auto thumbnail fetch on save failed:", e);
                    }
                }

                if (!thumbnail && prodId) {
                    const prod = allStoreProducts.find(p => String(p.id) === String(prodId));
                    if (prod) thumbnail = prod.imageUrl;
                }

                const reelItem = {
                    id: reelId,
                    is_hit_reel: isHit,
                    instagram_url: instaUrl,
                    reel_code: reelCode,
                    title: title,
                    caption: caption,
                    author: `@${(document.getElementById('insta_handle').value || 'theethnictouch.co').replace('@', '')}`,
                    likes: likes,
                    views: views,
                    thumbnail: thumbnail,
                    product_id: prodId
                };

                const existingIdx = currentReelsList.findIndex(r => String(r.id) === String(reelId));
                if (existingIdx >= 0) {
                    currentReelsList[existingIdx] = reelItem;
                } else {
                    currentReelsList.push(reelItem);
                }

                const saved = await saveInstagramConfigToBackend();
                if (saved) {
                    closeModals();
                    renderReelsList();
                    showAdminAlert(`Reel "${title}" saved and published to homepage!`, 'Reel Saved', 'success');
                }
            }

            async function deleteReel(reelId) {
                const reel = currentReelsList.find(r => String(r.id) === String(reelId));
                const title = reel ? reel.title : 'this reel';

                const confirmed = await showAdminConfirm(`Are you sure you want to remove "${title}" from the homepage?`, 'Remove Reel', 'Remove', 'Cancel', true);
                if (!confirmed) {
                    return;
                }

                currentReelsList = currentReelsList.filter(r => String(r.id) !== String(reelId));
                const saved = await saveInstagramConfigToBackend();
                if (saved) {
                    renderReelsList();
                    showAdminAlert('Reel removed from homepage.', 'Reel Deleted', 'success');
                }
            }

            async function moveReel(index, direction) {
                const targetIdx = index + direction;
                if (targetIdx < 0 || targetIdx >= currentReelsList.length) return;

                // Swap elements
                const temp = currentReelsList[index];
                currentReelsList[index] = currentReelsList[targetIdx];
                currentReelsList[targetIdx] = temp;

                const saved = await saveInstagramConfigToBackend();
                if (saved) {
                    renderReelsList();
                }
            }

            async function saveInstagramGlobalSettings() {
                const handle = (document.getElementById('insta_handle').value || '').trim().replace('@', '');
                const profileUrl = (document.getElementById('insta_profile_url').value || '').trim();

                const saved = await saveInstagramConfigToBackend(handle, profileUrl);
                if (saved) {
                    showAdminAlert('Instagram handle and profile URL updated!', 'Settings Saved', 'success');
                }
            }

            async function saveInstagramConfigToBackend(customHandle, customProfileUrl) {
                try {
                    const handle = customHandle || (document.getElementById('insta_handle') ? document.getElementById('insta_handle').value.trim().replace('@', '') : 'theethnictouch.co');
                    const profileUrl = customProfileUrl || (document.getElementById('insta_profile_url') ? document.getElementById('insta_profile_url').value.trim() : 'https://www.instagram.com/theethnictouch.co');

                    const instaPayload = {
                        handle: handle || 'theethnictouch.co',
                        profile_url: profileUrl || 'https://www.instagram.com/theethnictouch.co',
                        reels: currentReelsList
                    };

                    const res = await fetch(API_BASE_URL + '/api/admin/config/instagram', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                        },
                        body: JSON.stringify(instaPayload)
                    });

                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.error || `HTTP ${res.status}`);
                    }

                    return true;
                } catch (err) {
                    console.error("Failed to save Instagram config to backend:", err);
                    showAdminAlert('Failed to save to server: ' + err.message, 'Save Error', 'error');
                    return false;
                }
            }

            async function fetchReelThumbnailFromInsta() {
                const urlInput = document.getElementById('reel_instagram_url');
                const url = (urlInput ? urlInput.value : '').trim();
                if (!url) {
                    showAdminAlert('Please enter an Instagram Reel URL first.', 'URL Required', 'error');
                    if (urlInput) urlInput.focus();
                    return;
                }

                const btn = document.getElementById('btnFetchInstaThumb');
                const originalText = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '⏳ Fetching...';
                }

                try {
                    const res = await fetch(API_BASE_URL + '/api/reels/fetch-thumbnail', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ url: url })
                    });

                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.error || `HTTP ${res.status}`);
                    }

                    const data = await res.json();
                    if (data.thumbnail) {
                        const thumbInput = document.getElementById('reel_thumbnail');
                        if (thumbInput) {
                            thumbInput.value = data.thumbnail;
                            updateReelThumbPreview(data.thumbnail);
                        }
                        if (data.reelCode && !document.getElementById('reel_code').value) {
                            document.getElementById('reel_code').value = data.reelCode;
                        }
                        showAdminAlert('Authentic Instagram Reel thumbnail successfully fetched and applied!', 'Thumbnail Loaded', 'success');
                    }
                } catch (err) {
                    console.error("Failed to fetch reel thumbnail:", err);
                    showAdminAlert('Could not fetch thumbnail directly from Instagram: ' + err.message, 'Fetch Failed', 'error');
                } finally {
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                    }
                }
            }

            async function syncAllInstaThumbnails() {
                const btn = document.getElementById('btnSyncAllThumbs');
                const originalText = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '⏳ Syncing All Thumbnails...';
                }

                try {
                    let updatedCount = 0;
                    for (let i = 0; i < currentReelsList.length; i++) {
                        const r = currentReelsList[i];
                        const url = r.instagram_url || r.instagramUrl;
                        if (url) {
                            try {
                                const res = await fetch(API_BASE_URL + '/api/reels/fetch-thumbnail', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ url: url })
                                });
                                if (res.ok) {
                                    const data = await res.json();
                                    if (data.thumbnail) {
                                        r.thumbnail = data.thumbnail;
                                        if (data.reelCode && !r.reel_code) r.reel_code = data.reelCode;
                                        updatedCount++;
                                    }
                                }
                            } catch (e) {
                                console.warn("Error syncing reel thumbnail for", url, e);
                            }
                        }
                    }

                    if (updatedCount > 0) {
                        await saveInstagramConfigToBackend();
                        renderReelsList();
                        showAdminAlert(`Successfully synced ${updatedCount} Instagram Reel thumbnails!`, 'Thumbnails Synced', 'success');
                    } else {
                        showAdminAlert('No thumbnails needed syncing.', 'Info', 'info');
                    }
                } catch (err) {
                    showAdminAlert('Sync failed: ' + err.message, 'Error', 'error');
                } finally {
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                    }
                }
            }

            window.loadInstagramReels = loadInstagramReels;
            window.renderReelsList = renderReelsList;
            window.openAddReelModal = openAddReelModal;
            window.openEditReelModal = openEditReelModal;
            window.handleReelUrlInput = handleReelUrlInput;
            window.handleReelProductSelect = handleReelProductSelect;
            window.useProductImageAsThumbnail = useProductImageAsThumbnail;
            window.updateReelThumbPreview = updateReelThumbPreview;
            window.handleSaveReel = handleSaveReel;
            window.deleteReel = deleteReel;
            window.moveReel = moveReel;
            window.saveInstagramGlobalSettings = saveInstagramGlobalSettings;
            window.fetchReelThumbnailFromInsta = fetchReelThumbnailFromInsta;
            window.syncAllInstaThumbnails = syncAllInstaThumbnails;

            // ==========================================
            // FLASH SPOTLIGHT DROP CONFIGURATION
            // ==========================================
            let currentFlashConfig = null;
            let flashProductsList = [];
            let flashCountdownInterval = null;
            let currentCountdownSeconds = 0;

            async function loadFlashDropConfig() {
                const statusText = document.getElementById('fdStatusText');
                if (statusText) statusText.innerText = "Loading Flash Drop Status...";

                try {
                    const [hpRes, prodRes] = await Promise.all([
                        fetch(API_BASE_URL + '/api/config/homepage'),
                        fetch(API_BASE_URL + '/api/products')
                    ]);

                    if (prodRes.ok) {
                        flashProductsList = await prodRes.json();
                        populateFlashProductDropdown(flashProductsList);
                    }

                    if (hpRes.ok) {
                        const hpData = await hpRes.json();
                        const config = hpData.flash_drop || {};
                        currentFlashConfig = window.resolveLegacySpotlight(config, flashProductsList) || config;
                        applyFlashConfigToUI(currentFlashConfig);
                    }
                } catch (err) {
                    console.error("Failed to load flash drop config:", err);
                    if (statusText) statusText.innerText = "Error loading settings";
                }
            }

            function populateFlashProductDropdown(products) {
                const select = document.getElementById('fd_product_select');
                if (!select) return;

                const currentVal = select.value;
                select.innerHTML = '<option value="">-- Select a Kurti from Live Catalog --</option>';

                products.forEach(p => {
                    const opt = document.createElement('option');
                    opt.value = p.id;
                    opt.textContent = `${p.name} — ₹${p.price} (${p.stock} in stock)`;
                    select.appendChild(opt);
                });

                if (currentVal) select.value = currentVal;
            }

            function getActiveFlashProduct() {
                if (document.getElementById('fd_mode_manual')?.checked) {
                    const id = document.getElementById('fd_product_select')?.value;
                    return flashProductsList.find(product => String(product.id) === String(id));
                }
                const config = currentFlashConfig || {};
                if (config.mode === 'random') {
                    if (config.featured_product) return config.featured_product;
                    return flashProductsList.find(product => String(product.id) === String(config.featured_product_id));
                }
                // Switching the mode in the editor does not change the live selection until Save.
                return undefined;
            }

            function startAdminFlashCountdown(hours, mins, secs) {
                if (flashCountdownInterval) {
                    clearInterval(flashCountdownInterval);
                    flashCountdownInterval = null;
                }

                currentCountdownSeconds = (hours * 3600) + (mins * 60) + secs;

                const renderTimer = () => {
                    if (currentCountdownSeconds < 0) currentCountdownSeconds = 0;
                    const h = Math.floor(currentCountdownSeconds / 3600);
                    const m = Math.floor((currentCountdownSeconds % 3600) / 60);
                    const s = currentCountdownSeconds % 60;

                    const pvHours = document.getElementById('pv_hours');
                    const pvMins = document.getElementById('pv_mins');
                    const pvSecs = document.getElementById('pv_secs');

                    if (pvHours) pvHours.innerText = String(h).padStart(2, '0');
                    if (pvMins) pvMins.innerText = String(m).padStart(2, '0');
                    if (pvSecs) pvSecs.innerText = String(s).padStart(2, '0');

                    const statusText = document.getElementById('fdStatusText');
                    if (statusText && currentFlashConfig) {
                        const isManual = currentFlashConfig.mode === 'manual';
                        if (isManual) {
                            const prod = flashProductsList.find(p => String(p.id) === String(currentFlashConfig.product_id));
                            const name = prod ? prod.name : 'Selected Kurti';
                            statusText.innerHTML = `🎯 <strong>Spotlight Active:</strong> ${name} (${h}h ${m}m ${s}s left before auto-revert)`;
                        } else {
                            statusText.innerHTML = `🔀 <strong>Auto Rotation Active:</strong> Randomly rotating products from DB (${h}h ${m}m ${s}s left in cycle)`;
                        }
                    }

                    if (currentCountdownSeconds <= 0) {
                        clearInterval(flashCountdownInterval);
                        flashCountdownInterval = null;
                        setTimeout(() => {
                            loadFlashDropConfig();
                        }, 1000);
                    }
                };

                renderTimer();

                flashCountdownInterval = setInterval(() => {
                    currentCountdownSeconds--;
                    renderTimer();
                }, 1000);
            }

            function applyFlashConfigToUI(cfg) {
                const mode = cfg.mode === 'manual' ? 'manual' : 'random';
                const isManual = mode === 'manual';

                // Set radios
                const radRandom = document.getElementById('fd_mode_random');
                const radManual = document.getElementById('fd_mode_manual');
                if (radRandom && radManual) {
                    radRandom.checked = !isManual;
                    radManual.checked = isManual;
                }

                // Manual controls card
                const manualCard = document.getElementById('fd_manual_settings_card');
                if (manualCard) {
                    manualCard.style.display = isManual ? 'block' : 'none';
                }

                // Product Select
                const select = document.getElementById('fd_product_select');
                if (select && cfg.product_id) {
                    select.value = cfg.product_id;
                    onFlashProductSelect();
                }

                // Cycle duration for random mode
                const randHours = document.getElementById('fd_random_hours');
                const autoMinutes = cfg.rotation_minutes || (cfg.mode === 'random' ? (cfg.duration_hours || 0) * 60 + (cfg.duration_mins || 0) : 360) || 360;
                if (randHours) randHours.value = Math.floor(autoMinutes / 60);

                const randMins = document.getElementById('fd_random_mins');
                if (randMins) randMins.value = autoMinutes % 60;

                // Duration for manual spotlight
                const durHours = document.getElementById('fd_duration_hours');
                if (durHours) durHours.value = cfg.duration_hours !== undefined ? cfg.duration_hours : 6;

                const durMins = document.getElementById('fd_duration_mins');
                if (durMins) durMins.value = cfg.duration_mins !== undefined ? cfg.duration_mins : 0;

                // Active product (rotating kurti or manual selection)
                const activeProd = getActiveFlashProduct();

                // Scarcity & Copy (Section 3) - prefilled from active product or saved custom overrides
                const badgeInput = document.getElementById('fd_badge_text');
                if (badgeInput) badgeInput.value = cfg.badge_text || 'SELLING FAST';

                const remStockInput = document.getElementById('fd_remaining_stock');
                if (remStockInput) {
                    if (cfg.remaining_stock !== undefined && cfg.remaining_stock !== null && cfg.remaining_stock > 0) {
                        remStockInput.value = cfg.remaining_stock;
                    } else {
                        remStockInput.value = Math.max(1, Math.min(activeProd?.stock || 5, 8));
                    }
                }

                const totalStockInput = document.getElementById('fd_total_stock');
                if (totalStockInput) totalStockInput.value = cfg.total_stock !== undefined ? cfg.total_stock : 25;

                const titleInput = document.getElementById('fd_title');
                if (titleInput) titleInput.value = cfg.title !== undefined ? cfg.title : 'Customer Favorite: ';

                const highlightInput = document.getElementById('fd_highlight');
                if (highlightInput) {
                    if (cfg.highlight && cfg.highlight.trim() !== '') {
                        highlightInput.value = cfg.highlight;
                    } else {
                        highlightInput.value = activeProd?.name || 'Pink Paisley Cotton Kurti';
                    }
                }

                const descInput = document.getElementById('fd_desc');
                if (descInput) {
                    if (cfg.desc && cfg.desc.trim() !== '') {
                        descInput.value = cfg.desc;
                    } else {
                        descInput.value = activeProd?.description || `Crafted in 100% soft breathable ${activeProd?.fabric || 'Jaipur cotton'} with handpicked artisan detailing. Perfect for daily wear and office comfort. Only a few pieces left in stock!`;
                    }
                }

                const featureInput = document.getElementById('fd_feature_text');
                if (featureInput) {
                    if (cfg.feature_text && cfg.feature_text.trim() !== '') {
                        featureInput.value = cfg.feature_text;
                    } else {
                        featureInput.value = activeProd?.fabric ? `100% Pure Breathable ${activeProd.fabric}` : '100% Pure Breathable Cotton';
                    }
                }

                updateFlashStatusBadge(cfg);
                highlightSelectedModeCard();
                onRandomCycleInput();
                updateCalculatedExpiry();
                updatePreviewCard();

                // Start live countdown timer synchronized with DB
                startAdminFlashCountdown(
                    cfg.hours_left !== undefined ? cfg.hours_left : 0,
                    cfg.minutes_left !== undefined ? cfg.minutes_left : 0,
                    cfg.seconds_left !== undefined ? cfg.seconds_left : 0
                );
            }

            function updateFlashStatusBadge(cfg) {
                const statusText = document.getElementById('fdStatusText');
                const statusBadge = document.getElementById('fdStatusBadge');
                if (!statusText || !statusBadge) return;

                const h = cfg.hours_left !== undefined ? cfg.hours_left : 0;
                const m = cfg.minutes_left !== undefined ? cfg.minutes_left : 0;

                if (cfg.mode === 'manual' && cfg.product_id) {
                    const prod = flashProductsList.find(p => String(p.id) === String(cfg.product_id));
                    const name = prod ? prod.name : 'Selected Kurti';
                    statusBadge.style.background = '#ECFDF5';
                    statusBadge.style.color = '#065F46';
                    statusBadge.style.borderColor = '#A7F3D0';
                    statusText.innerHTML = `🎯 <strong>Spotlight Active:</strong> ${name} (${h}h ${m}m left before auto-revert)`;
                } else {
                    statusBadge.style.background = '#EFF6FF';
                    statusBadge.style.color = '#1E40AF';
                    statusBadge.style.borderColor = '#BFDBFE';
                    statusText.innerHTML = `🔀 <strong>Auto Rotation Active:</strong> Randomly rotating products from DB (${h}h ${m}m left in cycle)`;
                }
            }

            function onRandomCycleInput() {
                const hours = parseInt(document.getElementById('fd_random_hours')?.value) || 0;
                const mins = parseInt(document.getElementById('fd_random_mins')?.value) || 0;
                const totalMins = (hours * 60) + mins;
                const cycleDesc = document.getElementById('fd_random_cycle_desc');
                if (cycleDesc) {
                    if (totalMins <= 0) {
                        cycleDesc.innerText = "Please specify a cycle interval greater than 0 mins.";
                        cycleDesc.style.color = "#DC2626";
                    } else {
                        let desc = "";
                        if (hours > 0 && mins > 0) desc = `${hours} hours and ${mins} mins`;
                        else if (hours > 0) desc = `${hours} hours`;
                        else desc = `${mins} minutes`;
                        cycleDesc.innerText = `Each random kurti from the catalog will remain spotlighted for ${desc} before automatically cycling to the next.`;
                        cycleDesc.style.color = "#666";
                    }
                }
            }

            function populateSection3FromActiveProduct(force = false) {
                const activeProd = getActiveFlashProduct();
                if (!activeProd) return;

                const badgeInput = document.getElementById('fd_badge_text');
                const remStockInput = document.getElementById('fd_remaining_stock');
                const titleInput = document.getElementById('fd_title');
                const highlightInput = document.getElementById('fd_highlight');
                const descInput = document.getElementById('fd_desc');
                const featureInput = document.getElementById('fd_feature_text');

                if (badgeInput && (force || !badgeInput.value)) {
                    badgeInput.value = 'SELLING FAST';
                }
                if (remStockInput && (force || !remStockInput.value)) {
                    remStockInput.value = Math.max(1, Math.min(activeProd.stock || 5, 8));
                }
                if (titleInput && (force || !titleInput.value)) {
                    titleInput.value = 'Customer Favorite: ';
                }
                if (highlightInput && (force || !highlightInput.value)) {
                    highlightInput.value = activeProd.name;
                }
                if (descInput && (force || !descInput.value)) {
                    descInput.value = activeProd.description || `Crafted in 100% soft breathable ${activeProd.fabric || 'Jaipur cotton'} with handpicked artisan detailing. Perfect for daily wear and office comfort. Only a few pieces left in stock!`;
                }
                if (featureInput && (force || !featureInput.value)) {
                    featureInput.value = activeProd.fabric ? `100% Pure Breathable ${activeProd.fabric}` : '100% Pure Breathable Cotton';
                }

                updatePreviewCard();
                if (force) {
                    showAdminAlert(`Section 3 fields populated with active Kurti (${activeProd.name}) details!`, "Defaults Applied", "success");
                }
            }

            function onFlashModeChange() {
                const isManual = document.getElementById('fd_mode_manual').checked;
                const manualCard = document.getElementById('fd_manual_settings_card');
                if (manualCard) {
                    manualCard.style.display = isManual ? 'block' : 'none';
                }

                highlightSelectedModeCard();
                if (!isManual) {
                    populateSection3FromActiveProduct(false);
                } else {
                    onFlashProductSelect();
                }
                updateCalculatedExpiry();
                updatePreviewCard();
            }

            function highlightSelectedModeCard() {
                const isManual = document.getElementById('fd_mode_manual')?.checked;
                for (const id of ['fd_badge_text', 'fd_title', 'fd_highlight', 'fd_desc', 'fd_feature_text',
                    'fd_remaining_stock', 'fd_total_stock']) {
                    const field = document.getElementById(id);
                    if (field) field.disabled = !isManual || id === 'fd_remaining_stock' || id === 'fd_total_stock';
                }
                const cardRandom = document.getElementById('card_mode_random');
                const cycleBox = document.getElementById('fd_random_cycle_box');
                const lblManual = document.getElementById('lbl_mode_manual');

                if (cardRandom) {
                    cardRandom.style.borderColor = !isManual ? '#D4A373' : '#E5E7EB';
                    cardRandom.style.background = !isManual ? '#FAF5EE' : '#FAF9F6';
                }
                if (cycleBox) {
                    cycleBox.style.display = !isManual ? 'block' : 'none';
                }
                if (lblManual) {
                    lblManual.style.borderColor = isManual ? '#D4A373' : '#E5E7EB';
                    lblManual.style.background = isManual ? '#FAF5EE' : '#FAF9F6';
                }

                const pvBadge = document.getElementById('pv_mode_badge');
                if (pvBadge) {
                    pvBadge.innerText = isManual ? 'Specific Spotlight (Auto-Expiry)' : 'Random Rotation';
                    pvBadge.style.background = isManual ? '#FEF3C7' : '#E0E7FF';
                    pvBadge.style.color = isManual ? '#B45309' : '#3730A3';
                }
            }

            function onFlashProductSelect() {
                const select = document.getElementById('fd_product_select');
                const summaryCard = document.getElementById('fd_product_summary');
                if (!select || !summaryCard) return;

                const prodId = select.value;
                const prod = flashProductsList.find(p => String(p.id) === String(prodId));

                if (prod) {
                    summaryCard.style.display = 'flex';
                    document.getElementById('fd_summary_img').src = prod.imageUrl;
                    document.getElementById('fd_summary_name').innerText = prod.name;
                    document.getElementById('fd_summary_price').innerText = Number(prod.price).toLocaleString('en-IN');
                    document.getElementById('fd_summary_stock').innerText = prod.stock || 0;

                    // Auto-fill Section 3 inputs with chosen product details
                    const hl = document.getElementById('fd_highlight');
                    if (hl) hl.value = prod.name;

                    const desc = document.getElementById('fd_desc');
                    if (desc) desc.value = prod.description || `Crafted in 100% soft breathable ${prod.fabric || 'Jaipur cotton'} with handpicked artisan detailing. Perfect for daily wear and office comfort. Only a few pieces left in stock!`;

                    const remStock = document.getElementById('fd_remaining_stock');
                    if (remStock) remStock.value = Math.max(1, Math.min(prod.stock || 5, 8));

                    const feat = document.getElementById('fd_feature_text');
                    if (feat) feat.value = prod.fabric ? `100% Pure Breathable ${prod.fabric}` : '100% Pure Breathable Cotton';
                } else {
                    summaryCard.style.display = 'none';
                }

                updatePreviewCard();
            }

            function updateCalculatedExpiry() {
                const hours = parseInt(document.getElementById('fd_duration_hours')?.value) || 0;
                const mins = parseInt(document.getElementById('fd_duration_mins')?.value) || 0;
                const totalMinutes = (hours * 60) + mins;

                const previewSpan = document.getElementById('fd_expiry_time_preview');
                if (!previewSpan) return;

                if (totalMinutes <= 0) {
                    previewSpan.innerText = "Please specify a duration greater than 0 mins";
                    return;
                }

                const future = new Date(Date.now() + totalMinutes * 60 * 1000);
                const timeStr = future.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const isToday = future.toDateString() === new Date().toDateString();
                const datePrefix = isToday ? "Today" : future.toLocaleDateString([], { month: 'short', day: 'numeric' });

                let durDesc = "";
                if (hours > 0 && mins > 0) durDesc = `${hours} hours and ${mins} mins`;
                else if (hours > 0) durDesc = `${hours} hours`;
                else durDesc = `${mins} minutes`;

                previewSpan.innerText = `${datePrefix} at ${timeStr} (in ${durDesc})`;
            }

            function updatePreviewCard() {
                const product = getActiveFlashProduct();
                const manual = document.getElementById('fd_mode_manual')?.checked;
                const input = id => document.getElementById(id)?.value?.trim();
                const text = (id, value) => {
                    const element = document.getElementById(id);
                    if (element) element.textContent = value;
                };
                const image = document.getElementById('pv_img');
                if (image) {
                    image.hidden = !product?.imageUrl;
                    if (product?.imageUrl) image.src = product.imageUrl;
                    else image.removeAttribute('src');
                    image.alt = product?.name || '';
                }
                text('pv_badge', manual && input('fd_badge_text') || 'Flash Spotlight Drop');
                text('pv_title_prefix', product ? (manual && input('fd_title') || 'Featured style:') + ' ' : '');
                text('pv_highlight', product ? (manual && input('fd_highlight') || product.name)
                    : (currentFlashConfig.mode === 'manual' && !manual ? 'Save to start random rotation' : 'No product available'));
                text('pv_desc', product ? manual && input('fd_desc') || product.description || '' : '');
                text('pv_feature', product ? manual && input('fd_feature_text') || product.fabric || '' : '');
                text('pv_price', product ? Number(product.price).toLocaleString('en-IN') : '—');
                const sizes = Object.values(product?.sizesStock || {}).map(Number);
                const stock = sizes.length ? sizes.reduce((sum, qty) => sum + Math.max(0, qty), 0) : Number(product?.stock || 0);
                const lowStockLimit = 5;
                const showStock = Number.isSafeInteger(stock) && stock > 0;
                const stockLabel = stock <= lowStockLimit
                    ? `Only ${stock} ${stock === 1 ? 'piece' : 'pieces'} remaining`
                    : `In stock · ${stock} pieces`;
                text('pv_remaining', showStock ? stockLabel : '');
                const stockMeter = document.getElementById('pv_stock_line');
                if (stockMeter) stockMeter.style.display = showStock ? 'flex' : 'none';
                if (!manual) {
                    for (const [id, value] of Object.entries({
                        fd_highlight: product?.name || '',
                        fd_desc: product?.description || '',
                        fd_feature_text: product?.fabric || '',
                        fd_remaining_stock: stock,
                        fd_total_stock: stock
                    })) {
                        const field = document.getElementById(id);
                        if (field) field.value = value;
                    }
                }
                const bar = document.getElementById('pv_meter_bar');
                if (bar) {
                    bar.parentElement.style.display = showStock ? 'block' : 'none';
                    bar.style.width = showStock ? `${Math.min(100, stock / lowStockLimit * 100)}%` : '0%';
                }
            }

            async function saveFlashDropConfig() {
                console.log("[FLASH DROP] saveFlashDropConfig clicked");
                const saveBtn = document.getElementById('fdSaveBtn');
                let originalText = saveBtn ? saveBtn.innerHTML : '<span>⚡ Save & Publish Flash Drop Settings</span>';

                try {
                    const isManual = document.getElementById('fd_mode_manual')?.checked ?? false;
                    const mode = isManual ? 'manual' : 'random';
                    const productId = document.getElementById('fd_product_select')?.value || '';

                    let durationHours = 6;
                    let durationMins = 0;

                    if (isManual) {
                        durationHours = parseInt(document.getElementById('fd_duration_hours')?.value) || 0;
                        durationMins = parseInt(document.getElementById('fd_duration_mins')?.value) || 0;

                        if (!productId) {
                            showAdminAlert("Please choose a Kurti from the catalog to spotlight, or switch to 'Randomly Rotate Products from DB'.", "Select a Product", "warning");
                            document.getElementById('fd_product_select')?.focus();
                            return;
                        }
                        if (durationHours === 0 && durationMins === 0) {
                            showAdminAlert("Please specify a duration greater than 0 minutes for the spotlight timer.", "Duration Required", "warning");
                            document.getElementById('fd_duration_hours')?.focus();
                            return;
                        }
                    } else {
                        durationHours = parseInt(document.getElementById('fd_random_hours')?.value) || 0;
                        durationMins = parseInt(document.getElementById('fd_random_mins')?.value) || 0;

                        if (durationHours === 0 && durationMins === 0) {
                            durationHours = 6;
                            durationMins = 0;
                        }
                    }

                    const badgeText = document.getElementById('fd_badge_text')?.value?.trim() || 'SELLING FAST';
                    const title = document.getElementById('fd_title')?.value ?? 'Customer Favorite: ';
                    const highlight = document.getElementById('fd_highlight')?.value?.trim() || '';
                    const desc = document.getElementById('fd_desc')?.value?.trim() || '';
                    const featureText = document.getElementById('fd_feature_text')?.value?.trim() || '100% Pure Breathable Cotton';

                    if (saveBtn) {
                        saveBtn.disabled = true;
                        saveBtn.innerHTML = `<span>Saving & Publishing...</span>`;
                    }

                    const activeProduct = getActiveFlashProduct();
                    const activeProdId = isManual
                        ? productId
                        : '';
                    const matchedProduct = flashProductsList.find(p => String(p.id) === String(activeProdId))
                        || flashProductsList.find(p => p.name && p.name.trim().toLowerCase() === highlight.toLowerCase())
                        || activeProduct;
                    const activeImageUrl = matchedProduct?.imageUrl || activeProduct?.imageUrl || '';
                    const activePrice = Number(matchedProduct?.price) || Number(activeProduct?.price) || 0;
                    const activeOrigPrice = Number(matchedProduct?.originalPrice) || Number(activeProduct?.originalPrice) || 0;

                    const payload = {
                        mode: mode,
                        product_id: activeProdId,
                        image_url: activeImageUrl,
                        price: activePrice,
                        original_price: activeOrigPrice,
                        duration_hours: durationHours,
                        duration_mins: durationMins,
                        rotation_minutes: isManual
                            ? Number(document.getElementById('fd_random_hours')?.value || 0) * 60 + Number(document.getElementById('fd_random_mins')?.value || 0)
                            : durationHours * 60 + durationMins,
                        badge_text: badgeText,
                        remaining_stock: 0,
                        total_stock: 0,
                        title: title,
                        highlight: isManual ? highlight : '',
                        desc: isManual ? desc : '',
                        feature_text: isManual ? featureText : ''
                    };

                    console.log("[FLASH DROP] Sending payload to API:", payload);

                    const res = await fetch(API_BASE_URL + '/api/admin/config/flash-drop', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.error || errData.message || `HTTP ${res.status}`);
                    }

                    const resData = await res.json();
                    console.log("[FLASH DROP] Save success, response:", resData);

                    const successMsg = isManual
                        ? `Flash Spotlight Drop activated for selected Kurti! It will run for ${durationHours}h ${durationMins}m and then automatically revert back to random rotation.`
                        : `Flash Spotlight Drop configured with ${durationHours}h ${durationMins}m rotation cycle and published successfully!`;

                    showAdminAlert(successMsg, "Flash Drop Published!", "success");
                    await loadFlashDropConfig();
                } catch (err) {
                    console.error("[FLASH DROP] Save failed:", err);
                    showAdminAlert("Failed to save Flash Drop configuration: " + err.message, "Save Error", "error");
                } finally {
                    if (saveBtn) {
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = originalText;
                    }
                }
            }

            window.loadFlashDropConfig = loadFlashDropConfig;
            window.onFlashModeChange = onFlashModeChange;
            window.onFlashProductSelect = onFlashProductSelect;
            window.onRandomCycleInput = onRandomCycleInput;
            window.populateSection3FromActiveProduct = populateSection3FromActiveProduct;
            window.updateCalculatedExpiry = updateCalculatedExpiry;
            window.updatePreviewCard = updatePreviewCard;
            window.saveFlashDropConfig = saveFlashDropConfig;





            // ==========================================
            // PREORDER STORE PICKUP & DELIVERY MANAGEMENT
            // ==========================================

            let currentPreorderFilter = '';
            let allPreorderOrders = [];

            function handlePreorderToggleChange(checked) {
                const chk = document.getElementById('preorderPickup_enabled');
                if (chk && chk.checked !== !!checked) {
                    chk.checked = !!checked;
                }

                const wrapper = document.getElementById('preorderToggleWrapper');
                const badge = document.getElementById('preorderConfigStatusBadge');
                const stateBadge = document.getElementById('preorderToggleStateBadge');
                const subtitle = document.getElementById('preorderToggleSubtitle');

                if (checked) {
                    if (wrapper) {
                        wrapper.style.borderColor = '#86efac';
                        wrapper.style.background = '#f0fdf4';
                    }
                    if (stateBadge) {
                        stateBadge.innerText = 'ACTIVE';
                        stateBadge.style.background = '#dcfce7';
                        stateBadge.style.color = '#15803d';
                    }
                    if (badge) {
                        badge.innerHTML = '<span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #15803d;"></span> Store Pickup: ACTIVE';
                        badge.style.background = '#dcfce7';
                        badge.style.color = '#15803d';
                    }
                    if (subtitle) {
                        subtitle.innerText = 'Store pickup is ENABLED. Hyderabad customers can select free in-store pickup during preorder checkout.';
                    }
                } else {
                    if (wrapper) {
                        wrapper.style.borderColor = '#e2e8f0';
                        wrapper.style.background = '#ffffff';
                    }
                    if (stateBadge) {
                        stateBadge.innerText = 'DISABLED';
                        stateBadge.style.background = '#fee2e2';
                        stateBadge.style.color = '#b91c1c';
                    }
                    if (badge) {
                        badge.innerHTML = '<span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #b91c1c;"></span> Store Pickup: DISABLED';
                        badge.style.background = '#fee2e2';
                        badge.style.color = '#b91c1c';
                    }
                    if (subtitle) {
                        subtitle.innerText = 'Store pickup is DISABLED. Preorder customers will only have Home Delivery available.';
                    }
                }
            }

            function quickTogglePreorderPickup() {
                const chk = document.getElementById('preorderPickup_enabled');
                if (chk) {
                    chk.checked = !chk.checked;
                    handlePreorderToggleChange(chk.checked);
                }
            }

            async function loadPreorderPickupConfig() {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/config/preorder-pickup`);
                    if (!res.ok) return;
                    const cfg = await res.json();

                    const setVal = (id, val) => {
                        const el = document.getElementById(id);
                        if (el) el.value = val || '';
                    };
                    const setCheck = (id, val) => {
                        const el = document.getElementById(id);
                        if (el) el.checked = !!val;
                    };

                    setCheck('preorderPickup_enabled', cfg.enabled);
                    handlePreorderToggleChange(!!cfg.enabled);

                    setVal('preorderPickup_locationName', cfg.locationName);
                    setVal('preorderPickup_address', cfg.address);
                    setVal('preorderPickup_city', cfg.city);
                    setVal('preorderPickup_state', cfg.state);
                    setVal('preorderPickup_zipCode', cfg.zipCode);
                    setVal('preorderPickup_mapsLink', cfg.mapsLink);
                    setVal('preorderPickup_instructions', cfg.instructions);
                    setVal('preorderPickup_availability', cfg.availability);
                    setVal('preorderPickup_contactInfo', cfg.contactInfo);
                    setVal('preorderPickup_estimatedPickupDate', cfg.estimatedPickupDate);
                    setVal('preorderPickup_collectionDeadline', cfg.collectionDeadline);
                } catch (e) {
                    console.error('Failed to load preorder pickup config:', e);
                }
            }

            async function savePreorderPickupConfig(e) {
                if (e) e.preventDefault();
                const getVal = (id) => {
                    const el = document.getElementById(id);
                    return el ? el.value.trim() : '';
                };
                const getCheck = (id) => {
                    const el = document.getElementById(id);
                    return el ? el.checked : false;
                };

                const payload = {
                    enabled: getCheck('preorderPickup_enabled'),
                    locationName: getVal('preorderPickup_locationName'),
                    address: getVal('preorderPickup_address'),
                    city: getVal('preorderPickup_city'),
                    state: getVal('preorderPickup_state'),
                    zipCode: getVal('preorderPickup_zipCode'),
                    mapsLink: getVal('preorderPickup_mapsLink'),
                    instructions: getVal('preorderPickup_instructions'),
                    availability: getVal('preorderPickup_availability'),
                    contactInfo: getVal('preorderPickup_contactInfo'),
                    estimatedPickupDate: getVal('preorderPickup_estimatedPickupDate'),
                    collectionDeadline: getVal('preorderPickup_collectionDeadline')
                };

                try {
                    const res = await fetch(`${API_BASE_URL}/api/admin/config/preorder-pickup`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                        },
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                        const feedback = document.getElementById('preorderSaveFeedback');
                        if (feedback) {
                            feedback.innerText = '✓ Configuration saved & applied!';
                            feedback.style.display = 'inline-block';
                            setTimeout(() => { feedback.style.display = 'none'; }, 3500);
                        }
                        showAdminAlert('Preorder Pickup configuration saved successfully!', 'Configuration Saved', 'success');
                        loadPreorderPickupConfig();
                    } else {
                        const err = await res.text();
                        showAdminAlert('Failed to save configuration: ' + err, 'Save Error', 'error');
                    }
                } catch (err) {
                    showAdminAlert('Error saving configuration: ' + err.message, 'Save Error', 'error');
                }
            }

            async function loadPreorderOrders(filter) {
                currentPreorderFilter = filter;
                document.querySelectorAll('.preorder-filter-btn').forEach(btn => {
                    const isActive = btn.getAttribute('data-filter') === filter;
                    btn.classList.toggle('active', isActive);
                    btn.style.background = isActive ? '#1e293b' : 'white';
                    btn.style.color = isActive ? 'white' : '#475569';
                });

                const tbody = document.getElementById('preorderOrdersTableBody');
                if (tbody) tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">Loading orders...</td></tr>';

                try {
                    const res = await fetch(`${API_BASE_URL}/api/admin/preorder/orders?filter=${encodeURIComponent(filter)}`, {
                        headers: getAuthHeader()
                    });
                    if (!res.ok) throw new Error('Failed to fetch orders');
                    const data = await res.json();
                    allPreorderOrders = data.orders || [];
                    renderPreorderOrdersTable(allPreorderOrders);
                } catch (err) {
                    if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #ef4444; padding: 2rem;">Error: ${err.message}</td></tr>`;
                }
            }

            function renderPreorderOrdersTable(orders) {
                const tbody = document.getElementById('preorderOrdersTableBody');
                if (!tbody) return;

                if (!orders || orders.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 2rem;">No preorder orders found for this filter.</td></tr>';
                    return;
                }

                tbody.innerHTML = '';
                orders.forEach(o => {
                    const id = o.id || o.ID || '';
                    const email = o.customerEmail || o.CustomerEmail || '';
                    const name = o.shippingName || o.ShippingName || '';
                    const amount = o.totalAmount || o.TotalAmount || 0;
                    const status = o.status || o.Status || '';
                    const fType = o.fulfilmentType || o.FulfilmentType || '';
                    const dateStr = (o.createdAt || o.CreatedAt || '').substring(0, 10);

                    const tr = document.createElement('tr');

                    // ID Cell
                    const tdId = document.createElement('td');
                    tdId.setAttribute('data-label', 'Order ID');
                    const strongId = document.createElement('strong');
                    strongId.style.cssText = 'font-size: 0.85rem; font-family: monospace;';
                    strongId.textContent = id;
                    tdId.appendChild(strongId);
                    tr.appendChild(tdId);

                    // Customer Cell
                    const tdCust = document.createElement('td');
                    tdCust.setAttribute('data-label', 'Customer');
                    const nameDiv = document.createElement('div');
                    nameDiv.style.cssText = 'font-weight: 600; font-size: 0.88rem; color: #1e293b;';
                    nameDiv.textContent = name || 'Customer';
                    const emailDiv = document.createElement('div');
                    emailDiv.style.cssText = 'font-size: 0.78rem; color: #64748b;';
                    emailDiv.textContent = email;
                    tdCust.appendChild(nameDiv);
                    tdCust.appendChild(emailDiv);
                    tr.appendChild(tdCust);

                    // Fulfilment badge cell
                    const tdF = document.createElement('td');
                    tdF.setAttribute('data-label', 'Fulfillment');
                    const fBadge = document.createElement('span');
                    if (fType === 'PREORDER_STORE_PICKUP') {
                        fBadge.style.cssText = 'background: #f3e8ff; color: #7e22ce; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;';
                        fBadge.textContent = 'Store Pickup';
                    } else if (fType === 'PREORDER_HOME_DELIVERY') {
                        fBadge.style.cssText = 'background: #dbeafe; color: #1d4ed8; padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;';
                        fBadge.textContent = 'Home Delivery';
                    } else {
                        fBadge.style.cssText = 'color: #64748b;';
                        fBadge.textContent = 'Standard';
                    }
                    tdF.appendChild(fBadge);
                    tr.appendChild(tdF);

                    // Status badge cell
                    const tdS = document.createElement('td');
                    tdS.setAttribute('data-label', 'Status');
                    const sBadge = document.createElement('span');
                    sBadge.style.cssText = 'padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;';
                    if (status === 'READY_FOR_PICKUP') {
                        sBadge.style.background = '#dcfce7';
                        sBadge.style.color = '#15803d';
                        sBadge.textContent = 'Ready for Pickup';
                    } else if (status === 'COLLECTED') {
                        sBadge.style.background = '#f0fdf4';
                        sBadge.style.color = '#166534';
                        sBadge.textContent = 'Collected';
                    } else if (status === 'AWAITING_PICKUP') {
                        sBadge.style.background = '#fef3c7';
                        sBadge.style.color = '#b45309';
                        sBadge.textContent = 'Awaiting Pickup';
                    } else if (status === 'paid') {
                        sBadge.style.background = '#e0e7ff';
                        sBadge.style.color = '#4338ca';
                        sBadge.textContent = 'Paid (In Production)';
                    } else {
                        sBadge.style.background = '#f1f5f9';
                        sBadge.style.color = '#475569';
                        sBadge.textContent = status;
                    }
                    tdS.appendChild(sBadge);
                    tr.appendChild(tdS);

                    // Amount Cell
                    const tdAmt = document.createElement('td');
                    tdAmt.setAttribute('data-label', 'Amount');
                    const strongAmt = document.createElement('strong');
                    strongAmt.textContent = '₹' + amount.toLocaleString('en-IN');
                    tdAmt.appendChild(strongAmt);
                    tr.appendChild(tdAmt);

                    // Date Cell
                    const tdDate = document.createElement('td');
                    tdDate.setAttribute('data-label', 'Date');
                    tdDate.style.cssText = 'font-size: 0.85rem; color: #64748b;';
                    tdDate.textContent = dateStr;
                    tr.appendChild(tdDate);

                    // Actions Cell
                    const tdActs = document.createElement('td');
                    tdActs.setAttribute('data-label', 'Actions');
                    tdActs.style.textAlign = 'right';

                    if (fType === 'PREORDER_STORE_PICKUP') {
                        if (status !== 'READY_FOR_PICKUP' && status !== 'COLLECTED' && status !== 'cancelled' && status !== 'payment_failed') {
                            const btnReady = document.createElement('button');
                            btnReady.type = 'button';
                            btnReady.style.cssText = 'background: #10b981; border: none; color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.78rem; font-weight: 600; cursor: pointer; margin-right: 4px;';
                            btnReady.textContent = 'Mark Ready';
                            btnReady.addEventListener('click', () => markPreorderReady(id));
                            tdActs.appendChild(btnReady);
                        } else if (status === 'READY_FOR_PICKUP') {
                            const btnCollect = document.createElement('button');
                            btnCollect.type = 'button';
                            btnCollect.style.cssText = 'background: #7c3aed; border: none; color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.78rem; font-weight: 600; cursor: pointer; margin-right: 4px;';
                            btnCollect.textContent = 'Confirm Collected';
                            btnCollect.addEventListener('click', () => confirmPreorderPickup(id));
                            tdActs.appendChild(btnCollect);
                        }
                    }

                    const btnAudit = document.createElement('button');
                    btnAudit.type = 'button';
                    btnAudit.style.cssText = 'background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 4px 8px; border-radius: 4px; font-size: 0.78rem; font-weight: 600; cursor: pointer;';
                    btnAudit.textContent = 'Audit';
                    btnAudit.addEventListener('click', () => viewPreorderAudit(id));
                    tdActs.appendChild(btnAudit);

                    tr.appendChild(tdActs);
                    tbody.appendChild(tr);
                });
            }

            async function markPreorderReady(orderId) {
                const confirmed = await showAdminConfirm(
                    `Mark preorder ${orderId} as READY FOR PICKUP? This will trigger the ready-for-pickup customer notification.`,
                    'Mark Ready for Pickup',
                    'Mark Ready',
                    'Cancel'
                );
                if (!confirmed) return;

                try {
                    const res = await fetch(`${API_BASE_URL}/api/admin/preorder/mark-ready`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                        },
                        body: JSON.stringify({ orderId })
                    });
                    if (res.ok) {
                        showAdminAlert('Order marked as READY FOR PICKUP! Customer notification sent.', 'Preorder Ready', 'success');
                        loadPreorderOrders(currentPreorderFilter);
                    } else {
                        const err = await res.text();
                        showAdminAlert('Failed: ' + err, 'Error', 'error');
                    }
                } catch (e) {
                    showAdminAlert('Error: ' + e.message, 'Error', 'error');
                }
            }

            async function markAllPreordersReady() {
                const eligible = (allPreorderOrders || []).filter(o => {
                    const fType = o.fulfilmentType || o.FulfilmentType || '';
                    const status = o.status || o.Status || '';
                    return fType === 'PREORDER_STORE_PICKUP' && status !== 'READY_FOR_PICKUP' && status !== 'COLLECTED' && status !== 'cancelled' && status !== 'payment_failed';
                });

                const count = eligible.length;
                const confirmMsg = count > 0
                    ? `Mark ${count} eligible store pickup order(s) as READY FOR PICKUP? This will update their status and trigger customer ready notifications.`
                    : `Mark all eligible store pickup preorder orders as READY FOR PICKUP?`;

                const confirmed = await showAdminConfirm(confirmMsg, 'Mark All Preorders Ready', 'Mark All Ready', 'Cancel');
                if (!confirmed) return;

                const btn = document.getElementById('markAllReadyBtn');
                const oldHtml = btn ? btn.innerHTML : '';
                if (btn) {
                    btn.disabled = true;
                    btn.innerText = 'Marking Ready...';
                }

                try {
                    const res = await fetch(`${API_BASE_URL}/api/admin/preorder/mark-all-ready`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        showAdminAlert(data.message || `Successfully marked ${data.count || count} orders as READY FOR PICKUP!`, 'Orders Ready', 'success');
                        loadPreorderOrders(currentPreorderFilter);
                    } else {
                        const err = await res.text();
                        showAdminAlert('Failed to mark all as ready: ' + err, 'Error', 'error');
                    }
                } catch (e) {
                    showAdminAlert('Network error: ' + e.message, 'Error', 'error');
                } finally {
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = oldHtml;
                    }
                }
            }

            async function confirmPreorderPickup(orderId) {
                const notes = await showAdminPrompt(
                    `Confirm in-store collection for order ${orderId}.\n\nEnter operator notes (optional):`,
                    '',
                    'Confirm In-Store Collection',
                    'Confirm Collection',
                    'Cancel'
                );
                if (notes === null) return;

                try {
                    const res = await fetch(`${API_BASE_URL}/api/admin/preorder/confirm-pickup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                        },
                        body: JSON.stringify({ orderId, notes: notes || '' })
                    });
                    if (res.ok) {
                        showAdminAlert('Order successfully marked as COLLECTED!', 'Order Collected', 'success');
                        loadPreorderOrders(currentPreorderFilter);
                    } else {
                        const err = await res.text();
                        showAdminAlert('Failed: ' + err, 'Error', 'error');
                    }
                } catch (e) {
                    showAdminAlert('Error: ' + e.message, 'Error', 'error');
                }
            }

            async function viewPreorderAudit(orderId) {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/admin/preorder/orders/${orderId}/audit`, {
                        headers: getAuthHeader()
                    });
                    if (!res.ok) throw new Error('Could not fetch audit');
                    const data = await res.json();
                    const list = data.audit || [];
                    if (list.length === 0) {
                        showAdminAlert(`No audit entries recorded yet for order ${orderId}.`, 'Audit Trail', 'info');
                        return;
                    }

                    const formatted = list.map(function (e) {
                        var dt = e.changedAt || e.ChangedAt || '';
                        var act = e.action || e.Action || '';
                        var by = e.adminEmail || e.AdminEmail || 'System';
                        var n = (e.notes || e.Notes) ? ('\n  Notes: ' + (e.notes || e.Notes)) : '';
                        return '• ' + dt + '\n  Action: ' + act + '\n  By: ' + by + n;
                    }).join('\n\n');

                    showAdminAlert(formatted, `Audit Trail: Order ${orderId}`, 'info');
                } catch (e) {
                    showAdminAlert('Failed to load audit trail: ' + e.message, 'Audit Error', 'error');
                }
            }

            function searchPreorderOrders() {
                const inp = document.getElementById('preorderSearchInput');
                const q = inp ? inp.value.trim().toLowerCase() : '';
                if (!q) {
                    renderPreorderOrdersTable(allPreorderOrders);
                    return;
                }

                const filtered = allPreorderOrders.filter(o => {
                    const id = (o.id || o.ID || '').toLowerCase();
                    const email = (o.customerEmail || o.CustomerEmail || '').toLowerCase();
                    const name = (o.shippingName || o.ShippingName || '').toLowerCase();
                    return id.includes(q) || email.includes(q) || name.includes(q);
                });
                renderPreorderOrdersTable(filtered);
            }


            async function toggleProductPreorder(productId, enablePreorder) {
                try {
                    const p = loadedProductsMap[productId];
                    if (!p) {
                        showAdminAlert('Product not found in cache.', 'Update Preorder', 'warning');
                        return;
                    }

                    const updated = {
                        ...p,
                        isPreorder: enablePreorder
                    };

                    const res = await fetch(API_BASE_URL + '/api/products', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            ...getAuthHeader()
                        },
                        body: JSON.stringify(updated)
                    });

                    if (res.ok) {
                        loadProducts();
                    } else {
                        const err = await res.text();
                        showAdminAlert('Failed to update preorder status: ' + err, 'Update Error', 'error');
                    }
                } catch (err) {
                    showAdminAlert('Error updating product preorder status: ' + err.message, 'Update Error', 'error');
                }
            }
