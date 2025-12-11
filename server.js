const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const TronWeb = require('tronweb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CONFIGURATION =====
const CONFIG = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
    WALLET_ADDRESS: process.env.WALLET_ADDRESS || 'Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    SITE_NAME: "JOHN'S LAB TEMPLATES",
    TELEGRAM_LINK: "https://t.me/John_refund",
    CURRENCY: "USDT",
    NETWORK: "TRC20"
};

// ===== TRON WEB3 =====
const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY || '' }
});

// ===== FILE UPLOAD CONFIG =====
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
    limits: { fileSize: 100 * 1024 * 1024 }
});

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// ===== DATA INITIALIZATION =====
async function initData() {
    try {
        const folders = ['uploads/products', 'uploads/images', 'uploads/owner', 'uploads/logo', 'data'];
        for (const folder of folders) {
            await fs.mkdir(folder, { recursive: true });
        }

        const initialData = {
            products: [
                {
                    id: 1,
                    name: "Premium PSD Website Template",
                    price: 25.99,
                    category: "PSD Templates",
                    description: "Modern website template with clean design and responsive layout",
                    image: "",
                    file: "",
                    downloads: 0,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "E-commerce UI Kit",
                    price: 19.99,
                    category: "UI Kits",
                    description: "Complete UI kit for online stores and shopping platforms",
                    image: "",
                    file: "",
                    downloads: 0,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Crypto Dashboard Design",
                    price: 34.99,
                    category: "Dashboards",
                    description: "Professional dashboard design for cryptocurrency platforms",
                    image: "",
                    file: "",
                    downloads: 0,
                    createdAt: new Date().toISOString()
                }
            ],
            categories: [
                { id: 1, name: "PSD Templates", icon: "fa-palette" },
                { id: 2, name: "UI Kits", icon: "fa-layer-group" },
                { id: 3, name: "Dashboards", icon: "fa-chart-line" },
                { id: 4, name: "Illustrations", icon: "fa-paint-brush" },
                { id: 5, name: "Fonts", icon: "fa-font" },
                { id: 6, name: "3D Models", icon: "fa-cube" }
            ],
            orders: [],
            settings: {
                shopName: CONFIG.SITE_NAME,
                walletAddress: CONFIG.WALLET_ADDRESS,
                adminPassword: CONFIG.ADMIN_PASSWORD,
                telegram: CONFIG.TELEGRAM_LINK,
                currency: CONFIG.CURRENCY,
                network: CONFIG.NETWORK
            },
            contacts: {
                ownerName: "John",
                ownerDescription: "Professional digital product designer with 5+ years of experience. Creating premium templates for designers and developers.",
                ownerPhoto: "",
                telegram: CONFIG.TELEGRAM_LINK,
                about: "Welcome to my digital template shop! All products are carefully crafted and tested. For any questions or support, contact me on Telegram."
            }
        };

        for (const [key, data] of Object.entries(initialData)) {
            const filePath = `data/${key}.json`;
            try {
                await fs.access(filePath);
            } catch {
                await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            }
        }

        console.log('✅ Data initialized successfully');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
}

// ===== API ROUTES =====

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const data = await fs.readFile('data/products.json', 'utf8');
        const products = JSON.parse(data);
        const product = products.find(p => p.id === parseInt(req.params.id));
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new product
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

        if (req.files?.productImage) {
            newProduct.image = `/uploads/images/${req.files.productImage[0].filename}`;
        }

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

// Update product
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

        products[productIndex] = {
            ...products[productIndex],
            name: req.body.name || products[productIndex].name,
            price: parseFloat(req.body.price) || products[productIndex].price,
            category: req.body.category || products[productIndex].category,
            description: req.body.description || products[productIndex].description,
            updatedAt: new Date().toISOString()
        };

        if (req.files?.productImage) {
            products[productIndex].image = `/uploads/images/${req.files.productImage[0].filename}`;
        }

        if (req.files?.productFile) {
            products[productIndex].file = `/uploads/products/${req.files.productFile[0].filename}`;
            products[productIndex].fileName = req.files.productFile[0].originalname;
            products[productIndex].fileSize = formatFileSize(req.files.productFile[0].size);
        }

        await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
        res.json({ success: true, product: products[productIndex] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete product
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

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const data = await fs.readFile('data/categories.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add category
app.post('/api/categories', async (req, res) => {
    try {
        const data = await fs.readFile('data/categories.json', 'utf8');
        const categories = JSON.parse(data);
        
        const newCategory = {
            id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
            name: req.body.name,
            icon: req.body.icon || 'fa-folder'
        };

        categories.push(newCategory);
        await fs.writeFile('data/categories.json', JSON.stringify(categories, null, 2));
        
        res.json({ success: true, category: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update category
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
            icon: req.body.icon || categories[categoryIndex].icon
        };

        await fs.writeFile('data/categories.json', JSON.stringify(categories, null, 2));
        res.json({ success: true, category: categories[categoryIndex] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete category
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

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { email, items, total } = req.body;
        
        const data = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(data);
        
        // Generate unique amount with cents for identification
        const baseAmount = parseFloat(total);
        const uniqueCents = Math.floor(Math.random() * 99) + 1; // 1-99 cents
        const uniqueAmount = baseAmount + (uniqueCents / 100);
        
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        const newOrder = {
            id: orderId,
            email: email,
            items: items,
            originalAmount: baseAmount,
            payableAmount: uniqueAmount,
            status: 'pending',
            wallet: CONFIG.WALLET_ADDRESS,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes
            paidAt: null,
            transactionHash: '',
            downloadToken: uuidv4()
        };

        orders.push(newOrder);
        await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));

        res.json({ 
            success: true, 
            order: newOrder,
            paymentDetails: {
                wallet: CONFIG.WALLET_ADDRESS,
                network: CONFIG.NETWORK,
                amount: uniqueAmount,
                orderId: orderId,
                expiresAt: newOrder.expiresAt
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check payment status
app.get('/api/orders/:id/status', async (req, res) => {
    try {
        const data = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(data);
        const order = orders.find(o => o.id === req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if order expired
        if (new Date(order.expiresAt) < new Date()) {
            order.status = 'expired';
            await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));
            return res.json({ 
                success: false, 
                status: 'expired',
                message: 'Payment time expired'
            });
        }

        // Check blockchain for payment
        const isPaid = await checkBlockchainPayment(order.wallet, order.payableAmount);
        
        if (isPaid.paid && order.status === 'pending') {
            order.status = 'paid';
            order.paidAt = new Date().toISOString();
            order.transactionHash = isPaid.txHash;
            
            // Update product downloads
            const productsData = await fs.readFile('data/products.json', 'utf8');
            let products = JSON.parse(productsData);
            
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    product.downloads = (product.downloads || 0) + 1;
                }
            });
            
            await fs.writeFile('data/products.json', JSON.stringify(products, null, 2));
            await fs.writeFile('data/orders.json', JSON.stringify(orders, null, 2));
        }

        res.json({ 
            success: true, 
            status: order.status,
            paid: order.status === 'paid',
            downloadToken: order.downloadToken,
            transactionHash: order.transactionHash,
            expiresAt: order.expiresAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get order by token
app.get('/api/download/:token', async (req, res) => {
    try {
        const data = await fs.readFile('data/orders.json', 'utf8');
        const orders = JSON.parse(data);
        const order = orders.find(o => o.downloadToken === req.params.token);

        if (!order) {
            return res.status(404).json({ error: 'Download not found' });
        }

        if (order.status !== 'paid') {
            return res.status(403).json({ error: 'Order not paid' });
        }

        // Get product files
        const productsData = await fs.readFile('data/products.json', 'utf8');
        const products = JSON.parse(productsData);
        
        const files = [];
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product && product.file) {
                files.push({
                    name: product.name,
                    fileName: product.fileName || `product_${product.id}`,
                    fileUrl: product.file,
                    fileSize: product.fileSize
                });
            }
        });

        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get settings
app.get('/api/settings', async (req, res) => {
    try {
        const data = await fs.readFile('data/settings.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings
app.put('/api/settings', async (req, res) => {
    try {
        await fs.writeFile('data/settings.json', JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const data = await fs.readFile('data/contacts.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update contacts
app.put('/api/contacts', upload.single('ownerPhoto'), async (req, res) => {
    try {
        const data = await fs.readFile('data/contacts.json', 'utf8');
        let contacts = JSON.parse(data);
        
        contacts = {
            ...contacts,
            ownerName: req.body.ownerName || contacts.ownerName,
            ownerDescription: req.body.ownerDescription || contacts.ownerDescription,
            telegram: req.body.telegram || contacts.telegram,
            about: req.body.about || contacts.about
        };

        if (req.file) {
            contacts.ownerPhoto = `/uploads/owner/${req.file.filename}`;
        }

        await fs.writeFile('data/contacts.json', JSON.stringify(contacts, null, 2));
        res.json({ success: true, contacts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update logo
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

// Search products
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q?.toLowerCase() || '';
        const category = req.query.category || '';
        
        const data = await fs.readFile('data/products.json', 'utf8');
        let products = JSON.parse(data);
        
        if (query) {
            products = products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query)
            );
        }
        
        if (category && category !== 'all') {
            products = products.filter(p => p.category === category);
        }
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== BLOCKCHAIN FUNCTIONS =====

async function checkBlockchainPayment(walletAddress, amount) {
    try {
        // For demo purposes - in production use real API
        // This is a simplified version
        console.log(`Checking payment: ${amount} USDT to ${walletAddress}`);
        
        // Simulate payment check (replace with real API call)
        // Example using TronGrid API:
        // const transactions = await tronWeb.trx.getTransactionsRelated(walletAddress, 'to', { only_confirmed: true });
        
        return {
            paid: false, // Change to true when payment detected
            txHash: '',
            amount: amount,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Blockchain check error:', error);
        return { paid: false, txHash: '', amount: amount };
    }
}

// ===== HELPER FUNCTIONS =====

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== SERVER START =====
app.listen(PORT, async () => {
    await initData();
    console.log(`
    ╔═══════════════════════════════════════════════════════╗
    ║          🚀 JOHN'S LAB TEMPLATES STARTED!             ║
    ╠═══════════════════════════════════════════════════════╣
    ║ 🌐 Website:   http://localhost:${PORT}                ║
    ║ 📁 Uploads:   http://localhost:${PORT}/uploads/       ║
    ║ 👑 Admin:     Password: ${CONFIG.ADMIN_PASSWORD}      ║
    ║ 💰 Wallet:    ${CONFIG.WALLET_ADDRESS}                ║
    ║ 📞 Telegram:  ${CONFIG.TELEGRAM_LINK}                 ║
    ╚═══════════════════════════════════════════════════════╝
    `);
});

// Handle 404
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - JOHN'S LAB TEMPLATES</title>
            <style>
                body { background: #000; color: #D4AF37; font-family: Arial; text-align: center; padding: 50px; }
                h1 { font-size: 48px; }
                a { color: #D4AF37; text-decoration: none; }
            </style>
        </head>
        <body>
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/">Go to homepage</a>
        </body>
        </html>
    `);
});
