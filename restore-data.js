#!/usr/bin/env node

/**
 * Restore script for data files and uploads
 * Usage: node scripts/restore-data.js [backup-name]
 * 
 * If no backup name is provided, it will list available backups.
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const UPLOADS_DIR = path.join(__dirname, '../src/uploads');
const BACKUP_DIR = path.join(__dirname, '../backups');

async function listBackups() {
    try {
        const backups = await fs.readdir(BACKUP_DIR);
        const backupDirs = backups.filter(b => b.startsWith('backup-')).sort().reverse();
        
        if (backupDirs.length === 0) {
            console.log('❌ No backups found in', BACKUP_DIR);
            return null;
        }
        
        console.log('📦 Available backups:');
        backupDirs.forEach((backup, index) => {
            console.log(`   ${index + 1}. ${backup}`);
        });
        
        return backupDirs;
    } catch (error) {
        console.error('❌ Error listing backups:', error.message);
        return null;
    }
}

async function restoreData(backupName) {
    try {
        const backupPath = path.join(BACKUP_DIR, backupName);
        
        // Check if backup exists
        try {
            await fs.access(backupPath);
        } catch {
            console.error(`❌ Backup not found: ${backupName}`);
            console.log('\nAvailable backups:');
            await listBackups();
            process.exit(1);
        }
        
        console.log('🔄 Restoring from backup...');
        console.log(`   Backup: ${backupName}`);
        
        // Restore data files
        const dataBackupPath = path.join(backupPath, 'data');
        try {
            const dataFiles = await fs.readdir(dataBackupPath);
            console.log('   Restoring data files...');
            for (const file of dataFiles) {
                if (file.endsWith('.json')) {
                    const src = path.join(dataBackupPath, file);
                    const dest = path.join(DATA_DIR, file);
                    await fs.copyFile(src, dest);
                    console.log(`     ✓ ${file}`);
                }
            }
        } catch (err) {
            console.log('   ⚠ No data files in backup');
        }
        
        // Restore uploads
        const uploadsBackupPath = path.join(backupPath, 'uploads');
        try {
            await fs.access(uploadsBackupPath);
            console.log('   Restoring uploads...');
            await copyDirectory(uploadsBackupPath, UPLOADS_DIR);
            console.log(`     ✓ Uploads directory`);
        } catch (err) {
            console.log('   ⚠ No uploads in backup');
        }
        
        console.log('\n✅ Restore completed successfully!');
        console.log('   ⚠️  You may need to restart your server for changes to take effect.');
        
    } catch (error) {
        console.error('❌ Restore failed:', error.message);
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

// Main
const backupName = process.argv[2];

if (!backupName) {
    console.log('📦 Data Restore Tool\n');
    const backups = await listBackups();
    if (backups && backups.length > 0) {
        console.log('\nUsage: node scripts/restore-data.js <backup-name>');
        console.log(`Example: node scripts/restore-data.js ${backups[0]}`);
    }
} else {
    restoreData(backupName);
}

