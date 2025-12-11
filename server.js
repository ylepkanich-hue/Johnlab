require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== КОНФІГУРАЦІЯ =====
const CONFIG = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
    WALLET_ADDRESS: process.env.WALLET_ADDRESS || 'Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    SITE_NAME: "JOHN'S LAB TEMPLATES",
    SITE_URL: process.env.SITE_URL || `http://localhost:${PORT}`,
    TELEGRAM_LINK: "https://t.me/John_refund",
    // TRON API конфігурація
    TRONGRID_API: 'https://api.trongrid.io',
    TRONSCAN_API: 'https://apilist.tronscan.org/api'
};

// ===== НАЛАШТУВАННЯ ЗАВАНТАЖЕННЯ ФАЙЛІВ =====
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            let uploadPath = 'uploads/temp/';
            if (file.fieldname === 'productFile') uploadPath = 'uploads/products/';
            if (file.fieldname === 'productImage') uploadPath = 'uploads/images/';
            if (file.fieldname === 'ownerPhoto') uploadPath = 'uploads/owner/';
            if (file.fieldname === 'logo') uploadPath = 'uploads/logos/';
            
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        const unique = uuidv4();
        const ext = path.extname(file.originalname);
        const safeName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
        cb(null, `${safeName}-${unique}${ext}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

// ===== EMAIL ТРАНСПОРТ =====
let transporter;
if (CONFIG.EMAIL_USER && CONFIG.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: CONFIG.EMAIL_USER,
            pass: CONFIG.EMAIL_PASS
        }
    });
}

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// Дозволити CORS для фронтенду
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// ===== ІНІЦІАЛІЗАЦІЯ ДАНИХ =====
async function initData() {
    try {
        // Створюємо папки
        const folders = [
            'uploads/products', 
            'uploads/images', 
            'uploads/owner', 
            'uploads/logos', 
            'data',
            'logs'
        ];
        
        for (const folder of folders) {
            await fs.mkdir(folder, { recursive: true });
        }

        // Перевіряємо файли даних
        const dataFiles = {
            'products': [
                {
                    id: 1,
                    name: "Premium PSD Website Template",
                    price: 25.99,
                    category: "PSD",
                    description: "Modern website template with clean design and fully layered PSD",
                    image: "",
                    file: "",
                    fileName: "premium-template.psd",
                    fileSize: "45.2 MB",
                    downloads: 42,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "E-commerce UI Kit",
                    price: 19.99,
                    category: "UI Kits",
                    description: "Complete UI kit for online stores with 50+ screens",
                    image: "",
                    file: "",
                    fileName: "ecommerce-ui-kit.fig",
                    fileSize: "32.1 MB",
                    downloads: 28,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Crypto Dashboard Design",
                    price: 34.99,
                    category: "Dashboards",
                    description: "Professional dashboard for crypto platforms with dark/light themes",
                    image: "",
                    file: "",
                    fileName: "crypto-dashboard.zip",
                    fileSize: "67.8 MB",
                    downloads: 15,
                    createdAt: new Date().toISOString()
                }
            ],
            'categories': [
                { id: 1, name: "PSD", icon: "fa-palette", description: "Photoshop templates" },
                { id: 2, name: "UI Kits", icon: "fa-layer-group", description: "UI kits for designers" },
                { id: 3, name: "Dashboards", icon: "fa-chart-line", description: "Dashboard designs" },
                { id: 4, name: "Illustrations", icon: "fa-paint-brush", description: "Vector illustrations" },
                { id: 5, name: "Fonts", icon: "fa-font", description: "Premium fonts" },
                { id: 6, name: "3D Models", icon: "fa-cube", description: "3D models and assets" }
            ],
            'orders': [],
            'settings': {
                shopName: CONFIG.SITE_NAME,
                walletAddress: CONFIG.WALLET_ADDRESS,
                adminEmail: process.env.ADMIN_EMAIL || CONFIG.EMAIL_USER,
                adminPassword: CONFIG.ADMIN_PASSWORD,
                telegramLink: CONFIG.TELEGRAM_LINK,
                currency: "USDT",
                network: "TRC20",
                paymentTimeout: 60, // хвилини
                emailNotifications: true
            },
            'contacts': {
                ownerName: "John's Lab",
                ownerDescription: "Premium digital template creator with 5+ years experience",
                ownerPhoto: "",
                telegram: "@John_refund",
                telegramLink: CONFIG.TELEGRAM_LINK,
                about: "Welcome to JOHN'S LAB TEMPLATES! Here you'll find exclusive digital products. If you have any questions, feel free to contact me!"
            }
        };

        // Створюємо файли, якщо не існують
        for (const [key, data] of Object.entries(dataFiles)) {
            const filePath = `data/${key}.json`;
            try {
                await fs.access(filePath);
            } catch {
                await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            }
        }

        console.log('✅ Data initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Initialization error:', error);
        return false;
    }
}

// ===== ФУНКЦІЇ ДЛЯ РОБОТИ З TRON БЛОКЧЕЙНОМ =====

// Генерація унікальної суми з копійками для ідентифікації
function generateUniqueAmount(baseAmount) {
    const randomCents = Math.floor(Math.random() * 99) + 1; // 1-99 копійок
    return parseFloat((baseAmount + randomCents / 100).toFixed(2));
}

// Перевірка транзакцій в TRON мережі
async function checkTronTransaction(walletAddress, expectedAmount, timeoutMinutes = 60) {
    try {
        // Використовуємо TronGrid API для перевірки транзакцій
        const response = await axios.get(`${CONFIG.TRONGRID_API}/v1/accounts/${walletAddress}/transactions`, {
            params: {
                only_confirmed: true,
                limit: 50,
                order_by: 'block_timestamp,desc'
            }
        });

        const transactions = response.data.data || [];
        
        // Перевіряємо останні транзакції
        for (const tx of transactions) {
            if (tx.raw_data.contract[0].type === 'TransferContract') {
                const contract = tx.raw_data.contract[0];
                const toAddress = contract.parameter.value.to_address;
                const amount = contract.parameter.value.amount / 1000000; // Конвертуємо з sun в USDT
                
                // Перевіряємо адресу одержувача та суму
                const targetAddress = CONFIG.WALLET_ADDRESS.replace(/^T/, '0x').toLowerCase();
                const txToAddress = toAddress.toLowerCase();
                
                if (txToAddress === targetAddress && Math.abs(amount - expectedAmount) < 0.01) {
                    // Перевіряємо час транзакції
                    const txTime = tx.block_timestamp;
                    const currentTime = Date.now();
                    const timeDiff = (currentTime - txTime) / (1000 * 60); // в хвилинах
                    
                    if (timeDiff <= timeoutMinutes) {
                        return {
                            success: true,
                            found: true,
                            transaction: tx,
                            amount: amount,
                            timestamp: txTime
                        };
                    }
                }
            }
        }
        
        return {
            success: true,
            found: false,
            message: 'Transaction not found'
        };
        
    } catch (error) {
        console.error('TRON API error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// ===== API РОУТИ =====

// Отримати всі товари
app.get('/api/products', async (req, res) => {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати товар по ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        const products = JSON.parse(data);
        const product = products.find(p => p.id === parseInt(req.params.id));
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Додати товар
app.post('/api/products', upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'productFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        const products = JSON.parse(data);
        
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: req.body.name,
            price: parseFloat(req.body.price),
            category: req.body.category,
            description: req.body.description,
            downloads: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Зберегти зображення
        if (req.files?.productImage) {
            newProduct.image = `/uploads/images/${req.files.productImage[0].filename}`;
        }

        // Зберегти файл
        if (req.files?.productFile) {
            newProduct.file = `/uploads/products/${req.files.productFile[0].filename}`;
            newProduct.fileName = req.files.productFile[0].originalname;
            newProduct.fileSize = formatFileSize(req.files.productFile[0].size);
        }

        products.push(newProduct);
        await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
        
        res.json({ success: true, product: newProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Оновити товар
app.put('/api/products/:id', upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'productFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updatedProduct = {
            ...products[productIndex],
            name: req.body.name || products[productIndex].name,
            price: req.body.price ? parseFloat(req.body.price) : products[productIndex].price,
            category: req.body.category || products[productIndex].category,
            description: req.body.description || products[productIndex].description,
            updatedAt: new Date().toISOString()
        };

        // Оновити зображення
        if (req.files?.productImage) {
            updatedProduct.image = `/uploads/images/${req.files.productImage[0].filename}`;
        }

        // Оновити файл
        if (req.files?.productFile) {
            updatedProduct.file = `/uploads/products/${req.files.productFile[0].filename}`;
            updatedProduct.fileName = req.files.productFile[0].originalname;
            updatedProduct.fileSize = formatFileSize(req.files.productFile[0].size);
        }

        products[productIndex] = updatedProduct;
        await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
        
        res.json({ success: true, product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Видалити товар
app.delete('/api/products/:id', async (req, res) => {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        let products = JSON.parse(data);
        const filtered = products.filter(p => p.id !== parseInt(req.params.id));
        
        await fs.writeFile('data/products.json', JSON.stringify(filtered, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Категорії
app.get('/api/categories', async (req, res) => {
    try {
        const data = await fs.readFile('data/categories.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const data = await fs.readFile('data/categories.json', 'utf8');
        const categories = JSON.parse(data);
        
        const newCategory = {
            id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
            name: req.body.name,
            icon: req.body.icon || 'fa-folder',
            description: req.body.description || ''
        };

        categories.push(newCategory);
        await fs.writeFile('data/categories.json', JSON.stringify(categories, null, 2));
        
        res.json({ success: true, category: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    try {
        const data = await fs.readFile('data/categories.json', 'utf8');
        let categories = JSON.parse(data);
        const categoryIndex = categories.findIndex(c => c.id === parseInt(req.params.id));
        
        if (categoryIndex === -1) {
            return res.status(404).json({ error: 'Category not found' });
        }

        categories[categoryIndex] = {
            ...categories[categoryIndex],
            name: req.body.name || categories[categoryIndex].name,
            icon: req.body.icon || categories[categoryIndex].icon,
            description: req.body.description || categories[categoryIndex].description
        };

        await fs.writeFile('data/categories.json', JSON.stringify(categories, null, 2));
        res.json({ success: true, category: categories[categoryIndex] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        const data = await fs.readFile('data/categories.json', 'utf8');
        let categories = JSON.parse(data);
        const filtered = categories.filter(c => c.id !== parseInt(req.params.id));
        
        await fs.writeFile('data/categories.json', JSON.stringify(filtered, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Створити замовлення з унікальною сумою
app.post('/api/orders', async (req, res) => {
    try {
        const { email, items, total, wallet } = req.body;
        
        if (!email || !items || !total || !wallet) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Перевірити email
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Перевірити TRON адресу
        if (!isValidTronAddress(wallet)) {
            return res.status(400).json({ error: 'Invalid TRON address' });
        }

        const data = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(data);
        
        // Генеруємо унікальну суму з копійками
        const uniqueTotal = generateUniqueAmount(parseFloat(total));
        
        const orderId = 'ORD-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        const newOrder = {
            id: orderId,
            email,
            wallet,
            items,
            total: uniqueTotal,
            baseTotal: parseFloat(total),
            uniqueAmount: uniqueTotal,
            status: 'pending',
            createdAt: new Date().toISOString(),
            paidAt: null,
            filesSent: false,
            downloadLink: null,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 60 хвилин
        };

        orders.push(newOrder);
        await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));

        // Відправити email з деталями оплати
        if (transporter) {
            await sendPaymentEmail(email, orderId, uniqueTotal);
        }
        
        res.json({ 
            success: true, 
            order: newOrder,
            wallet: CONFIG.WALLET_ADDRESS,
            network: 'TRC20',
            uniqueAmount: uniqueTotal,
            timeout: 60
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Перевірити оплату замовлення
app.get('/api/orders/:id/check', async (req, res) => {
    try {
        const data = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(data);
        const order = orders.find(o => o.id === req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Перевіряємо, чи не минув час
        const now = new Date();
        const expiresAt = new Date(order.expiresAt);
        
        if (now > expiresAt) {
            order.status = 'expired';
            await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));
            return res.json({ 
                success: true, 
                status: 'expired',
                paid: false,
                message: 'Payment time expired'
            });
        }

        // Перевіряємо транзакцію в блокчейні
        const paymentCheck = await checkTronTransaction(
            CONFIG.WALLET_ADDRESS,
            order.uniqueAmount,
            60
        );

        if (paymentCheck.success && paymentCheck.found) {
            // Оплата знайдена!
            order.status = 'paid';
            order.paidAt = new Date().toISOString();
            
            // Генеруємо посилання для завантаження
            const downloadToken = uuidv4();
            const downloadLink = `${CONFIG.SITE_URL}/api/download/${order.id}/${downloadToken}`;
            order.downloadLink = downloadLink;
            order.downloadToken = downloadToken;
            order.filesSent = true;
            
            await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));
            
            // Відправити файли на email
            if (transporter) {
                await sendDownloadEmail(order.email, order.id, downloadLink);
            }
            
            // Оновити кількість завантажень товарів
            await updateProductDownloads(order.items);
            
            return res.json({ 
                success: true, 
                status: 'paid',
                paid: true,
                filesSent: true,
                downloadLink: downloadLink,
                transaction: paymentCheck.transaction
            });
        }

        // Оплата не знайдена
        res.json({ 
            success: true, 
            status: 'pending',
            paid: false,
            message: 'Waiting for payment...',
            uniqueAmount: order.uniqueAmount
        });
        
    } catch (error) {
        console.error('Payment check error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Завантаження файлів
app.get('/api/download/:orderId/:token', async (req, res) => {
    try {
        const { orderId, token } = req.params;
        
        const ordersData = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(ordersData);
        const order = orders.find(o => o.id === orderId && o.downloadToken === token);
        
        if (!order) {
            return res.status(404).send('Download link expired or invalid');
        }

        if (order.status !== 'paid') {
            return res.status(403).send('Order not paid');
        }

        // Перевіряємо, чи не минув час завантаження
        const now = new Date();
        const paidAt = new Date(order.paidAt);
        const hoursDiff = (now - paidAt) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) { // 24 години на завантаження
            return res.status(403).send('Download link expired');
        }

        // Знаходимо файли товарів
        const productsData = await fs.readFile('data/products.json', 'utf8');
        const products = JSON.parse(productsData);
        
        const orderProducts = order.items.map(item => {
            const product = products.find(p => p.id === item.id);
            return product ? {
                ...item,
                fileName: product.fileName,
                filePath: product.file
            } : null;
        }).filter(p => p !== null);

        if (orderProducts.length === 0) {
            return res.status(404).send('Files not found');
        }

        // Якщо тільки один файл - віддаємо його напряму
        if (orderProducts.length === 1) {
            const filePath = path.join(__dirname, orderProducts[0].filePath);
            const fileName = orderProducts[0].fileName;
            
            return res.download(filePath, fileName);
        }

        // Якщо декілька файлів - створюємо ZIP (потрібна додаткова бібліотека)
        res.json({
            success: true,
            message: 'Multiple files available',
            files: orderProducts.map(p => ({
                name: p.fileName,
                url: `${CONFIG.SITE_URL}${p.filePath}`
            }))
        });
        
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Download error');
    }
});

// Налаштування
app.get('/api/settings', async (req, res) => {
    try {
        const data = await fs.readFile('data/settings.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/settings', async (req, res) => {
    try {
        const data = await fs.readFile('data/settings.json', 'utf8');
        const currentSettings = JSON.parse(data);
        
        const updatedSettings = {
            ...currentSettings,
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        await fs.writeFile('data/settings.json', JSON.stringify(updatedSettings, null, 2));
        
        // Оновити глобальну конфігурацію
        if (req.body.walletAddress) {
            CONFIG.WALLET_ADDRESS = req.body.walletAddress;
        }
        
        res.json({ success: true, settings: updatedSettings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Контакти
app.get('/api/contacts', async (req, res) => {
    try {
        const data = await fs.readFile('data/contacts.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/contacts', upload.single('ownerPhoto'), async (req, res) => {
    try {
                const data = await fs.readFile('data/contacts.json', 'utf8');
        let contacts = JSON.parse(data);
        
        // Оновити текстові поля
        contacts = {
            ...contacts,
            ownerName: req.body.ownerName || contacts.ownerName,
            ownerDescription: req.body.ownerDescription || contacts.ownerDescription,
            about: req.body.about || contacts.about,
            telegram: req.body.telegram || contacts.telegram,
            telegramLink: req.body.telegramLink || contacts.telegramLink
        };

        // Оновити фото якщо завантажено
        if (req.file) {
            contacts.ownerPhoto = `/uploads/owner/${req.file.filename}`;
        }

        await fs.writeFile('data/contacts.json', JSON.stringify(contacts, null, 2));
        res.json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Оновити логотип
app.post('/api/upload-logo', upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Оновити налаштування з новим лого
        const settingsData = await fs.readFile('data/settings.json', 'utf8');
        const settings = JSON.parse(settingsData);
        
        settings.logoUrl = `/uploads/logos/${req.file.filename}`;
        await fs.writeFile('data/settings.json', JSON.stringify(settings, null, 2));
        
        res.json({ 
            success: true, 
            logoUrl: settings.logoUrl 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Пошук товарів
app.get('/api/search', async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, sort } = req.query;
        
        const data = await fs.readFile('data/products.json', 'utf8');
        let products = JSON.parse(data);
        
        // Фільтр по категорії
        if (category && category !== 'all') {
            products = products.filter(p => p.category === category);
        }
        
        // Пошук по тексту
        if (q) {
            const searchTerm = q.toLowerCase();
            products = products.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm)
            );
        }
        
        // Фільтр по ціні
        if (minPrice) {
            products = products.filter(p => p.price >= parseFloat(minPrice));
        }
        
        if (maxPrice) {
            products = products.filter(p => p.price <= parseFloat(maxPrice));
        }
        
        // Сортування
        if (sort) {
            switch(sort) {
                case 'price-asc':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'popular':
                    products.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
                    break;
                case 'newest':
                    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    break;
                case 'name':
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }
        }
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Статистика
app.get('/api/stats', async (req, res) => {
    try {
        const productsData = await fs.readFile('data/products.json', 'utf8');
        const ordersData = await fs.readFile('data/orders.json', 'utf8');
        const categoriesData = await fs.readFile('data/categories.json', 'utf8');
        
        const products = JSON.parse(productsData);
        const orders = JSON.parse(ordersData);
        const categories = JSON.parse(categoriesData);
        
        const paidOrders = orders.filter(o => o.status === 'paid');
        const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
        const totalDownloads = products.reduce((sum, product) => sum + (product.downloads || 0), 0);
        
        const stats = {
            totalProducts: products.length,
            totalCategories: categories.length,
            totalOrders: orders.length,
            totalPaidOrders: paidOrders.length,
            totalRevenue: totalRevenue,
            totalDownloads: totalDownloads,
            averageOrderValue: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
            topProducts: [...products].sort((a, b) => (b.downloads || 0) - (a.downloads || 0)).slice(0, 5),
            recentOrders: orders.slice(-5).reverse()
        };
        
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== ДОПОМІЖНІ ФУНКЦІЇ =====

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidTronAddress(address) {
    if (!address) return false;
    if (address.startsWith('T') && address.length === 34) return true;
    if (address.startsWith('0x') && address.length === 42) return true;
    return false;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function sendPaymentEmail(email, orderId, amount) {
    try {
        if (!transporter) {
            console.log('Email transporter not configured');
            return false;
        }

        const mailOptions = {
            from: `"JOHN'S LAB TEMPLATES" <${CONFIG.EMAIL_USER}>`,
            to: email,
            subject: `💳 Payment Details for Order #${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">JOHN'S LAB TEMPLATES - Payment Details</h2>
                        
                        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <p>Order: <strong>#${orderId}</strong></p>
                            <p>Date: ${new Date().toLocaleDateString()}</p>
                            <h1 style="color: #D4AF37; font-size: 36px; margin: 20px 0; text-align: center;">
                                ${amount} USDT
                            </h1>
                        </div>
                        
                        <div style="background: #1a1a1a; color: #D4AF37; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all; margin: 20px 0;">
                            ${CONFIG.WALLET_ADDRESS}
                        </div>
                        
                        <p><strong>Network:</strong> TRON (TRC20)</p>
                        <p><strong>Payment Timeout:</strong> 60 minutes</p>
                        
                        <div style="margin-top: 30px; padding: 20px; background: #f0f8ff; border-radius: 8px; border-left: 4px solid #D4AF37;">
                            <p><strong>📌 Instructions:</strong></p>
                            <ol style="margin-left: 20px;">
                                <li>Send exactly <strong>${amount} USDT</strong> to the address above</li>
                                <li>Use <strong>TRC20 network only</strong></li>
                                <li>Complete payment within 60 minutes</li>
                                <li>Files will be sent automatically after payment confirmation</li>
                                <li>Check your order status on our website</li>
                            </ol>
                        </div>
                        
                        <p style="margin-top: 30px; text-align: center; color: #666;">
                            Need help? Contact us: <a href="${CONFIG.TELEGRAM_LINK}" style="color: #D4AF37;">Telegram</a>
                        </p>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #999; font-size: 12px;">
                                © ${new Date().getFullYear()} JOHN'S LAB TEMPLATES. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Payment email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending payment email:', error);
        return false;
    }
}

async function sendDownloadEmail(email, orderId, downloadLink) {
    try {
        if (!transporter) {
            console.log('Email transporter not configured');
            return false;
        }

        const mailOptions = {
            from: `"JOHN'S LAB TEMPLATES" <${CONFIG.EMAIL_USER}>`,
            to: email,
            subject: `🎉 Your Order #${orderId} is Ready!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
                    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #27ae60; text-align: center; margin-bottom: 30px;">🎉 Payment Confirmed!</h2>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="font-size: 72px; color: #27ae60; margin-bottom: 20px;">✓</div>
                            <h3 style="color: #333; margin-bottom: 10px;">Order #${orderId} Paid Successfully</h3>
                            <p style="color: #666;">Your files are ready for download</p>
                        </div>
                        
                        <div style="background: #f0f8ff; padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center; border: 2px solid #D4AF37;">
                            <p style="margin-bottom: 15px;"><strong>Download Link:</strong></p>
                            <a href="${downloadLink}" 
                               style="display: inline-block; background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                📥 Download Files
                            </a>
                            <p style="margin-top: 15px; font-size: 12px; color: #666;">
                                Link valid for 24 hours
                            </p>
                        </div>
                        
                        <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
                            <p><strong>📋 Order Details:</strong></p>
                            <p>Order ID: ${orderId}</p>
                            <p>Date: ${new Date().toLocaleDateString()}</p>
                            <p>Download Link: <a href="${downloadLink}">${downloadLink}</a></p>
                        </div>
                        
                        <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107;">
                            <p><strong>⚠️ Important:</strong></p>
                            <ul style="margin-left: 20px;">
                                <li>Download link is valid for 24 hours</li>
                                <li>Keep your order ID for reference</li>
                                <li>If you have issues, contact us immediately</li>
                            </ul>
                        </div>
                        
                        <p style="margin-top: 30px; text-align: center;">
                            <a href="${CONFIG.TELEGRAM_LINK}" 
                               style="color: #D4AF37; text-decoration: none;">
                                💬 Need help? Contact us on Telegram
                            </a>
                        </p>
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                            <p style="color: #999; font-size: 12px;">
                                © ${new Date().getFullYear()} JOHN'S LAB TEMPLATES. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Download email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending download email:', error);
        return false;
    }
}

async function updateProductDownloads(items) {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        let products = JSON.parse(data);
        
        items.forEach(item => {
            const productIndex = products.findIndex(p => p.id === item.id);
            if (productIndex !== -1) {
                products[productIndex].downloads = (products[productIndex].downloads || 0) + 1;
            }
        });
        
        await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
        return true;
    } catch (error) {
        console.error('Error updating product downloads:', error);
        return false;
    }
}

// ===== HTML РОУТИ =====

// Головна сторінка
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Сторінка завантаження
app.get('/download/:orderId/:token', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Сторінка адміна
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ===== ЗАПУСК СЕРВЕРА =====

async function startServer() {
    try {
        await initData();
        
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════════╗
║           🚀 JOHN'S LAB TEMPLATES STARTED!            ║
╠═══════════════════════════════════════════════════════╣
║ 🌐 Website:    http://localhost:${PORT}                ║
║ 📁 Uploads:    http://localhost:${PORT}/uploads/       ║
║ 💰 Wallet:     ${CONFIG.WALLET_ADDRESS}                ║
║ 📧 Email:      ${CONFIG.EMAIL_USER || 'Not configured'} ║
║ 📞 Telegram:   ${CONFIG.TELEGRAM_LINK}                ║
╚═══════════════════════════════════════════════════════╝
            `);
            
            // Перевірити конфігурацію
            if (!CONFIG.EMAIL_USER || !CONFIG.EMAIL_PASS) {
                console.warn('⚠️  Email not configured - some features will be limited');
            }
            
            if (CONFIG.WALLET_ADDRESS.startsWith('Txxxx')) {
                console.warn('⚠️  Please update your USDT wallet address in .env file');
            }
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Обробка помилок
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
