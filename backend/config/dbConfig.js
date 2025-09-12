// Database configuration
const dotenv = require('dotenv');

dotenv.config();

// Determine which database to use based on environment variable
const DB_TYPE = process.env.DB_TYPE || 'file'; // 'file', 'mongodb', or 'mysql'

module.exports = {
  DB_TYPE
};