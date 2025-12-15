#!/usr/bin/env node

/**
 * Backup script for data files and uploads
 * Usage: node scripts/backup-data.js
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const UPLOADS_DIR = path.join(__dirname, '../src/uploads');
const BACKUP_DIR = path.join(__dirname, '../backups');

async function backupData() {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '-' + 
                         new Date().toTimeString().split(' ')[0].replace(/:/g, '');
        const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
        
        console.log('📦 Creating backup...');
        console.log(`   Backup location: ${backupPath}`);
        
        // Create backup directory
        await fs.mkdir(backupPath, { recursive: true });
        await fs.mkdir(path.join(backupPath, 'data'), { recursive: true });
        await fs.mkdir(path.join(backupPath, 'uploads'), { recursive: true });
        
        // Backup data files
        console.log('   Backing up data files...');
        const dataFiles = await fs.readdir(DATA_DIR);
        for (const file of dataFiles) {
            if (file.endsWith('.json')) {
                const src = path.join(DATA_DIR, file);
                const dest = path.join(backupPath, 'data', file);
                await fs.copyFile(src, dest);
                console.log(`     ✓ ${file}`);
            }
        }
        
        // Backup uploads (if they exist)
        try {
            const uploads = await fs.readdir(UPLOADS_DIR);
            if (uploads.length > 0) {
                console.log('   Backing up uploads...');
                await copyDirectory(UPLOADS_DIR, path.join(backupPath, 'uploads'));
                console.log(`     ✓ Uploads directory`);
            }
        } catch (err) {
            console.log('   ⚠ No uploads to backup');
        }
        
        console.log('\n✅ Backup completed successfully!');
        console.log(`   Location: ${backupPath}`);
        
        // List recent backups
        const backups = await fs.readdir(BACKUP_DIR);
        const backupDirs = backups.filter(b => b.startsWith('backup-')).sort().reverse();
        if (backupDirs.length > 5) {
            console.log(`\n⚠️  You have ${backupDirs.length} backups. Consider cleaning up old ones.`);
        }
        
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        process.exit(1);
    }
}

async function copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

// Run backup
backupData();

