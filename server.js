const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування завантаження файлів
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/temp/';
        if (file.fieldname === 'productFile') uploadPath = 'uploads/products/';
        if (file.fieldname === 'productImage') uploadPath = 'uploads/images/';
        fs.mkdir(uploadPath, { recursive: true }).then(() => cb(null, uploadPath));
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + unique + ext);
    }
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.static('.')); // Для обслуговування index.html
app.use('/uploads', express.static('uploads'));

// Створення папок при запуску
async function initFolders() {
    const folders = ['uploads/products', 'uploads/images', 'uploads/temp', 'data'];
    for (const folder of folders) {
        await fs.mkdir(folder, { recursive: true });
    }
    // Створення початкових JSON файлів
    const defaultData = { products: [], categories: [], orders: [], settings: {} };
    for (const file of ['products', 'categories', 'orders', 'settings']) {
        try { await fs.access(`data/${file}.json`); } 
        catch { await fs.writeFile(`data/${file}.json`, JSON.stringify(defaultData[file] || [], null, 2)); }
    }
}

// API: Отримати всі товари
app.get('/api/products', async (req, res) => {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.json([]);
    }
});

// API: Додати товар (з завантаженням файлу та зображення)
app.post('/api/products', upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'productFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const products = JSON.parse(await fs.readFile('data/products.json', 'utf8'));
        const newProduct = {
            id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name: req.body.name,
            price: parseFloat(req.body.price),
            category: req.body.category,
            description: req.body.description,
            createdAt: new Date().toISOString(),
            sales: 0,
            active: true
        };
        if (req.files.productImage) {
            newProduct.image = `/uploads/images/${req.files.productImage[0].filename}`;
        }
        if (req.files.productFile) {
            newProduct.fileUrl = `/uploads/products/${req.files.productFile[0].filename}`;
            newProduct.fileName = req.files.productFile[0].originalname;
        }
        products.push(newProduct);
        await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
        res.json({ success: true, product: newProduct });
    } catch (err) {
        res.status(500).json({ error: 'Помилка додавання товару' });
    }
});

// API: Створити замовлення
app.post('/api/orders', async (req, res) => {
    try {
        const orders = JSON.parse(await fs.readFile('data/orders.json', 'utf8'));
        const order = {
            id: 'ORD-' + Date.now(),
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        orders.push(order);
        await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ error: 'Помилка створення замовлення' });
    }
});

// Обслуговування головної сторінки
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, async () => {
    await initFolders();
    console.log(`✅ Сервер запущено на порті ${PORT}`);
    console.log(`🌐 Відкрийте: http://localhost:${PORT}`);
    console.log(`📁 Файли зберігаються в папці uploads/`);
});
