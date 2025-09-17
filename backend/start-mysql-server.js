#!/usr/bin/env node

// Script to start the server with MySQL database
const fs = require('fs');
const path = require('path');

// Update .env to use MySQL
const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Replace DB_TYPE with mysql
envContent = envContent.replace(/DB_TYPE=.*/, 'DB_TYPE=mysql');

// Write updated content back to .env
fs.writeFileSync(envPath, envContent);

console.log('Updated .env to use MySQL database');

// Start the server
require('./server.js');