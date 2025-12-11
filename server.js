const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== КОНФІГУРАЦІЯ =====
const CONFIG = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
    WALLET_ADDRESS: process.env.WALLET_ADDRESS || 'Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
    EMAIL_PASS: process.env.EMAIL_PASS || 'your-password',
    SITE_NAME: 'USDT SHOP'
};

// ===== НАЛАШТУВАННЯ ЗАВАНТАЖЕННЯ ФАЙЛІВ =====
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
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: CONFIG.EMAIL_USER,
        pass: CONFIG.EMAIL_PASS
    }
});

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// ===== ІНІЦІАЛІЗАЦІЯ ДАНИХ =====
async function initData() {
    try {
        // Створюємо папки
        const folders = ['uploads/products', 'uploads/images', 'uploads/owner', 'uploads/logo', 'data'];
        for (const folder of folders) {
            await fs.mkdir(folder, { recursive: true });
        }

        // Початкові дані
        const initialData = {
            products: [
                {
                    id: 1,
                    name: "Premium PSD Website Template",
                    price: 25.99,
                    category: "PSD",
                    description: "Modern website template with clean design",
                    image: "",
                    file: "",
                    downloads: 42,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "E-commerce UI Kit",
                    price: 19.99,
                    category: "UI Kits",
                    description: "Complete UI kit for online stores",
                    image: "",
                    file: "",
                    downloads: 28,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Crypto Dashboard Design",
                    price: 34.99,
                    category: "Dashboards",
                    description: "Professional dashboard for crypto platforms",
                    image: "",
                    file: "",
                    downloads: 15,
                    createdAt: new Date().toISOString()
                }
            ],
            categories: [
                { id: 1, name: "PSD", icon: "fa-palette" },
                { id: 2, name: "UI Kits", icon: "fa-layer-group" },
                { id: 3, name: "Dashboards", icon: "fa-chart-line" },
                { id: 4, name: "Illustrations", icon: "fa-paint-brush" }
            ],
            orders: [],
            settings: {
                shopName: CONFIG.SITE_NAME,
                walletAddress: CONFIG.WALLET_ADDRESS,
                adminEmail: CONFIG.EMAIL_USER,
                adminPassword: CONFIG.ADMIN_PASSWORD,
                telegram: "@usdt_shop",
                instagram: "@usdt.shop"
            },
            contacts: {
                ownerName: "Володар магазину",
                ownerDescription: "Професійний дизайнер з багаторічним досвідом. Створюю унікальні цифрові продукти.",
                ownerPhoto: "",
                telegram: "@owner",
                instagram: "@owner.design",
                whatsapp: "+380123456789",
                about: "Ласкаво просимо до мого магазину! Тут ви знайдете ексклюзивні дизайнерські роботи. Якщо є питання - звертайтеся!"
            }
        };

        // Створюємо файли, якщо не існують
        for (const [key, data] of Object.entries(initialData)) {
            const filePath = `data/${key}.json`;
            try {
                await fs.access(filePath);
            } catch {
                await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            }
        }

        console.log('✅ Дані ініціалізовано');
    } catch (error) {
        console.error('❌ Помилка ініціалізації:', error);
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
            createdAt: new Date().toISOString()
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

// Отримати замовлення
app.get('/api/orders', async (req, res) => {
    try {
        const data = await fs.readFile('data/orders.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Створити замовлення
app.post('/api/orders', async (req, res) => {
    try {
        const { email, items, total, wallet } = req.body;
        
        const data = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(data);
        
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        const newOrder = {
            id: orderId,
            email,
            wallet,
            items,
            total,
            status: 'pending',
            createdAt: new Date().toISOString(),
            paidAt: null,
            filesSent: false
        };

        orders.push(newOrder);
        await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));

        // Відправити email з деталями оплати
        await sendPaymentEmail(email, orderId, total);
        
        res.json({ 
            success: true, 
            order: newOrder,
            wallet: CONFIG.WALLET_ADDRESS,
            network: 'TRC20'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Перевірити оплату
app.get('/api/orders/:id/check', async (req, res) => {
    try {
        const data = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(data);
        const order = orders.find(o => o.id === req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Симуляція успішної оплати (в реальності - перевірка через API)
        if (order.status === 'pending') {
            order.status = 'paid';
            order.paidAt = new Date().toISOString();
            
            // Відправити файли
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
        
        // Оновити дані
        contacts = {
            ...contacts,
            ownerName: req.body.ownerName || contacts.ownerName,
            ownerDescription: req.body.ownerDescription || contacts.ownerDescription,
            telegram: req.body.telegram || contacts.telegram,
            instagram: req.body.instagram || contacts.instagram,
            whatsapp: req.body.whatsapp || contacts.whatsapp,
            about: req.body.about || contacts.about
        };

        // Оновити фото
        if (req.file) {
            contacts.ownerPhoto = `/uploads/owner/${req.file.filename}`;
        }

        await fs.writeFile('data/contacts.json', JSON.stringify(contacts, null, 2));
        res.json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Оновити лого
app.post('/api/upload-logo', upload.single('logo'), async (req, res) => {
    try {
        res.json({ 
            success: true, 
            logoUrl: `/uploads/logo/${req.file.filename}` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== EMAIL ФУНКЦІЇ =====

async function sendPaymentEmail(email, orderId, amount) {
    try {
        const mailOptions = {
            from: CONFIG.EMAIL_USER,
            to: email,
            subject: `💳 Деталі оплати замовлення #${orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D4AF37;">USDT SHOP - Деталі оплати</h2>
                    <p>Для завершення замовлення <strong>#${orderId}</strong> надішліть:</p>
                    <h1 style="color: #D4AF37; font-size: 36px; margin: 20px 0;">${amount} USDT</h1>
                    <p>на адресу:</p>
                    <div style="background: #1a1a1a; color: #D4AF37; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all;">
                        ${CONFIG.WALLET_ADDRESS}
                    </div>
                    <p><strong>Мережа:</strong> TRON (TRC20)</p>
                    <div style="margin-top: 30px; padding: 20px; background: #f4f4f4; border-radius: 10px;">
                        <p><strong>📌 Інструкція:</strong></p>
                        <ol>
                            <li>Надішліть точно ${amount} USDT</li>
                            <li>Використовуйте мережу TRC20</li>
                            <li>Після оплати файли автоматично відправляться на цей email</li>
                        </ol>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email відправлено до ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Помилка відправки email:', error);
        return false;
    }
}

async function sendOrderFiles(email, items, orderId) {
    try {
        const productsData = await fs.readFile('data/products.json', 'utf8');
        const products = JSON.parse(productsData);
        
        let filesHtml = '';
        for (const item of items) {
            const product = products.find(p => p.id === item.id);
            if (product?.file) {
                filesHtml += `<li>${product.name} - <a href="${process.env.SITE_URL || 'http://localhost:3000'}${product.file}">Завантажити</a></li>`;
                
                // Оновити кількість завантажень
                product.downloads = (product.downloads || 0) + 1;
            }
        }
        
        // Зберегти оновлені дані
        await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));

        const mailOptions = {
            from: CONFIG.EMAIL_USER,
            to: email,
            subject: `🎉 Ваше замовлення #${orderId} готове!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D4AF37;">USDT SHOP - Замовлення оплачене!</h2>
                    <p>Дякуємо за покупку! Ваше замовлення <strong>#${orderId}</strong> успішно оплачене.</p>
                    
                    <h3 style="color: #D4AF37; margin-top: 30px;">📦 Ваші файли:</h3>
                    <ul>${filesHtml || '<li>Файли будуть доступні в особистому кабінеті</li>'}</ul>
                    
                    <div style="margin-top: 30px; padding: 20px; background: #f4f4f4; border-radius: 10px;">
                        <p><strong>❗ Важливо:</strong> Посилання дійсні 30 днів.</p>
                    </div>
                    
                    <p style="margin-top: 30px;">З повагою,<br>Команда USDT SHOP</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Файли відправлено до ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Помилка відправки файлів:', error);
        return false;
    }
}

// ===== ДОПОМІЖНІ ФУНКЦІЇ =====

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
    console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║                🚀 USDT SHOP Запущено!                 ║
    ╠═══════════════════════════════════════════════════════╣
    ║ 🌐 Сайт:     http://localhost:${PORT}                   ║
    ║ 📁 Файли:    http://localhost:${PORT}/uploads/         ║
    ║ 👑 Адмін:    Пароль: ${CONFIG.ADMIN_PASSWORD}           ║
    ║ 💰 Гаманець: ${CONFIG.WALLET_ADDRESS}                   ║
    ╚═══════════════════════════════════════════════════════╝
    `);
});

// Обробка 404
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - USDT SHOP</title>
            <style>
                body { 
                    background: #000; 
                    color: #D4AF37; 
                    font-family: Arial; 
                    text-align: center; 
                    padding: 50px; 
                }
                h1 { font-size: 48px; }
                a { color: #D4AF37; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>404</h1>
            <p>Сторінка не знайдена</p>
            <a href="/">На головну</a>
        </body>
        </html>
    `);
});
