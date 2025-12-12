// ===== CONFIGURATION =====
const API_URL = window.location.origin;

// ===== GLOBAL STATE =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let categories = [];
let orders = [];
let settings = {};
let contacts = {};
let isAdmin = false;
let currentFilter = 'all';
let currentSort = 'newest';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    updateCartCount();
    renderHomePage();
    renderProducts();
    renderCategoryFilters();
    renderContacts();
    
    if (localStorage.getItem('admin_logged_in') === 'true') {
        isAdmin = true;
        showAdminPanel();
    }
    
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Also check on search button click
    document.querySelector('.search-btn').addEventListener('click', () => {
        handleSearch();
    });
});

// ===== DATA LOADING =====
async function loadData() {
    try {
        const [productsRes, categoriesRes, settingsRes, contactsRes, ordersRes] = await Promise.all([
            fetch(`${API_URL}/api/products`),
            fetch(`${API_URL}/api/categories`),
            fetch(`${API_URL}/api/settings`),
            fetch(`${API_URL}/api/contacts`),
            fetch(`${API_URL}/api/orders`).catch(() => ({ json: async () => [] }))
        ]);
        
        products = await productsRes.json();
        categories = await categoriesRes.json();
        settings = await settingsRes.json();
        contacts = await contactsRes.json();
        orders = await ordersRes.json();
        
        updateSiteSettings();
        updateContactsDisplay();
    } catch (error) {
        console.error('Error loading data:', error);
        showAlert('Error loading data', 'error');
    }
}

function updateSiteSettings() {
    if (settings.logo) {
        document.getElementById('main-logo').innerHTML = `<img src="${API_URL}${settings.logo}" alt="Logo">`;
    }
    if (settings.shopName) {
        document.getElementById('site-name').textContent = settings.shopName;
    }
    if (settings.backgroundImage) {
        document.body.classList.add('custom-background');
        document.body.style.setProperty('--bg-image', `url(${API_URL}${settings.backgroundImage})`);
    }
}

// ===== NAVIGATION =====
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        window.scrollTo(0, 0);
        
        if (sectionId === 'home') renderHomePage();
        else if (sectionId === 'cart') renderCart();
        else if (sectionId === 'products') renderProducts();
    }
}

function showAlert(message, type = 'success') {
    const container = document.getElementById('alerts');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// ===== HOME PAGE =====
function renderHomePage() {
    // Use configured statistics if available, otherwise use calculated values
    const stats = settings.statistics || {};
    
    document.getElementById('total-products').textContent = stats.totalProducts !== undefined ? stats.totalProducts : products.length;
    document.getElementById('total-sales').textContent = stats.totalDownloads !== undefined ? stats.totalDownloads : products.reduce((sum, p) => sum + (p.downloads || 0), 0);
    document.getElementById('total-orders').textContent = stats.totalOrders !== undefined ? stats.totalOrders : orders.length;
    document.getElementById('total-users').textContent = stats.totalCustomers !== undefined ? stats.totalCustomers : new Set(orders.map(o => o.email)).size;

    const featured = [...products]
        .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
        .slice(0, 3);
    
    document.getElementById('featured-products').innerHTML = featured.map(renderProductCard).join('');
}

// ===== PRODUCTS =====
function renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    const allButton = '<button class="btn-filter active" onclick="filterProducts(\'all\', this)">All</button>';
    const categoryButtons = categories.map(cat => {
        const displayName = `${cat.flag ? `${cat.flag} ` : ''}${cat.name}`;
        const iconHtml = cat.flag ? '' : `<i class="fas ${cat.icon || 'fa-folder'}"></i> `;
        const safeName = (cat.name || '').replace(/"/g, '&quot;');
        
        return `<button class="btn-filter" data-category="${safeName}" onclick="filterProducts(this.dataset.category, this)">
            ${iconHtml}${displayName}
        </button>`;
    }).join('');
    
    container.innerHTML = allButton + categoryButtons;
}

function renderProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${product.image ? 
                    `<img src="${API_URL}${product.image}" alt="${product.name}">` :
                    `<i class="fas fa-box"></i>`
                }
            </div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-meta">
                    <span><i class="fas fa-download"></i> ${product.downloads || 0}</span>
                    <span><i class="fas fa-folder"></i> ${product.category}</span>
                </div>
                <div class="product-price">$${product.price}</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})" style="flex: 1;">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderProducts() {
    let filtered = products;
    
    if (currentFilter !== 'all') {
        filtered = products.filter(p => p.category === currentFilter);
    }
    
    switch(currentSort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
            break;
        case 'newest':
        default:
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
    }
    
    const container = document.getElementById('products-container');
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px;">
                <i class="fas fa-search fa-4x" style="color: var(--gold); margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="color: var(--gold); margin-bottom: 10px;">No templates found</h3>
                <p style="color: #aaa;">Try a different search or category</p>
            </div>
        `;
    } else {
        container.innerHTML = filtered.map(renderProductCard).join('');
    }
}

function filterProducts(category, button) {
    currentFilter = category;
    
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
    
    renderProducts();
}

function sortProducts(sortType) {
    currentSort = sortType;
    renderProducts();
}

function searchProducts() {
    const searchValue = document.getElementById('search-input').value.trim();
    
    // If search is empty or doesn't match admin password, do normal search
    if (!searchValue || searchValue.length === 0) {
        currentFilter = 'all';
        renderProducts();
        return;
    }
    
    // Normal product search functionality
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!searchTerm) {
        currentFilter = 'all';
        renderProducts();
        return;
    }
    
    const container = document.getElementById('products-container');
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px;">
                <i class="fas fa-search fa-4x" style="color: var(--gold); margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="color: var(--gold); margin-bottom: 10px;">No results for "${searchTerm}"</h3>
                <p style="color: #aaa;">Try a different search term</p>
            </div>
        `;
    } else {
        container.innerHTML = filtered.map(renderProductCard).join('');
    }
    
    showSection('products');
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-title">${product.name}</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                    <div>
                        <div class="product-image" style="height: 350px; border-radius: 15px;">
                            ${product.image ? 
                                `<img src="${API_URL}${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 15px;">` :
                                `<i class="fas fa-box" style="font-size: 96px;"></i>`
                            }
                        </div>
                    </div>
                    <div>
                        <div style="margin-bottom: 20px;">
                            <span style="background: var(--gold); color: var(--black); padding: 8px 20px; border-radius: 25px; font-weight: 700;">
                                ${product.category}
                            </span>
                        </div>
                        <div class="product-price" style="font-size: 42px; margin: 20px 0;">$${product.price}</div>
                        <div style="color: #ccc; margin: 20px 0; line-height: 1.8; font-size: 16px;">${product.description}</div>
                        <div style="background: var(--black); padding: 20px; border-radius: 12px; margin: 25px 0;">
                            <div style="margin-bottom: 10px;"><strong>Downloads:</strong> ${product.downloads || 0}</div>
                            <div style="margin-bottom: 10px;"><strong>File Size:</strong> ${product.fileSize || 'N/A'}</div>
                            <div><strong>Added:</strong> ${new Date(product.createdAt).toLocaleDateString()}</div>
                        </div>
                        <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();" style="width: 100%; padding: 18px; font-size: 18px;">
                            <i class="fas fa-cart-plus"></i> Add to Cart - $${product.price}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('modals').innerHTML = modal;
}

// ===== CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showAlert(`${product.name} added to cart!`);
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 80px 20px;">
                <i class="fas fa-shopping-cart fa-4x" style="color: var(--gold); margin-bottom: 25px; opacity: 0.5;"></i>
                <h3 style="color: var(--gold); margin-bottom: 15px; font-size: 28px;">Your cart is empty</h3>
                <p style="color: #aaa; margin-bottom: 30px;">Add some templates from our catalog</p>
                <button class="btn btn-primary" onclick="showSection('products')" style="padding: 15px 30px; font-size: 16px;">
                    <i class="fas fa-shopping-bag"></i> Browse Templates
                </button>
            </div>
        `;
        totalContainer.innerHTML = '';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * (item.quantity || 1);
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <img src="${item.image ? API_URL + item.image : 'https://via.placeholder.com/90'}" 
                     class="cart-item-image" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price} × ${item.quantity || 1} = $${itemTotal.toFixed(2)}</div>
                    <div style="color: #777; font-size: 14px; margin-top: 5px;">${item.category}</div>
                </div>
                <button class="cart-remove" onclick="removeFromCart(${index})" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    totalContainer.innerHTML = `
        <div class="cart-total">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Network Fee:</span>
                <span>$0.00</span>
            </div>
            <div class="total-row" style="border-top: 3px solid var(--gold); padding-top: 20px; margin-top: 20px; font-size: 24px;">
                <span style="font-weight: 700;">Total:</span>
                <span class="total-amount">$${total.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary" onclick="showPayment()" style="width: 100%; margin-top: 25px; padding: 18px; font-size: 18px;">
                <i class="fas fa-lock"></i> Proceed to Payment
            </button>
        </div>
    `;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    showAlert('Item removed from cart', 'warning');
}

// ===== PAYMENT =====
function showPayment() {
    if (cart.length === 0) {
        showAlert('Your cart is empty!', 'error');
        return;
    }
    
    showSection('payment');
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    document.getElementById('payment-details').innerHTML = `
        <div id="payment-step-1">
            <div style="background: var(--black); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 18px;">
                    <span>Amount to Pay:</span>
                    <span style="font-weight: 700; color: var(--gold);">$${total.toFixed(2)} USDT</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 16px;">
                    <span>Network:</span>
                    <span style="color: var(--gold);">TRON (TRC20)</span>
                </div>
            </div>
            
            <div style="margin: 30px 0;">
                <div class="form-group">
                    <label for="payment-email"><i class="fas fa-envelope"></i> Your Email:</label>
                    <input type="email" id="payment-email" class="form-control" placeholder="your@email.com" required>
                    <small style="color: #aaa; display: block; margin-top: 5px;">We'll send your download link to this email after payment confirmation</small>
                </div>
                <div class="form-group">
                    <label for="payment-telegram"><i class="fab fa-telegram"></i> Your Telegram Username:</label>
                    <input type="text" id="payment-telegram" class="form-control" placeholder="@username or username" required>
                    <small style="color: #aaa; display: block; margin-top: 5px;">Enter your Telegram username (with or without @)</small>
                </div>
                <button class="btn btn-primary" onclick="createOrder()" style="width: 100%; padding: 18px; font-size: 18px;">
                    <i class="fas fa-check-circle"></i> Confirm Order
                </button>
            </div>
        </div>
        
        <div id="payment-step-2" style="display: none;">
            <div style="text-align: center; padding: 30px;">
                <div style="font-size: 96px; color: var(--gold); margin-bottom: 25px;">
                    <i class="fas fa-wallet"></i>
                </div>
                <h3 style="color: var(--gold); margin-bottom: 20px; font-size: 28px;">Send Exactly</h3>
                <div style="font-size: 48px; color: var(--gold); font-weight: 900; margin-bottom: 10px;" id="exact-amount"></div>
                <p style="color: #aaa; margin-bottom: 25px;">to this address:</p>
                <div class="wallet-address" id="display-wallet">${settings.walletAddress || 'Loading...'}</div>
                <div class="qr-code" id="qr-code"></div>
                <button class="btn btn-secondary" onclick="copyWalletAddress()" style="width: 100%; margin-top: 20px; padding: 15px;">
                    <i class="fas fa-copy"></i> Copy Wallet Address
                </button>
                <div class="countdown" id="payment-countdown"></div>
            </div>
            <div id="payment-status" style="text-align: center; margin-top: 30px;"></div>
        </div>
    `;
}

async function createOrder() {
    const email = document.getElementById('payment-email').value.trim();
    const telegram = document.getElementById('payment-telegram').value.trim();
    
    if (!email) {
        showAlert('Please enter your email address', 'error');
        return;
    }
    
    if (!telegram) {
        showAlert('Please enter your Telegram username', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email', 'error');
        return;
    }
    
    // Clean telegram username (remove @ if present)
    const cleanTelegram = telegram.replace(/^@/, '');
    
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const items = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1
    }));
    
    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, telegram: cleanTelegram, items, total })
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('payment-step-1').style.display = 'none';
            document.getElementById('payment-step-2').style.display = 'block';
            document.getElementById('exact-amount').textContent = `$${result.paymentDetails.amount} USDT`;
            document.getElementById('display-wallet').textContent = result.paymentDetails.wallet;
            
            generateQRCode(result.paymentDetails.amount, result.paymentDetails.wallet);
            startPaymentCheck(result.order.id, result.paymentDetails.expiresIn);
            
            showAlert(`Order #${result.order.id} created! Check your email for details.`);
        } else {
            showAlert('Error creating order', 'error');
        }
    } catch (error) {
        showAlert('Network error', 'error');
    }
}

function generateQRCode(amount, wallet) {
    // Generate QR code with TRON USDT payment URI
    // Format: tron:WALLET_ADDRESS?amount=AMOUNT&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
    const qrData = `tron:${wallet}?amount=${amount}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&bgcolor=FFFFFF&color=000000&margin=10`;
    
    document.getElementById('qr-code').innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; padding: 20px; background: #fff; border-radius: 15px; margin: 20px auto; max-width: 320px;">
            <img src="${qrUrl}" 
                 alt="USDT Payment QR Code" 
                 style="width: 100%; height: auto; border-radius: 10px; display: block;">
        </div>
        <p style="color: #aaa; margin-top: 15px; font-size: 14px;">Scan with your TRON wallet app to pay</p>
    `;
}

function copyWalletAddress() {
    const wallet = document.getElementById('display-wallet').textContent;
    navigator.clipboard.writeText(wallet).then(() => {
        showAlert('Wallet address copied to clipboard!');
    });
}

async function startPaymentCheck(orderId, timeoutMinutes) {
    const statusEl = document.getElementById('payment-status');
    const countdownEl = document.getElementById('payment-countdown');
    const expiryTime = Date.now() + (timeoutMinutes * 60 * 1000);
    
    statusEl.innerHTML = `
        <div style="background: rgba(212, 175, 55, 0.1); padding: 25px; border-radius: 15px; border: 2px solid var(--gold);">
            <i class="fas fa-spinner fa-spin" style="font-size: 36px; color: var(--gold); margin-bottom: 15px;"></i>
            <div style="font-size: 18px; color: var(--gold);">Waiting for payment...</div>
            <div style="color: #aaa; margin-top: 10px;">Checking blockchain every 30 seconds</div>
        </div>
    `;
    
    const updateCountdown = () => {
        const timeLeft = expiryTime - Date.now();
        if (timeLeft <= 0) {
            countdownEl.innerHTML = '<span style="color: var(--danger);">⏰ Payment expired</span>';
            return false;
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        countdownEl.innerHTML = `⏱️ Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        return true;
    };
    
    const countdownInterval = setInterval(() => {
        if (!updateCountdown()) {
            clearInterval(countdownInterval);
        }
    }, 1000);
    
    updateCountdown();
    
    const checkInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_URL}/api/orders/${orderId}/check`);
            const result = await response.json();
            
            if (result.paid) {
                clearInterval(checkInterval);
                clearInterval(countdownInterval);
                
                statusEl.innerHTML = `
                    <div style="background: rgba(39, 174, 96, 0.2); padding: 30px; border-radius: 15px; border: 2px solid var(--success);">
                        <i class="fas fa-check-circle" style="font-size: 64px; color: var(--success); margin-bottom: 20px;"></i>
                        <div style="font-size: 24px; color: var(--success); font-weight: 700; margin-bottom: 15px;">Payment Confirmed!</div>
                        <div style="color: #aaa; margin-bottom: 20px;">Files have been sent to your email</div>
                        <div style="margin-top: 25px;">
                            <a href="${result.downloadUrl}" class="btn btn-primary" style="padding: 15px 30px; font-size: 16px;">
                                <i class="fas fa-download"></i> Download Files
                            </a>
                        </div>
                    </div>
                `;
                
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                
                setTimeout(() => showSection('home'), 5000);
            } else if (result.status === 'expired') {
                clearInterval(checkInterval);
                clearInterval(countdownInterval);
                
                statusEl.innerHTML = `
                    <div style="background: rgba(231, 76, 60, 0.2); padding: 25px; border-radius: 15px; border: 2px solid var(--danger);">
                        <i class="fas fa-times-circle" style="font-size: 48px; color: var(--danger); margin-bottom: 15px;"></i>
                        <div style="font-size: 20px; color: var(--danger);">Payment Expired</div>
                        <div style="color: #aaa; margin-top: 10px;">Please create a new order</div>
                    </div>
                `;
            } else {
                // Update countdown with time from server
                if (result.timeLeft !== undefined) {
                    countdownEl.innerHTML = `⏱️ Time left: ${result.timeLeft} minutes`;
                }
            }
        } catch (error) {
            console.error('Payment check error:', error);
        }
    }, 30000); // Check every 30 seconds
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidTronAddress(address) {
    return address.startsWith('T') && address.length === 34;
}

// ===== CONTACTS =====
function renderContacts() {
    updateContactsDisplay();
}

function updateContactsDisplay() {
    if (contacts.ownerName) {
        document.getElementById('owner-name').textContent = contacts.ownerName;
    }
    
    if (contacts.ownerDescription) {
        document.getElementById('owner-description').textContent = contacts.ownerDescription;
    }
    
    if (contacts.ownerPhoto) {
        const photoEl = document.getElementById('owner-photo');
        photoEl.src = API_URL + contacts.ownerPhoto;
        photoEl.style.display = 'block';
    }
    
    if (contacts.about) {
        document.getElementById('owner-about').textContent = contacts.about;
    }
    
    if (contacts.telegram) {
        const telegramLink = document.getElementById('telegram-link');
        telegramLink.href = `https://t.me/${contacts.telegram.replace('@', '')}`;
    }
}

// ===== ADMIN PANEL =====
function checkSecretAdminAccess() {
    const searchValue = document.getElementById('search-input').value.trim();
    
    // Check if the search input contains the admin password
    if (searchValue && searchValue.length > 0) {
        // Try to login with the search value as password
        adminLoginWithPassword(searchValue);
    } else {
        // Normal search functionality
        searchProducts();
    }
}

async function adminLoginWithPassword(password) {
    
    try {
        const settingsData = await fetch(`${API_URL}/api/settings`).then(r => r.json());
        const correctPassword = settingsData.adminPassword || 'admin123';
        
        if (password === correctPassword) {
            isAdmin = true;
            localStorage.setItem('admin_logged_in', 'true');
            await loadData();
            showAdminPanel();
            showAlert('Successfully logged in');
        } else {
            showAlert('Incorrect password!', 'error');
        }
    } catch (error) {
        showAlert('Login error', 'error');
    }
}

function showAdminPanel() {
    showSection('admin-panel');
    showAdminTab('dashboard');
}

function adminLogout() {
    isAdmin = false;
    localStorage.removeItem('admin_logged_in');
    showSection('home');
    showAlert('Logged out', 'warning');
}

function showAdminTab(tabName, button) {
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
    
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    
    // Map tab names to element IDs
    const tabIdMap = {
        'dashboard': 'admin-dashboard',
        'products': 'admin-products',
        'categories': 'admin-categories',
        'orders': 'admin-orders',
        'settings': 'admin-settings',
        'contacts-admin': 'admin-contacts'
    };
    
    const elementId = tabIdMap[tabName] || `admin-${tabName}`;
    document.getElementById(elementId).classList.add('active');
    
    switch(tabName) {
        case 'dashboard':
            loadAdminDashboard();
            break;
        case 'products':
            loadAdminProducts();
            break;
        case 'categories':
            loadAdminCategories();
            break;
        case 'orders':
            loadAdminOrders();
            break;
        case 'settings':
            loadAdminSettings();
            break;
        case 'contacts-admin':
            loadAdminContacts();
            break;
        case 'database':
            loadAdminDatabase();
            break;
    }
}

function loadAdminDashboard() {
    const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.baseAmount, 0);
    
    document.getElementById('admin-dashboard').innerHTML = `
        <h3 style="color: var(--gold); margin-bottom: 30px; font-size: 28px;"><i class="fas fa-chart-bar"></i> Statistics</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-number">${products.length}</span>
                <span class="stat-label">Total Products</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${orders.length}</span>
                <span class="stat-label">Total Orders</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">$${totalRevenue.toFixed(2)}</span>
                <span class="stat-label">Revenue (USDT)</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${products.reduce((sum, p) => sum + (p.downloads || 0), 0)}</span>
                <span class="stat-label">Total Downloads</span>
            </div>
        </div>
    `;
}

function loadAdminProducts() {
    const container = document.getElementById('admin-products');
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h3 style="color: var(--gold); font-size: 24px;"><i class="fas fa-box"></i> Product Management</h3>
            <button class="btn btn-primary" onclick="showAddProductModal()">
                <i class="fas fa-plus"></i> Add Product
            </button>
        </div>
        <div id="admin-products-list"></div>
    `;
    
    renderAdminProductsList();
}

function renderAdminProductsList() {
    const listContainer = document.getElementById('admin-products-list');
    
    if (products.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #aaa; padding: 40px;">No products yet</p>';
        return;
    }
    
    listContainer.innerHTML = `
        <div style="overflow-x: auto;">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Downloads</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(product => `
                        <tr>
                            <td>${product.id}</td>
                            <td>
                                ${product.image ? 
                                    `<img src="${API_URL}${product.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` :
                                    `<div style="width: 60px; height: 60px; background: var(--gray); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-box"></i>
                                    </div>`
                                }
                            </td>
                            <td>${product.name}</td>
                            <td style="color: var(--gold); font-weight: 700;">$${product.price}</td>
                            <td>${product.category}</td>
                            <td>${product.downloads || 0}</td>
                            <td>
                                <button class="btn btn-secondary btn-small" onclick="editProduct(${product.id})" style="margin-right: 5px;">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-small" onclick="deleteProduct(${product.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function showAddProductModal() {
    const categoryOptions = categories.map(cat => 
        `<option value="${cat.name}">${cat.name}</option>`
    ).join('');
    
    const modal = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-title">Add New Product</div>
                <form id="add-product-form">
                    <div class="form-group">
                        <label>Product Name:</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea name="description" class="form-control" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Price (USDT):</label>
                        <input type="number" name="price" class="form-control" step="0.01" min="0" required>
                    </div>
                    <div class="form-group">
                        <label>Category:</label>
                        <select name="category" class="form-control" required>
                            ${categoryOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Product Image:</label>
                        <input type="file" name="productImage" class="form-control" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label>Product File:</label>
                        <input type="file" name="productFile" class="form-control" required>
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button type="button" class="btn btn-primary" onclick="submitProductForm()" style="flex: 1;">
                            <i class="fas fa-plus"></i> Add Product
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modals').innerHTML = modal;
}

async function submitProductForm(isEdit = false, productId = null) {
    const form = document.getElementById(isEdit ? 'edit-product-form' : 'add-product-form');
    const formData = new FormData(form);
    
    try {
        const url = isEdit ? `${API_URL}/api/products/${productId}` : `${API_URL}/api/products`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(isEdit ? 'Product updated successfully!' : 'Product added successfully!');
            closeModal();
            await loadData();
            renderAdminProductsList();
            renderProducts();
            renderHomePage();
            renderCategoryFilters();
        } else {
            showAlert('Error saving product', 'error');
        }
    } catch (error) {
        showAlert('Network error', 'error');
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const categoryOptions = categories.map(cat => 
        `<option value="${cat.name}" ${cat.name === product.category ? 'selected' : ''}>${cat.name}</option>`
    ).join('');
    
    const modal = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-title">Edit Product</div>
                <form id="edit-product-form">
                    <div class="form-group">
                        <label>Product Name:</label>
                        <input type="text" name="name" class="form-control" value="${product.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea name="description" class="form-control" rows="3" required>${product.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Price (USDT):</label>
                        <input type="number" name="price" class="form-control" step="0.01" min="0" value="${product.price}" required>
                    </div>
                    <div class="form-group">
                        <label>Category:</label>
                        <select name="category" class="form-control" required>
                            ${categoryOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Product Image (leave empty to keep current):</label>
                        ${product.image ? `<div style="margin-bottom: 10px;"><img src="${API_URL}${product.image}" style="max-width: 200px; border-radius: 10px;"></div>` : ''}
                        <input type="file" name="productImage" class="form-control" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label>Product File (leave empty to keep current):</label>
                        ${product.fileName ? `<div style="margin-bottom: 10px; color: #aaa;">Current: ${product.fileName}</div>` : ''}
                        <input type="file" name="productFile" class="form-control">
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button type="button" class="btn btn-primary" onclick="submitProductForm(true, ${product.id})" style="flex: 1;">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modals').innerHTML = modal;
}

async function deleteProduct(productId) {
    if (!confirm('Delete this product?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/products/${productId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Product deleted successfully');
            await loadData();
            renderAdminProductsList();
            renderProducts();
            renderHomePage();
        }
    } catch (error) {
        showAlert('Error deleting product', 'error');
    }
}

// ===== CATEGORIES =====
function loadAdminCategories() {
    const container = document.getElementById('admin-categories');
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h3 style="color: var(--gold); font-size: 24px;"><i class="fas fa-folder"></i> Category Management</h3>
            <button class="btn btn-primary" onclick="showAddCategoryModal()">
                <i class="fas fa-plus"></i> Add Category
            </button>
        </div>
        <div class="stats-grid">
            ${categories.map(cat => `
                <div class="stat-card">
                    <div style="font-size: 48px; color: var(--gold); margin-bottom: 15px;">
                        ${cat.flag ? `<span>${cat.flag}</span>` : `<i class="fas ${cat.icon || 'fa-folder'}"></i>`}
                    </div>
                    <div style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">${cat.flag ? `${cat.flag} ${cat.name}` : cat.name}</div>
                    <div style="color: #777; margin-bottom: 20px;">${products.filter(p => p.category === cat.name).length} products</div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="btn btn-secondary btn-small" onclick="editCategory(${cat.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-small" onclick="deleteCategory(${cat.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showAddCategoryModal() {
    const modal = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-title">Add New Category</div>
                <form id="add-category-form">
                    <div class="form-group">
                        <label>Category Name:</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Icon (Font Awesome class):</label>
                        <input type="text" name="icon" class="form-control" placeholder="fa-folder" value="fa-folder" required>
                        <small style="color: #aaa; display: block; margin-top: 5px;">
                            Examples: fa-palette, fa-layer-group, fa-chart-line, fa-mobile-alt
                        </small>
                    </div>
                    <div class="form-group">
                        <label>Flag Emoji (optional):</label>
                        <input type="text" name="flag" class="form-control" placeholder="🇺🇸">
                        <small style="color: #aaa; display: block; margin-top: 5px;">
                            Add a country flag emoji or leave empty for non-country categories.
                        </small>
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button type="button" class="btn btn-primary" onclick="submitCategoryForm()" style="flex: 1;">
                            <i class="fas fa-plus"></i> Add Category
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modals').innerHTML = modal;
}

async function submitCategoryForm(isEdit = false, categoryId = null) {
    const form = document.getElementById(isEdit ? 'edit-category-form' : 'add-category-form');
    const formData = new FormData(form);
    
    const data = {
        name: formData.get('name'),
        icon: formData.get('icon'),
        flag: formData.get('flag') || ''
    };
    
    try {
        const url = isEdit ? `${API_URL}/api/categories/${categoryId}` : `${API_URL}/api/categories`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(isEdit ? 'Category updated!' : 'Category added!');
            closeModal();
            await loadData();
            loadAdminCategories();
            renderCategoryFilters();
        } else {
            showAlert('Error saving category', 'error');
        }
    } catch (error) {
        showAlert('Network error', 'error');
    }
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const modal = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-title">Edit Category</div>
                <form id="edit-category-form">
                    <div class="form-group">
                        <label>Category Name:</label>
                        <input type="text" name="name" class="form-control" value="${category.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Icon (Font Awesome class):</label>
                        <input type="text" name="icon" class="form-control" value="${category.icon}" required>
                        <small style="color: #aaa; display: block; margin-top: 5px;">
                            Examples: fa-palette, fa-layer-group, fa-chart-line, fa-mobile-alt
                        </small>
                    </div>
                    <div class="form-group">
                        <label>Flag Emoji (optional):</label>
                        <input type="text" name="flag" class="form-control" value="${category.flag || ''}" placeholder="🇺🇸">
                        <small style="color: #aaa; display: block; margin-top: 5px;">
                            Use this to show a country flag next to the category name.
                        </small>
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button type="button" class="btn btn-primary" onclick="submitCategoryForm(true, ${category.id})" style="flex: 1;">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.getElementById('modals').innerHTML = modal;
}

async function deleteCategory(categoryId) {
    if (!confirm('Delete this category?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Category deleted');
            await loadData();
            loadAdminCategories();
            renderCategoryFilters();
        }
    } catch (error) {
        showAlert('Error deleting category', 'error');
    }
}

// ===== ORDERS =====
function loadAdminOrders() {
    const container = document.getElementById('admin-orders');
    
    container.innerHTML = `
        <h3 style="color: var(--gold); margin-bottom: 30px; font-size: 24px;"><i class="fas fa-shopping-cart"></i> Orders</h3>
        <div id="orders-list"></div>
    `;
    
    renderOrdersList();
}

function renderOrdersList() {
    const listContainer = document.getElementById('orders-list');
    
    if (orders.length === 0) {
        listContainer.innerHTML = '<p style="text-align: center; color: #aaa; padding: 40px;">No orders yet</p>';
        return;
    }
    
    listContainer.innerHTML = orders.map(order => `
        <div style="background: var(--black); padding: 25px; border-radius: 15px; margin-bottom: 20px; border-left: 5px solid ${order.status === 'paid' ? 'var(--success)' : order.status === 'expired' ? 'var(--danger)' : 'var(--warning)'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <div>
                    <h4 style="color: var(--gold); margin-bottom: 8px; font-size: 20px;">#${order.id}</h4>
                    <div style="color: #aaa; font-size: 14px;">
                        ${new Date(order.createdAt).toLocaleString()} • ${order.email}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 28px; color: var(--gold); font-weight: 900;">$${order.exactAmount || order.baseAmount}</div>
                    <div style="color: #777; font-size: 14px;">${order.customerWallet || 'N/A'}</div>
                </div>
            </div>
            
            <div style="background: var(--black-lighter); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <strong>Status:</strong>
                    <span style="background: ${order.status === 'paid' ? 'var(--success)' : order.status === 'expired' ? 'var(--danger)' : 'var(--warning)'}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700;">
                        ${order.status === 'paid' ? '✅ Paid' : order.status === 'expired' ? '❌ Expired' : '⏳ Pending'}
                    </span>
                </div>
                ${order.paidAt ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong>Paid At:</strong>
                        <span>${new Date(order.paidAt).toLocaleString()}</span>
                    </div>
                ` : ''}
                ${order.txId ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong>TX ID:</strong>
                        <span style="font-family: monospace; font-size: 12px; color: var(--gold);">${order.txId.substring(0, 16)}...</span>
                    </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between;">
                    <strong>Exact Amount:</strong>
                    <span style="color: var(--gold); font-weight: 700;">$${order.exactAmount || order.baseAmount} USDT</span>
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong style="display: block; margin-bottom: 12px;">Items:</strong>
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--gray);">
                        <span>${item.name} × ${item.quantity}</span>
                        <span style="color: var(--gold);">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ===== SETTINGS =====
function loadAdminSettings() {
    document.getElementById('admin-settings').innerHTML = `
        <h3 style="color: var(--gold); margin-bottom: 30px; font-size: 24px;"><i class="fas fa-cog"></i> Shop Settings</h3>
        <form id="settings-form">
            <div class="form-group">
                <label>Shop Name:</label>
                <input type="text" id="setting-shop-name" class="form-control" value="${settings.shopName || ''}">
            </div>
            <div class="form-group">
                <label>USDT Wallet (TRC20):</label>
                <input type="text" id="setting-wallet" class="form-control" value="${settings.walletAddress || ''}">
            </div>
            <div class="form-group">
                <label>Admin Email:</label>
                <input type="email" id="setting-email" class="form-control" value="${settings.adminEmail || ''}">
            </div>
            <div class="form-group">
                <label>Admin Password:</label>
                <input type="password" id="setting-password" class="form-control" placeholder="Leave empty to keep current">
            </div>
            <div class="form-group">
                <label>Logo:</label>
                ${settings.logo ? `<div style="margin-bottom: 10px;"><img src="${API_URL}${settings.logo}" style="max-width: 100px; border-radius: 10px;"></div>` : ''}
                <input type="file" id="setting-logo" class="form-control" accept="image/*">
            </div>
            <div class="form-group">
                <label>Background Image:</label>
                ${settings.backgroundImage ? `<div style="margin-bottom: 10px;"><img src="${API_URL}${settings.backgroundImage}" style="max-width: 200px; border-radius: 10px;"></div>` : ''}
                <input type="file" id="setting-background" class="form-control" accept="image/*">
            </div>
            
            <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid var(--gold);">
                <h3 style="color: var(--gold); margin-bottom: 25px; font-size: 22px;"><i class="fas fa-chart-line"></i> Home Page Statistics</h3>
                <p style="color: #aaa; margin-bottom: 20px;">Configure the statistics displayed on the home page. Leave empty to use automatic calculation.</p>
                
                <div class="form-group">
                    <label>Total Downloads:</label>
                    <input type="number" id="setting-total-downloads" class="form-control" value="${settings.statistics?.totalDownloads || ''}" placeholder="Auto-calculated if empty" min="0">
                    <small style="color: #aaa; display: block; margin-top: 5px;">Leave empty to auto-calculate from product downloads</small>
                </div>
                <div class="form-group">
                    <label>Total Orders:</label>
                    <input type="number" id="setting-total-orders" class="form-control" value="${settings.statistics?.totalOrders || ''}" placeholder="Auto-calculated if empty" min="0">
                    <small style="color: #aaa; display: block; margin-top: 5px;">Leave empty to auto-calculate from orders</small>
                </div>
                <div class="form-group">
                    <label>Total Customers:</label>
                    <input type="number" id="setting-total-customers" class="form-control" value="${settings.statistics?.totalCustomers || ''}" placeholder="Auto-calculated if empty" min="0">
                    <small style="color: #aaa; display: block; margin-top: 5px;">Leave empty to auto-calculate from unique emails</small>
                </div>
            </div>
            
            <button type="button" class="btn btn-primary" onclick="saveSettings()" style="width: 100%; padding: 15px; margin-top: 30px;">
                <i class="fas fa-save"></i> Save Settings
            </button>
        </form>
    `;
}

async function saveSettings() {
    const updatedSettings = {
        shopName: document.getElementById('setting-shop-name').value,
        walletAddress: document.getElementById('setting-wallet').value,
        adminEmail: document.getElementById('setting-email').value
    };
    
    const newPassword = document.getElementById('setting-password').value;
    if (newPassword) {
        updatedSettings.adminPassword = newPassword;
    }
    
    // Save statistics configuration
    const totalDownloads = document.getElementById('setting-total-downloads').value.trim();
    const totalOrders = document.getElementById('setting-total-orders').value.trim();
    const totalCustomers = document.getElementById('setting-total-customers').value.trim();
    
    updatedSettings.statistics = {
        totalDownloads: totalDownloads ? parseInt(totalDownloads) : undefined,
        totalOrders: totalOrders ? parseInt(totalOrders) : undefined,
        totalCustomers: totalCustomers ? parseInt(totalCustomers) : undefined
    };
    
    try {
        const response = await fetch(`${API_URL}/api/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSettings)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Upload logo if selected
            const logoFile = document.getElementById('setting-logo').files[0];
            if (logoFile) {
                const logoData = new FormData();
                logoData.append('logo', logoFile);
                await fetch(`${API_URL}/api/upload-logo`, {
                    method: 'POST',
                    body: logoData
                });
            }
            
            // Upload background if selected
            const bgFile = document.getElementById('setting-background').files[0];
            if (bgFile) {
                const bgData = new FormData();
                bgData.append('backgroundImage', bgFile);
                await fetch(`${API_URL}/api/upload-background`, {
                    method: 'POST',
                    body: bgData
                });
            }
            
            showAlert('Settings saved successfully!');
            await loadData();
            loadAdminSettings();
            renderHomePage(); // Update home page statistics
        } else {
            showAlert('Error saving settings', 'error');
        }
    } catch (error) {
        showAlert('Network error', 'error');
    }
}

// ===== DATABASE ADMIN =====
async function loadAdminDatabase() {
    try {
        const response = await fetch(`${API_URL}/api/customers`);
        const customers = await response.json();
        
        const totalCustomers = customers.length;
        const uniqueEmails = new Set(customers.map(c => c.email)).size;
        const uniqueTelegrams = new Set(customers.map(c => c.telegram).filter(t => t)).size;
        
        document.getElementById('admin-database').innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h3 style="color: var(--gold); font-size: 24px;"><i class="fas fa-database"></i> Customer Database</h3>
                <div style="display: flex; gap: 15px;">
                    <button class="btn btn-secondary" onclick="exportCustomersCSV()">
                        <i class="fas fa-download"></i> Export CSV
                    </button>
                    <button class="btn btn-secondary" onclick="exportCustomersJSON()">
                        <i class="fas fa-file-code"></i> Export JSON
                    </button>
                </div>
            </div>
            
            <div class="stats-grid" style="margin-bottom: 30px;">
                <div class="stat-card">
                    <div style="font-size: 48px; color: var(--gold); margin-bottom: 15px;">
                        <i class="fas fa-users"></i>
                    </div>
                    <div style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">Total Customers</div>
                    <div style="color: #777; font-size: 32px; font-weight: 700;">${totalCustomers}</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 48px; color: var(--gold); margin-bottom: 15px;">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">Unique Emails</div>
                    <div style="color: #777; font-size: 32px; font-weight: 700;">${uniqueEmails}</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 48px; color: var(--gold); margin-bottom: 15px;">
                        <i class="fab fa-telegram"></i>
                    </div>
                    <div style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">Unique Telegrams</div>
                    <div style="color: #777; font-size: 32px; font-weight: 700;">${uniqueTelegrams}</div>
                </div>
            </div>
            
            <div style="background: var(--black-lighter); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                    <input type="text" id="database-search" class="form-control" placeholder="Search by email or telegram..." style="flex: 1;" onkeyup="filterCustomers()">
                    <select id="database-sort" class="form-control" style="width: 200px;" onchange="filterCustomers()">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="email">Sort by Email</option>
                        <option value="telegram">Sort by Telegram</option>
                    </select>
                </div>
            </div>
            
            <div style="background: var(--black-lighter); padding: 20px; border-radius: 12px; overflow-x: auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Telegram</th>
                            <th>First Order</th>
                            <th>Total Orders</th>
                            <th>Total Spent</th>
                        </tr>
                    </thead>
                    <tbody id="customers-table-body">
                        ${customers.length === 0 ? `
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 40px; color: #777;">
                                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                                    No customers yet
                                </td>
                            </tr>
                        ` : customers.map((customer, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${customer.email}</td>
                                <td>${customer.telegram ? `@${customer.telegram}` : 'N/A'}</td>
                                <td>${new Date(customer.firstOrderDate).toLocaleDateString()}</td>
                                <td>${customer.orderCount || 0}</td>
                                <td>$${(customer.totalSpent || 0).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        document.getElementById('admin-database').innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--danger);">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 15px;"></i>
                <p>Error loading customer database</p>
            </div>
        `;
    }
}

function filterCustomers() {
    const searchTerm = document.getElementById('database-search')?.value.toLowerCase() || '';
    const sortBy = document.getElementById('database-sort')?.value || 'newest';
    
    // This would need to be implemented with a full reload or client-side filtering
    // For now, just reload the database tab
    loadAdminDatabase();
}

function exportCustomersCSV() {
    fetch(`${API_URL}/api/customers/export?format=csv`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showAlert('CSV file downloaded successfully!');
        })
        .catch(error => {
            showAlert('Error exporting CSV', 'error');
        });
}

function exportCustomersJSON() {
    fetch(`${API_URL}/api/customers/export?format=json`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `customers_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showAlert('JSON file downloaded successfully!');
        })
        .catch(error => {
            showAlert('Error exporting JSON', 'error');
        });
}

// ===== CONTACT ADMIN =====
function loadAdminContacts() {
    document.getElementById('admin-contacts').innerHTML = `
        <h3 style="color: var(--gold); margin-bottom: 30px; font-size: 24px;"><i class="fas fa-user"></i> Contact Information</h3>
        <form id="contacts-form" class="admin-contact-grid">
            <div class="form-group">
                <label>Your Name:</label>
                <input type="text" id="contact-admin-name" class="form-control" value="${contacts.ownerName || ''}">
            </div>
            <div class="form-group">
                <label>Telegram Username:</label>
                <input type="text" id="contact-admin-telegram" class="form-control" value="${contacts.telegram || ''}" placeholder="John_refund">
            </div>
            <div class="form-group">
                <label>Description:</label>
                <textarea id="contact-admin-description" class="form-control contact-textarea" rows="5">${contacts.ownerDescription || ''}</textarea>
            </div>
            <div class="form-group">
                <label>About Text:</label>
                <textarea id="contact-admin-about" class="form-control contact-textarea" rows="7">${contacts.about || ''}</textarea>
            </div>
            <div class="form-group contact-photo-card">
                <label>Your Photo:</label>
                ${contacts.ownerPhoto ? `<div style="margin-bottom: 12px;"><img src="${API_URL}${contacts.ownerPhoto}" class="contact-photo-preview"></div>` : ''}
                <input type="file" id="contact-admin-photo" class="form-control contact-photo-input" accept="image/*">
                <small style="color: #aaa; display: block; margin-top: 8px;">Use a clear, high-resolution image. Square images look best.</small>
            </div>
            <div style="grid-column: span 2;">
                <button type="button" class="btn btn-primary" onclick="saveContactSettings()" style="width: 100%; padding: 15px;">
                    <i class="fas fa-save"></i> Save Contact Info
                </button>
            </div>
        </form>
    `;
}

async function saveContactSettings() {
    const formData = new FormData();
    formData.append('ownerName', document.getElementById('contact-admin-name').value);
    formData.append('ownerDescription', document.getElementById('contact-admin-description').value);
    formData.append('about', document.getElementById('contact-admin-about').value);
    formData.append('telegram', document.getElementById('contact-admin-telegram').value);
    
    const photoFile = document.getElementById('contact-admin-photo').files[0];
    if (photoFile) {
        formData.append('ownerPhoto', photoFile);
    }
    
    try {
        const response = await fetch(`${API_URL}/api/contacts`, {
            method: 'PUT',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert('Contact info saved!');
            await loadData();
            loadAdminContacts();
            updateContactsDisplay();
        } else {
            showAlert('Error saving contact info', 'error');
        }
    } catch (error) {
        showAlert('Network error', 'error');
    }
}

// ===== UTILITIES =====
function closeModal() {
    document.getElementById('modals').innerHTML = '';
}

console.log('🚀 JOHN\'S LAB TEMPLATES ready!');
