const { initDB } = require('../utils/mysql');

// Initialize database
const initMySQLDB = async () => {
  try {
    console.log('Initializing MySQL database...');
    await initDB();
    console.log('MySQL database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing MySQL database:', error.message);
    console.error('Please make sure MySQL server is running and the connection details are correct.');
    process.exit(1);
  }
};

initMySQLDB();