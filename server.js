const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const TronWeb = require('tronweb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== КОНФІГУРАЦІЯ TRON WEB3 =====
const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY }
});

// ===== КОНФІГУРАЦІЯ EMAIL =====
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ===== НАЛАШТУВАННЯ MULTER ДЛЯ ФАЙЛІВ =====
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            let uploadPath = 'uploads/temp/';
            if (file.fieldname === 'productFile') uploadPath = 'uploads/products/';
            if (file.fieldname === 'productImage') uploadPath = 'uploads/images/';
            if (file.fieldname === 'ownerPhoto') uploadPath = 'uploads/owner/';
            if (file.fieldname === 'logo') uploadPath = 'uploads/logo/';
            
            await fs.mkdir(uploadPath, { recursive: true });
            cb(null, uploadPath);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        const safeName = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '-');
        cb(null, `${safeName}-${uniqueId}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
        files: 10
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = {
            'productImage': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            'productFile': [
                'application/pdf',
                'application/zip',
                'application/x-zip-compressed',
                'image/vnd.adobe.photoshop',
                'application/postscript',
                'application/illustrator',
                'application/x-psd',
                'application/vnd.adobe.illustrator'
            ],
            'ownerPhoto': ['image/jpeg', 'image/png', 'image/gif'],
            'logo': ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']
        };

        const allowed = allowedTypes[file.fieldname];
        if (allowed && allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Недопустимий тип файлу: ${file.mimetype}`));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Статичні файли
app.use('/uploads', express.static('uploads'));
app.use('/data', express.static('data', {
    setHeaders: (res, path) => {
        if (path.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
        }
    }
}));

// ===== ІНІЦІАЛІЗАЦІЯ ДАНИХ =====
async function initData() {
    const folders = [
        'uploads/products',
        'uploads/images', 
        'uploads/temp',
        'uploads/owner',
        'uploads/logo',
        'data'
    ];

    for (const folder of folders) {
        await fs.mkdir(folder, { recursive: true });
    }

    // Створення початкових JSON файлів
    const defaults = {
        products: [
            {
                id: 1,
                name: "Premium PSD Website Template",
                price: 25.99,
                category: "PSD Templates",
                description: "Professionally designed PSD template for modern websites",
                image: "",
                file: "",
                fileName: "premium-template.psd",
                fileSize: "15.4 MB",
                downloads: 42,
                createdAt: new Date().toISOString(),
                active: true
            },
            {
                id: 2,
                name: "E-commerce UI Kit",
                price: 19.99,
                category: "UI Kits",
                description: "Complete UI kit for e-commerce applications",
                image: "",
                file: "",
                fileName: "ecommerce-ui-kit.fig",
                fileSize: "8.2 MB",
                downloads: 28,
                createdAt: new Date().toISOString(),
                active: true
            },
            {
                id: 3,
                name: "Crypto Dashboard Design",
                price: 34.99,
                category: "Dashboards",
                description: "Modern dashboard design for cryptocurrency platforms",
                image: "",
                file: "",
                fileName: "crypto-dashboard.psd",
                fileSize: "22.1 MB",
                downloads: 15,
                createdAt: new Date().toISOString(),
                active: true
            }
        ],
        categories: [
            { id: 1, name: "PSD Templates", icon: "fas fa-palette", count: 1 },
            { id: 2, name: "UI Kits", icon: "fas fa-layer-group", count: 1 },
            { id: 3, name: "Dashboards", icon: "fas fa-chart-line", count: 1 },
            { id: 4, name: "Illustrations", icon: "fas fa-paint-brush", count: 0 },
            { id: 5, name: "Fonts", icon: "fas fa-font", count: 0 },
            { id: 6, name: "3D Models", icon: "fas fa-cube", count: 0 }
        ],
        orders: [],
        settings: {
            shopName: "USDT SHOP",
            walletAddress: process.env.WALLET_ADDRESS || "Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            email: process.env.ADMIN_EMAIL || "admin@example.com",
            currency: "USDT",
            network: "TRC20",
            adminPassword: process.env.ADMIN_PASSWORD || "admin123",
            telegram: "@yourtelegram",
            instagram: "@yourinstagram"
        },
        contacts: {
            ownerName: "Власник магазину",
            ownerDescription: "Професійний дизайнер та розробник з 5-річним досвідом. Спеціалізуюсь на створенні цифрових продуктів для криптоіндустрії.",
            ownerEmail: "owner@example.com",
            ownerPhoto: "",
            telegram: "@yourtelegram",
            instagram: "@yourinstagram",
            whatsapp: "+1234567890",
            about: "Ласкаво просимо до мого магазину! Тут ви знайдете унікальні цифрові товари для вашого бізнесу. Якщо є питання - не соромтеся звертатися!"
        }
    };

    for (const [key, value] of Object.entries(defaults)) {
        const filePath = `data/${key}.json`;
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify(value, null, 2));
        }
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
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Товар не знайдено' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Додати новий товар
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
            fileSize: req.body.fileSize || "Unknown",
            downloads: 0,
            createdAt: new Date().toISOString(),
            active: true
        };

        // Зберегти зображення
        if (req.files && req.files.productImage) {
            const image = req.files.productImage[0];
            newProduct.image = `/uploads/images/${image.filename}`;
        }

        // Зберегти файл товару
        if (req.files && req.files.productFile) {
            const file = req.files.productFile[0];
            newProduct.file = `/uploads/products/${file.filename}`;
            newProduct.fileName = file.originalname;
            newProduct.fileSize = formatFileSize(file.size);
        }

        products.push(newProduct);
        await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));

        // Оновити категорію
        await updateCategoryCount(newProduct.category);

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
            return res.status(404).json({ error: 'Товар не знайдено' });
        }

        const oldCategory = products[productIndex].category;
        const newCategory = req.body.category || oldCategory;

        // Оновити товар
        products[productIndex] = {
            ...products[productIndex],
            name: req.body.name || products[productIndex].name,
            price: parseFloat(req.body.price) || products[productIndex].price,
            category: newCategory,
            description: req.body.description || products[productIndex].description,
            updatedAt: new Date().toISOString()
        };

        // Оновити зображення
        if (req.files && req.files.productImage) {
            const image = req.files.productImage[0];
            products[productIndex].image = `/uploads/images/${image.filename}`;
        }

        // Оновити файл
        if (req.files && req.files.productFile) {
            const file = req.files.productFile[0];
            products[productIndex].file = `/uploads/products/${file.filename}`;
            products[productIndex].fileName = file.originalname;
            products[productIndex].fileSize = formatFileSize(file.size);
        }

        await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));

        // Оновити кількість товарів у категоріях
        if (oldCategory !== newCategory) {
            await updateCategoryCount(oldCategory, -1);
            await updateCategoryCount(newCategory, 1);
        }

        res.json({ success: true, product: products[productIndex] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Видалити товар
app.delete('/api/products/:id', async (req, res) => {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
        
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Товар не знайдено' });
        }

        const category = products[productIndex].category;
        products.splice(productIndex, 1);

        await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
        await updateCategoryCount(category, -1);

        res.json({ success: true, message: 'Товар видалено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== ЗАМОВЛЕННЯ =====

// Створити замовлення
app.post('/api/orders', async (req, res) => {
    try {
        const { email, items, total, wallet } = req.body;
        
        const ordersData = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(ordersData);
        
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        const newOrder = {
            id: orderId,
            email: email,
            wallet: wallet,
            items: items,
            total: total,
            status: 'pending',
            paymentHash: '',
            createdAt: new Date().toISOString(),
            paidAt: null,
            filesSent: false
        };

        orders.push(newOrder);
        await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));

        // Оновити кількість продажів товарів
        for (const item of items) {
            await updateProductSales(item.productId || item.id);
        }

        // Відправити email з деталями оплати
        await sendPaymentEmail(email, orderId, total, wallet);

        res.json({ 
            success: true, 
            order: newOrder,
            paymentDetails: {
                wallet: process.env.WALLET_ADDRESS,
                network: 'TRC20',
                amount: total,
                orderId: orderId
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Перевірити оплату
app.get('/api/orders/:id/check-payment', async (req, res) => {
    try {
        const ordersData = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(ordersData);
        const order = orders.find(o => o.id === req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Замовлення не знайдено' });
        }

        // Перевірка оплати через TronGrid API
        const isPaid = await checkTronPayment(order.wallet, order.total);

        if (isPaid && order.status === 'pending') {
            order.status = 'paid';
            order.paidAt = new Date().toISOString();
            
            // Відправити файли на email
            await sendOrderFiles(order.email, order.items, order.id);
            order.filesSent = true;

            await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));
        }

        res.json({ 
            success: true, 
            status: order.status,
            paid: order.status === 'paid',
            filesSent: order.filesSent
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== НАЛАШТУВАННЯ =====

// Отримати налаштування
app.get('/api/settings', async (req, res) => {
    try {
        const data = await fs.readFile('data/settings.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Оновити налаштування
app.put('/api/settings', async (req, res) => {
    try {
        await fs.writeFile('data/settings.json', JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== КОНТАКТИ =====

// Отримати контакти
app.get('/api/contacts', async (req, res) => {
    try {
        const data = await fs.readFile('data/contacts.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Оновити контакти
app.put('/api/contacts', upload.single('ownerPhoto'), async (req, res) => {
    try {
        const data = await fs.readFile('data/contacts.json', 'utf8');
        let contacts = JSON.parse(data);
        
        // Оновити основні дані
        contacts = {
            ...contacts,
            ...req.body
        };

        // Оновити фото, якщо завантажено
        if (req.file) {
            contacts.ownerPhoto = `/uploads/owner/${req.file.filename}`;
        }

        await fs.writeFile('data/contacts.json', JSON.stringify(contacts, null, 2));
        res.json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== КАТЕГОРІЇ =====
app.get('/api/categories', async (req, res) => {
    try {
        const data = await fs.readFile('data/categories.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== ДОДАТКОВІ ФУНКЦІЇ =====

// Перевірка оплати через Tron
async function checkTronPayment(userWallet, amount) {
    try {
        // Для тестування завжди повертаємо true
        // У реальному випадку використовуйте TronGrid API
        return true;
    } catch (error) {
        console.error('Помилка перевірки оплати:', error);
        return false;
    }
}

// Відправка файлів на email
async function sendOrderFiles(email, items, orderId) {
    try {
        // Зібрати всі файли з товарів
        const files = [];
        const productsData = await fs.readFile('data/products.json', 'utf8');
        const products = JSON.parse(productsData);

        for (const item of items) {
            const product = products.find(p => p.id === (item.productId || item.id));
            if (product && product.file) {
                const filePath = path.join(__dirname, product.file);
                try {
                    await fs.access(filePath);
                    files.push({
                        filename: product.fileName || `product_${product.id}`,
                        path: filePath
                    });
                } catch {
                    console.log(`Файл не знайдено: ${filePath}`);
                }
            }
        }

        if (files.length === 0) {
            console.log('Немає файлів для відправки');
            return;
        }

        // Налаштування email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Ваше замовлення #${orderId} готове!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D4AF37;">🎉 Ваше замовлення оплачене!</h2>
                    <p>Дякуємо за покупку в <strong>USDT SHOP</strong>!</p>
                    <p><strong>ID замовлення:</strong> ${orderId}</p>
                    <p><strong>Дата:</strong> ${new Date().toLocaleDateString()}</p>
                    
                    <h3 style="color: #D4AF37; margin-top: 30px;">📦 Завантажити товари:</h3>
                    <ul>
                        ${items.map(item => `<li>${item.name} - ${item.price} USDT</li>`).join('')}
                    </ul>
                    
                    <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p><strong>❗ Важливо:</strong> Файли будуть доступні для завантаження протягом 30 днів.</p>
                        <p>Якщо виникли проблеми з завантаженням, звертайтеся в підтримку.</p>
                    </div>
                    
                    <p style="margin-top: 30px;">З повагою,<br>Команда USDT SHOP</p>
                </div>
            `
        };

        // Додати файли як вкладення
        mailOptions.attachments = files.map(file => ({
            filename: file.filename,
            path: file.path
        }));

        const info = await transporter.sendMail(mailOptions);
        console.log('Файли відправлено на email:', info.messageId);
        return true;
    } catch (error) {
        console.error('Помилка відправки файлів:', error);
        return false;
    }
}

// Відправка деталей оплати
async function sendPaymentEmail(email, orderId, amount, userWallet) {
    try {
        const settingsData = await fs.readFile('data/settings.json', 'utf8');
        const settings = JSON.parse(settingsData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Деталі оплати замовлення #${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D4AF37;">💳 Деталі оплати</h2>
                    <p>Для завершення замовлення <strong>#${orderId}</strong> надішліть <strong>${amount} USDT</strong> на адресу:</p>
                    
                    <div style="background-color: #1a1a1a; color: #D4AF37; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace; font-size: 16px; word-break: break-all;">
                        ${settings.walletAddress}
                    </div>
                    
                    <p><strong>Мережа:</strong> TRON (TRC20)</p>
                    <p><strong>Ваша адреса:</strong> ${userWallet}</p>
                    
                    <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
                        <p><strong>❗ Увага:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Надсилайте точно ${amount} USDT</li>
                            <li>Переконайтеся, що використовуєте мережу TRC20</li>
                            <li>Після оплати файли автоматично відправляться на цей email</li>
                            <li>Якщо оплата не буде отримана протягом 30 хвилин, зверніться в підтримку</li>
                        </ul>
                    </div>
                    
                    <p>Після отримання оплати ви отримаєте лист з файлами вашого замовлення.</p>
                    
                    <p style="margin-top: 30px;">З повагою,<br>Команда USDT SHOP</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email з деталями оплати відправлено:', info.messageId);
        return true;
    } catch (error) {
        console.error('Помилка відправки email:', error);
        return false;
    }
}

// Оновлення кількості товарів у категорії
async function updateCategoryCount(categoryName, change = 1) {
    try {
        const data = await fs.readFile('data/categories.json', 'utf8');
        const categories = JSON.parse(data);
        
        const category = categories.find(c => c.name === categoryName);
        if (category) {
            category.count = Math.max(0, (category.count || 0) + change);
            await fs.writeFile('data/categories.json', JSON.stringify(categories, null, 2));
        }
    } catch (error) {
        console.error('Помилка оновлення категорії:', error);
    }
}

// Оновлення кількості продажів товару
async function updateProductSales(productId) {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        const products = JSON.parse(data);
        
        const product = products.find(p => p.id === productId);
        if (product) {
            product.downloads = (product.downloads || 0) + 1;
            await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
        }
    } catch (error) {
        console.error('Помилка оновлення продажів:', error);
    }
}

// Форматування розміру файлу
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== ЗАПУСК СЕРВЕРА =====
app.listen(PORT, async () => {
    await initData();
    console.log(`🚀 Сервер запущено на порті ${PORT}`);
    console.log(`📁 Завантаження файлів: http://localhost:${PORT}/uploads/`);
    console.log(`⚙️  API доступне за: http://localhost:${PORT}/api/`);
    console.log(`👑 Адмін пароль: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
});
