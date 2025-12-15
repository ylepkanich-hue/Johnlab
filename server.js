const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cron = require('node-cron');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== CONFIGURATION =====
const CONFIG = {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
    WALLET_ADDRESS: process.env.WALLET_ADDRESS || 'TLN2r1R9Bod7sMEWoqZrL4Awue29LCJohn',
    TRON_API_KEY: process.env.TRON_API_KEY || '244c879d-e9ee-456d-911a-92dd800b8eac',
    EMAIL_USER: process.env.EMAIL_USER || 'john.psd.lab@gmail.com',
    EMAIL_PASS: process.env.EMAIL_PASS || 'vkvn nfxh whve oemu'.replace(/\s/g, ''),
    SITE_URL: process.env.SITE_URL || `http://localhost:${PORT}`,
    SITE_NAME: "JOHN'S LAB TEMPLATES",
    PAYMENT_TIMEOUT: parseInt(process.env.PAYMENT_TIMEOUT_MINUTES) || 60,
    CHECK_INTERVAL: parseInt(process.env.PAYMENT_CHECK_INTERVAL_SECONDS) || 30,
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production-' + Date.now()
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
// Gmail app password should be 16 characters without spaces
const gmailAppPassword = CONFIG.EMAIL_PASS.replace(/\s/g, '');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: CONFIG.EMAIL_USER,
        pass: gmailAppPassword
    },
    tls: {
        rejectUnauthorized: false
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
            console.log(`🔍 Checking transactions for wallet ${walletAddress}, expected: $${expectedAmount}, since: ${new Date(since).toISOString()}`);
            
            // Try with API key first, fallback to no key if it fails
            let response;
            try {
                response = await axios.get(
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
            } catch (apiKeyError) {
                if (apiKeyError.response?.status === 401 && CONFIG.TRON_API_KEY) {
                    console.log(`⚠️ API key invalid, retrying without API key...`);
                    // Retry without API key
                    response = await axios.get(
                        `${this.apiUrl}/v1/accounts/${walletAddress}/transactions/trc20`,
                        {
                            params: {
                                limit: 50,
                                only_confirmed: true,
                                only_to: true,
                                min_timestamp: since
                            }
                        }
                    );
                } else {
                    throw apiKeyError;
                }
            }

            console.log(`📊 API Response: ${response.data?.data?.length || 0} transactions found`);

            if (response.data && response.data.data) {
                console.log(`   Processing ${response.data.data.length} transactions...`);
                
                for (const tx of response.data.data) {
                    // Check if it's USDT (TRC20) - check multiple ways
                    const tokenInfo = tx.token_info || {};
                    const isUSDT = (
                        tokenInfo.symbol === 'USDT' || 
                        tokenInfo.address === 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' ||
                        tokenInfo.name === 'Tether USD' ||
                        tokenInfo.name === 'USDT'
                    );
                    
                    if (isUSDT) {
                        const amount = parseFloat(tx.value) / 1000000; // USDT has 6 decimals
                        const difference = Math.abs(amount - expectedAmount);
                        
                        console.log(`  💰 Found USDT tx: $${amount.toFixed(2)} (expected: $${expectedAmount.toFixed(2)}, diff: $${difference.toFixed(2)})`);
                        console.log(`     TX ID: ${tx.transaction_id}`);
                        console.log(`     From: ${tx.from}`);
                        console.log(`     Time: ${new Date(tx.block_timestamp).toISOString()}`);
                        
                        // Check if amount matches (with 0.01 tolerance)
                        if (difference < 0.01) {
                            console.log(`✅✅✅ MATCH FOUND! Transaction ID: ${tx.transaction_id} ✅✅✅`);
                            return {
                                found: true,
                                txId: tx.transaction_id,
                                amount: amount,
                                timestamp: tx.block_timestamp,
                                from: tx.from
                            };
                        } else {
                            console.log(`     ⚠️ Amount mismatch: diff is $${difference.toFixed(2)} (tolerance: $0.01)`);
                        }
                    } else {
                        // Log what token was found for debugging
                        const tokenSymbol = tokenInfo.symbol || tokenInfo.name || 'UNKNOWN';
                        if (tokenSymbol !== 'UNKNOWN') {
                            console.log(`  ⚠️ Skipped non-USDT token: ${tokenSymbol} (${tokenInfo.address || 'no address'})`);
                        }
                    }
                }
            } else {
                console.log(`   ⚠️ No transaction data in response`);
                if (response.data) {
                    console.log(`   Response keys:`, Object.keys(response.data));
                }
            }
            
            console.log(`❌ No matching transaction found`);
            return { found: false };
        } catch (error) {
            console.error('❌ Error checking TRON transaction:', error.message);
            if (error.response) {
                console.error('   Response status:', error.response.status);
                console.error('   Response data:', error.response.data);
            }
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
            console.log(`⚠️ Payment not found in activePayments for order ${orderId}`);
            // Try to get from orders database
            try {
                const orders = await readData('orders');
                const order = orders.find(o => o.id === orderId);
                if (order && order.status === 'pending') {
                    console.log(`📋 Found order in database, expected amount: $${order.exactAmount}`);
                    // Recreate payment entry
                    this.activePayments.set(orderId, {
                        amount: order.exactAmount,
                        wallet: CONFIG.WALLET_ADDRESS,
                        startTime: new Date(order.createdAt).getTime(),
                        expiryTime: new Date(order.expiresAt).getTime(),
                        checked: false
                    });
                    const restoredPayment = this.activePayments.get(orderId);
                    return await this.verifyPayment(orderId); // Retry with restored payment
                }
            } catch (err) {
                console.error('Error reading orders:', err);
            }
            return { verified: false, error: 'Payment not found' };
        }

        // Check if expired
        if (Date.now() > payment.expiryTime) {
            this.activePayments.delete(orderId);
            return { verified: false, error: 'Payment expired', expired: true };
        }

        console.log(`🔍 Verifying payment for order ${orderId}: Expected $${payment.amount}`);

        // Check blockchain - use a timestamp 5 minutes before order creation to catch any early payments
        // Also don't go back more than 24 hours
        const checkSince = Math.max(
            payment.startTime - (5 * 60 * 1000), // 5 minutes before order
            Date.now() - (24 * 60 * 60 * 1000) // Max 24 hours ago
        );
        console.log(`   Checking since: ${new Date(checkSince).toISOString()}`);
        console.log(`   Order created: ${new Date(payment.startTime).toISOString()}`);
        
        const result = await this.checkTransaction(
            CONFIG.WALLET_ADDRESS,
            payment.amount,
            checkSince
        );

        if (result.found) {
            console.log(`✅ Payment verified for order ${orderId}!`);
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

// Automatically check pending payments every CHECK_INTERVAL seconds
cron.schedule(`*/${CONFIG.CHECK_INTERVAL} * * * * *`, async () => {
    try {
        const orders = await readData('orders');
        const pendingOrders = orders.filter(o => o.status === 'pending' && new Date(o.expiresAt) > new Date());
        
        if (pendingOrders.length > 0) {
            console.log(`\n⏰ [${new Date().toISOString()}] Checking ${pendingOrders.length} pending payment(s)...`);
            
            for (const order of pendingOrders) {
                console.log(`  📦 Order ${order.id}: Expected $${order.exactAmount || order.baseAmount}`);
                
                // Ensure payment is in activePayments map
                if (!paymentChecker.activePayments.has(order.id) && order.exactAmount) {
                    console.log(`  🔄 Restoring payment entry for order ${order.id}`);
                    paymentChecker.activePayments.set(order.id, {
                        amount: order.exactAmount,
                        wallet: CONFIG.WALLET_ADDRESS,
                        startTime: new Date(order.createdAt).getTime(),
                        expiryTime: new Date(order.expiresAt).getTime(),
                        checked: false
                    });
                }
                
                const verification = await paymentChecker.verifyPayment(order.id);
                
                if (verification.verified) {
                    console.log(`\n✅✅✅ PAYMENT CONFIRMED FOR ORDER ${order.id} ✅✅✅\n`);
                    
                    // Update order status
                    order.status = 'paid';
                    order.paidAt = new Date().toISOString();
                    order.txId = verification.transaction.txId;
                    
                    await writeData('orders', orders);
                    
                    // Send files email automatically
                    try {
                        await sendOrderFiles(order.email, order.items, order.id, order.downloadToken);
                        console.log(`📧 Files email sent to ${order.email} for order ${order.id}`);
                    } catch (emailError) {
                        console.error(`❌ Error sending email:`, emailError);
                    }
                    
                    // Update download counts
                    const products = await readData('products');
                    order.items.forEach(item => {
                        const product = products.find(p => p.id === item.id);
                        if (product) {
                            product.downloads = (product.downloads || 0) + 1;
                        }
                    });
                    await writeData('products', products);
                } else if (verification.error) {
                    console.log(`  ⚠️ Order ${order.id}: ${verification.error}`);
                } else {
                    console.log(`  ⏳ Order ${order.id}: Still waiting... (${verification.timeLeft || 'N/A'} min left)`);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error in automatic payment check:', error);
        console.error('Stack:', error.stack);
    }
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

// Get all countries for product filtering
async function getAllCountries() {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2,flag');
        const countries = (response.data || [])
            .filter(country => country?.name?.common && country.cca2)
            .sort((a, b) => a.name.common.localeCompare(b.name.common));

        return countries.map(country => ({
            name: country.name.common,
            code: country.cca2,
            flag: country.flag || countryCodeToFlag(country.cca2)
        }));
    } catch (error) {
        console.error('❌ Failed to fetch country list:', error.message);
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
                    name: "Sample Passport Template",
                    price: 29.99,
                    category: "Passport",
                    description: "Professional passport template",
                    image: "",
                    file: "",
                    downloads: 0,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Sample ID Card Template",
                    price: 39.99,
                    category: "ID",
                    description: "Professional ID card template",
                    image: "",
                    file: "",
                    downloads: 0,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Sample Driving License Template",
                    price: 49.99,
                    category: "Driving",
                    description: "Professional driving license template",
                    image: "",
                    file: "",
                    downloads: 0,
                    createdAt: new Date().toISOString()
                }
            ],
            categories: [
                { id: 1, name: "Passport", slug: "passport", icon: "fa-passport" },
                { id: 2, name: "ID", slug: "id", icon: "fa-id-card" },
                { id: 3, name: "Driving", slug: "driving", icon: "fa-truck" },
                { id: 4, name: "Bill", slug: "bill", icon: "fa-file-invoice" },
                { id: 5, name: "Credit", slug: "credit", icon: "fa-credit-card" },
                { id: 6, name: "USA", slug: "usa", icon: "🇺🇸" },
                { id: 7, name: "MRZ", slug: "mrz", icon: "fa-lock" },
                { id: 8, name: "Barcode Generator", slug: "barcode-generator", icon: "fa-barcode" }
            ],
            orders: [],
            settings: {
                shopName: CONFIG.SITE_NAME,
                walletAddress: CONFIG.WALLET_ADDRESS,
                adminEmail: CONFIG.EMAIL_USER,
                adminPassword: CONFIG.ADMIN_PASSWORD,
                heroTitle: "JOHN'S LAB TEMPLATES",
                heroSubtitle: "Premium digital templates for modern businesses. High-quality designs, instant delivery via USDT.",
                footerTagline: "Premium digital templates for USDT",
                footerCopyright: "© 2024 JOHN'S LAB TEMPLATES. All rights reserved.",
                footerPayment: "Payment: USDT (TRC20) | Instant Digital Delivery",
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
            },
            customers: [],
            users: []
        };

        for (const [key, data] of Object.entries(initialData)) {
            const filePath = `data/${key}.json`;
            try {
                await fs.access(filePath);
            } catch {
                await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            }
        }

        // Clean up any existing country categories
        await cleanupCategories();
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

// Clean up categories - remove country categories
async function cleanupCategories() {
    const categories = await readData('categories') || [];
    // Remove all country categories
    const mainCategories = categories.filter(c => !c.isCountry);
    await writeData('categories', mainCategories);
    return mainCategories;
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
            countries: req.body.countries ? (Array.isArray(req.body.countries) ? req.body.countries : JSON.parse(req.body.countries)) : [],
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
        const countries = req.body.countries ? (Array.isArray(req.body.countries) ? req.body.countries : JSON.parse(req.body.countries)) : products[index].countries || [];
        
        products[index] = {
            ...products[index],
            name: req.body.name || products[index].name,
            price: req.body.price ? parseFloat(req.body.price) : products[index].price,
            category: req.body.category || products[index].category,
            description: req.body.description || products[index].description,
            countries: countries,
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

// Get categories (main categories only, no countries)
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await readData('categories') || [];
        // Filter out any country categories that might still exist
        const mainCategories = categories.filter(c => !c.isCountry);
        res.json(mainCategories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all countries for filtering
app.get('/api/countries', async (req, res) => {
    try {
        const countries = await getAllCountries();
        res.json(countries);
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
            icon: req.body.icon || 'fa-folder'
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
            icon: req.body.icon || categories[index].icon
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

// Helper function for email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { email, telegram, items, total, wallet } = req.body;
        
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ success: false, error: 'Valid email is required' });
        }
        
        if (!telegram || telegram.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Telegram username is required' });
        }
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
        }
        
        const orders = await readData('orders');
        
        const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Generate unique amount with different cents for payment identification
        // This ensures even if multiple orders have the same base amount, they'll have unique exact amounts
        const uniqueAmount = paymentChecker.startMonitoring(orderId, total, CONFIG.WALLET_ADDRESS, CONFIG.PAYMENT_TIMEOUT);
        
        // Clean telegram username (remove @ if present)
        const cleanTelegram = telegram.replace(/^@/, '').trim();
        
        const newOrder = {
            id: orderId,
            email,
            telegram: cleanTelegram,
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

        // Save/update customer in database
        await saveCustomerToDatabase(email, cleanTelegram, total);

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

        if (files.length === 0) {
            return res.status(404).json({ success: false, error: 'No files found' });
        }

        // If single file, serve it directly
        if (files.length === 1) {
            const filePath = files[0].path.startsWith('/') ? files[0].path.substring(1) : files[0].path;
            const fullPath = path.join(__dirname, '..', filePath);
            
            // Check if file exists
            try {
                await fs.access(fullPath);
                res.download(fullPath, files[0].filename || path.basename(fullPath));
            } catch (fileError) {
                console.error('File not found:', fullPath);
                return res.status(404).send('File not found on server');
            }
        } else {
            // Multiple files - return JSON with download links
            res.json({
                success: true,
                files: files.map(f => ({
                    name: f.name,
                    downloadUrl: `${CONFIG.SITE_URL}/download/${req.params.token}/${encodeURIComponent(f.filename || path.basename(f.path))}`,
                    filename: f.filename
                }))
            });
        }
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Download specific file by token and filename
app.get('/download/:token/:filename', async (req, res) => {
    try {
        const orders = await readData('orders');
        const order = orders.find(o => o.downloadToken === req.params.token);
        
        if (!order || order.status !== 'paid') {
            return res.status(404).send('Download not found or payment not confirmed');
        }

        const products = await readData('products');
        const requestedFilename = decodeURIComponent(req.params.filename);
        
        // Find the product file matching the requested filename
        let filePath = null;
        let fileName = null;
        
        for (const item of order.items) {
            const product = products.find(p => p.id === item.id);
            if (product && product.file) {
                const productFilename = product.fileName || path.basename(product.file);
                if (productFilename === requestedFilename || path.basename(product.file) === requestedFilename) {
                    filePath = product.file;
                    fileName = product.fileName || productFilename;
                    break;
                }
            }
        }

        if (!filePath) {
            return res.status(404).send('File not found in order');
        }

        const fullPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        const absolutePath = path.join(__dirname, '..', fullPath);
        
        // Check if file exists
        try {
            await fs.access(absolutePath);
            res.download(absolutePath, fileName || path.basename(absolutePath));
        } catch (fileError) {
            console.error('File not found:', absolutePath);
            return res.status(404).send('File not found on server');
        }
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ===== USER ACCOUNT SYSTEM =====

// Simple token generation
function generateToken(userId, email) {
    const payload = { userId, email, timestamp: Date.now() };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token) {
    try {
        const payload = JSON.parse(Buffer.from(token, 'base64').toString());
        // Token valid for 30 days
        if (Date.now() - payload.timestamp > 30 * 24 * 60 * 60 * 1000) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}

// Middleware to verify token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const payload = verifyToken(token);
    if (!payload) {
        return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    
    req.user = payload;
    next();
}

// User registration
app.post('/api/users/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const users = (await readData('users').catch(() => null)) || [];
        
        // Check if user already exists
        if (users && users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }

        // Simple password hash (base64)
        const hashedPassword = Buffer.from(password).toString('base64');
        
        const newUser = {
            id: uuidv4(),
            email: email.toLowerCase(),
            password: hashedPassword,
            name: name || '',
            createdAt: new Date().toISOString(),
            orders: []
        };

        users.push(newUser);
        await writeData('users', users);

        // Create token
        const token = generateToken(newUser.id, newUser.email);

        res.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// User login
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const users = (await readData('users').catch(() => null)) || [];
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        // Verify password
        const hashedPassword = Buffer.from(password).toString('base64');
        if (user.password !== hashedPassword) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        // Create token
        const token = generateToken(user.id, user.email);

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user profile with purchase history
app.get('/api/users/me', authenticateToken, async (req, res) => {
    try {
        const users = (await readData('users').catch(() => null)) || [];
        const user = users.find(u => u.id === req.user.userId);
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Get user's orders (by email match)
        const orders = await readData('orders');
        const products = await readData('products');
        const userOrders = orders
            .filter(o => o.email.toLowerCase() === user.email.toLowerCase() && o.status === 'paid')
            .map(o => {
                const orderItems = o.items.map(item => {
                    const product = products.find(p => p.id === item.id);
                    return product ? {
                        id: product.id,
                        name: product.name,
                        price: item.price,
                        file: product.file,
                        fileName: product.fileName,
                        downloadUrl: `${CONFIG.SITE_URL}/download/${o.downloadToken}/${encodeURIComponent(product.fileName || 'file')}`
                    } : null;
                }).filter(i => i !== null);

                return {
                    id: o.id,
                    items: orderItems,
                    total: o.total || o.baseAmount,
                    paidAt: o.paidAt,
                    downloadToken: o.downloadToken,
                    downloadUrl: `${CONFIG.SITE_URL}/download/${o.downloadToken}`
                };
            });

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                totalOrders: userOrders.length,
                orders: userOrders
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
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

// Admin login (password validation only)
app.post('/api/admin/login', async (req, res) => {
    try {
        const settings = await readData('settings');
        const correctPassword = settings.adminPassword || CONFIG.ADMIN_PASSWORD;

        if (req.body.password && req.body.password === correctPassword) {
            return res.json({ success: true });
        }

        res.status(401).json({ success: false, error: 'Invalid password' });
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

// ===== CUSTOMER DATABASE FUNCTIONS =====
async function saveCustomerToDatabase(email, telegram, orderAmount) {
    try {
        let customers = await readData('customers') || [];
        
        // Find existing customer by email
        const existingCustomerIndex = customers.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
        
        if (existingCustomerIndex >= 0) {
            // Update existing customer
            const customer = customers[existingCustomerIndex];
            customer.telegram = telegram || customer.telegram;
            customer.orderCount = (customer.orderCount || 0) + 1;
            customer.totalSpent = (customer.totalSpent || 0) + orderAmount;
            customer.lastOrderDate = new Date().toISOString();
            customers[existingCustomerIndex] = customer;
        } else {
            // Add new customer
            const newCustomer = {
                id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
                email: email.toLowerCase(),
                telegram: telegram || '',
                firstOrderDate: new Date().toISOString(),
                lastOrderDate: new Date().toISOString(),
                orderCount: 1,
                totalSpent: orderAmount
            };
            customers.push(newCustomer);
        }
        
        await writeData('customers', customers);
    } catch (error) {
        console.error('Error saving customer to database:', error);
    }
}

// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await readData('customers') || [];
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export customers
app.get('/api/customers/export', async (req, res) => {
    try {
        const format = req.query.format || 'json';
        const customers = await readData('customers') || [];
        
        if (format === 'csv') {
            // Generate CSV
            const headers = ['Email', 'Telegram', 'First Order', 'Last Order', 'Total Orders', 'Total Spent'];
            const rows = customers.map(c => [
                c.email,
                c.telegram || '',
                new Date(c.firstOrderDate).toLocaleDateString(),
                new Date(c.lastOrderDate).toLocaleDateString(),
                c.orderCount || 0,
                (c.totalSpent || 0).toFixed(2)
            ]);
            
            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');
            
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=customers_${new Date().toISOString().split('T')[0]}.csv`);
            res.send(csvContent);
        } else {
            // JSON format
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=customers_${new Date().toISOString().split('T')[0]}.json`);
            res.json(customers);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===== EMAIL FUNCTIONS =====
async function sendPaymentEmail(email, orderId, amount, suggestAccount = false) {
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
                        <a href="${CONFIG.SITE_URL}/download/${downloadToken}/${encodeURIComponent(product.fileName || 'file')}" 
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

// ===== MRZ GENERATOR ENDPOINTS =====
// All MRZ generation uses standard ICAO 9303 formats:
// - TD2 format for passports (2 lines of 44 characters each)
// - TD1 format for ID cards (3 lines of 30 characters each)

// Map 2-letter country codes to 3-letter ISO codes for MRZ
const countryCodeMap = {
    'US': 'USA', 'RU': 'RUS', 'GB': 'GBR', 'DE': 'D', 'FR': 'FRA', 'IT': 'ITA',
    'ES': 'ESP', 'CA': 'CAN', 'AU': 'AUS', 'JP': 'JPN', 'CN': 'CHN', 'IN': 'IND',
    'BR': 'BRA', 'MX': 'MEX', 'KR': 'KOR', 'NL': 'NLD', 'SE': 'SWE', 'NO': 'NOR',
    'DK': 'DNK', 'FI': 'FIN', 'PL': 'POL', 'TR': 'TUR', 'SA': 'SAU', 'AE': 'ARE',
    'EG': 'EGY', 'ZA': 'ZAF', 'AR': 'ARG', 'CL': 'CHL', 'CO': 'COL', 'PE': 'PER',
    'VE': 'VEN', 'PH': 'PHL', 'ID': 'IDN', 'TH': 'THA', 'VN': 'VNM', 'MY': 'MYS',
    'SG': 'SGP', 'NZ': 'NZL', 'IE': 'IRL', 'CH': 'CHE', 'AT': 'AUT', 'BE': 'BEL',
    'PT': 'PRT', 'GR': 'GRC', 'CZ': 'CZE', 'HU': 'HUN', 'RO': 'ROU', 'BG': 'BGR',
    'HR': 'HRV', 'RS': 'SRB', 'UA': 'UKR', 'BY': 'BLR', 'KZ': 'KAZ', 'UZ': 'UZB',
    'PK': 'PAK', 'BD': 'BGD', 'NG': 'NGA', 'KE': 'KEN', 'ET': 'ETH', 'GH': 'GHA',
    'MA': 'MAR', 'DZ': 'DZA', 'TN': 'TUN', 'LY': 'LBY', 'SD': 'SDN', 'IQ': 'IRQ',
    'IR': 'IRN', 'IL': 'ISR', 'JO': 'JOR', 'LB': 'LBN', 'SY': 'SYR', 'YE': 'YEM',
    'AF': 'AFG', 'NP': 'NPL', 'LK': 'LKA', 'MM': 'MMR', 'KH': 'KHM', 'LA': 'LAO',
    'MN': 'MNG', 'KP': 'PRK', 'TW': 'TWN', 'HK': 'HKG', 'MO': 'MAC', 'BN': 'BRN',
    'FJ': 'FJI', 'PG': 'PNG', 'NC': 'NCL', 'PF': 'PYF', 'GU': 'GUM', 'AS': 'ASM',
    'MP': 'MNP', 'VI': 'VIR', 'PR': 'PRI', 'JM': 'JAM', 'HT': 'HTI', 'DO': 'DOM',
    'CU': 'CUB', 'GT': 'GTM', 'BZ': 'BLZ', 'HN': 'HND', 'SV': 'SLV', 'NI': 'NIC',
    'CR': 'CRI', 'PA': 'PAN', 'EC': 'ECU', 'BO': 'BOL', 'PY': 'PRY', 'UY': 'URY',
    'GY': 'GUY', 'SR': 'SUR', 'GF': 'GUF', 'FK': 'FLK', 'IS': 'ISL', 'FO': 'FRO',
    'GL': 'GRL', 'SJ': 'SJM', 'AX': 'ALA', 'EE': 'EST', 'LV': 'LVA', 'LT': 'LTU',
    'MD': 'MDA', 'GE': 'GEO', 'AM': 'ARM', 'AZ': 'AZE', 'TM': 'TKM', 'TJ': 'TJK',
    'KG': 'KGZ', 'AF': 'AFG', 'MV': 'MDV', 'BT': 'BTN', 'TL': 'TLS', 'SB': 'SLB',
    'VU': 'VUT', 'NC': 'NCL', 'PF': 'PYF', 'WS': 'WSM', 'TO': 'TON', 'TV': 'TUV',
    'KI': 'KIR', 'NR': 'NRU', 'PW': 'PLW', 'FM': 'FSM', 'MH': 'MHL', 'CK': 'COK',
    'NU': 'NIU', 'TK': 'TKL', 'PN': 'PCN', 'AQ': 'ATA', 'BV': 'BVT', 'TF': 'ATF',
    'HM': 'HMD', 'GS': 'SGS', 'IO': 'IOT', 'CC': 'CCK', 'CX': 'CXR', 'NF': 'NFK',
    'PW': 'PLW', 'PW': 'PLW', 'PW': 'PLW'
};

// Convert 2-letter code to 3-letter code for MRZ
function getMRZCountryCode(code2) {
    return countryCodeMap[code2] || code2.toUpperCase().padEnd(3, '<').substring(0, 3);
}

// Calculate MRZ check digit
function calculateMRZCheckDigit(str) {
    const weights = [7, 3, 1];
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        let value;
        if (char >= '0' && char <= '9') {
            value = parseInt(char);
        } else if (char >= 'A' && char <= 'Z') {
            value = char.charCodeAt(0) - 55;
        } else if (char === '<') {
            value = 0;
        } else {
            value = 0;
        }
        sum += value * weights[i % 3];
    }
    return sum % 10;
}

// Format name for MRZ (uppercase, replace spaces with <)
function formatNameForMRZ(name) {
    return (name || '').toUpperCase().replace(/[^A-Z0-9]/g, '<').substring(0, 39);
}

// Format date for MRZ (YYMMDD)
function formatDateForMRZ(year, month, day) {
    const y = (year || '').toString().padStart(4, '0').substring(2);
    const m = (month || '').toString().padStart(2, '0');
    const d = (day || '').toString().padStart(2, '0');
    return `${y}${m}${d}`;
}

// Generate passport MRZ - Standard TD2 format for all countries
function generatePassportMRZ(data) {
    const { country, firstName, lastName, surName, birthYear, birthMonth, birthDay, 
            expirYear, expirMonth, expirDay, number, code, sex, codeCheck } = data;
    
    const sexChar = sex === 0 ? 'F' : sex === 1 ? 'M' : '<';
    const docType = 'P';
    
    // Convert country code to 3-letter format if needed
    const countryCode = country.length === 2 ? getMRZCountryCode(country) : country.padEnd(3, '<').substring(0, 3);
    
    // Format names
    const lastNameFormatted = formatNameForMRZ(lastName);
    const firstNameFormatted = formatNameForMRZ(firstName);
    const surNameFormatted = surName ? formatNameForMRZ(surName) : '';
    
    // Combine names
    let nameLine = lastNameFormatted;
    if (surNameFormatted) {
        nameLine += '<<' + surNameFormatted;
    }
    if (firstNameFormatted) {
        nameLine += '<<' + firstNameFormatted;
    }
    nameLine = nameLine.padEnd(44, '<');
    
    // First line: Document type, <, country, name (44 chars total)
    // Format: P<[COUNTRY][NAME] (P + < + 3-char country + 39-char name = 44 chars)
    const line1 = `${docType}<${countryCode}${nameLine.substring(0, 39)}`;
    
    // Second line: Document number, check digit, nationality, birth date, sex, expiry date, optional data
    const docNumber = (number || '').toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(9, '<');
    const docNumberCheck = calculateMRZCheckDigit(docNumber).toString();
    
    const birthDate = formatDateForMRZ(birthYear, birthMonth, birthDay);
    const birthDateCheck = calculateMRZCheckDigit(birthDate).toString();
    
    const expirDate = formatDateForMRZ(expirYear, expirMonth, expirDay);
    const expirDateCheck = calculateMRZCheckDigit(expirDate).toString();
    
    // TD2 line 2 structure (44 chars total):
    // docNumber(9) + check(1) + country(3) + birth(6) + check(1) + sex(1) + expiry(6) + check(1) + optional(15) + finalCheck(1) = 44
    let optionalData = '';
    if (code) {
        optionalData = code.toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(15, '<');
        if (codeCheck) {
            // If codeCheck is provided, replace the last char with check digit for positions 0-14
            optionalData = optionalData.substring(0, 14) + calculateMRZCheckDigit(optionalData.substring(0, 14));
        }
    } else {
        optionalData = '<'.repeat(15);
    }
    
    const line2 = `${docNumber}${docNumberCheck}${countryCode}${birthDate}${birthDateCheck}${sexChar}${expirDate}${expirDateCheck}${optionalData}`;
    
    // Calculate final check digit for line 2 (positions 0-42, which is 43 characters)
    // TD2 line 2 must be exactly 44 characters: 43 data chars + 1 check digit
    const line2Check = calculateMRZCheckDigit(line2.substring(0, 43)).toString();
    const finalLine2 = line2.substring(0, 43) + line2Check;
    
    return { gen1: line1, gen2: finalLine2 };
}

// Generate ID card MRZ - Standard TD1 format for all countries
function generateIDMRZ(data) {
    const { country, firstName, lastName, surName, birthYear, birthMonth, birthDay, 
            expirYear, expirMonth, expirDay, number, code, sex, codeCheck, codeCheck1 } = data;
    
    // Use standard document type
    const docType = 'ID';
    
    // Convert country code to 3-letter format if needed
    const countryCode = country.length === 2 ? getMRZCountryCode(country) : country.padEnd(3, '<').substring(0, 3);
    
    return generateStandardTD1MRZ(data, countryCode, docType);
}

// Generate standard TD1 format MRZ (ICAO 9303 standard for all countries)
function generateStandardTD1MRZ(data, countryCode, docType) {
    const { firstName, lastName, surName, birthYear, birthMonth, birthDay, 
            expirYear, expirMonth, expirDay, number, code, sex, codeCheck, codeCheck1 } = data;
    
    const sexChar = sex === 0 ? 'F' : sex === 1 ? 'M' : '<';
    
    // Format document number (9 chars for standard TD1)
    const docNumber = (number || '').toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(9, '<');
    const docNumberCheck = calculateMRZCheckDigit(docNumber).toString();
    
    // Format dates
    const birthDate = formatDateForMRZ(birthYear, birthMonth, birthDay); // YYMMDD
    const birthDateCheck = calculateMRZCheckDigit(birthDate).toString();
    
    const expirDate = formatDateForMRZ(expirYear, expirMonth, expirDay); // YYMMDD
    const expirDateCheck = calculateMRZCheckDigit(expirDate).toString();
    
    // Format names
    const lastNameFormatted = formatNameForMRZ(lastName);
    const firstNameFormatted = formatNameForMRZ(firstName);
    const surNameFormatted = surName ? formatNameForMRZ(surName) : '';
    
    // Optional data fields
    const optionalData1 = (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(15, '<');
    const optionalData2 = (codeCheck1 || '').toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(11, '<');
    const optionalData2Check = calculateMRZCheckDigit(optionalData2.substring(0, 11)).toString();
    
    // Line 1 (30 chars): docType(2) + country(3) + docNumber(9) + docCheck(1) + optionalData1(15)
    // Ensure docType is exactly 2 characters
    const docTypeFormatted = docType.padEnd(2, '<').substring(0, 2);
    const line1 = `${docTypeFormatted}${countryCode}${docNumber}${docNumberCheck}${optionalData1}`.substring(0, 30);
    
    // Line 2 (30 chars): birthDate(6) + birthCheck(1) + sex(1) + expirDate(6) + expirCheck(1) + country(3) + optionalData2(11) + optionalData2Check(1)
    const line2 = `${birthDate}${birthDateCheck}${sexChar}${expirDate}${expirDateCheck}${countryCode}${optionalData2.substring(0, 11)}${optionalData2Check}`.substring(0, 30);
    
    // Line 3 (30 chars): Full name
    let fullName = lastNameFormatted;
    if (surNameFormatted) {
        fullName += '<<' + surNameFormatted;
    }
    if (firstNameFormatted) {
        fullName += '<<' + firstNameFormatted;
    }
    const line3 = fullName.padEnd(30, '<').substring(0, 30);
    
    return { gen1: line1, gen2: line2, gen3: line3 };
}

// Generate MRZ endpoint
app.post('/api/mrz/generate', (req, res) => {
    try {
        const result = generatePassportMRZ(req.body);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate Russian passport MRZ (special handling)
app.post('/api/mrz/generate-ru', (req, res) => {
    try {
        // Russian passports may have specific formatting requirements
        const result = generatePassportMRZ(req.body);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate ID card MRZ
app.post('/api/mrz/generate-id', (req, res) => {
    try {
        const result = generateIDMRZ(req.body);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Generate control digit
app.post('/api/mrz/control-digit', (req, res) => {
    try {
        const { str } = req.body;
        if (!str) {
            return res.status(400).json({ success: false, error: 'String is required' });
        }
        const digit = calculateMRZCheckDigit(str);
        res.json({ success: true, digit });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Debug endpoint: Check all recent transactions on wallet
app.get('/api/debug/transactions', async (req, res) => {
    try {
        console.log(`\n🔍 DEBUG: Checking all recent transactions for wallet ${CONFIG.WALLET_ADDRESS}`);
        
        let response;
        let usedApiKey = false;
        
        // Try with API key first
        if (CONFIG.TRON_API_KEY) {
            try {
                response = await axios.get(
                    `https://api.trongrid.io/v1/accounts/${CONFIG.WALLET_ADDRESS}/transactions/trc20`,
                    {
                        params: {
                            limit: 20,
                            only_confirmed: true,
                            only_to: true
                        },
                        headers: {
                            'TRON-PRO-API-KEY': CONFIG.TRON_API_KEY
                        }
                    }
                );
                usedApiKey = true;
            } catch (apiKeyError) {
                if (apiKeyError.response?.status === 401) {
                    console.log(`⚠️ API key invalid, retrying without API key...`);
                    // Fall through to try without API key
                } else {
                    throw apiKeyError;
                }
            }
        }
        
        // If API key failed or not set, try without it
        if (!response) {
            response = await axios.get(
                `https://api.trongrid.io/v1/accounts/${CONFIG.WALLET_ADDRESS}/transactions/trc20`,
                {
                    params: {
                        limit: 20,
                        only_confirmed: true,
                        only_to: true
                    }
                }
            );
        }

        const transactions = [];
        if (response.data && response.data.data) {
            for (const tx of response.data.data) {
                if (tx.token_info && (tx.token_info.symbol === 'USDT' || tx.token_info.address === 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')) {
                    const amount = parseFloat(tx.value) / 1000000;
                    transactions.push({
                        txId: tx.transaction_id,
                        amount: amount.toFixed(2),
                        from: tx.from,
                        timestamp: new Date(tx.block_timestamp).toISOString(),
                        confirmed: tx.confirmed
                    });
                }
            }
        }

        res.json({
            success: true,
            wallet: CONFIG.WALLET_ADDRESS,
            totalTransactions: transactions.length,
            transactions: transactions,
            apiKeyUsed: usedApiKey,
            apiKeyValid: usedApiKey,
            rawResponse: response.data
        });
    } catch (error) {
        console.error('Debug transaction check error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            details: error.response?.data 
        });
    }
});

// Manual payment check endpoint (for debugging)
app.get('/api/orders/:id/manual-check', async (req, res) => {
    try {
        const orders = await readData('orders');
        const order = orders.find(o => o.id === req.params.id);
        
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        
        console.log(`\n🔧 MANUAL CHECK REQUESTED for order ${order.id}`);
        console.log(`   Expected amount: $${order.exactAmount || order.baseAmount}`);
        console.log(`   Created at: ${order.createdAt}`);
        console.log(`   Wallet: ${CONFIG.WALLET_ADDRESS}`);
        
        // Restore payment entry if needed
        if (!paymentChecker.activePayments.has(order.id) && order.exactAmount) {
            paymentChecker.activePayments.set(order.id, {
                amount: order.exactAmount,
                wallet: CONFIG.WALLET_ADDRESS,
                startTime: new Date(order.createdAt).getTime(),
                expiryTime: new Date(order.expiresAt).getTime(),
                checked: false
            });
        }
        
        const verification = await paymentChecker.verifyPayment(order.id);
        
        res.json({
            success: true,
            orderId: order.id,
            expectedAmount: order.exactAmount || order.baseAmount,
            verification: verification,
            wallet: CONFIG.WALLET_ADDRESS
        });
    } catch (error) {
        console.error('Manual check error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
    try {
        const testEmail = CONFIG.EMAIL_USER;
        await transporter.sendMail({
            from: `${CONFIG.SITE_NAME} <${CONFIG.EMAIL_USER}>`,
            to: testEmail,
            subject: 'Test Email from Payment System',
            html: `
                <div style="background: #1a1a1a; color: #fff; padding: 20px; border-radius: 10px; border: 2px solid #D4AF37;">
                    <h1 style="color: #D4AF37;">✅ Email is Working!</h1>
                    <p>If you receive this, your email configuration is correct.</p>
                    <p>Your system is ready to send order confirmation emails automatically.</p>
                </div>
            `
        });
        res.json({ success: true, message: 'Test email sent! Check your inbox.' });
    } catch (error) {
        console.error('Email test error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

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
