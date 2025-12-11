// app.js
document.addEventListener('DOMContentLoaded', function() {
    // Глобальні змінні
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = [];
    let currentAdminTab = 'products';
    
    // Ініціалізація
    init();
    
    function init() {
        updateCartCount();
        loadProducts();
        renderCart();
        setupEventListeners();
        
        // Перевірка адміна
        checkAdminSession();
    }
    
    function setupEventListeners() {
        // Пошук
        document.querySelector('.search-btn').addEventListener('click', searchProducts);
        document.getElementById('search-input').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchProducts();
        });
        
        // Кнопки навігації
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.getAttribute('data-section');
                showSection(section);
            });
        });
        
        // Адмін таби
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                showAdminTab(tabName);
            });
        });
        
        // Модальні вікна
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.closest('.modal').classList.remove('active');
            });
        });
        
        // Завантаження продуктів при показі секції товарів
        document.getElementById('products').addEventListener('click', function() {
            loadProducts();
        });
    }
    
    // === ФУНКЦІОНАЛ СЕКЦІЙ ===
    function showSection(sectionId) {
        // Приховуємо всі секції
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Показуємо потрібну секцію
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Оновлюємо URL
            window.location.hash = sectionId;
            
            // Оновлюємо активну кнопку навігації
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-section') === sectionId) {
                    btn.classList.add('active');
                }
            });
        }
    }
    
    // === ФУНКЦІОНАЛ ТОВАРІВ ===
    async function loadProducts() {
        try {
            const response = await fetch('/api/products');
            products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Помилка завантаження товарів:', error);
            // Тестові дані
            products = [
                {
                    id: 1,
                    name: "Шаблон веб-сайту преміум",
                    price: 50,
                    category: "Веб-шаблони",
                    description: "Професійний шаблон сайту з адаптивним дизайном",
                    image: "",
                    active: true
                },
                {
                    id: 2,
                    name: "Логотип бренду",
                    price: 30,
                    category: "Дизайн",
                    description: "Унікальний логотип в векторному форматі",
                    image: "",
                    active: true
                }
            ];
            renderProducts(products);
        }
    }
    
    function renderProducts(productsList) {
        const container = document.getElementById('products-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (productsList.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="grid-column: 1/-1; padding: 40px;">
                    <i class="fas fa-box-open fa-3x text-gold mb-20"></i>
                    <h3>Товари не знайдені</h3>
                    <p>Спробуйте змінити критерії пошуку</p>
                </div>
            `;
            return;
        }
        
        productsList.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                ${product.sales > 10 ? '<div class="product-badge">Популярний</div>' : ''}
                <div class="product-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" loading="lazy">` : 
                        `<i class="fas fa-box"></i>`
                    }
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category || 'Інше'}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description || ''}</p>
                    <div class="product-price">${product.price} USDT</div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> До кошика
                        </button>
                        <button class="btn" onclick="viewProductDetails(${product.id})">
                            <i class="fas fa-info-circle"></i> Деталі
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(productCard);
        });
    }
    
    function searchProducts() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }
    
    // === ФУНКЦІОНАЛ КОШИКА ===
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        
        saveCart();
        updateCartCount();
        alert(`${product.name} додано в кошик!`);
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        renderCart();
    }
    
    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                removeFromCart(productId);
                return;
            }
            saveCart();
            renderCart();
        }
    }
    
    function renderCart() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        
        if (!container) return;
        
        if (cart.length === 0) {
            container.innerHTML = `
                <div class="text-center" style="padding: 40px;">
                    <i class="fas fa-shopping-cart fa-3x text-gold mb-20"></i>
                    <h3>Кошик порожній</h3>
                    <p>Додайте товари з каталогу</p>
                    <button class="btn btn-primary" onclick="showSection('products')">
                        Перейти до товарів
                    </button>
                </div>
            `;
            totalEl.innerHTML = '';
            return;
        }
        
        let html = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="text-gold">${item.price} USDT × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <div style="min-width: 80px; text-align: right;">
                            <strong>${itemTotal} USDT</strong>
                        </div>
                        <button class="btn btn-danger" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        totalEl.innerHTML = `
            <div class="cart-total">
                <h3>Загальна сума:</h3>
                <div class="total-amount">${total.toFixed(2)} USDT</div>
                <button class="btn btn-primary mt-20" onclick="showCheckoutModal()">
                    <i class="fas fa-lock"></i> Оформити замовлення
                </button>
            </div>
        `;
    }
    
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function updateCartCount() {
        const countElement = document.getElementById('cart-count');
        if (countElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            countElement.textContent = totalItems;
        }
    }
    
    // === ОФОРМЛЕННЯ ЗАМОВЛЕННЯ ===
    function showCheckoutModal() {
        if (cart.length === 0) {
            alert('Кошик порожній!');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const modalContent = `
            <div class="modal-header">
                <h2>Оформлення замовлення</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="form-group">
                <label>Ваш email:</label>
                <input type="email" id="order-email" class="form-control" 
                       placeholder="example@email.com" required>
            </div>
            <div class="form-group">
                <label>Адреса гаманця USDT (TRC20):</label>
                <input type="text" id="usdt-wallet" class="form-control" 
                       placeholder="TXXXXXXXXXXXXXXXXXXXXXXXXXX" required>
            </div>
            <div class="form-group">
                <label>Додаткові побажання:</label>
                <textarea id="order-notes" class="form-control" 
                          placeholder="Ваші побажання..."></textarea>
            </div>
            <div style="background: var(--black); padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4>Деталі замовлення:</h4>
                ${cart.map(item => `
                    <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${item.price * item.quantity} USDT</span>
                    </div>
                `).join('')}
                <hr style="border-color: var(--gold); margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                    <span>Разом:</span>
                    <span class="text-gold">${total} USDT</span>
                </div>
            </div>
            <button class="btn btn-primary" style="width: 100%;" onclick="processOrder()">
                <i class="fas fa-check"></i> Підтвердити замовлення
            </button>
        `;
        
        document.getElementById('modal-content').innerHTML = modalContent;
        document.getElementById('checkout-modal').classList.add('active');
    }
    
    async function processOrder() {
        const email = document.getElementById('order-email').value;
        const wallet = document.getElementById('usdt-wallet').value;
        const notes = document.getElementById('order-notes').value;
        
        if (!email || !wallet) {
            alert('Будь ласка, заповніть обов\'язкові поля');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderData = {
            email,
            wallet,
            notes,
            total,
            items: cart,
            date: new Date().toISOString()
        };
        
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Показуємо деталі оплати
                showPaymentDetails(total, wallet, result.order.id);
                
                // Очищаємо кошик
                cart = [];
                saveCart();
                updateCartCount();
            } else {
                alert('Помилка при створенні замовлення');
            }
        } catch (error) {
            console.error('Помилка:', error);
            // Локальне збереження замовлення
            showPaymentDetails(total, wallet, 'LOCAL-' + Date.now());
            cart = [];
            saveCart();
            updateCartCount();
        }
    }
    
    function showPaymentDetails(amount, wallet, orderId) {
        const modalContent = `
            <div class="modal-header">
                <h2>Деталі оплати</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 48px; color: var(--gold); margin: 20px 0;">
                    <i class="fas fa-coins"></i>
                </div>
                <h3 class="text-gold">ID замовлення: ${orderId}</h3>
                <p>Сплатіть: <strong style="font-size: 24px;">${amount} USDT</strong></p>
                <p>на адресу:</p>
                <div style="background: var(--black); padding: 15px; border-radius: 8px; 
                           margin: 15px 0; font-family: monospace; word-break: break-all;">
                    ${wallet}
                </div>
                <p>Після оплати файли будуть відправлені на вашу email адресу</p>
                <div class="mt-20">
                    <button class="btn btn-primary" onclick="copyWalletAddress('${wallet}')">
                        <i class="fas fa-copy"></i> Копіювати адресу
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('modal-content').innerHTML = modalContent;
    }
    
    function copyWalletAddress(wallet) {
        navigator.clipboard.writeText(wallet).then(() => {
            alert('Адресу скопійовано в буфер обміну!');
        });
    }
    
    // === АДМІН ПАНЕЛЬ ===
    function checkAdminSession() {
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            showAdminPanel();
        }
    }
    
    function adminLogin() {
        const password = document.getElementById('admin-password').value;
        const correctPassword = 'admin123'; // Тимчасовий пароль
        
        if (password === correctPassword) {
            localStorage.setItem('adminLoggedIn', 'true');
            showAdminPanel();
            showAdminTab('products');
        } else {
            alert('Невірний пароль!');
        }
    }
    
    function adminLogout() {
        localStorage.removeItem('adminLoggedIn');
        document.getElementById('admin-panel').classList.add('hidden');
        document.getElementById('admin-login').classList.remove('hidden');
        document.getElementById('admin-password').value = '';
    }
    
    function showAdminPanel() {
        document.getElementById('admin-login').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        loadAdminProducts();
    }
    
    function showAdminTab(tabName) {
        currentAdminTab = tabName;
        
        // Оновлюємо активний таб
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            }
        });
        
        // Показуємо відповідний контент
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.add('hidden');
            if (content.id === `admin-${tabName}`) {
                content.classList.remove('hidden');
            }
        });
    }
    
    async function loadAdminProducts() {
        try {
            const response = await fetch('/api/products');
            products = await response.json();
            renderAdminProducts();
        } catch (error) {
            console.error('Помилка завантаження товарів:', error);
        }
    }
    
    function renderAdminProducts() {
        const container = document.getElementById('admin-products-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        products.forEach(product => {
            const productRow = document.createElement('div');
            productRow.className = 'product-row';
            productRow.innerHTML = `
                <div>
                    <h4>${product.name}</h4>
                    <p>${product.price} USDT • ${product.category} • 
                       Продажі: ${product.sales || 0}</p>
                </div>
                <div class="product-row-actions">
                    <button class="btn btn-primary" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            container.appendChild(productRow);
        });
    }
    
    function showAddProductModal() {
        const modalContent = `
            <div class="modal-header">
                <h2>Додати новий товар</h2>
                <button class="modal-close">&times;</button>
            </div>
            <form id="add-product-form" enctype="multipart/form-data">
                <div class="form-group">
                    <label>Назва товару:</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Ціна (USDT):</label>
                    <input type="number" name="price" class="form-control" 
                           step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label>Категорія:</label>
                    <input type="text" name="category" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Опис:</label>
                    <textarea name="description" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Зображення товару:</label>
                    <input type="file" name="productImage" class="form-control" 
                           accept="image/*">
                </div>
                <div class="form-group">
                    <label>Файл товару (PDF, ZIP, PSD тощо):</label>
                    <input type="file" name="productFile" class="form-control" 
                           accept=".pdf,.zip,.psd,.ai,.eps">
                </div>
                <button type="button" class="btn btn-primary" onclick="submitProductForm()">
                    <i class="fas fa-plus"></i> Додати товар
                </button>
            </form>
        `;
        
        document.getElementById('modal-content').innerHTML = modalContent;
        document.getElementById('admin-modal').classList.add('active');
    }
    
    async function submitProductForm() {
        const form = document.getElementById('add-product-form');
        const formData = new FormData(form);
        
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Товар успішно додано!');
                document.getElementById('admin-modal').classList.remove('active');
                loadAdminProducts();
            } else {
                alert('Помилка при додаванні товару');
            }
        } catch (error) {
            console.error('Помилка:', error);
            alert('Помилка при додаванні товару');
        }
    }
    
    function editProduct(productId) {
        // Реалізація редагування товару
        alert('Редагування товару (ID: ' + productId + ')');
    }
    
    function deleteProduct(productId) {
        if (confirm('Видалити цей товар?')) {
            // Тут буде запит на видалення
            alert('Товар видалено (ID: ' + productId + ')');
        }
    }
    
    // Експорт функцій в глобальну область видимості
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateQuantity = updateQuantity;
    window.showSection = showSection;
    window.showCheckoutModal = showCheckoutModal;
    window.processOrder = processOrder;
    window.copyWalletAddress = copyWalletAddress;
    window.adminLogin = adminLogin;
    window.adminLogout = adminLogout;
    window.showAddProductModal = showAddProductModal;
    window.showAdminTab = showAdminTab;
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
    window.submitProductForm = submitProductForm;
});
