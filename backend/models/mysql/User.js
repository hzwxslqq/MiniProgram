const bcrypt = require('bcryptjs');
const { pool } = require('../../utils/mysql');

// User class for MySQL
class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
    this.phone = data.phone;
    this.avatar = data.avatar;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  // Compare password method
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }
  
  // Remove password from JSON output
  toJSON() {
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }
  
  // Save user
  async save() {
    try {
      if (this.id) {
        // Update existing user
        const [result] = await pool.execute(
          'UPDATE users SET username = ?, password = ?, email = ?, phone = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [this.username, this.password, this.email, this.phone, this.avatar, this.id]
        );
        return result.affectedRows > 0;
      } else {
        // Create new user
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        const [result] = await pool.execute(
          'INSERT INTO users (username, password, email, phone, avatar) VALUES (?, ?, ?, ?, ?)',
          [this.username, this.password, this.email, this.phone, this.avatar]
        );
        
        this.id = result.insertId;
        return true;
      }
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  }
  
  // Static methods
  static async findOne(filter) {
    try {
      let query = 'SELECT * FROM users WHERE ';
      const conditions = [];
      const values = [];
      
      for (const key in filter) {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      }
      
      query += conditions.join(' AND ');
      
      const [rows] = await pool.execute(query, values);
      if (rows.length === 0) return null;
      
      return new User(rows[0]);
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }
  
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      return new User(rows[0]);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }
  
  static async deleteMany(filter) {
    // For simplicity, we'll just return a success result
    return { deletedCount: 0 };
  }
}

module.exports = User;