#!/usr/bin/env node

/**
 * Node.js script to delete all empty directories in the misc folder
 * Author: GitHub Copilot
 * Description: Recursively scans the misc directory and removes any empty folders
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

// Configuration
const TARGET_DIR = path.join(__dirname, 'static', 'misc');
const VERBOSE = process.argv.includes('--verbose') || process.argv.includes('-v');
const WHAT_IF = process.argv.includes('--what-if') || process.argv.includes('--dry-run');

/**
 * Check if a directory is empty
 * @param {string} dirPath - Path to the directory
 * @returns {Promise<boolean>} - True if directory is empty
 */
async function isDirectoryEmpty(dirPath) {
    try {
        const files = await fs.readdir(dirPath);
        return files.length === 0;
    } catch (error) {
        console.warn(`Warning: Could not read directory ${dirPath}: ${error.message}`);
        return false;
    }
}

/**
 * Get all directories recursively
 * @param {string} dirPath - Root directory path
 * @returns {Promise<string[]>} - Array of directory paths
 */
async function getAllDirectories(dirPath) {
    const directories = [];
    
    try {
        const items = await fs.readdir(dirPath, { withFileTypes: true });
        
        for (const item of items) {
            if (item.isDirectory()) {
                const fullPath = path.join(dirPath, item.name);
                directories.push(fullPath);
                
                // Recursively get subdirectories
                const subDirectories = await getAllDirectories(fullPath);
                directories.push(...subDirectories);
            }
        }
    } catch (error) {
        console.warn(`Warning: Could not read directory ${dirPath}: ${error.message}`);
    }
    
    return directories;
}

/**
 * Find all empty directories
 * @param {string} rootPath - Root directory to search
 * @returns {Promise<string[]>} - Array of empty directory paths
 */
async function findEmptyDirectories(rootPath) {
    const allDirectories = await getAllDirectories(rootPath);
    const emptyDirectories = [];
    
    for (const dir of allDirectories) {
        if (await isDirectoryEmpty(dir)) {
            emptyDirectories.push(dir);
        }
    }
    
    // Sort by depth (deepest first) to avoid deleting parent before child
    return emptyDirectories.sort((a, b) => {
        const aDepth = a.split(path.sep).length;
        const bDepth = b.split(path.sep).length;
        return bDepth - aDepth;
    });
}

/**
 * Delete a directory
 * @param {string} dirPath - Path to directory to delete
 * @returns {Promise<boolean>} - True if successfully deleted
 */
async function deleteDirectory(dirPath) {
    try {
        await fs.rmdir(dirPath);
        return true;
    } catch (error) {
        console.warn(`Warning: Failed to delete ${dirPath}: ${error.message}`);
        return false;
    }
}

/**
 * Ask user for confirmation
 * @param {string} question - Question to ask
 * @returns {Promise<boolean>} - True if user confirms
 */
function askConfirmation(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
    });
}

/**
 * Main function
 */
async function main() {
    console.log('=== Empty Directory Cleanup Script ===');
    console.log(`Target directory: ${TARGET_DIR}`);
    
    if (WHAT_IF) {
        console.log('Running in WHAT-IF mode (no changes will be made)');
    }
    
    // Check if target directory exists
    try {
        await fs.access(TARGET_DIR);
    } catch (error) {
        console.error(`Error: Directory '${TARGET_DIR}' does not exist.`);
        process.exit(1);
    }
    
    console.log('\nScanning for empty directories...');
    
    let totalDeleted = 0;
    let iteration = 0;
    
    // Keep scanning until no more empty directories are found
    // This handles cases where removing empty directories creates new empty parent directories
    while (true) {
        iteration++;
        const emptyDirs = await findEmptyDirectories(TARGET_DIR);
        
        if (emptyDirs.length === 0) {
            if (iteration === 1) {
                console.log('No empty directories found.');
            }
            break;
        }
        
        if (iteration === 1) {
            console.log(`Found ${emptyDirs.length} empty directories.`);
            
            if (VERBOSE || WHAT_IF) {
                console.log('\nEmpty directories:');
                emptyDirs.forEach(dir => {
                    const relativePath = path.relative(TARGET_DIR, dir);
                    console.log(`  ${relativePath}`);
                });
            }
            
            if (!WHAT_IF) {
                const confirmed = await askConfirmation('\nAre you sure you want to delete all empty directories? (y/N): ');
                if (!confirmed) {
                    console.log('Operation cancelled.');
                    process.exit(0);
                }
            }
        }
        
        console.log(`\nIteration ${iteration}: Processing ${emptyDirs.length} empty directories...`);
        
        let deletedInIteration = 0;
        
        for (const dir of emptyDirs) {
            const relativePath = path.relative(TARGET_DIR, dir);
            
            if (WHAT_IF) {
                console.log(`What if: Would delete '${relativePath}'`);
                deletedInIteration++;
            } else {
                const success = await deleteDirectory(dir);
                if (success) {
                    deletedInIteration++;
                    if (VERBOSE) {
                        console.log(`Deleted: ${relativePath}`);
                    }
                }
            }
        }
        
        totalDeleted += deletedInIteration;
        
        if (deletedInIteration === 0) {
            break; // No directories were deleted, stop trying
        }
    }
    
    if (WHAT_IF) {
        console.log(`\nWould delete ${totalDeleted} empty directories.`);
    } else {
        console.log(`\nSuccessfully deleted ${totalDeleted} empty directories.`);
    }
    
    console.log('=== Script completed ===');
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('An unexpected error occurred:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection:', reason);
    process.exit(1);
});

// Show help if requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(`
Usage: node delete-empty-dirs.js [options]

Options:
  --verbose, -v     Show detailed output
  --what-if, --dry-run    Show what would be deleted without actually deleting
  --help, -h        Show this help message

Examples:
  node delete-empty-dirs.js
  node delete-empty-dirs.js --verbose
  node delete-empty-dirs.js --what-if
`);
    process.exit(0);
}

// Run the main function
main().catch((error) => {
    console.error('Script failed:', error.message);
    process.exit(1);
});