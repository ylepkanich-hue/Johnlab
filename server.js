const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CONFIGURATION =====
const CONFIG = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
    WALLET_ADDRESS: process.env.WALLET_ADDRESS || 'TYourWalletAddress',
    TRON_API_KEY: process.env.TRON_API_KEY || '',
    EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
    EMAIL_PASS: process.env.EMAIL_PASS || 'your-password',
    SITE_URL: process.env.SITE_URL || `http://localhost:${PORT}`,
    SITE_NAME: "JOHN'S LAB TEMPLATES",
    PAYMENT_TIMEOUT: parseInt(process.env.PAYMENT_TIMEOUT_MINUTES) || 60,
    CHECK_INTERVAL: parseInt(process.env.PAYMENT_CHECK_INTERVAL_SECONDS) || 30
};

// ===== FILE UPLOAD CONFIGURATION =====
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            let uploadPath = 'uploads/temp/';
            if (file.fieldname === 'productFile') uploadPath = 'uploads/products/';
            if (file.fieldname === 'productImage') uploadPath = 'uploads/images/';
            if (file.fieldname === 'ownerPhoto') uploadPath = 'uploads/owner/';
            if (file.fieldname === 'logo') uploadPath = 'uploads/logo/';
            if (file.fieldname === 'backgroundImage') uploadPath = 'uploads/backgrounds/';
            
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
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// ===== EMAIL CONFIGURATION =====
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

// ===== TRON BLOCKCHAIN FUNCTIONS =====
class TronPaymentChecker {
    constructor() {
        this.apiUrl = 'https://api.trongrid.io';
        this.activePayments = new Map();
    }

    // Generate unique amount with cents
    generateUniqueAmount(baseAmount) {
        const randomCents = Math.floor(Math.random() * 99) + 1;
        return parseFloat((baseAmount + (randomCents / 100)).toFixed(2));
    }

    // Check transaction on TRON blockchain
    async checkTransaction(walletAddress, expectedAmount, since) {
        try {
            const response = await axios.get(
                `${this.apiUrl}/v1/accounts/${walletAddress}/transactions/trc20`,
                {
                    params: {
                        limit: 50,
                        only_confirmed: true,
                        only_to: true,
                        min_timestamp: since
                    },
                    headers: CONFIG.TRON_API_KEY ? {
                        'TRON-PRO-API-KEY': CONFIG.TRON_API_KEY
                    } : {}
                }
            );

            if (response.data && response.data.data) {
                for (const tx of response.data.data) {
                    // Check if it's USDT (TRC20)
                    if (tx.token_info && tx.token_info.symbol === 'USDT') {
                        const amount = parseFloat(tx.value) / 1000000; // USDT has 6 decimals
                        
                        // Check if amount matches (with 0.01 tolerance)
                        if (Math.abs(amount - expectedAmount) < 0.01) {
                            return {
                                found: true,
                                txId: tx.transaction_id,
                                amount: amount,
                                timestamp: tx.block_timestamp,
                                from: tx.from
                            };
                        }
                    }
                }
            }
            
            return { found: false };
        } catch (error) {
            console.error('Error checking TRON transaction:', error.message);
            return { found: false, error: error.message };
        }
    }

    // Start monitoring payment
    startMonitoring(orderId, amount, wallet, timeout = 60) {
        const uniqueAmount = this.generateUniqueAmount(amount);
        const startTime = Date.now();
        const expiryTime = startTime + (timeout * 60 * 1000);

        this.activePayments.set(orderId, {
            amount: uniqueAmount,
            wallet,
            startTime,
            expiryTime,
            checked: false
        });

        return uniqueAmount;
    }

    // Check if payment is received
    async verifyPayment(orderId) {
        const payment = this.activePayments.get(orderId);
        if (!payment) {
            return { verified: false, error: 'Payment not found' };
        }

        // Check if expired
        if (Date.now() > payment.expiryTime) {
            this.activePayments.delete(orderId);
            return { verified: false, error: 'Payment expired', expired: true };
        }

        // Check blockchain
        const result = await this.checkTransaction(
            CONFIG.WALLET_ADDRESS,
            payment.amount,
            payment.startTime
        );

        if (result.found) {
            payment.checked = true;
            payment.txId = result.txId;
            return {
                verified: true,
                transaction: result,
                amount: payment.amount
            };
        }

        return { 
            verified: false, 
            timeLeft: Math.floor((payment.expiryTime - Date.now()) / 1000 / 60),
            expectedAmount: payment.amount
        };
    }

    // Get payment info
    getPaymentInfo(orderId) {
        const payment = this.activePayments.get(orderId);
        if (!payment) return null;

        return {
            amount: payment.amount,
            wallet: CONFIG.WALLET_ADDRESS,
            expiresAt: payment.expiryTime,
            timeLeft: Math.floor((payment.expiryTime - Date.now()) / 1000 / 60)
        };
    }

    // Cleanup expired payments
    cleanupExpired() {
        const now = Date.now();
        for (const [orderId, payment] of this.activePayments.entries()) {
            if (now > payment.expiryTime) {
                this.activePayments.delete(orderId);
            }
        }
    }
}

const paymentChecker = new TronPaymentChecker();

// Cleanup expired payments every 5 minutes
cron.schedule('*/5 * * * *', () => {
    paymentChecker.cleanupExpired();
    console.log('🧹 Cleaned up expired payments');
});

// ===== CATEGORY HELPERS =====
function buildSlug(name) {
    return name
        ?.toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || '';
}

function countryCodeToFlag(code) {
    if (!code || code.length !== 2) return '';
    const base = 127397;
    return String.fromCodePoint(...code.toUpperCase().split('').map(char => base + char.charCodeAt(0)));
}

async function buildCountryCategories() {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
        const countries = (response.data || [])
            .filter(country => country?.name?.common && country.cca2)
            .sort((a, b) => a.name.common.localeCompare(b.name.common));

        return countries.map(country => ({
            name: country.name.common,
            slug: buildSlug(country.name.common),
            icon: 'fa-flag',
            flag: country.flag || countryCodeToFlag(country.cca2),
            isCountry: true
        }));
    } catch (error) {
        console.error('❌ Failed to fetch country list for categories:', error.message);
        return [];
    }
}

// ===== DATA INITIALIZATION =====
async function initData() {
    try {
        const folders = [
            'uploads/products', 
            'uploads/images', 
            'uploads/owner', 
            'uploads/logo',
            'uploads/backgrounds',
            'data'
        ];
        
        for (const folder of folders) {
            await fs.mkdir(folder, { recursive: true });
        }

        const initialData = {
            products: [
                {
                    id: 1,
                    name: "Modern Website Template",
                    price: 29.99,
                    category: "Website Templates",
                    description: "Clean and modern website template with responsive design",
                    image: "",
                    file: "",
                    downloads: 0,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "E-commerce UI Kit",
                    price: 39.99,
                    category: "UI Kits",
                    description: "Complete UI kit for building e-commerce platforms",
                    image: "",
                    file: "",
                    downloads: 0,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Dashboard Admin Panel",
                    price: 49.99,
                    category: "Dashboards",
                    description: "Professional admin dashboard with analytics",
                    image: "",
                    file: "",
                    downloads: 0,
                    createdAt: new Date().toISOString()
                }
            ],
            categories: [
                { id: 1, name: "Website Templates", slug: "website-templates", icon: "fa-globe" },
                { id: 2, name: "UI Kits", slug: "ui-kits", icon: "fa-layer-group" },
                { id: 3, name: "Dashboards", slug: "dashboards", icon: "fa-chart-line" },
                { id: 4, name: "Mobile Apps", slug: "mobile-apps", icon: "fa-mobile-alt" },
                { id: 5, name: "Landing Pages", slug: "landing-pages", icon: "fa-file-alt" }
            ],
            orders: [],
            settings: {
                shopName: CONFIG.SITE_NAME,
                walletAddress: CONFIG.WALLET_ADDRESS,
                adminEmail: CONFIG.EMAIL_USER,
                adminPassword: CONFIG.ADMIN_PASSWORD,
                telegram: "John_refund",
                logo: "",
                backgroundImage: ""
            },
            contacts: {
                ownerName: "John",
                ownerDescription: "Premium digital templates creator. Professional designs for modern businesses.",
                ownerPhoto: "",
                telegram: "John_refund",
                about: "Welcome to JOHN'S LAB TEMPLATES! Here you'll find exclusive, high-quality digital templates. If you have any questions, feel free to contact me."
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

        await ensureCountryCategories();
        console.log('✅ Data initialized');
    } catch (error) {
        console.error('❌ Initialization error:', error);
    }
}

// ===== HELPER FUNCTIONS =====
async function readData(filename) {
    try {
        const data = await fs.readFile(`data/${filename}.json`, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
}

async function writeData(filename, data) {
    try {
        await fs.writeFile(`data/${filename}.json`, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

async function ensureCountryCategories() {
    const categories = await readData('categories') || [];
    const countryCategories = categories.filter(c => c.isCountry);

    // Avoid re-adding if we already have a full country list with flags
    if (countryCategories.length >= 190) {
        return categories;
    }

    const baseCategories = categories.filter(c => !c.isCountry).map((cat, index) => ({
        ...cat,
        id: cat.id || index + 1,
        slug: cat.slug || buildSlug(cat.name)
    }));

    const countries = await buildCountryCategories();
    if (!countries.length) {
        return categories;
    }

    const startingId = baseCategories.length
        ? Math.max(...baseCategories.map(c => c.id))
        : 0;

    const mergedCategories = [
        ...baseCategories,
        ...countries.map((country, idx) => ({
            ...country,
            id: startingId + idx + 1
        }))
    ];

    await writeData('categories', mergedCategories);
    return mergedCategories;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== API ROUTES =====

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await readData('products');
        res.json(products || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const products = await readData('products');
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

// Add product
app.post('/api/products', upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'productFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const products = await readData('products');
        
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
        await writeData('products', products);
        
        res.json({ success: true, product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update product
app.put('/api/products/:id', upload.fields([
    { name: 'productImage', maxCount: 1 },
    { name: 'productFile', maxCount: 1 }
]), async (req, res) => {
    try {
        const products = await readData('products');
        const index = products.findIndex(p => p.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Update product data
        products[index] = {
            ...products[index],
            name: req.body.name || products[index].name,
            price: req.body.price ? parseFloat(req.body.price) : products[index].price,
            category: req.body.category || products[index].category,
            description: req.body.description || products[index].description,
            updatedAt: new Date().toISOString()
        };

        // Update image if provided
        if (req.files?.productImage) {
            products[index].image = `/uploads/images/${req.files.productImage[0].filename}`;
        }

        // Update file if provided
        if (req.files?.productFile) {
            products[index].file = `/uploads/products/${req.files.productFile[0].filename}`;
            products[index].fileName = req.files.productFile[0].originalname;
            products[index].fileSize = formatFileSize(req.files.productFile[0].size);
        }

        await writeData('products', products);
        res.json({ success: true, product: products[index] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const products = await readData('products');
        const filtered = products.filter(p => p.id !== parseInt(req.params.id));
        
        await writeData('products', filtered);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get categories
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await ensureCountryCategories();
        res.json(categories || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add category
app.post('/api/categories', async (req, res) => {
    try {
        const categories = await readData('categories');
        const newCategory = {
            id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
            name: req.body.name,
            slug: buildSlug(req.body.name),
            icon: req.body.icon || 'fa-folder',
            flag: req.body.flag || '',
            isCountry: !!req.body.isCountry
        };
        
        categories.push(newCategory);
        await writeData('categories', categories);
        res.json({ success: true, category: newCategory });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update category
app.put('/api/categories/:id', async (req, res) => {
    try {
        const categories = await readData('categories');
        const index = categories.findIndex(c => c.id === parseInt(req.params.id));
        
        if (index === -1) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        categories[index] = {
            ...categories[index],
            name: req.body.name || categories[index].name,
            slug: req.body.name ? buildSlug(req.body.name) : categories[index].slug,
            icon: req.body.icon || categories[index].icon,
            flag: req.body.flag !== undefined ? req.body.flag : categories[index].flag,
            isCountry: req.body.isCountry !== undefined ? req.body.isCountry : categories[index].isCountry
        };

        await writeData('categories', categories);
        res.json({ success: true, category: categories[index] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete category
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const categories = await readData('categories');
        const filtered = categories.filter(c => c.id !== parseInt(req.params.id));
        
        await writeData('categories', filtered);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await readData('orders');
        res.json(orders || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { email, items, total, wallet } = req.body;
        
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ success: false, error: 'Valid email is required' });
        }
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
        }
        
        const orders = await readData('orders');
        
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Generate unique amount with different cents for payment identification
        // This ensures even if multiple orders have the same base amount, they'll have unique exact amounts
        const uniqueAmount = paymentChecker.startMonitoring(orderId, total, CONFIG.WALLET_ADDRESS, CONFIG.PAYMENT_TIMEOUT);
        
        const newOrder = {
            id: orderId,
            email,
            customerWallet: wallet || '', // Optional, kept for backward compatibility
            items,
            baseAmount: total,
            exactAmount: uniqueAmount,
            status: 'pending',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + CONFIG.PAYMENT_TIMEOUT * 60 * 1000).toISOString(),
            paidAt: null,
            txId: null,
            downloadToken: uuidv4()
        };

        orders.push(newOrder);
        await writeData('orders', orders);

        // Send payment email with QR code and payment details
        await sendPaymentEmail(email, orderId, uniqueAmount);
        
        res.json({ 
            success: true, 
            order: newOrder,
            paymentDetails: {
                wallet: CONFIG.WALLET_ADDRESS,
                amount: uniqueAmount,
                network: 'TRC20',
                expiresIn: CONFIG.PAYMENT_TIMEOUT
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check payment status
app.get('/api/orders/:id/check', async (req, res) => {
    try {
        const orders = await readData('orders');
        const order = orders.find(o => o.id === req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // If already paid, return success
        if (order.status === 'paid') {
            return res.json({ 
                success: true, 
                status: 'paid',
                paid: true,
                downloadUrl: `${CONFIG.SITE_URL}/download/${order.downloadToken}`
            });
        }

        // Check if expired
        if (new Date() > new Date(order.expiresAt)) {
            order.status = 'expired';
            await writeData('orders', orders);
            return res.json({ 
                success: false, 
                status: 'expired',
                paid: false,
                error: 'Payment time expired'
            });
        }

        // Verify payment on blockchain
        const verification = await paymentChecker.verifyPayment(req.params.id);
        
        if (verification.verified) {
            order.status = 'paid';
            order.paidAt = new Date().toISOString();
            order.txId = verification.transaction.txId;
            
            await writeData('orders', orders);
            
            // Send files email
            await sendOrderFiles(order.email, order.items, order.id, order.downloadToken);
            
            // Update download count
            const products = await readData('products');
            order.items.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    product.downloads = (product.downloads || 0) + 1;
                }
            });
            await writeData('products', products);
            
            return res.json({ 
                success: true, 
                status: 'paid',
                paid: true,
                txId: order.txId,
                downloadUrl: `${CONFIG.SITE_URL}/download/${order.downloadToken}`
            });
        }

        res.json({ 
            success: true, 
            status: 'pending',
            paid: false,
            timeLeft: verification.timeLeft,
            expectedAmount: verification.expectedAmount
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Download files
app.get('/download/:token', async (req, res) => {
    try {
        const orders = await readData('orders');
        const order = orders.find(o => o.downloadToken === req.params.token);
        
        if (!order || order.status !== 'paid') {
            return res.status(404).send('Download not found or payment not confirmed');
        }

        const products = await readData('products');
        const files = order.items.map(item => {
            const product = products.find(p => p.id === item.id);
            return product ? {
                name: product.name,
                path: product.file,
                filename: product.fileName
            } : null;
        }).filter(f => f !== null);

        // For simplicity, redirect to first file or show download page
        if (files.length > 0) {
            res.json({
                success: true,
                files: files.map(f => ({
                    name: f.name,
                    downloadUrl: `${CONFIG.SITE_URL}${f.path}`,
                    filename: f.filename
                }))
            });
        } else {
            res.status(404).json({ success: false, error: 'No files found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get settings
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await readData('settings');
        // Don't send password to client
        const { adminPassword, ...safeSettings } = settings;
        res.json(safeSettings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update settings
app.put('/api/settings', async (req, res) => {
    try {
        const currentSettings = await readData('settings');
        const updatedSettings = {
            ...currentSettings,
            ...req.body
        };
        
        await writeData('settings', updatedSettings);
        
        // Update CONFIG if wallet changed
        if (req.body.walletAddress) {
            CONFIG.WALLET_ADDRESS = req.body.walletAddress;
        }
        
        res.json({ success: true, settings: updatedSettings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload logo
app.post('/api/upload-logo', upload.single('logo'), async (req, res) => {
    try {
        const logoUrl = `/uploads/logo/${req.file.filename}`;
        const settings = await readData('settings');
        settings.logo = logoUrl;
        await writeData('settings', settings);
        
        res.json({ success: true, logoUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload background
app.post('/api/upload-background', upload.single('backgroundImage'), async (req, res) => {
    try {
        const backgroundUrl = `/uploads/backgrounds/${req.file.filename}`;
        const settings = await readData('settings');
        settings.backgroundImage = backgroundUrl;
        await writeData('settings', settings);
        
        res.json({ success: true, backgroundUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await readData('contacts');
        res.json(contacts || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update contacts
app.put('/api/contacts', upload.single('ownerPhoto'), async (req, res) => {
    try {
        const contacts = await readData('contacts');
        
        const updatedContacts = {
            ...contacts,
            ownerName: req.body.ownerName || contacts.ownerName,
            ownerDescription: req.body.ownerDescription || contacts.ownerDescription,
            telegram: req.body.telegram || contacts.telegram,
            about: req.body.about || contacts.about
        };

        if (req.file) {
            updatedContacts.ownerPhoto = `/uploads/owner/${req.file.filename}`;
        }

        await writeData('contacts', updatedContacts);
        res.json({ success: true, contacts: updatedContacts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===== EMAIL FUNCTIONS =====
async function sendPaymentEmail(email, orderId, amount) {
    try {
        // Generate QR code URL for email
        const qrData = `tron:${CONFIG.WALLET_ADDRESS}?amount=${amount}&token=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&bgcolor=FFFFFF&color=000000&margin=10`;
        
        const mailOptions = {
            from: `${CONFIG.SITE_NAME} <${CONFIG.EMAIL_USER}>`,
            to: email,
            subject: `💳 Payment Details - Order #${orderId}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background: #000; color: #fff; margin: 0; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 10px; overflow: hidden; border: 2px solid #D4AF37; }
                        .header { background: linear-gradient(135deg, #D4AF37, #F4D03F); padding: 30px; text-align: center; }
                        .header h1 { margin: 0; color: #000; font-size: 28px; }
                        .content { padding: 30px; }
                        .amount { background: #000; color: #D4AF37; padding: 20px; border-radius: 8px; text-align: center; font-size: 36px; font-weight: bold; margin: 20px 0; }
                        .wallet { background: #000; color: #D4AF37; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all; margin: 20px 0; text-align: center; }
                        .qr-code { text-align: center; margin: 25px 0; padding: 20px; background: #fff; border-radius: 10px; }
                        .qr-code img { max-width: 300px; height: auto; border-radius: 8px; }
                        .info-box { background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .info-box ul { margin: 10px 0; padding-left: 20px; }
                        .info-box li { margin: 8px 0; }
                        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>${CONFIG.SITE_NAME}</h1>
                        </div>
                        <div class="content">
                            <h2 style="color: #D4AF37;">Payment Details</h2>
                            <p>To complete your order <strong>#${orderId}</strong>, please send:</p>
                            
                            <div class="amount">$${amount} USDT</div>
                            
                            <p style="text-align: center; margin-bottom: 15px;">To this address:</p>
                            <div class="wallet">${CONFIG.WALLET_ADDRESS}</div>
                            
                            <div class="qr-code">
                                <p style="color: #000; margin-bottom: 10px; font-weight: bold;">Scan QR Code to Pay</p>
                                <img src="${qrUrl}" alt="USDT Payment QR Code">
                                <p style="color: #666; margin-top: 10px; font-size: 12px;">Scan with your TRON wallet app</p>
                            </div>
                            
                            <div class="info-box">
                                <p><strong>⚠️ IMPORTANT:</strong></p>
                                <ul>
                                    <li>Send exactly <strong>$${amount} USDT</strong> (unique amount for this order)</li>
                                    <li>Use <strong>TRC20</strong> network only</li>
                                    <li>Payment expires in <strong>${CONFIG.PAYMENT_TIMEOUT} minutes</strong></li>
                                    <li>After payment confirmation on blockchain, files will be sent automatically to this email</li>
                                    <li>Each order has a unique payment amount to prevent confusion</li>
                                </ul>
                            </div>
                            
                            <p style="margin-top: 25px;">Your files will be delivered to this email address once payment is confirmed on the TRON blockchain network.</p>
                        </div>
                        <div class="footer">
                            <p>${CONFIG.SITE_NAME} - Premium Digital Templates</p>
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Payment email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Email send error:', error);
        return false;
    }
}

async function sendOrderFiles(email, items, orderId, downloadToken) {
    try {
        const products = await readData('products');
        
        let filesHtml = '';
        items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                filesHtml += `
                    <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin: 10px 0;">
                        <h3 style="margin: 0 0 10px 0; color: #D4AF37;">${product.name}</h3>
                        <p style="margin: 0; color: #888;">File: ${product.fileName || 'Download'} (${product.fileSize || 'N/A'})</p>
                        <a href="${CONFIG.SITE_URL}${product.file}" 
                           style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #D4AF37; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold;">
                            Download File
                        </a>
                    </div>
                `;
            }
        });

        const mailOptions = {
            from: `${CONFIG.SITE_NAME} <${CONFIG.EMAIL_USER}>`,
            to: email,
            subject: `🎉 Your Order #${orderId} is Ready!`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; background: #000; color: #fff; margin: 0; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 10px; overflow: hidden; border: 2px solid #D4AF37; }
                        .header { background: linear-gradient(135deg, #27ae60, #2ecc71); padding: 30px; text-align: center; }
                        .header h1 { margin: 0; color: #fff; font-size: 28px; }
                        .content { padding: 30px; }
                        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ Payment Confirmed!</h1>
                        </div>
                        <div class="content">
                            <h2 style="color: #D4AF37;">Thank you for your purchase!</h2>
                            <p>Your order <strong>#${orderId}</strong> has been successfully paid and processed.</p>
                            
                            <h3 style="color: #D4AF37; margin-top: 30px;">📦 Your Files:</h3>
                            ${filesHtml}
                            
                            <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                                <p style="margin: 0 0 15px 0;">Or use this download link:</p>
                                <a href="${CONFIG.SITE_URL}/download/${downloadToken}" 
                                   style="display: inline-block; padding: 15px 30px; background: #D4AF37; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                    Download All Files
                                </a>
                            </div>
                            
                            <p><strong>⚠️ Note:</strong> Download links are valid for 30 days.</p>
                            
                            <p>If you have any questions, feel free to contact us on Telegram: @${await readData('contacts').then(c => c.telegram)}</p>
                        </div>
                        <div class="footer">
                            <p>${CONFIG.SITE_NAME} - Premium Digital Templates</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Files sent to ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Files email error:', error);
        return false;
    }
}

// ===== START SERVER =====
app.listen(PORT, async () => {
    await initData();
    console.log(`
╔════════════════════════════════════════════════════════════╗
║           🚀 JOHN'S LAB TEMPLATES - RUNNING                ║
╠════════════════════════════════════════════════════════════╣
║ 🌐 URL:      ${CONFIG.SITE_URL.padEnd(43)} ║
║ 💰 Wallet:   ${CONFIG.WALLET_ADDRESS.padEnd(43)} ║
║ 👑 Admin:    Password: ${CONFIG.ADMIN_PASSWORD.padEnd(33)} ║
║ ⏱️  Timeout:  ${CONFIG.PAYMENT_TIMEOUT} minutes payment window${' '.repeat(24)} ║
╚════════════════════════════════════════════════════════════╝
    `);
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
