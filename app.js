// ===== CONFIGURATION =====
const API_URL = window.location.origin;

// ===== TRANSLATIONS =====
const translations = {
    en: {
        // Navigation
        navHome: 'Home',
        navShop: 'Shop',
        navCart: 'Cart',
        navContact: 'Contact',
        searchPlaceholder: 'Search templates...',
        
        // Home Section
        heroSubtitle: 'Premium digital templates for modern businesses. High-quality designs, instant delivery via USDT.',
        exploreTemplates: 'Explore Templates',
        templates: 'Templates',
        downloads: 'Downloads',
        visitors: 'Visitors',
        orders: 'Orders',
        customers: 'Customers',
        browseByCategory: 'Browse by Category',
        featuredTemplates: 'Featured Templates',
        
        // Products Section
        templateCatalog: 'Template Catalog',
        all: 'All',
        newestFirst: 'Newest First',
        priceLow: 'Price: Low to High',
        priceHigh: 'Price: High to Low',
        mostPopular: 'Most Popular',
        addToCart: 'Add to Cart',
        viewDetails: 'View Details',
        price: 'Price',
        category: 'Category',
        countries: 'Countries',
        
        // Cart Section
        shoppingCart: 'Shopping Cart',
        cartEmpty: 'Your cart is empty',
        total: 'Total',
        checkout: 'Checkout',
        remove: 'Remove',
        continueShopping: 'Continue Shopping',
        
        // Payment Section
        usdtPayment: 'USDT Payment',
        paymentDetails: 'Payment Details',
        orderTotal: 'Order Total',
        paymentInstructions: 'Payment Instructions',
        sendPayment: 'Send Payment',
        backToCart: 'Back to Cart',
        
        // MRZ Generator
        mrzGenerator: 'MRZ Generator',
        mrzDescription: 'Generate Machine Readable Zone (MRZ) codes for passports and ID cards. Fill in the required information below to generate accurate MRZ codes that meet international standards.',
        documentInformation: 'Document Information',
        documentType: 'Document Type',
        passport: 'Passport',
        idCard: 'ID Card',
        country: 'Country',
        chooseCountry: 'Choose Country',
        sex: 'Sex',
        female: 'Female',
        male: 'Male',
        unspecified: 'Unspecified',
        firstName: 'First Name',
        lastName: 'Last Name',
        surName: 'Sur Name (Optional)',
        birthYear: 'Birth Year',
        birthMonth: 'Birth Month',
        birthDay: 'Birth Day',
        expiryYear: 'Expiry Year',
        expiryMonth: 'Expiry Month',
        expiryDay: 'Expiry Day',
        documentNumber: 'Document Number',
        optionalCode: 'Optional Code',
        generateMRZ: 'Generate MRZ',
        mrzResults: 'MRZ Results',
        copy: 'Copy',
        copyMRZCode: 'Copy MRZ Code',
        controlDigit: 'Control Digit',
        controlDigitGenerator: 'Control Digit Generator',
        generateControlDigit: 'Generate Control Digit',
        inputString: 'Input String',
        calculate: 'Calculate',
        fillFormAndGenerate: 'Fill in the form and click "Generate MRZ" to see results here',
        oneCheckDigitAtEnd: 'One check digit at the end',
        moveToSecondLine: 'Move to the second line',
        
        // Barcode Generator
        barcodeGenerator: 'Barcode Generator',
        barcodeDescription: 'Generate PDF417 and Code128 barcodes for driver licenses and ID cards. Supports USA and Canada formats.',
        personalInfo: 'Personal Information',
        middleName: 'Middle Name',
        otherCountry: 'Other Country',
        city: 'City',
        street: 'Street',
        birthDate: 'Birth Date',
        issueDate: 'Issue Date',
        expiryDate: 'Expiry Date',
        
        // Contact Section
        contact: 'Contact',
        contactOnTelegram: 'Contact on Telegram',
        premiumCreator: 'Premium digital templates creator',
        
        // Footer
        footerTagline: 'Premium digital templates for USDT',
        footerCopyright: '© 2024 JOHN\'S LAB TEMPLATES. All rights reserved.',
        
        // Admin
        dashboard: 'Dashboard',
        adminOrders: 'Orders',
        adminContactInfo: 'Contact Info',
        adminSettings: 'Settings',
        
        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        close: 'Close',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        update: 'Update',
        notFound: 'not found',
        tryDifferentSearch: 'Try a different search or category',
        addTemplatesFromCatalog: 'Add some templates from our catalog'
    },
    uk: {
        // Navigation
        navHome: 'Головна',
        navShop: 'Магазин',
        navCart: 'Кошик',
        navContact: 'Контакти',
        searchPlaceholder: 'Пошук шаблонів...',
        
        // Home Section
        heroSubtitle: 'Преміальні цифрові шаблони для сучасного бізнесу. Високоякісні дизайни, миттєва доставка через USDT.',
        exploreTemplates: 'Переглянути шаблони',
        templates: 'Шаблони',
        downloads: 'Завантажень',
        visitors: 'Відвідувачів',
        orders: 'Замовлень',
        customers: 'Клієнтів',
        browseByCategory: 'Перегляд за категоріями',
        featuredTemplates: 'Рекомендовані шаблони',
        
        // Products Section
        templateCatalog: 'Каталог шаблонів',
        all: 'Всі',
        newestFirst: 'Спочатку нові',
        priceLow: 'Ціна: від низької до високої',
        priceHigh: 'Ціна: від високої до низької',
        mostPopular: 'Найпопулярніші',
        addToCart: 'Додати в кошик',
        viewDetails: 'Деталі',
        price: 'Ціна',
        category: 'Категорія',
        countries: 'Країни',
        
        // Cart Section
        shoppingCart: 'Кошик',
        cartEmpty: 'Ваш кошик порожній',
        total: 'Всього',
        checkout: 'Оформити замовлення',
        remove: 'Видалити',
        continueShopping: 'Продовжити покупки',
        
        // Payment Section
        usdtPayment: 'Оплата USDT',
        paymentDetails: 'Деталі оплати',
        orderTotal: 'Сума замовлення',
        paymentInstructions: 'Інструкції з оплати',
        sendPayment: 'Відправити платіж',
        backToCart: 'Назад до кошика',
        
        // User Account
        login: 'Вхід',
        register: 'Реєстрація',
        logout: 'Вихід',
        myAccount: 'Мій акаунт',
        createAccount: 'Створити акаунт',
        registerDescription: 'Створіть акаунт, щоб отримати доступ до всіх ваших покупок та завантажувати файли в будь-який час',
        alreadyHaveAccount: 'Вже є акаунт?',
        loginHere: 'Увійти тут',
        loginDescription: 'Увійдіть, щоб отримати доступ до вашого акаунту та завантажити покупки',
        dontHaveAccount: 'Немає акаунту?',
        registerHere: 'Зареєструватися тут',
        fullName: "Повне ім'я",
        email: 'Електронна пошта',
        password: 'Пароль',
        confirmPassword: 'Підтвердити пароль',
        passwordMinLength: 'Мінімум 6 символів',
        accountInformation: 'Інформація про акаунт',
        memberSince: 'Учасник з',
        purchaseHistory: 'Історія покупок',
        noOrdersYet: 'Поки що немає замовлень. Почніть покупки!',
        loading: 'Завантаження...',
        downloadFile: 'Завантажити файл',
        orderDate: 'Дата замовлення',
        orderTotal: 'Сума замовлення',
        
        // MRZ Generator
        mrzGenerator: 'Генератор MRZ',
        mrzDescription: 'Генеруйте коди машинно-читабельної зони (MRZ) для паспортів та посвідчень особи. Заповніть необхідну інформацію нижче для генерації точних MRZ кодів, що відповідають міжнародним стандартам.',
        documentInformation: 'Інформація про документ',
        documentType: 'Тип документа',
        passport: 'Паспорт',
        idCard: 'Посвідчення особи',
        country: 'Країна',
        chooseCountry: 'Виберіть країну',
        sex: 'Стать',
        female: 'Жіноча',
        male: 'Чоловіча',
        unspecified: 'Не вказано',
        firstName: 'Ім\'я',
        lastName: 'Прізвище',
        surName: 'По батькові (необов\'язково)',
        birthYear: 'Рік народження',
        birthMonth: 'Місяць народження',
        birthDay: 'День народження',
        expiryYear: 'Рік закінчення',
        expiryMonth: 'Місяць закінчення',
        expiryDay: 'День закінчення',
        documentNumber: 'Номер документа',
        optionalCode: 'Додатковий код',
        generateMRZ: 'Згенерувати MRZ',
        mrzResults: 'Результати MRZ',
        copy: 'Копіювати',
        copyMRZCode: 'Копіювати MRZ код',
        controlDigit: 'Контрольна цифра',
        controlDigitGenerator: 'Генератор контрольних цифр',
        generateControlDigit: 'Згенерувати контрольну цифру',
        inputString: 'Вхідний рядок',
        calculate: 'Обчислити',
        fillFormAndGenerate: 'Заповніть форму та натисніть "Згенерувати MRZ", щоб побачити результати тут',
        oneCheckDigitAtEnd: 'Одна контрольна цифра в кінці',
        moveToSecondLine: 'Перемістити на другий рядок',
        
        // Barcode Generator
        barcodeGenerator: 'Генератор штрих-кодів',
        barcodeDescription: 'Генеруйте PDF417 та Code128 штрих-коди для водійських посвідчень та посвідчень особи. Підтримує формати USA та Canada.',
        personalInfo: 'Особиста інформація',
        middleName: 'По батькові',
        otherCountry: 'Інша країна',
        city: 'Місто',
        street: 'Вулиця',
        birthDate: 'Дата народження',
        issueDate: 'Дата видачі',
        expiryDate: 'Дата закінчення',
        
        // Contact Section
        contact: 'Контакти',
        contactOnTelegram: 'Зв\'язатися в Telegram',
        premiumCreator: 'Створювач преміальних цифрових шаблонів',
        
        // Footer
        footerTagline: 'Преміальні цифрові шаблони для USDT',
        footerCopyright: '© 2024 JOHN\'S LAB TEMPLATES. Всі права захищені.',
        
        // Admin
        dashboard: 'Панель управління',
        adminOrders: 'Замовлення',
        adminContactInfo: 'Контактна інформація',
        adminSettings: 'Налаштування',
        
        // Common
        loading: 'Завантаження...',
        error: 'Помилка',
        success: 'Успіх',
        close: 'Закрити',
        save: 'Зберегти',
        cancel: 'Скасувати',
        delete: 'Видалити',
        edit: 'Редагувати',
        add: 'Додати',
        update: 'Оновити',
        notFound: 'не знайдено',
        tryDifferentSearch: 'Спробуйте інший пошук або категорію',
        addTemplatesFromCatalog: 'Додайте шаблони з нашого каталогу'
    }
};

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
let currentLanguage = localStorage.getItem('language') || 'en';

// ===== TRANSLATION FUNCTIONS =====
function t(key) {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        applyTranslations();
        updateLanguageSelector();
        updateSiteSettings();
        // Re-render home page to update language-specific settings
        if (document.getElementById('home')?.classList.contains('active')) {
            renderHomePage();
        }
    }
}

function applyTranslations() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.tagName === 'INPUT' && el.type === 'text' && el.hasAttribute('placeholder')) {
            el.placeholder = t(key);
        } else if (el.tagName === 'INPUT' && el.type === 'submit') {
            el.value = t(key);
        } else if (el.tagName === 'OPTION') {
            // Options are handled separately
        } else {
            el.textContent = t(key);
        }
    });
    
    // Update option elements with data-i18n attribute
    document.querySelectorAll('option[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    
    // Update elements with data-i18n-html attribute (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        el.innerHTML = t(key);
    });
    
    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // Update sort select options
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        const currentValue = sortSelect.value;
        sortSelect.innerHTML = `
            <option value="newest">${t('newestFirst')}</option>
            <option value="price-low">${t('priceLow')}</option>
            <option value="price-high">${t('priceHigh')}</option>
            <option value="popular">${t('mostPopular')}</option>
        `;
        sortSelect.value = currentValue;
    }
    
    // Update MRZ type select options
    const mrzTypeSelect = document.getElementById('mrz-type');
    if (mrzTypeSelect) {
        const currentValue = mrzTypeSelect.value;
        mrzTypeSelect.innerHTML = `
            <option value="1">${t('passport')}</option>
            <option value="2">${t('idCard')}</option>
        `;
        mrzTypeSelect.value = currentValue;
    }
    
    // Re-render dynamic content
    updateCartCount();
    renderHomePage();
    renderProducts();
    renderCategoryFilters();
    renderContacts();
    
    // Update site settings after language change to ensure hero text is correct
    updateSiteSettings();
    
    // Update MRZ generator if visible
    if (document.getElementById('mrz-generator')?.classList.contains('active')) {
        initializeMRZGenerator();
    }
}

function updateLanguageSelector() {
    const langSelect = document.getElementById('language-selector');
    if (langSelect) {
        langSelect.value = currentLanguage;
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    // Set initial language
    document.documentElement.lang = currentLanguage;
    
    // Track visitor
    try {
        await fetch(`${API_URL}/api/visitors/track`, { method: 'POST' });
    } catch (error) {
        console.error('Error tracking visitor:', error);
    }
    
    await loadData();
    await loadCountries();
    updateCartCount();
    updateLanguageSelector();
    applyTranslations();
    // Update site settings after loading data to ensure hero text is correct
    updateSiteSettings();
    renderHomePage();
    renderProducts();
    renderCategoryFilters();
    renderContacts();
    
    // Admin panel should only be accessed via password in search, not automatically
    // Removed automatic admin panel redirect
    
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Also check on search button click
    document.querySelector('.search-btn').addEventListener('click', () => {
        handleSearch();
    });
    
    // Language selector change handler
    const langSelect = document.getElementById('language-selector');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});

// ===== DATA LOADING =====
async function loadData() {
    console.log('📥 Loading data from server...');
    try {
        // Add cache-busting timestamp to ensure fresh data from server
        const cacheBuster = `?t=${Date.now()}`;
        const [productsRes, categoriesRes, settingsRes, contactsRes, ordersRes] = await Promise.all([
            fetch(`${API_URL}/api/products${cacheBuster}`),
            fetch(`${API_URL}/api/categories${cacheBuster}`),
            fetch(`${API_URL}/api/settings${cacheBuster}`, { cache: 'no-store' }),
            fetch(`${API_URL}/api/contacts${cacheBuster}`),
            fetch(`${API_URL}/api/orders${cacheBuster}`).catch(() => ({ json: async () => [] }))
        ]);
        
        products = await productsRes.json();
        categories = await categoriesRes.json();
        settings = await settingsRes.json();
        contacts = await contactsRes.json();
        orders = await ordersRes.json();
        
        // Debug: log featured products after loading
        // Check for featured in multiple ways to catch all cases
        const featuredProducts = products.filter(p => {
            const featured = p.featured;
            return featured === true || featured === 'true' || featured === 1 || featured === '1';
        });
        
        // Also check a sample product to see what featured values exist
        const sampleProducts = products.slice(0, 5).map(p => ({
            id: p.id,
            name: p.name,
            featured: p.featured,
            featuredType: typeof p.featured,
            hasFeatured: 'featured' in p
        }));
        
        console.log('📦 Products loaded:', {
            total: products.length,
            featuredCount: featuredProducts.length,
            featuredProducts: featuredProducts.map(p => ({ 
                id: p.id, 
                name: p.name, 
                featured: p.featured, 
                featuredType: typeof p.featured 
            })),
            sampleProducts: sampleProducts
        });
        
        // Ensure all categories have order and visible fields
        categories = categories.map(cat => ({
            ...cat,
            order: cat.order !== undefined ? cat.order : cat.id,
            visible: cat.visible !== undefined ? cat.visible : true
        }));
        
        updateSiteSettings();
        updateContactsDisplay();
    } catch (error) {
        console.error('Error loading data:', error);
        showAlert('Error loading data', 'error');
    }
}

function updateSiteSettings() {
    // Update favicon if set
    if (settings.favicon) {
        const faviconLink = document.getElementById('favicon-link');
        if (faviconLink) {
            faviconLink.href = `${API_URL}${settings.favicon}`;
        }
    }
    
    // Helper function to get language-specific text
    function getLocalizedText(textObj) {
        if (!textObj) return '';
        if (typeof textObj === 'string') return textObj; // Backward compatibility
        return textObj[currentLanguage] || textObj.en || textObj.uk || '';
    }
    
    // Helper function to get language-specific text
    function getLocalizedText(textObj) {
        if (!textObj) return '';
        if (typeof textObj === 'string') return textObj; // Backward compatibility
        return textObj[currentLanguage] || textObj.en || textObj.uk || '';
    }
    
    // Update meta tags for social media preview
    const siteName = settings.shopName || "JOHN'S LAB TEMPLATES";
    const siteTitle = `${siteName} | Premium Digital Templates`;
    const siteDescription = getLocalizedText(settings.heroSubtitle) || "Premium digital templates for modern businesses. High-quality designs, instant delivery via USDT.";
    const siteUrl = window.location.origin;
    const siteImage = settings.logo ? `${API_URL}${settings.logo}` : `${siteUrl}/favicon.ico`;
    
    // Update title
    document.title = siteTitle;
    
    // Update meta tags
    const metaTitle = document.getElementById('meta-title');
    const metaDescription = document.getElementById('meta-description');
    const ogTitle = document.getElementById('og-title');
    const ogDescription = document.getElementById('og-description');
    const ogImage = document.getElementById('og-image');
    const ogUrl = document.getElementById('og-url');
    const ogSiteName = document.getElementById('og-site-name');
    const twitterTitle = document.getElementById('twitter-title');
    const twitterDescription = document.getElementById('twitter-description');
    const twitterImage = document.getElementById('twitter-image');
    const twitterUrl = document.getElementById('twitter-url');
    
    if (metaTitle) metaTitle.setAttribute('content', siteTitle);
    if (metaDescription) metaDescription.setAttribute('content', siteDescription);
    if (ogTitle) ogTitle.setAttribute('content', siteTitle);
    if (ogDescription) ogDescription.setAttribute('content', siteDescription);
    if (ogImage) ogImage.setAttribute('content', siteImage);
    if (ogUrl) ogUrl.setAttribute('content', siteUrl);
    if (ogSiteName) ogSiteName.setAttribute('content', siteName);
    if (twitterTitle) twitterTitle.setAttribute('content', siteTitle);
    if (twitterDescription) twitterDescription.setAttribute('content', siteDescription);
    if (twitterImage) twitterImage.setAttribute('content', siteImage);
    if (twitterUrl) twitterUrl.setAttribute('content', siteUrl);
    
    if (settings.logo) {
        document.getElementById('main-logo').innerHTML = `<img src="${API_URL}${settings.logo}" alt="Logo">`;
    }
    if (settings.shopName) {
        document.getElementById('site-name').textContent = settings.shopName;
        const heroTitleEl = document.getElementById('hero-title');
        if (heroTitleEl) heroTitleEl.textContent = settings.shopName;
    }
    
    if (settings.heroTitle) {
        const heroTitleEl = document.getElementById('hero-title');
        if (heroTitleEl) heroTitleEl.textContent = getLocalizedText(settings.heroTitle);
    }
    if (settings.heroSubtitle) {
        const heroSubtitleEl = document.getElementById('hero-subtitle');
        if (heroSubtitleEl) heroSubtitleEl.textContent = getLocalizedText(settings.heroSubtitle);
    }
    if (settings.footerTagline) {
        const footerTaglineEl = document.getElementById('footer-tagline');
        if (footerTaglineEl) footerTaglineEl.textContent = getLocalizedText(settings.footerTagline);
    }
    if (settings.footerCopyright) {
        const footerCopyrightEl = document.getElementById('footer-copyright');
        if (footerCopyrightEl) footerCopyrightEl.textContent = getLocalizedText(settings.footerCopyright);
    }
    if (settings.footerPayment) {
        const footerPaymentEl = document.getElementById('footer-payment');
        if (footerPaymentEl) footerPaymentEl.textContent = getLocalizedText(settings.footerPayment);
    }
    if (settings.backgroundImage) {
        document.body.classList.add('custom-background');
        document.body.style.setProperty('--bg-image', `url(${API_URL}${settings.backgroundImage})`);
    }
    
    // Apply hero background if set
    const heroEl = document.querySelector('.hero');
    if (heroEl && settings.heroBackground) {
        heroEl.style.backgroundImage = `url(${API_URL}${settings.heroBackground})`;
        heroEl.style.backgroundSize = 'cover';
        heroEl.style.backgroundPosition = 'center';
        heroEl.style.backgroundRepeat = 'no-repeat';
        // Add overlay for better text readability
        if (!heroEl.querySelector('.hero-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'hero-overlay';
            overlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 0;';
            heroEl.insertBefore(overlay, heroEl.firstChild);
        }
        // Ensure text is above overlay
        const heroContent = heroEl.querySelector('h1, p, button');
        if (heroContent) {
            heroContent.style.position = 'relative';
            heroContent.style.zIndex = '1';
        }
    } else if (heroEl && !settings.heroBackground) {
        // Remove background image if not set
        heroEl.style.backgroundImage = '';
        heroEl.style.backgroundSize = '';
        heroEl.style.backgroundPosition = '';
        heroEl.style.backgroundRepeat = '';
        // Remove overlay if exists
        const overlay = heroEl.querySelector('.hero-overlay');
        if (overlay) overlay.remove();
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
        else if (sectionId === 'mrz-generator') initializeMRZGenerator();
        else if (sectionId === 'barcode-generator') initializeBarcodeGenerator();
        else if (sectionId === 'other-services') renderOtherServices();
        else if (sectionId === 'account') loadUserAccount();
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
    document.getElementById('total-visitors').textContent = settings.totalVisitors || 0;
    document.getElementById('total-orders').textContent = stats.totalOrders !== undefined ? stats.totalOrders : orders.length;
    document.getElementById('total-users').textContent = stats.totalCustomers !== undefined ? stats.totalCustomers : new Set(orders.map(o => o.email)).size;

    // Render categories on home page
    renderHomeCategories();
    
    // Ensure hero text is updated after rendering
    updateSiteSettings();

    // Get featured/recommended products
    // First, try to get products marked as featured
    // Check multiple formats: true, 'true', 1, '1'
    let featured = products.filter(p => {
        const isFeatured = p.featured === true || p.featured === 'true' || p.featured === 1 || p.featured === '1';
        const validCategory = p.category !== 'MRZ' && p.category !== 'Other services';
        return isFeatured && validCategory;
    });
    
    // Debug: check all products with featured field
    const allWithFeatured = products.filter(p => 'featured' in p).map(p => ({
        id: p.id,
        name: p.name,
        featured: p.featured,
        featuredType: typeof p.featured,
        category: p.category
    }));
    
    console.log('🔍 Featured products check:', {
        totalProducts: products.length,
        featuredCount: featured.length,
        allFeatured: featured.map(p => ({ id: p.id, name: p.name, featured: p.featured, category: p.category })),
        productsWithFeaturedField: allWithFeatured,
        sampleFeaturedValues: products.slice(0, 10).map(p => ({ id: p.id, name: p.name, featured: p.featured, hasFeatured: 'featured' in p }))
    });
    
    // If no featured products, fall back to top downloads (backward compatibility)
    if (featured.length === 0) {
        featured = [...products]
            .filter(p => p.category !== 'MRZ' && p.category !== 'Other services')
        .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
        .slice(0, 3);
    } else {
        // Sort featured products by order if available, otherwise by id
        featured.sort((a, b) => {
            const orderA = a.featuredOrder !== undefined ? a.featuredOrder : a.id;
            const orderB = b.featuredOrder !== undefined ? b.featuredOrder : b.id;
            return orderA - orderB;
        });
        // Limit to max 6 featured products
        featured = featured.slice(0, 6);
    }
    
    document.getElementById('featured-products').innerHTML = featured.map(renderProductCard).join('');
}

// Helper function to render category icon (supports FontAwesome and emojis)
function renderCategoryIcon(icon) {
    if (!icon) return '<i class="fas fa-folder"></i>';
    // Check if it's an emoji (doesn't start with "fa-")
    if (!icon.startsWith('fa-')) {
        // Special handling for USA flag - make it gold/yellow
        if (icon === '🇺🇸') {
            return `<span class="category-emoji usa-flag">${icon}</span>`;
        }
        return `<span class="category-emoji">${icon}</span>`;
    }
    return `<i class="fas ${icon}"></i>`;
}

// Helper function to filter out MRZ, Other services, and Barcode Generator categories from store display
function getStoreCategories() {
    return categories.filter(c => 
        !c.isCountry && 
        c.name !== 'MRZ' && 
        c.name !== 'Other services' && 
        c.name !== 'Barcode Generator' &&
        (c.visible !== false) // Show if visible is true or undefined
    );
}

function renderHomeCategories() {
    const container = document.getElementById('home-categories');
    if (!container) {
        console.error('❌ home-categories container not found!');
        return;
    }
    
    // Ensure container has the categories-grid class
    if (!container.classList.contains('categories-grid')) {
        container.classList.add('categories-grid');
    }
    
    // Inject mobile styles directly into the page as a <style> tag
    // This ensures they always apply, even if CSS media queries fail
    if (!document.getElementById('mobile-category-styles')) {
        const style = document.createElement('style');
        style.id = 'mobile-category-styles';
        style.textContent = `
            @media (max-width: 768px) {
                #home-categories.categories-grid {
                    display: grid !important;
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 15px !important;
                    margin: 20px 0 !important;
                    width: 100% !important;
                }
                
                #home-categories .category-card {
                    padding: 20px 12px !important;
                    min-height: 140px !important;
                    max-height: none !important;
                    height: auto !important;
                    display: flex !important;
                    flex-direction: column !important;
                    justify-content: center !important;
                    align-items: center !important;
                    text-align: center !important;
                    box-sizing: border-box !important;
                }
                
                #home-categories .category-card .category-icon,
                #home-categories .category-card .category-emoji {
                    font-size: 36px !important;
                    margin-bottom: 10px !important;
                    width: auto !important;
                    height: auto !important;
                }
                
                #home-categories .category-card h3 {
                    font-size: 15px !important;
                    margin-bottom: 6px !important;
                    line-height: 1.3 !important;
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                    hyphens: auto !important;
                }
                
                #home-categories .category-card p {
                    font-size: 11px !important;
                    line-height: 1.4 !important;
                    margin: 0 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show all visible categories on home page (including MRZ for navigation, but exclude Barcode Generator)
    // visible defaults to true if not set (for backward compatibility)
    // Sort by order field if available, otherwise by id
    const mainCategories = categories
        .filter(c => 
            !c.isCountry && 
            c.name !== 'Barcode Generator' && 
            (c.visible !== false) // Show if visible is true or undefined
        )
        .sort((a, b) => {
            // Sort by order field if available, otherwise by id
            const orderA = a.order !== undefined ? a.order : a.id;
            const orderB = b.order !== undefined ? b.order : b.id;
            return orderA - orderB;
        });
        // Removed .slice(0, 8) to show all visible categories
    
    // Debug: log categories for troubleshooting
    if (mainCategories.length === 0 && categories.length > 0) {
        console.log('⚠️ No visible categories found. All categories:', categories);
        console.log('Categories with visible=false:', categories.filter(c => c.visible === false));
    }
    
    container.innerHTML = mainCategories.map(cat => {
        // Don't show product count for MRZ and Other services categories
        let displayText = '';
        if (cat.name === 'MRZ') {
            displayText = t('mrzGenerator') || 'MRZ Generator';
        } else if (cat.name === 'Other services') {
            displayText = t('otherServices') || 'Other Services';
        } else {
            const productCount = products.filter(p => p.category === cat.name).length;
            const templateText = productCount === 1 ? t('templates').slice(0, -1) : t('templates');
            displayText = `${productCount} ${templateText}`;
        }
        
        return `
            <div class="category-card" onclick="viewCategory('${cat.name}')">
                <div class="category-icon">
                    ${renderCategoryIcon(cat.icon)}
                </div>
                <h3>${cat.name}</h3>
                <p>${displayText}</p>
            </div>
        `;
    }).join('');
}

function viewCategory(categoryName) {
    // Special handling for MRZ Generator/MRZ
    if (categoryName === 'MRZ Generator' || categoryName === 'MRZ') {
        showSection('mrz-generator');
        initializeMRZGenerator();
        return;
    }
    
    // Special handling for Other services
    if (categoryName === 'Other services') {
        showSection('other-services');
        renderOtherServices();
        return;
    }
    
    // Barcode Generator is hidden for now
    // if (categoryName === 'Barcode Generator') {
    //     showSection('barcode-generator');
    //     initializeBarcodeGenerator();
    //     return;
    // }
    
    currentFilter = categoryName;
    showSection('products');
    renderCategoryView(categoryName);
}

// ===== PRODUCTS =====
let currentCountryFilter = null;
let allCountries = [];

async function loadCountries() {
    try {
        const response = await fetch(`${API_URL}/api/countries`);
        allCountries = await response.json();
    } catch (error) {
        console.error('Error loading countries:', error);
    }
}

function renderCategoryFilters() {
    const container = document.getElementById('category-filters');
    // Exclude MRZ category from store filters
    const mainCategories = getStoreCategories();
    const allButton = `<button class="btn-filter active" onclick="filterProducts('all', this)">${t('all')}</button>`;
    const categoryButtons = mainCategories.map(cat => {
        const safeName = (cat.name || '').replace(/"/g, '&quot;');
        return `<button class="btn-filter" data-category="${safeName}" onclick="filterProducts(this.dataset.category, this)">
            ${renderCategoryIcon(cat.icon)} ${cat.name}
        </button>`;
    }).join('');
    
    container.innerHTML = allButton + categoryButtons;
}

function renderCategoryView(categoryName) {
    currentFilter = categoryName;
    currentCountryFilter = null;
    
    // Update category filter buttons
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.btn-filter')).find(btn => 
        btn.dataset.category === categoryName || (categoryName === 'all' && btn.textContent.trim() === 'All')
    );
    if (activeBtn) activeBtn.classList.add('active');
    
    // Render country filters for this category
    renderCountryFilters(categoryName);
    
    // Render products
    renderProducts();
}

function renderCountryFilters(categoryName) {
    const container = document.getElementById('country-filters');
    if (!container) return;
    
    // Get unique countries from products in this category (exclude MRZ and Other services products)
    const categoryProducts = categoryName === 'all' 
        ? products.filter(p => p.category !== 'MRZ' && p.category !== 'Other services')
        : products.filter(p => p.category === categoryName && p.category !== 'MRZ' && p.category !== 'Other services');
    const productCountries = new Set();
    categoryProducts.forEach(p => {
        if (p.countries && Array.isArray(p.countries)) {
            p.countries.forEach(c => {
                // Clean country name - remove brackets and quotes if present
                const cleanCountry = String(c).replace(/^\[|\]$/g, '').replace(/^"|"$/g, '').trim();
                if (cleanCountry) {
                    productCountries.add(cleanCountry);
                }
            });
        }
    });
    
    if (productCountries.size === 0) {
        container.innerHTML = `<p style="color: #aaa; text-align: center; padding: 20px;">${t('all')} ${t('countries')}</p>`;
        return;
    }
    
    // Remove duplicates and sort
    const countryList = Array.from(productCountries).sort();
    
    // Get selected country name for display
    const selectedCountryName = currentCountryFilter 
        ? (allCountries.find(c => c.name === currentCountryFilter)?.name || currentCountryFilter)
        : null;
    
    const selectedCountryFlag = currentCountryFilter && allCountries.find(c => c.name === currentCountryFilter)
        ? allCountries.find(c => c.name === currentCountryFilter).flag
        : '';
    
    container.innerHTML = `
        <div class="country-filter-dropdown" style="margin-bottom: 15px;">
            <button class="country-filter-toggle" onclick="toggleCountryFilter()">
                <i class="fas fa-globe"></i> 
                <span>${currentCountryFilter ? `${selectedCountryFlag} ${selectedCountryName}` : t('all') + ' ' + t('countries')}</span>
                <i class="fas fa-chevron-down" id="country-filter-chevron"></i>
            </button>
            <div class="country-filter-content" id="country-filter-content" style="display: none;">
                <div class="category-filters">
                    <button class="btn-filter ${currentCountryFilter === null ? 'active' : ''}" onclick="filterByCountry(null, '${categoryName}'); toggleCountryFilter();">
                        ${t('all')} ${t('countries')}
                    </button>
                    ${countryList.map(countryName => {
                        const country = allCountries.find(c => c.name === countryName);
                        const flag = country ? country.flag : '';
                        return `<button class="btn-filter ${currentCountryFilter === countryName ? 'active' : ''}" onclick="filterByCountry('${countryName}', '${categoryName}'); toggleCountryFilter();">
                            ${flag} ${countryName}
                        </button>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

// Toggle country filter dropdown
function toggleCountryFilter() {
    const content = document.getElementById('country-filter-content');
    const chevron = document.getElementById('country-filter-chevron');
    if (!content || !chevron) return;
    
    const isVisible = content.style.display !== 'none';
    content.style.display = isVisible ? 'none' : 'block';
    chevron.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
    chevron.style.transition = 'transform 0.3s ease';
}

function filterByCountry(countryName, categoryName) {
    currentCountryFilter = countryName;
    if (categoryName) {
        currentFilter = categoryName;
    }
    renderProducts();
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
                        <i class="fas fa-cart-plus"></i> ${t('addToCart')}
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="viewProduct(${product.id})" title="${t('viewDetails')}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderProducts() {
    // Always exclude MRZ and Other services category products from store display
    let filtered = products.filter(p => p.category !== 'MRZ' && p.category !== 'Other services');
    
    // Filter by category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilter);
    }
    
    // Filter by country
    if (currentCountryFilter) {
        filtered = filtered.filter(p => {
            if (!p.countries || !Array.isArray(p.countries)) return false;
            return p.countries.includes(currentCountryFilter);
        });
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
                <h3 style="color: var(--gold); margin-bottom: 10px;">${t('templates')} ${t('notFound') || 'not found'}</h3>
                <p style="color: #aaa;">${t('tryDifferentSearch') || 'Try a different search or category'}</p>
            </div>
        `;
    } else {
        container.innerHTML = filtered.map(renderProductCard).join('');
    }
}

function filterProducts(category, button) {
    currentFilter = category;
    currentCountryFilter = null; // Reset country filter when changing category
    
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
    
    // Render country filters for the selected category
    renderCountryFilters(category);
    
    renderProducts();
}

function sortProducts(sortType) {
    currentSort = sortType;
    renderProducts();
}

async function handleSearch() {
    const searchValue = document.getElementById('search-input').value.trim();

    // If empty, just show all products
    if (!searchValue) {
        currentFilter = 'all';
        renderProducts();
        return;
    }

    // Silently try admin login; on success, open admin panel and stop
    try {
        const response = await fetch(`${API_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: searchValue })
        });

        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                isAdmin = true;
                localStorage.setItem('admin_logged_in', 'true');
                await loadData();
                document.getElementById('search-input').value = '';
                showAdminPanel();
                return;
            }
        } else {
            // If response is not ok (401, etc.), parse error response but continue to normal search
            try {
                await response.json();
            } catch (e) {
                // Ignore JSON parse errors
            }
        }
    } catch (error) {
        // Network error or other error - ignore and fall through to normal search
        console.error('Admin login check error:', error);
    }

    // Normal product search fallback
    searchProducts();
}

function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!searchTerm) {
        currentFilter = 'all';
        renderProducts();
        return;
    }
    
    const container = document.getElementById('products-container');
    // Exclude MRZ and Other services category products from search results
    const filtered = products.filter(p => 
        p.category !== 'MRZ' && p.category !== 'Other services' && (
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
        )
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
                <div class="product-detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                    <div>
                        <div class="product-image-modal" style="border-radius: 15px; display: flex; align-items: center; justify-content: center; background: var(--black); min-height: 300px;">
                            ${product.image ? 
                                `<img src="${API_URL}${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 70vh; width: auto; height: auto; object-fit: contain; border-radius: 15px; cursor: zoom-in;" onclick="this.style.maxHeight = this.style.maxHeight === 'none' ? '70vh' : 'none'; this.style.cursor = this.style.maxHeight === 'none' ? 'zoom-out' : 'zoom-in';">` :
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
                <h3 style="color: var(--gold); margin-bottom: 15px; font-size: 28px;">${t('cartEmpty')}</h3>
                <p style="color: #aaa; margin-bottom: 30px;">${t('addTemplatesFromCatalog') || 'Add some templates from our catalog'}</p>
                <button class="btn btn-primary" onclick="showSection('products')" style="padding: 15px 30px; font-size: 16px;">
                    <i class="fas fa-shopping-bag"></i> ${t('exploreTemplates')}
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
                <button class="cart-remove" onclick="removeFromCart(${index})" title="${t('remove')}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Get applied promocode from localStorage
    const appliedPromocode = JSON.parse(localStorage.getItem('appliedPromocode') || 'null');
    let discountAmount = 0;
    let finalTotal = total;
    
    if (appliedPromocode && appliedPromocode.valid) {
        discountAmount = appliedPromocode.discountAmount;
        finalTotal = appliedPromocode.finalAmount;
    }
    
    totalContainer.innerHTML = `
        <div class="cart-total">
            <div style="margin-bottom: 20px;">
                <div class="form-group" style="margin-bottom: 10px;">
                    <label style="font-size: 14px; color: #aaa; margin-bottom: 5px; display: block;">
                        <i class="fas fa-tag"></i> Promocode:
                    </label>
                    <div style="display: flex; gap: 10px;">
                        <input type="text" id="promocode-input" class="form-control" placeholder="Enter promocode" 
                               value="${appliedPromocode && appliedPromocode.valid ? appliedPromocode.promocode.code : ''}"
                               style="flex: 1;">
                        <button class="btn btn-secondary" onclick="applyPromocode()" style="white-space: nowrap;">
                            <i class="fas fa-check"></i> Apply
                        </button>
                    </div>
                    <div id="promocode-message" style="margin-top: 5px; font-size: 12px;"></div>
                </div>
            </div>
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            ${discountAmount > 0 ? `
            <div class="total-row" style="color: var(--success);">
                <span>Discount (${appliedPromocode.promocode.code}):</span>
                <span>-$${discountAmount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="total-row">
                <span>Network Fee:</span>
                <span>$0.00</span>
            </div>
            <div class="total-row" style="border-top: 3px solid var(--gold); padding-top: 20px; margin-top: 20px; font-size: 24px;">
                <span style="font-weight: 700;">${t('total')}:</span>
                <span class="total-amount">$${finalTotal.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary" onclick="showPayment()" style="width: 100%; margin-top: 25px; padding: 18px; font-size: 18px;">
                <i class="fas fa-lock"></i> ${t('checkout')}
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

// Apply promocode
async function applyPromocode() {
    const code = document.getElementById('promocode-input').value.trim();
    const messageEl = document.getElementById('promocode-message');
    
    if (!code) {
        messageEl.innerHTML = '<span style="color: var(--danger);">Please enter a promocode</span>';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    try {
        const response = await fetch(`${API_URL}/api/promocodes/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, total })
        });
        
        const result = await response.json();
        
        if (result.valid) {
            localStorage.setItem('appliedPromocode', JSON.stringify(result));
            messageEl.innerHTML = `<span style="color: var(--success);"><i class="fas fa-check-circle"></i> Promocode applied! Discount: $${result.discountAmount}</span>`;
            renderCart();
        } else {
            localStorage.removeItem('appliedPromocode');
            messageEl.innerHTML = `<span style="color: var(--danger);"><i class="fas fa-times-circle"></i> ${result.error || 'Invalid promocode'}</span>`;
            renderCart();
        }
    } catch (error) {
        messageEl.innerHTML = '<span style="color: var(--danger);">Error validating promocode</span>';
    }
}

// ===== PAYMENT =====
function showPayment() {
    if (cart.length === 0) {
        showAlert('Your cart is empty!', 'error');
        return;
    }
    
    showSection('payment');
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const appliedPromocode = JSON.parse(localStorage.getItem('appliedPromocode') || 'null');
    const finalTotal = appliedPromocode && appliedPromocode.valid ? appliedPromocode.finalAmount : total;
    const discountAmount = appliedPromocode && appliedPromocode.valid ? appliedPromocode.discountAmount : 0;
    
    document.getElementById('payment-details').innerHTML = `
        <div id="payment-step-1">
            <div style="background: var(--black); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 18px;">
                    <span>Subtotal:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                ${discountAmount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 18px; color: var(--success);">
                    <span>Discount (${appliedPromocode.promocode.code}):</span>
                    <span>-$${discountAmount.toFixed(2)}</span>
                </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 20px; border-top: 2px solid var(--gold); padding-top: 12px; margin-top: 12px;">
                    <span style="font-weight: 700;">Amount to Pay:</span>
                    <span style="font-weight: 700; color: var(--gold);">$${finalTotal.toFixed(2)} USDT</span>
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
    const appliedPromocode = JSON.parse(localStorage.getItem('appliedPromocode') || 'null');
    const promocode = appliedPromocode && appliedPromocode.valid ? appliedPromocode.promocode.code : null;
    
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
            body: JSON.stringify({ email, telegram: cleanTelegram, items, total, promocode })
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
    // Find and activate the dashboard button
    const dashboardButton = document.querySelector('.admin-tab-btn');
    if (dashboardButton) {
        showAdminTab('dashboard', dashboardButton);
    } else {
    showAdminTab('dashboard');
    }
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
        'contacts-admin': 'admin-contacts',
        'database': 'admin-database',
        'services': 'admin-services',
        'promocodes': 'admin-promocodes'
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
        case 'promocodes':
            loadAdminPromocodes();
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
        case 'services':
            loadAdminServices();
            break;
    }
}

async function loadAdminDashboard() {
    const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.baseAmount, 0);
    
    // Load visitor statistics
    let visitorStats = {
        uniqueVisitors: settings.totalVisitors || 0,
        todayUnique: 0,
        todayTotal: 0,
        dailyStats: []
    };
    
    try {
        const response = await fetch(`${API_URL}/api/visitors/stats`);
        if (response.ok) {
            visitorStats = await response.json();
        }
    } catch (error) {
        console.error('Error loading visitor stats:', error);
    }
    
    // Calculate chart data for last 7 days
    const last7Days = visitorStats.dailyStats && visitorStats.dailyStats.length > 0 
        ? visitorStats.dailyStats.slice(-7) 
        : [];
    const maxVisitors = last7Days.length > 0 
        ? Math.max(...last7Days.map(d => d.unique || 0), 1) 
        : 1;
    
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
        
        <div style="margin-top: 40px;">
            <h3 style="color: var(--gold); margin-bottom: 20px; font-size: 24px;"><i class="fas fa-users"></i> Unique Visitors</h3>
            <div class="stats-grid">
                <div class="stat-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <span class="stat-number" style="font-size: 48px;">${visitorStats.uniqueVisitors}</span>
                    <span class="stat-label">Total Unique Visitors</span>
                    <small style="display: block; margin-top: 10px; color: rgba(255,255,255,0.8);">Based on IP addresses</small>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                    <span class="stat-number" style="font-size: 48px;">${visitorStats.todayUnique}</span>
                    <span class="stat-label">Unique Today</span>
                    <small style="display: block; margin-top: 10px; color: rgba(255,255,255,0.8);">New visitors today</small>
                </div>
                <div class="stat-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                    <span class="stat-number" style="font-size: 48px;">${visitorStats.todayTotal}</span>
                    <span class="stat-label">Total Visits Today</span>
                    <small style="display: block; margin-top: 10px; color: rgba(255,255,255,0.8);">All visits today</small>
                </div>
            </div>
            
            <div style="margin-top: 30px; background: var(--gray); padding: 25px; border-radius: 15px; border: 1px solid var(--gold);">
                <h4 style="color: var(--gold); margin-bottom: 20px; font-size: 18px;"><i class="fas fa-chart-line"></i> Last 7 Days</h4>
                <div style="display: flex; align-items: flex-end; gap: 10px; height: 200px; margin-bottom: 15px;">
                    ${last7Days.map(day => {
                        const height = (day.unique / maxVisitors) * 100;
                        const date = new Date(day.date);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        return `
                            <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%;">
                                <div style="flex: 1; display: flex; align-items: flex-end; width: 100%;">
                                    <div style="width: 100%; background: linear-gradient(180deg, var(--gold) 0%, var(--gold-dark) 100%); border-radius: 8px 8px 0 0; height: ${height}%; min-height: ${day.unique > 0 ? '5px' : '0'}; position: relative;" title="${day.date}: ${day.unique} unique, ${day.total} total">
                                        <div style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); color: var(--gold); font-size: 12px; font-weight: bold; white-space: nowrap;">${day.unique}</div>
                                    </div>
                                </div>
                                <div style="margin-top: 10px; color: #aaa; font-size: 11px; text-align: center;">${dayName}</div>
                                <div style="color: #777; font-size: 10px; text-align: center;">${date.getDate()}/${date.getMonth() + 1}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--gray-light);">
                    <div style="text-align: center;">
                        <div style="color: var(--gold); font-size: 20px; font-weight: bold;">${last7Days.reduce((sum, d) => sum + d.unique, 0)}</div>
                        <div style="color: #aaa; font-size: 12px;">Unique (7 days)</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: var(--gold); font-size: 20px; font-weight: bold;">${last7Days.reduce((sum, d) => sum + d.total, 0)}</div>
                        <div style="color: #aaa; font-size: 12px;">Total Visits (7 days)</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="color: var(--gold); font-size: 20px; font-weight: bold;">${last7Days.length > 0 ? (last7Days.reduce((sum, d) => sum + d.unique, 0) / last7Days.length).toFixed(1) : 0}</div>
                        <div style="color: #aaa; font-size: 12px;">Avg Unique/Day</div>
                    </div>
                </div>
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
                            <td>
                                ${product.name}
                                ${product.featured ? '<span style="color: var(--gold); margin-left: 8px;" title="Featured on home page"><i class="fas fa-star"></i></span>' : ''}
                            </td>
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
    // Exclude MRZ category from product category selection
    const mainCategories = getStoreCategories();
    const categoryOptions = mainCategories.map(cat => 
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
                        <label>Countries (select multiple):</label>
                        <select name="countries" id="product-countries" class="form-control" multiple style="min-height: 150px;" required>
                            ${allCountries.map(country => 
                                `<option value="${country.name}">${country.flag} ${country.name}</option>`
                            ).join('')}
                        </select>
                        <small style="color: #aaa; display: block; margin-top: 5px;">Hold Ctrl/Cmd to select multiple countries</small>
                    </div>
                    <div class="form-group">
                        <label>Product Image:</label>
                        <input type="file" name="productImage" class="form-control" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label>TeraBox Download Link *:</label>
                        <input type="url" name="downloadLink" class="form-control" placeholder="https://terabox.com/s/..." required>
                        <small style="color: #aaa; display: block; margin-top: 5px;">Link to the TeraBox folder containing the product files</small>
                    </div>
                    <div class="form-group">
                        <label>Archive Password:</label>
                        <input type="text" name="downloadPassword" class="form-control" placeholder="JohnSaysThankYou" value="JohnSaysThankYou">
                        <small style="color: #aaa; display: block; margin-top: 5px;">Password for the archive. Default: "JohnSaysThankYou"</small>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="featured" onchange="document.getElementById('featured-order-group-add').style.display = this.checked ? 'block' : 'none';">
                            <span style="color: var(--gold); font-weight: 600;"><i class="fas fa-star"></i> Featured on Home Page</span>
                        </label>
                        <small style="color: #aaa; display: block; margin-top: 5px;">Show this product in "Featured Templates" section on home page</small>
                    </div>
                    <div class="form-group" style="display: none;" id="featured-order-group-add">
                        <label>Featured Order (1-6):</label>
                        <input type="number" name="featuredOrder" class="form-control" min="1" max="6" placeholder="Leave empty for auto">
                        <small style="color: #aaa; display: block; margin-top: 5px;">Order in which this product appears in featured section (1 = first, 6 = last)</small>
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
    
    // Get selected countries from multi-select
    const countriesSelect = document.getElementById(isEdit ? 'edit-product-countries' : 'product-countries');
    const selectedCountries = Array.from(countriesSelect.selectedOptions).map(option => option.value);
    formData.append('countries', JSON.stringify(selectedCountries));
    
    // Get featured checkbox - FormData converts boolean to string, so send as string
    const featuredCheckbox = form.querySelector('input[name="featured"]');
    const isFeatured = featuredCheckbox && featuredCheckbox.checked;
    
    // IMPORTANT: Remove any existing 'featured' entries first to avoid array issues
    // Then append only once with the correct value
    // Note: FormData doesn't have delete method, but we can overwrite by appending
    // The server will handle both array and string cases
    formData.append('featured', isFeatured ? 'true' : 'false');
    
    // Debug: Log what we're sending
    console.log('📤 Sending featured status:', {
        isFeatured: isFeatured,
        checkboxExists: !!featuredCheckbox,
        checkboxChecked: featuredCheckbox ? featuredCheckbox.checked : null,
        productId: isEdit ? productId : 'new',
        formDataValue: isFeatured ? 'true' : 'false',
        formDataEntries: Array.from(formData.entries()).filter(([key]) => key === 'featured' || key === 'name' || key === 'price').map(([key, value]) => ({ key, value }))
    });
    
    // Get featured order
    const featuredOrderInput = form.querySelector('input[name="featuredOrder"]');
    if (featuredOrderInput && featuredOrderInput.value) {
        formData.append('featuredOrder', parseInt(featuredOrderInput.value));
    }
    
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
            // Reload data from server to get updated featured status
            await loadData();
            
            // Debug: Check what we got from server
            const featuredAfterLoad = products.filter(p => {
                const feat = p.featured;
                return feat === true || feat === 'true' || feat === 1 || feat === '1';
            });
            console.log('🔄 After loadData, featured products:', featuredAfterLoad.map(p => ({ 
                id: p.id, 
                name: p.name, 
                featured: p.featured,
                featuredType: typeof p.featured 
            })));
            
            renderAdminProductsList();
            renderProducts();
            // Always refresh home page to show updated featured products
            renderHomePage();
            renderCategoryFilters();
            console.log('🔄 After product update, featured products:', 
                products.filter(p => p.featured === true || p.featured === 'true').map(p => ({ id: p.id, name: p.name }))
            );
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
    
    // Exclude MRZ category from product category selection
    const mainCategories = getStoreCategories();
    const categoryOptions = mainCategories.map(cat => 
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
                        <label>Countries (select multiple):</label>
                        <select name="countries" id="edit-product-countries" class="form-control" multiple style="min-height: 150px;" required>
                            ${allCountries.map(country => {
                                const selected = product.countries && product.countries.includes(country.name) ? 'selected' : '';
                                return `<option value="${country.name}" ${selected}>${country.flag} ${country.name}</option>`;
                            }).join('')}
                        </select>
                        <small style="color: #aaa; display: block; margin-top: 5px;">Hold Ctrl/Cmd to select multiple countries</small>
                    </div>
                    <div class="form-group">
                        <label>Product Image (leave empty to keep current):</label>
                        ${product.image ? `<div style="margin-bottom: 10px;"><img src="${API_URL}${product.image}" style="max-width: 200px; border-radius: 10px;"></div>` : ''}
                        <input type="file" name="productImage" class="form-control" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label>TeraBox Download Link *:</label>
                        ${product.downloadLink ? `<div style="margin-bottom: 10px; color: #aaa;">Current: <a href="${product.downloadLink}" target="_blank" style="color: var(--gold);">${product.downloadLink}</a></div>` : ''}
                        <input type="url" name="downloadLink" class="form-control" value="${product.downloadLink || ''}" placeholder="https://terabox.com/s/..." required>
                        <small style="color: #aaa; display: block; margin-top: 5px;">Link to the TeraBox folder containing the product files</small>
                    </div>
                    <div class="form-group">
                        <label>Archive Password:</label>
                        <input type="text" name="downloadPassword" class="form-control" value="${product.downloadPassword || 'JohnSaysThankYou'}" placeholder="JohnSaysThankYou">
                        <small style="color: #aaa; display: block; margin-top: 5px;">Password for the archive. Default: "JohnSaysThankYou"</small>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="featured" ${product.featured ? 'checked' : ''} onchange="document.getElementById('featured-order-group-edit').style.display = this.checked ? 'block' : 'none';">
                            <span style="color: var(--gold); font-weight: 600;"><i class="fas fa-star"></i> Featured on Home Page</span>
                        </label>
                        <small style="color: #aaa; display: block; margin-top: 5px;">Show this product in "Featured Templates" section on home page</small>
                    </div>
                    <div class="form-group" style="${product.featured ? '' : 'display: none;'}" id="featured-order-group-edit">
                        <label>Featured Order (1-6):</label>
                        <input type="number" name="featuredOrder" class="form-control" value="${product.featuredOrder || ''}" min="1" max="6" placeholder="Leave empty for auto">
                        <small style="color: #aaa; display: block; margin-top: 5px;">Order in which this product appears in featured section (1 = first, 6 = last)</small>
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
            ${categories
                .map((c, i) => ({ ...c, index: i, order: c.order !== undefined ? c.order : c.id }))
                .sort((a, b) => a.order - b.order)
                .map((cat, idx, sorted) => {
                    const isFirst = idx === 0;
                    const isLast = idx === sorted.length - 1;
                    return `
                <div class="stat-card">
                    <div style="font-size: 48px; color: var(--gold); margin-bottom: 15px;">
                        ${cat.flag ? `<span>${cat.flag}</span>` : renderCategoryIcon(cat.icon)}
                    </div>
                    <div style="font-size: 18px; font-weight: 700; margin-bottom: 10px;">${cat.flag ? `${cat.flag} ${cat.name}` : cat.name}</div>
                    <div style="color: #777; margin-bottom: 10px;">${products.filter(p => p.category === cat.name).length} products</div>
                    <div style="color: ${cat.visible !== false ? '#4CAF50' : '#f44336'}; margin-bottom: 10px; font-size: 14px;">
                        <i class="fas fa-${cat.visible !== false ? 'eye' : 'eye-slash'}"></i> 
                        ${cat.visible !== false ? 'Visible' : 'Hidden'} on home page
                    </div>
                    <div style="color: #aaa; margin-bottom: 20px; font-size: 12px;">
                        Order: ${cat.order}
                    </div>
                    <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
                        <button class="btn btn-secondary btn-small" onclick="moveCategoryOrder(${cat.id}, 'up')" ${isFirst ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Move up">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="moveCategoryOrder(${cat.id}, 'down')" ${isLast ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''} title="Move down">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="editCategory(${cat.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-small" onclick="deleteCategory(${cat.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
                }).join('')}
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
        flag: formData.get('flag') || '',
        visible: formData.get('visible') === 'on' || formData.get('visible') === 'true'
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
            // Always re-render home page to update visible categories and order
            renderHomePage();
            // Force update of home categories
            renderHomeCategories();
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
                    <div class="form-group">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" name="visible" ${category.visible !== false ? 'checked' : ''} style="width: auto; margin: 0;">
                            <span>Visible on home page</span>
                        </label>
                        <small style="color: #aaa; display: block; margin-top: 5px;">
                            Uncheck to hide this category from the home page (it will still be available in admin panel)
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

async function moveCategoryOrder(categoryId, direction) {
    try {
        const response = await fetch(`${API_URL}/api/categories/${categoryId}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ direction })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(`Category moved ${direction === 'up' ? 'up' : 'down'}`);
            await loadData();
            loadAdminCategories();
            renderCategoryFilters();
            // Always re-render home page to update category order
            renderHomePage();
            renderHomeCategories();
        } else {
            showAlert(result.error || 'Error moving category', 'error');
        }
    } catch (error) {
        console.error('Error moving category:', error);
        showAlert('Network error: ' + error.message, 'error');
    }
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
            // Always re-render home page to update visible categories
            renderHomePage();
            renderHomeCategories();
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
    // Reset language tab to English
    settingsCurrentLang = 'en';
    
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
            <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid var(--gold);">
                <h3 style="color: var(--gold); margin-bottom: 25px; font-size: 22px;"><i class="fas fa-globe"></i> Language-Specific Text Settings</h3>
                <p style="color: #aaa; margin-bottom: 20px;">Configure text settings separately for English and Ukrainian languages.</p>
                
                <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid var(--gray); padding-bottom: 15px;">
                    <button type="button" class="btn btn-secondary" id="lang-tab-en" onclick="switchSettingsLanguage('en', this)" style="flex: 1; background: var(--gold); color: var(--black);">English</button>
                    <button type="button" class="btn btn-secondary" id="lang-tab-uk" onclick="switchSettingsLanguage('uk', this)" style="flex: 1; background: var(--black-lighter); color: var(--gold);">Ukrainian</button>
                </div>
                
                <div id="settings-lang-content">
                    <div class="form-group">
                        <label>Header Title:</label>
                        <input type="text" id="setting-hero-title" class="form-control" value="${typeof settings.heroTitle === 'object' ? (settings.heroTitle.en || '') : (settings.heroTitle || settings.shopName || '')}" placeholder="Site title shown in header and hero">
                    </div>
                    <div class="form-group">
                        <label>Hero Subtitle:</label>
                        <textarea id="setting-hero-subtitle" class="form-control" rows="3" placeholder="Hero subtitle on the home page">${typeof settings.heroSubtitle === 'object' ? (settings.heroSubtitle.en || '') : (settings.heroSubtitle || '')}</textarea>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Logo:</label>
                ${settings.logo ? `<div style="margin-bottom: 10px;"><img src="${API_URL}${settings.logo}" style="max-width: 100px; border-radius: 10px;"></div>` : ''}
                <input type="file" id="setting-logo" class="form-control" accept="image/*">
            </div>
            <div class="form-group">
                <label>Favicon (Site Icon):</label>
                ${settings.favicon ? `<div style="margin-bottom: 10px;"><img src="${API_URL}${settings.favicon}" style="max-width: 32px; height: 32px; border-radius: 4px;"></div>` : ''}
                <input type="file" id="setting-favicon" class="form-control" accept="image/*">
                <small style="color: #aaa; display: block; margin-top: 5px;">Icon displayed in browser tab (recommended: 32x32px or 16x16px, .ico or .png)</small>
            </div>
            <div class="form-group">
                <label>Background Image (Body):</label>
                ${settings.backgroundImage ? `<div style="margin-bottom: 10px;"><img src="${API_URL}${settings.backgroundImage}" style="max-width: 200px; border-radius: 10px;"></div>` : ''}
                <input type="file" id="setting-background" class="form-control" accept="image/*">
                <small style="color: #aaa; display: block; margin-top: 5px;">Background for entire page</small>
            </div>
            <div class="form-group">
                <label>Hero Block Background:</label>
                ${settings.heroBackground ? `<div style="margin-bottom: 10px;"><img src="${API_URL}${settings.heroBackground}" style="max-width: 200px; border-radius: 10px; border: 2px solid var(--gold);"></div>` : ''}
                <input type="file" id="setting-hero-background" class="form-control" accept="image/*">
                <small style="color: #aaa; display: block; margin-top: 5px;">Background image for the hero block (main title section)</small>
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
            
            <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid var(--gold);">
                <h3 style="color: var(--gold); margin-bottom: 25px; font-size: 22px;"><i class="fas fa-file-alt"></i> Footer Text</h3>
                <p style="color: #aaa; margin-bottom: 20px;">Configure the text displayed in the footer section (language-specific).</p>
                
                <div class="form-group">
                    <label>Footer Tagline:</label>
                    <input type="text" id="setting-footer-tagline" class="form-control" value="${typeof settings.footerTagline === 'object' ? (settings.footerTagline.en || '') : (settings.footerTagline || '')}" placeholder="Premium digital templates for USDT">
                    <small style="color: #aaa; display: block; margin-top: 5px;">Text shown below the logo in footer</small>
                </div>
                <div class="form-group">
                    <label>Footer Copyright:</label>
                    <input type="text" id="setting-footer-copyright" class="form-control" value="${typeof settings.footerCopyright === 'object' ? (settings.footerCopyright.en || '') : (settings.footerCopyright || '')}" placeholder="© 2024 JOHN'S LAB TEMPLATES. All rights reserved.">
                    <small style="color: #aaa; display: block; margin-top: 5px;">Copyright text in footer</small>
                </div>
                <div class="form-group">
                    <label>Footer Payment Info:</label>
                    <input type="text" id="setting-footer-payment" class="form-control" value="${typeof settings.footerPayment === 'object' ? (settings.footerPayment.en || '') : (settings.footerPayment || '')}" placeholder="Payment: USDT (TRC20) | Instant Digital Delivery">
                    <small style="color: #aaa; display: block; margin-top: 5px;">Payment information text in footer</small>
                </div>
            </div>
            
            <button type="button" class="btn btn-primary" onclick="saveSettings()" style="width: 100%; padding: 15px; margin-top: 30px;">
                <i class="fas fa-save"></i> Save Settings
            </button>
        </form>
    `;
}

// Language tab for settings
let settingsCurrentLang = 'en';

function switchSettingsLanguage(lang, button) {
    settingsCurrentLang = lang;
    document.querySelectorAll('#lang-tab-en, #lang-tab-uk').forEach(btn => {
        btn.style.background = 'var(--black-lighter)';
        btn.style.color = 'var(--gold)';
    });
    button.style.background = 'var(--gold)';
    button.style.color = 'var(--black)';
    
    // Update form values with current language data
    const currentSettings = settings;
    
    // Helper to get language-specific value
    function getLangValue(obj) {
        if (!obj) return '';
        if (typeof obj === 'string') return obj; // Backward compatibility
        return obj[lang] || '';
    }
    
    document.getElementById('setting-hero-title').value = getLangValue(currentSettings.heroTitle);
    document.getElementById('setting-hero-subtitle').value = getLangValue(currentSettings.heroSubtitle);
    document.getElementById('setting-footer-tagline').value = getLangValue(currentSettings.footerTagline);
    document.getElementById('setting-footer-copyright').value = getLangValue(currentSettings.footerCopyright);
    document.getElementById('setting-footer-payment').value = getLangValue(currentSettings.footerPayment);
}

async function saveSettings() {
    // Get current settings to preserve other language data
    const currentSettings = settings;
    
    // Helper to update language-specific object
    function updateLangValue(obj, value, lang) {
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
            return { ...obj, [lang]: value };
        }
        // If it's a string or doesn't exist, create new object
        const existing = typeof obj === 'string' ? { en: obj, uk: obj } : { en: '', uk: '' };
        return { ...existing, [lang]: value };
    }
    
    const updatedSettings = {
        shopName: document.getElementById('setting-shop-name').value,
        walletAddress: document.getElementById('setting-wallet').value,
        adminEmail: document.getElementById('setting-email').value,
        heroTitle: updateLangValue(currentSettings.heroTitle, document.getElementById('setting-hero-title').value, settingsCurrentLang),
        heroSubtitle: updateLangValue(currentSettings.heroSubtitle, document.getElementById('setting-hero-subtitle').value, settingsCurrentLang),
        footerTagline: updateLangValue(currentSettings.footerTagline, document.getElementById('setting-footer-tagline').value, settingsCurrentLang),
        footerCopyright: updateLangValue(currentSettings.footerCopyright, document.getElementById('setting-footer-copyright').value, settingsCurrentLang),
        footerPayment: updateLangValue(currentSettings.footerPayment, document.getElementById('setting-footer-payment').value, settingsCurrentLang)
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
            
            // Upload favicon if selected
            const faviconFile = document.getElementById('setting-favicon').files[0];
            if (faviconFile) {
                const faviconData = new FormData();
                faviconData.append('favicon', faviconFile);
                const faviconResponse = await fetch(`${API_URL}/api/upload-favicon`, {
                    method: 'POST',
                    body: faviconData
                });
                const faviconResult = await faviconResponse.json();
                if (faviconResult.success) {
                    // Update favicon link in HTML head
                    const faviconLink = document.getElementById('favicon-link');
                    if (faviconLink) {
                        faviconLink.href = `${API_URL}${faviconResult.faviconUrl}`;
                    }
                }
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
            
            // Upload hero background if selected
            const heroBgFile = document.getElementById('setting-hero-background').files[0];
            if (heroBgFile) {
                const heroBgData = new FormData();
                heroBgData.append('heroBackground', heroBgFile);
                await fetch(`${API_URL}/api/upload-hero-background`, {
                    method: 'POST',
                    body: heroBgData
                });
            }
            
            showAlert('Settings saved successfully!');
            // Reload all data from server to ensure consistency across devices
            // Add cache-busting to ensure fresh data
            await loadData();
            // Force refresh of home page to show updated settings
            if (document.getElementById('home')?.classList.contains('active')) {
                renderHomePage();
            }
            loadAdminSettings();
            // Re-apply language to update displayed text
            updateSiteSettings();
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

// ===== MRZ GENERATOR =====
let mrzCountries = [];

async function initializeMRZGenerator() {
    // Load countries if not already loaded
    if (allCountries.length === 0) {
        await loadCountries();
    }
    
    // Populate country dropdown
    const countrySelect = document.getElementById('mrz-country');
    if (countrySelect && allCountries.length > 0) {
        countrySelect.innerHTML = `<option value="0">${t('chooseCountry')}</option>` + 
            allCountries.map(country => 
                `<option value="${country.code}">${country.flag} ${country.name}</option>`
            ).join('');
    }
    
    // Setup form event listeners
    setupMRZFormListeners();
}

function setupMRZFormListeners() {
    const typeSelect = document.getElementById('mrz-type');
    const countrySelect = document.getElementById('mrz-country');
    const formFields = document.getElementById('mrz-form-fields');
    const surCheck = document.getElementById('mrz-sur-check');
    const codeCheck = document.getElementById('mrz-code-check');
    const passportOptions = document.getElementById('mrz-passport-options');
    const idOptions = document.getElementById('mrz-id-options');
    
    if (!typeSelect || !countrySelect || !formFields) return;
    
    // Show/hide form fields based on type and country selection
    function checkFormVisibility() {
        if (typeSelect.value !== '0' && countrySelect.value !== '0') {
            formFields.style.display = 'block';
            
            // Show/hide document-specific options
            if (typeSelect.value === '1') {
                passportOptions.style.display = 'block';
                idOptions.style.display = 'none';
            } else {
                passportOptions.style.display = 'none';
                idOptions.style.display = 'block';
            }
        } else {
            formFields.style.display = 'none';
        }
    }
    
    typeSelect.addEventListener('change', checkFormVisibility);
    countrySelect.addEventListener('change', checkFormVisibility);
    
    // Sur name checkbox
    if (surCheck) {
        surCheck.addEventListener('change', function() {
            const surNameInput = document.getElementById('mrz-sur-name');
            if (surNameInput) {
                surNameInput.disabled = !this.checked;
            }
        });
    }
    
    // Optional code checkbox
    if (codeCheck) {
        codeCheck.addEventListener('change', function() {
            const codeInput = document.getElementById('mrz-code');
            if (codeInput) {
                codeInput.disabled = !this.checked;
            }
        });
    }
    
    // Radio button exclusivity
    const sexRadios = ['mrz-female', 'mrz-male', 'mrz-none'];
    sexRadios.forEach(id => {
        const radio = document.getElementById(id);
        if (radio) {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    sexRadios.filter(r => r !== id).forEach(otherId => {
                        const otherRadio = document.getElementById(otherId);
                        if (otherRadio) otherRadio.checked = false;
                    });
                }
            });
        }
    });
}

async function generateMRZ() {
    const type = document.getElementById('mrz-type').value;
    const country = document.getElementById('mrz-country').value;
    
    if (country === '0') {
        showAlert('Please select a country', 'error');
        return;
    }
    
    // Get form values
    const sex = document.querySelector('input[name="mrz-sex"]:checked')?.value || '0';
    const firstName = document.getElementById('mrz-first-name').value.trim();
    const lastName = document.getElementById('mrz-last-name').value.trim();
    const surName = document.getElementById('mrz-sur-name').value.trim();
    const birthYear = document.getElementById('mrz-birth-year').value.trim();
    const birthMonth = document.getElementById('mrz-birth-month').value.trim();
    const birthDay = document.getElementById('mrz-birth-day').value.trim();
    const expirYear = document.getElementById('mrz-expir-year').value.trim();
    const expirMonth = document.getElementById('mrz-expir-month').value.trim();
    const expirDay = document.getElementById('mrz-expir-day').value.trim();
    const number = document.getElementById('mrz-number').value.trim();
    const code = document.getElementById('mrz-code').value.trim();
    
    // Validation
    if (!expirYear || !expirMonth || !expirDay) {
        showAlert('Please fill in all expiry date fields', 'error');
        return;
    }
    
    const codeCheck = document.getElementById('mrz-code-check-digit')?.checked ? 1 : 0;
    const codeCheck1 = document.getElementById('mrz-code-check-digit-1')?.checked ? 1 : 0;
    
    try {
        let endpoint = '/api/mrz/generate';
        // Check for Russian passport (RU or RUS)
        if (type === '1' && (country === 'RU' || country === 'RUS')) {
            endpoint = '/api/mrz/generate-ru';
        } else if (type === '2') {
            endpoint = '/api/mrz/generate-id';
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: parseInt(type),
                country,
                sex: parseInt(sex),
                firstName,
                lastName,
                surName,
                birthYear,
                birthMonth,
                birthDay,
                expirYear,
                expirMonth,
                expirDay,
                number,
                code,
                codeCheck,
                codeCheck1
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            displayMRZResults(result.gen1, result.gen2, result.gen3, type);
        } else {
            showAlert(result.error || 'Error generating MRZ', 'error');
        }
    } catch (error) {
        console.error('MRZ generation error:', error);
        showAlert('Network error. Please try again.', 'error');
    }
}

function displayMRZResults(gen1, gen2, gen3, type) {
    const resultsDiv = document.getElementById('mrz-results');
    const noResultsDiv = document.getElementById('mrz-no-results');
    const result1 = document.getElementById('mrz-result1');
    const result2 = document.getElementById('mrz-result2');
    const result3 = document.getElementById('mrz-result3');
    const result3Container = document.getElementById('mrz-result3-container');
    
    if (resultsDiv) resultsDiv.style.display = 'block';
    if (noResultsDiv) noResultsDiv.style.display = 'none';
    
    if (result1) result1.value = gen1 || '';
    if (result2) result2.value = gen2 || '';
    
    // Show third line only for ID cards
    if (type === '2' && gen3) {
        if (result3) result3.value = gen3;
        if (result3Container) result3Container.style.display = 'block';
    } else {
        if (result3Container) result3Container.style.display = 'none';
    }
}

function copyMRZ() {
    const type = document.getElementById('mrz-type').value;
    const result1 = document.getElementById('mrz-result1')?.value || '';
    const result2 = document.getElementById('mrz-result2')?.value || '';
    const result3 = document.getElementById('mrz-result3')?.value || '';
    
    let text = '';
    if (type === '2') {
        text = `${result1}\n${result2}\n${result3}`;
    } else {
        text = `${result1}\n${result2}`;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showAlert('MRZ code copied to clipboard!');
    }).catch(() => {
        showAlert('Failed to copy. Please select and copy manually.', 'error');
    });
}

async function generateControlDigit() {
    const input = document.getElementById('mrz-control-input')?.value.trim();
    
    if (!input) {
        showAlert('Please enter a string', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/mrz/control-digit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ str: input })
        });
        
        const result = await response.json();
        
        if (result.success) {
            const resultDiv = document.getElementById('mrz-control-result');
            const valueDiv = document.getElementById('mrz-control-value');
            if (resultDiv) resultDiv.style.display = 'block';
            if (valueDiv) valueDiv.textContent = `Control Digit: ${result.digit}`;
        } else {
            showAlert(result.error || 'Error generating control digit', 'error');
        }
    } catch (error) {
        console.error('Control digit error:', error);
        showAlert('Network error. Please try again.', 'error');
    }
}

// ===== BARCODE GENERATOR =====
let currentBarcodeDocType = 'DL';

// USA States list
const USA_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'District of Columbia', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
    'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
    'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
    'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
    'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// Canadian Provinces list
const CANADA_PROVINCES = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Yukon'
];

function initializeBarcodeGenerator() {
    // Populate states dropdown initially with USA states
    const statesSelect = document.getElementById('barcode-states');
    if (statesSelect) {
        updateStatesDropdown(false); // false = USA
    }
    
    // Setup country toggle
    const countryToggle = document.getElementById('barcode-country-toggle');
    const countryLabel = document.getElementById('barcode-country-label');
    if (countryToggle && countryLabel) {
        countryToggle.addEventListener('change', function() {
            const isCanada = this.checked;
            countryLabel.textContent = isCanada ? 'CANADA' : 'USA';
            updateStatesDropdown(isCanada);
        });
    }
    
    // Set default document type
    setBarcodeDocType('DL');
    
    // Setup date format toggle (if needed)
    setupBarcodeDateFormats();
}

function updateStatesDropdown(isCanada) {
    const statesSelect = document.getElementById('barcode-states');
    if (!statesSelect) return;
    
    const options = isCanada ? CANADA_PROVINCES : USA_STATES;
    statesSelect.innerHTML = options.map(option => 
        `<option value="${option}">${option}</option>`
    ).join('');
    
    // Update label
    const label = statesSelect.previousElementSibling;
    if (label && label.tagName === 'LABEL') {
        label.textContent = isCanada ? 'Province:' : 'State:';
    }
}

function setupBarcodeDateFormats() {
    // Format date inputs to remove non-numeric characters
    const dateInputs = ['barcode-dateBirthday', 'barcode-dateIssue', 'barcode-dateExpiry'];
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '').substring(0, 8);
            });
        }
    });
}


function setBarcodeDocType(type) {
    currentBarcodeDocType = type;
    ['DL', 'CDL', 'ID'].forEach(docType => {
        const btn = document.getElementById(`barcode-doctype-${docType}`);
        if (btn) {
            if (docType === type) {
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            } else {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            }
        }
    });
}

function generateBarcodeLicense() {
    // Generate random license number (7-8 digits)
    const length = Math.random() > 0.5 ? 7 : 8;
    const licNumber = Array.from({length}, () => Math.floor(Math.random() * 10)).join('');
    const input = document.getElementById('barcode-licNumber');
    if (input) input.value = licNumber;
}

function generateBarcodeDiscriminator() {
    // Generate random document discriminator
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = Math.floor(Math.random() * 10) + 10; // 10-20 chars
    const discriminator = Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const input = document.getElementById('barcode-docDiscr');
    if (input) input.value = discriminator;
}

function generateBarcodeInventory() {
    // Generate inventory number (ten zeros + random digits)
    const zeros = '0000000000';
    const random = Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join('');
    const input = document.getElementById('barcode-invNum');
    if (input) input.value = zeros + random;
}

function generateBarcodeAudit() {
    // Generate audit information
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = Math.floor(Math.random() * 10) + 10;
    const audit = Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const input = document.getElementById('barcode-auditInfo');
    if (input) input.value = audit;
}


// Build AAMVA string from form data
function buildAAMVAString() {
    const firstName = document.getElementById('barcode-firstName')?.value || '';
    const middleName = document.getElementById('barcode-middleName')?.value || '';
    const lastName = document.getElementById('barcode-lastName')?.value || '';
    const gender = document.querySelector('input[name="barcode-gender"]:checked')?.value || '0';
    const state = document.getElementById('barcode-states')?.value || 'Alabama';
    const city = document.getElementById('barcode-city')?.value || '';
    const street = document.getElementById('barcode-street')?.value || '';
    const zipCode = document.getElementById('barcode-zipCode')?.value || '00000';
    const hairColor = document.getElementById('barcode-hairColor')?.value || 'BAL';
    const eyeColor = document.getElementById('barcode-eyeColor')?.value || 'BLK';
    const raceCode = document.getElementById('barcode-raceCode')?.value || 'W';
    const heightFt = document.getElementById('barcode-heightFt')?.value || '5';
    const heightIn = document.getElementById('barcode-heightIn')?.value || '10';
    const weight = document.getElementById('barcode-weight')?.value || '130';
    const dateBirthday = document.getElementById('barcode-dateBirthday')?.value || '02031980';
    const dateIssue = document.getElementById('barcode-dateIssue')?.value || '01022000';
    const dateExpiry = document.getElementById('barcode-dateExpiry')?.value || '02031999';
    const licNumber = document.getElementById('barcode-licNumber')?.value || '';
    const docDiscr = document.getElementById('barcode-docDiscr')?.value || '';
    const invNum = document.getElementById('barcode-invNum')?.value || '';
    const auditInfo = document.getElementById('barcode-auditInfo')?.value || '';
    const country = document.getElementById('barcode-country-toggle')?.checked ? 'CAN' : 'USA';
    
    // Convert date format from MMDDYYYY to YYYY-MM-DD for AAMVA
    function convertDate(dateStr) {
        if (dateStr.length !== 8) return '';
        const month = dateStr.substring(0, 2);
        const day = dateStr.substring(2, 4);
        const year = dateStr.substring(4, 8);
        return `${year}-${month}-${day}`;
    }
    
    // Build basic AAMVA string (simplified version)
    // AAMVA format: @\nANSI [version]\n[data elements]
    const aamvaData = [
        `@`,
        `ANSI 6360260101DL00290188${state.substring(0, 2).toUpperCase()}DL`,
        `DAA${lastName.toUpperCase()}`,
        `DAB${firstName.toUpperCase()}${middleName ? ' ' + middleName.toUpperCase() : ''}`,
        `DAC${firstName.toUpperCase()}`,
        `DAD${middleName ? middleName.toUpperCase() : ''}`,
        `DBD${convertDate(dateIssue)}`,
        `DBB${convertDate(dateBirthday)}`,
        `DBA${convertDate(dateExpiry)}`,
        `DBC${gender === '1' ? '1' : '2'}`,
        `DAU${heightFt}FT ${heightIn}IN`,
        `DAY${hairColor}`,
        `DAZ${weight}LB`,
        `DAG${street}`,
        `DAI${city}`,
        `DAJ${state}`,
        `DAK${zipCode}`,
        `DAQ${licNumber}`,
        `DCF${docDiscr}`,
        `DCG${country}`,
        `DDE${raceCode}`,
        `DDD${eyeColor}`
    ];
    
    return aamvaData.join('\n');
}

async function generatePDF417() {
    console.log('generatePDF417() called');
    try {
        console.log('Building AAMVA string...');
        const aamvaString = buildAAMVAString();
        console.log('AAMVA string built, length:', aamvaString.length);
        
        const svgContainer = document.getElementById('barcode-svg');
        const resultsDiv = document.getElementById('barcode-results');
        
        console.log('SVG container:', svgContainer ? 'found' : 'not found');
        console.log('Results div:', resultsDiv ? 'found' : 'not found');
        
        if (!svgContainer || !resultsDiv) {
            showAlert('Barcode container not found', 'error');
            return;
        }
        
        // Check if bwip-js is available
        // The standard build (bwip-js-min.js) loads successfully but might expose differently
        console.log('Checking for bwip-js library...');
        console.log('typeof bwipjs:', typeof bwipjs);
        console.log('typeof window.bwipjs:', typeof window.bwipjs);
        console.log('window.bwipjsLoaded:', window.bwipjsLoaded);
        
        let bwipjsLib = null;
        let attempts = 0;
        const maxAttempts = 30; // Wait up to 3 seconds
        
        while (attempts < maxAttempts && !bwipjsLib) {
            // Check all possible ways the library might be exposed
            if (typeof bwipjs !== 'undefined' && typeof bwipjs.toCanvas === 'function') {
                bwipjsLib = bwipjs;
                break;
            } else if (typeof window.bwipjs !== 'undefined' && typeof window.bwipjs.toCanvas === 'function') {
                bwipjsLib = window.bwipjs;
                break;
            } else if (typeof window.BWIPJS !== 'undefined' && typeof window.BWIPJS.toCanvas === 'function') {
                bwipjsLib = window.BWIPJS;
                break;
            }
            
            // Also check if it's available but not yet initialized
            const possibleNames = ['bwipjs', 'BWIPJS', 'bwip', 'BWIP'];
            for (const name of possibleNames) {
                const lib = window[name];
                if (lib && typeof lib.toCanvas === 'function') {
                    bwipjsLib = lib;
                    window.bwipjs = lib; // Make it available as bwipjs
                    break;
                }
            }
            
            if (bwipjsLib) break;
            
            attempts++;
            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        if (!bwipjsLib || typeof bwipjsLib.toCanvas !== 'function') {
            console.error('bwipjs is undefined after', attempts, 'attempts');
            console.error('Available globals with "bwip":', Object.keys(window).filter(k => k.toLowerCase().includes('bwip')));
            console.error('window.bwipjs:', typeof window.bwipjs, window.bwipjs);
            console.error('typeof bwipjs:', typeof bwipjs);
            console.error('window keys:', Object.keys(window).slice(0, 50)); // First 50 keys for debugging
            showAlert('Barcode library (bwip-js) not loaded. The library file loaded but is not accessible. Please check the browser console for details.', 'error');
            return;
        }
        
        console.log('bwipjs library loaded successfully:', typeof bwipjsLib, 'has toCanvas:', typeof bwipjsLib.toCanvas);
        console.log('AAMVA string length:', aamvaString.length);
        
        // Validate AAMVA string
        if (!aamvaString || aamvaString.trim() === '') {
            showAlert('Please fill in the form fields to generate PDF417 barcode', 'error');
            return;
        }
        
        // Get PDF417 settings
        const ecc = parseInt(document.getElementById('barcode-ecc')?.value || '5');
        const rows = parseInt(document.getElementById('barcode-rows')?.value || '6');
        const columns = parseInt(document.getElementById('barcode-columns')?.value || '12');
        
        // Create canvas for PDF417 - must be in DOM for bwip-js
        let canvas = document.getElementById('barcode-pdf417-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'barcode-pdf417-canvas';
            canvas.style.display = 'none';
            document.body.appendChild(canvas);
        }
        
        const scale = 3; // Higher scale for better quality
        
        // Generate PDF417 barcode using bwip-js (callback-based API)
        // Note: Not specifying backgroundcolor makes it transparent by default
        console.log('Calling bwipjsLib.toCanvas with:', {
            bcid: 'pdf417',
            textLength: aamvaString.length,
            scale: scale,
            columns: columns,
            rows: rows,
            ecclevel: ecc
        });
        
        try {
            bwipjsLib.toCanvas(canvas, {
                bcid: 'pdf417',
                text: aamvaString,
                scale: scale,
                height: 10,
                width: 2,
                columns: columns,
                rows: rows,
                ecclevel: ecc,
                includetext: false
                // backgroundcolor is not specified to keep it transparent
            }, function(err) {
                if (err) {
                    console.error('PDF417 generation error:', err);
                    showAlert('Error generating PDF417 barcode: ' + (err.message || err), 'error');
                    return;
                }
                
                console.log('PDF417 barcode generated successfully on canvas');
                
                // Convert canvas to SVG
                const svg = canvasToSVG(canvas);
                svgContainer.innerHTML = '';
                svg.setAttribute('width', '100%');
                // SVG doesn't support height="auto", use viewBox instead or calculate height
                const aspectRatio = canvas.height / canvas.width;
                svg.setAttribute('viewBox', `0 0 ${canvas.width} ${canvas.height}`);
                svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                svg.style.width = '100%';
                svg.style.height = 'auto';
                svgContainer.appendChild(svg);
                
                // Show results
                resultsDiv.style.display = 'block';
                resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Store SVG and canvas for download
                window.currentBarcodeSVG = svg.outerHTML;
                window.currentBarcodeCanvas = canvas;
                window.currentBarcodeType = 'PDF417';
                
                showAlert('PDF417 barcode generated successfully!', 'success');
            });
        } catch (canvasError) {
            console.error('Error calling toCanvas:', canvasError);
            showAlert('Error calling barcode generation: ' + canvasError.message, 'error');
        }
    } catch (error) {
        console.error('PDF417 generation error:', error);
        console.error('Error stack:', error.stack);
        showAlert('Error generating PDF417 barcode: ' + error.message, 'error');
    }
}

// Helper function to convert canvas to SVG
function canvasToSVG(canvas) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', canvas.width);
    svg.setAttribute('height', canvas.height);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // Use PNG with transparency preserved
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', canvas.toDataURL('image/png'));
    image.setAttribute('width', canvas.width);
    image.setAttribute('height', canvas.height);
    svg.appendChild(image);
    
    return svg;
}

async function generateCode128() {
    try {
        const svgContainer = document.getElementById('barcode-svg');
        const resultsDiv = document.getElementById('barcode-results');
        
        if (!svgContainer || !resultsDiv) {
            showAlert('Barcode container not found', 'error');
            return;
        }
        
        // Check if JsBarcode is available
        if (typeof JsBarcode === 'undefined') {
            showAlert('JsBarcode library not loaded. Please refresh the page.', 'error');
            return;
        }
        
        // Use license number or build a simple string from form data
        const licNumber = document.getElementById('barcode-licNumber')?.value || '';
        const firstName = document.getElementById('barcode-firstName')?.value || '';
        const lastName = document.getElementById('barcode-lastName')?.value || '';
        
        // Build Code128 data - prefer license number, otherwise use name
        let code128Data = licNumber;
        if (!code128Data || code128Data.trim() === '') {
            code128Data = `${lastName.toUpperCase()},${firstName.toUpperCase()}`.substring(0, 50);
        }
        
        if (!code128Data || code128Data.trim() === '') {
            showAlert('Please enter a License Number or Name to generate Code128 barcode', 'error');
            return;
        }
        
        // Generate Code128 barcode
        svgContainer.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        // SVG doesn't support height="auto", use viewBox and style instead
        svg.setAttribute('viewBox', `0 0 ${svg.getAttribute('width') || '300'} ${svg.getAttribute('height') || '100'}`);
        svg.style.height = 'auto';
        svgContainer.appendChild(svg);
        
        JsBarcode(svg, code128Data, {
            format: 'CODE128',
            width: 2,
            height: 100,
            displayValue: false,
            fontSize: 20,
            background: 'transparent',
            lineColor: '#000000',
            margin: 10
        });
        
        // Create canvas for PNG export
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
        
        // Show results
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Store SVG and canvas for download
        window.currentBarcodeSVG = svg.outerHTML;
        window.currentBarcodeCanvas = canvas;
        window.currentBarcodeImage = img;
        window.currentBarcodeType = 'CODE128';
        
        showAlert('Code128 barcode generated successfully!', 'success');
    } catch (error) {
        console.error('Code128 generation error:', error);
        showAlert('Error generating Code128 barcode: ' + error.message, 'error');
    }
}

async function savePDF417SVG() {
    if (!window.currentBarcodeSVG || window.currentBarcodeType !== 'PDF417') {
        showAlert('Please generate a PDF417 barcode first', 'error');
        return;
    }
    
    try {
        const blob = new Blob([window.currentBarcodeSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PDF417_${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showAlert('SVG file downloaded successfully!', 'success');
    } catch (error) {
        showAlert('Error saving SVG: ' + error.message, 'error');
    }
}

async function savePDF417PNG() {
    if (!window.currentBarcodeCanvas || window.currentBarcodeType !== 'PDF417') {
        showAlert('Please generate a PDF417 barcode first', 'error');
        return;
    }
    
    try {
        // Use toBlob with PNG format to preserve transparency
        window.currentBarcodeCanvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `PDF417_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showAlert('PNG file downloaded successfully!', 'success');
        }, 'image/png'); // PNG format preserves transparency
    } catch (error) {
        showAlert('Error saving PNG: ' + error.message, 'error');
    }
}

async function saveCode128SVG() {
    if (!window.currentBarcodeSVG || window.currentBarcodeType !== 'CODE128') {
        showAlert('Please generate a Code128 barcode first', 'error');
        return;
    }
    
    try {
        const blob = new Blob([window.currentBarcodeSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Code128_${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showAlert('SVG file downloaded successfully!', 'success');
    } catch (error) {
        showAlert('Error saving SVG: ' + error.message, 'error');
    }
}

async function saveCode128PNG() {
    if (!window.currentBarcodeSVG || window.currentBarcodeType !== 'CODE128') {
        showAlert('Please generate a Code128 barcode first', 'error');
        return;
    }
    
    try {
        const svg = window.currentBarcodeSVG;
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        img.onload = function() {
            canvas.width = img.width || 800;
            canvas.height = img.height || 200;
            // Don't fill with white - keep transparent
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Code128_${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showAlert('PNG file downloaded successfully!', 'success');
            }, 'image/png');
        };
        
        const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.src = url;
    } catch (error) {
        showAlert('Error saving PNG: ' + error.message, 'error');
    }
}


// ===== USER AUTHENTICATION =====
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Check if user is logged in on page load
async function checkUserAuth() {
    if (!authToken) {
        updateAuthUI();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                currentUser = data.user;
                updateAuthUI();
            } else {
                localStorage.removeItem('authToken');
                authToken = null;
                updateAuthUI();
            }
        } else {
            localStorage.removeItem('authToken');
            authToken = null;
            updateAuthUI();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('authToken');
        authToken = null;
        updateAuthUI();
    }
}

// Update UI based on auth status
function updateAuthUI() {
    const userButtons = document.getElementById('user-account-buttons');
    const guestButtons = document.getElementById('guest-account-buttons');
    
    if (currentUser && authToken) {
        if (userButtons) {
            userButtons.style.display = 'flex';
            userButtons.style.gap = '10px';
        }
        if (guestButtons) guestButtons.style.display = 'none';
    } else {
        if (userButtons) userButtons.style.display = 'none';
        if (guestButtons) {
            guestButtons.style.display = 'flex';
            guestButtons.style.gap = '10px';
        }
    }
}

// Handle user registration
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    const errorDiv = document.getElementById('register-error');
    
    // Clear previous errors
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    // Validation
    if (password.length < 6) {
        errorDiv.textContent = t('passwordMinLength') || 'Password must be at least 6 characters';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (password !== passwordConfirm) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            updateAuthUI();
            showAlert(t('createAccount') + ' ' + (t('success') || 'Success') + '!', 'success');
            showSection('account');
            loadUserAccount();
        } else {
            errorDiv.textContent = data.error || 'Registration failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
        console.error('Registration error:', error);
    }
}

// Handle user login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    // Clear previous errors
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    
    try {
        const response = await fetch(`${API_URL}/api/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            updateAuthUI();
            showAlert(t('login') + ' ' + (t('success') || 'Success') + '!', 'success');
            showSection('account');
            loadUserAccount();
        } else {
            errorDiv.textContent = data.error || 'Login failed';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Network error. Please try again.';
        errorDiv.style.display = 'block';
        console.error('Login error:', error);
    }
}

// User logout
function userLogout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('authToken');
    updateAuthUI();
    showAlert(t('logout') + ' ' + (t('success') || 'Success') + '!', 'success');
    showSection('home');
}

// Load user account data
async function loadUserAccount() {
    if (!authToken) {
        showSection('login');
        return;
    }
    
    const loadingDiv = document.getElementById('account-loading');
    const contentDiv = document.getElementById('account-content');
    
    loadingDiv.style.display = 'block';
    contentDiv.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            
            // Update account info
            document.getElementById('account-email').textContent = currentUser.email;
            document.getElementById('account-name').textContent = currentUser.name || 'N/A';
            document.getElementById('account-created').textContent = new Date(currentUser.createdAt).toLocaleDateString();
            document.getElementById('account-orders-count').textContent = currentUser.totalOrders || 0;
            
            // Render orders
            renderUserOrders(currentUser.orders);
            
            loadingDiv.style.display = 'none';
            contentDiv.style.display = 'block';
        } else {
            throw new Error(data.error || 'Failed to load account');
        }
    } catch (error) {
        console.error('Load account error:', error);
        loadingDiv.innerHTML = `<p style="color: var(--danger);">${t('error')}: ${error.message}</p>`;
    }
}

// Render user orders
function renderUserOrders(orders) {
    const ordersDiv = document.getElementById('account-orders');
    
    if (!orders || orders.length === 0) {
        ordersDiv.innerHTML = `<div class="empty-state">${t('noOrdersYet')}</div>`;
        return;
    }
    
    ordersDiv.innerHTML = orders.map(order => {
        const orderDate = order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A';
        const itemsHtml = order.items.map(item => {
            const downloadLink = item.downloadLink;
            const password = item.downloadPassword || 'JohnSaysThankYou';
            
            return `
            <div class="order-item" style="display: flex; flex-direction: column; gap: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">$${item.price.toFixed(2)}</div>
                </div>
                ${downloadLink ? `
                    <div style="background: var(--black); padding: 15px; border-radius: 10px; border: 1px solid var(--gray);">
                        <div style="margin-bottom: 10px;">
                            <label style="color: #888; font-size: 12px; display: block; margin-bottom: 5px;">Download Link:</label>
                            <a href="${downloadLink}" target="_blank" style="color: var(--gold); word-break: break-all; text-decoration: underline;">
                                ${downloadLink}
                            </a>
                        </div>
                        <div>
                            <label style="color: #888; font-size: 12px; display: block; margin-bottom: 5px;">Archive Password:</label>
                            <div style="background: var(--black-lighter); padding: 10px; border-radius: 5px; font-family: monospace; color: var(--gold); font-weight: bold; letter-spacing: 1px;">
                                ${password}
                            </div>
                        </div>
                    </div>
                    <a href="${downloadLink}" target="_blank" class="order-item-download" rel="noopener noreferrer" style="text-align: center;">
                        <i class="fas fa-external-link-alt"></i> ${t('downloadFile')} from TeraBox
                    </a>
                ` : '<span style="color: #888;">No download available</span>'}
            </div>
        `;
        }).join('');
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">${t('order')} #${order.id}</div>
                        <div class="order-date">${t('orderDate')}: ${orderDate}</div>
                    </div>
                    <div class="order-total">$${order.total.toFixed(2)}</div>
                </div>
                <div class="order-items">
                    ${itemsHtml}
                </div>
            </div>
        `;
    }).join('');
}

// Update showSection to handle account section
const originalShowSection = showSection;
showSection = function(sectionId) {
    originalShowSection(sectionId);
    if (sectionId === 'account') {
        loadUserAccount();
    }
};

// Check auth on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkUserAuth);
} else {
    checkUserAuth();
}

// ===== OTHER SERVICES =====
let services = [];

async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/api/services`);
        services = await response.json();
    } catch (error) {
        console.error('Error loading services:', error);
        services = [];
    }
}

function renderOtherServices() {
    const container = document.getElementById('services-list');
    if (!container) return;
    
    // Reload services before rendering
    loadServices().then(() => {
        if (!services || services.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #888;">
                    <i class="fas fa-concierge-bell" style="font-size: 48px; margin-bottom: 20px; color: var(--gold);"></i>
                    <p style="font-size: 18px;">No services available at the moment.</p>
                    <p style="font-size: 14px; margin-top: 10px;">Check back soon for new services!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = services.map(service => `
            <div class="service-item">
                <div class="service-title">
                    <i class="fas fa-star"></i>
                    ${service.name}
                </div>
                <div class="service-description">
                    ${service.description}
                </div>
                <a href="${service.telegramLink}" target="_blank" class="service-telegram-link" rel="noopener noreferrer">
                    <i class="fab fa-telegram-plane"></i>
                    View on Telegram
                </a>
            </div>
        `).join('');
    });
}

// Admin: Load services management
function loadAdminPromocodes() {
    const container = document.getElementById('admin-promocodes');
    
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h3 style="color: var(--gold); font-size: 24px;"><i class="fas fa-tag"></i> Promocode Management</h3>
            <button class="btn btn-primary" onclick="showAddPromocodeModal()">
                <i class="fas fa-plus"></i> Add Promocode
            </button>
        </div>
        <div id="admin-promocodes-list"></div>
    `;
    
    renderAdminPromocodesList();
}

async function renderAdminPromocodesList() {
    const listContainer = document.getElementById('admin-promocodes-list');
    
    try {
        const response = await fetch(`${API_URL}/api/promocodes`);
        const promocodes = await response.json();
        
        if (promocodes.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: #aaa; padding: 40px;">No promocodes yet</p>';
            return;
        }
        
        listContainer.innerHTML = `
            <div style="overflow-x: auto;">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Discount</th>
                            <th>Status</th>
                            <th>Used</th>
                            <th>Expires</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${promocodes.map(promo => `
                            <tr>
                                <td><strong style="color: var(--gold);">${promo.code}</strong></td>
                                <td>${promo.discountType === 'percentage' ? 'Percentage' : 'Fixed'}</td>
                                <td>${promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}</td>
                                <td>${promo.active ? '<span style="color: var(--success);">Active</span>' : '<span style="color: var(--danger);">Inactive</span>'}</td>
                                <td>${promo.usedCount || 0}${promo.maxUses ? ` / ${promo.maxUses}` : ''}</td>
                                <td>${promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : 'No expiry'}</td>
                                <td>
                                    <button class="btn btn-secondary btn-small" onclick="editPromocode(${promo.id})" style="margin-right: 5px;">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-small" onclick="deletePromocode(${promo.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        listContainer.innerHTML = '<p style="color: var(--danger);">Error loading promocodes</p>';
    }
}

function showAddPromocodeModal() {
    const modal = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-title">Add Promocode</div>
                <form onsubmit="submitPromocodeForm(false); return false;">
                    <div class="form-group">
                        <label>Promocode:</label>
                        <input type="text" id="promocode-code" class="form-control" placeholder="SUMMER2024" required>
                        <small style="color: #aaa;">Uppercase letters and numbers only</small>
                    </div>
                    <div class="form-group">
                        <label>Discount Type:</label>
                        <select id="promocode-type" class="form-control" onchange="updatePromocodeType()">
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount ($)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label id="promocode-value-label">Discount Value (%):</label>
                        <input type="number" id="promocode-value" class="form-control" step="0.01" min="0" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="promocode-active" checked>
                            Active
                        </label>
                    </div>
                    <div class="form-group">
                        <label>Expiration Date (optional):</label>
                        <input type="datetime-local" id="promocode-expires" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Max Uses (optional):</label>
                        <input type="number" id="promocode-maxuses" class="form-control" min="1" placeholder="Leave empty for unlimited">
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">
                            <i class="fas fa-save"></i> Save Promocode
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

function updatePromocodeType() {
    const type = document.getElementById('promocode-type').value;
    const label = document.getElementById('promocode-value-label');
    if (label) {
        label.textContent = type === 'percentage' ? 'Discount Value (%):' : 'Discount Value ($):';
    }
}

async function submitPromocodeForm(isEdit, promocodeId) {
    const code = document.getElementById('promocode-code').value.trim().toUpperCase();
    const discountType = document.getElementById('promocode-type').value;
    const discountValue = parseFloat(document.getElementById('promocode-value').value);
    const active = document.getElementById('promocode-active').checked;
    const expiresAt = document.getElementById('promocode-expires').value || null;
    const maxUses = document.getElementById('promocode-maxuses').value || null;
    
    try {
        const url = isEdit ? `${API_URL}/api/promocodes/${promocodeId}` : `${API_URL}/api/promocodes`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, discountType, discountValue, active, expiresAt, maxUses })
        });
        
        const result = await response.json();
        
        if (result.success || result.promocode) {
            showAlert(`Promocode ${isEdit ? 'updated' : 'created'} successfully`);
            closeModal();
            renderAdminPromocodesList();
        } else {
            showAlert(result.error || 'Error saving promocode', 'error');
        }
    } catch (error) {
        showAlert('Error saving promocode', 'error');
    }
}

function editPromocode(id) {
    fetch(`${API_URL}/api/promocodes`)
        .then(r => r.json())
        .then(promocodes => {
            const promo = promocodes.find(p => p.id === id);
            if (!promo) return;
            
            const modal = `
                <div class="modal-overlay active" onclick="closeModal()">
                    <div class="modal" onclick="event.stopPropagation()">
                        <button class="modal-close" onclick="closeModal()">&times;</button>
                        <div class="modal-title">Edit Promocode</div>
                        <form onsubmit="submitPromocodeForm(true, ${promo.id}); return false;">
                            <div class="form-group">
                                <label>Promocode:</label>
                                <input type="text" id="promocode-code" class="form-control" value="${promo.code}" required>
                            </div>
                            <div class="form-group">
                                <label>Discount Type:</label>
                                <select id="promocode-type" class="form-control" onchange="updatePromocodeType()">
                                    <option value="percentage" ${promo.discountType === 'percentage' ? 'selected' : ''}>Percentage (%)</option>
                                    <option value="fixed" ${promo.discountType === 'fixed' ? 'selected' : ''}>Fixed Amount ($)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label id="promocode-value-label">Discount Value:</label>
                                <input type="number" id="promocode-value" class="form-control" value="${promo.discountValue}" step="0.01" min="0" required>
                            </div>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="promocode-active" ${promo.active ? 'checked' : ''}>
                                    Active
                                </label>
                            </div>
                            <div class="form-group">
                                <label>Expiration Date (optional):</label>
                                <input type="datetime-local" id="promocode-expires" class="form-control" value="${promo.expiresAt ? new Date(promo.expiresAt).toISOString().slice(0, 16) : ''}">
                            </div>
                            <div class="form-group">
                                <label>Max Uses (optional):</label>
                                <input type="number" id="promocode-maxuses" class="form-control" value="${promo.maxUses || ''}" min="1" placeholder="Leave empty for unlimited">
                            </div>
                            <div style="display: flex; gap: 15px; margin-top: 30px;">
                                <button type="submit" class="btn btn-primary" style="flex: 1;">
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
            updatePromocodeType();
        });
}

async function deletePromocode(id) {
    if (!confirm('Are you sure you want to delete this promocode?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/promocodes/${id}`, { method: 'DELETE' });
        const result = await response.json();
        
        if (result.success) {
            showAlert('Promocode deleted');
            renderAdminPromocodesList();
        } else {
            showAlert(result.error || 'Error deleting promocode', 'error');
        }
    } catch (error) {
        showAlert('Error deleting promocode', 'error');
    }
}

function loadAdminServices() {
    const container = document.getElementById('admin-services');
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h2 style="color: var(--gold); margin: 0;">Other Services Management</h2>
            <button class="btn btn-primary" onclick="showAddServiceModal()">
                <i class="fas fa-plus"></i> Add Service
            </button>
        </div>
        <div id="admin-services-list"></div>
    `;
    renderAdminServicesList();
}

function renderAdminServicesList() {
    const listContainer = document.getElementById('admin-services-list');
    if (!listContainer) return;
    
    loadServices().then(() => {
        if (!services || services.length === 0) {
            listContainer.innerHTML = '<p style="text-align: center; color: #aaa; padding: 40px;">No services yet. Click "Add Service" to create one.</p>';
            return;
        }
        
        listContainer.innerHTML = `
            <div style="display: grid; gap: 20px;">
                ${services.map(service => `
                    <div style="background: var(--black-lighter); padding: 20px; border-radius: 15px; border: 2px solid var(--gray);">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                            <div>
                                <h3 style="color: var(--gold); margin: 0 0 10px 0; font-size: 20px;">${service.name}</h3>
                                <p style="color: #ccc; margin: 0; line-height: 1.6;">${service.description}</p>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button class="btn btn-secondary btn-small" onclick="editService(${service.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-danger btn-small" onclick="deleteService(${service.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div style="margin-top: 15px;">
                            <a href="${service.telegramLink}" target="_blank" style="color: var(--gold); text-decoration: underline;">
                                <i class="fab fa-telegram-plane"></i> ${service.telegramLink}
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    });
}

function showAddServiceModal() {
    const modal = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-title">Add New Service</div>
                <form id="add-service-form">
                    <div class="form-group">
                        <label>Service Name *:</label>
                        <input type="text" name="name" class="form-control" required placeholder="e.g., Custom Design Service">
                    </div>
                    <div class="form-group">
                        <label>Description *:</label>
                        <textarea name="description" class="form-control" rows="4" required placeholder="Brief description of the service..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Telegram Link *:</label>
                        <input type="url" name="telegramLink" class="form-control" required placeholder="https://t.me/yourgroup">
                        <small style="color: #aaa; display: block; margin-top: 5px;">Link to Telegram group/channel where this service is demonstrated</small>
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button type="button" class="btn btn-primary" onclick="submitServiceForm()" style="flex: 1;">
                            <i class="fas fa-plus"></i> Add Service
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

function showEditServiceModal(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;
    
    const modal = `
        <div class="modal-overlay active" onclick="closeModal()">
            <div class="modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeModal()">&times;</button>
                <div class="modal-title">Edit Service</div>
                <form id="edit-service-form">
                    <div class="form-group">
                        <label>Service Name *:</label>
                        <input type="text" name="name" class="form-control" value="${service.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Description *:</label>
                        <textarea name="description" class="form-control" rows="4" required>${service.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Telegram Link *:</label>
                        <input type="url" name="telegramLink" class="form-control" value="${service.telegramLink}" required>
                        <small style="color: #aaa; display: block; margin-top: 5px;">Link to Telegram group/channel where this service is demonstrated</small>
                    </div>
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button type="button" class="btn btn-primary" onclick="submitServiceForm(true, ${service.id})" style="flex: 1;">
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

async function submitServiceForm(isEdit = false, serviceId = null) {
    const form = document.getElementById(isEdit ? 'edit-service-form' : 'add-service-form');
    if (!form) {
        showAlert('Form not found', 'error');
        return;
    }
    
    const formData = {
        name: form.name.value.trim(),
        description: form.description.value.trim(),
        telegramLink: form.telegramLink.value.trim()
    };
    
    // Validate Telegram link - if it doesn't start with http, add https://t.me/
    if (formData.telegramLink && !formData.telegramLink.startsWith('http')) {
        formData.telegramLink = `https://t.me/${formData.telegramLink.replace(/^@?/, '')}`;
    }
    
    if (!formData.name || !formData.description || !formData.telegramLink) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        const url = isEdit ? `${API_URL}/api/services/${serviceId}` : `${API_URL}/api/services`;
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Server error' }));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            closeModal();
            await loadServices();
            renderAdminServicesList();
            showAlert('Service ' + (isEdit ? 'updated' : 'added') + ' successfully!');
        } else {
            showAlert(result.error || 'Error saving service', 'error');
        }
    } catch (error) {
        console.error('Service save error:', error);
        showAlert(error.message || 'Network error. Please try again.', 'error');
    }
}

function editService(serviceId) {
    showEditServiceModal(serviceId);
}

async function deleteService(serviceId) {
    if (!confirm('Delete this service?')) return;
    
    try {
        const response = await fetch(`${API_URL}/api/services/${serviceId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            await loadServices();
            renderAdminServicesList();
            showAlert('Service deleted successfully!');
        } else {
            showAlert(result.error || 'Error deleting service', 'error');
        }
    } catch (error) {
        showAlert('Network error. Please try again.', 'error');
        console.error('Service delete error:', error);
    }
}

// Load services on page load
loadServices();

// ===== UTILITIES =====
function closeModal() {
    document.getElementById('modals').innerHTML = '';
}

console.log('🚀 JOHN\'S LAB TEMPLATES ready!');
