const { pool } = require('../../utils/mysql');

// UserAddress class for MySQL
class UserAddress {
  constructor(data) {
    // Map database field names to JavaScript field names
    this.id = data.id;
    this.userId = data.user_id !== undefined ? data.user_id : data.userId;
    this.name = data.name;
    this.phone = data.phone;
    this.address = data.address;
    this.city = data.city;
    this.postalCode = data.postal_code !== undefined ? data.postal_code : data.postalCode;
    this.isDefault = (data.is_default !== undefined ? data.is_default : data.isDefault) || false;
    this.createdAt = data.created_at !== undefined ? data.created_at : data.createdAt;
    this.updatedAt = data.updated_at !== undefined ? data.updated_at : data.updatedAt;
  }
  
  // Save user address
  async save() {
    try {
      if (this.id) {
        // Update existing address
        const [result] = await pool.execute(
          'UPDATE user_addresses SET user_id = ?, name = ?, phone = ?, address = ?, city = ?, postal_code = ?, is_default = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [this.userId, this.name, this.phone, this.address, this.city, this.postalCode, this.isDefault, this.id]
        );
        return result.affectedRows > 0;
      } else {
        // Create new address
        const [result] = await pool.execute(
          'INSERT INTO user_addresses (user_id, name, phone, address, city, postal_code, is_default) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [this.userId, this.name, this.phone, this.address, this.city, this.postalCode, this.isDefault]
        );
        
        this.id = result.insertId;
        return true;
      }
    } catch (error) {
      console.error('Error saving user address:', error);
      return false;
    }
  }
  
  // Static methods
  static async find(filter, options = {}) {
    try {
      let query = 'SELECT * FROM user_addresses';
      const conditions = [];
      const values = [];
      
      // Apply filters
      for (const key in filter) {
        // Map JavaScript field names to database field names
        const dbKey = key === 'userId' ? 'user_id' : 
                     key === 'postalCode' ? 'postal_code' : 
                     key === 'isDefault' ? 'is_default' : 
                     key === 'createdAt' ? 'created_at' : 
                     key === 'updatedAt' ? 'updated_at' : key;
                     
        conditions.push(`${dbKey} = ?`);
        values.push(filter[key]);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      // Apply sorting
      if (options.sort) {
        const sortField = Object.keys(options.sort)[0];
        // Map JavaScript field names to database field names for sorting
        const dbSortField = sortField === 'userId' ? 'user_id' : 
                           sortField === 'postalCode' ? 'postal_code' : 
                           sortField === 'isDefault' ? 'is_default' : 
                           sortField === 'createdAt' ? 'created_at' : 
                           sortField === 'updatedAt' ? 'updated_at' : sortField;
                           
        const sortOrder = options.sort[sortField] === -1 ? 'DESC' : 'ASC';
        query += ` ORDER BY ${dbSortField} ${sortOrder}`;
      } else {
        query += ' ORDER BY created_at DESC';
      }
      
      const [rows] = await pool.execute(query, values);
      return rows.map(row => new UserAddress(row));
    } catch (error) {
      console.error('Error finding user addresses:', error);
      return [];
    }
  }
  
  static async findOne(filter) {
    try {
      let query = 'SELECT * FROM user_addresses WHERE ';
      const conditions = [];
      const values = [];
      
      // Map JavaScript field names to database field names
      for (const key in filter) {
        const dbKey = key === 'userId' ? 'user_id' : 
                     key === 'postalCode' ? 'postal_code' : 
                     key === 'isDefault' ? 'is_default' : 
                     key === 'createdAt' ? 'created_at' : 
                     key === 'updatedAt' ? 'updated_at' : key;
                     
        conditions.push(`${dbKey} = ?`);
        values.push(filter[key]);
      }
      
      query += conditions.join(' AND ') + ' LIMIT 1';
      
      const [rows] = await pool.execute(query, values);
      if (rows.length === 0) return null;
      
      return new UserAddress(rows[0]);
    } catch (error) {
      console.error('Error finding user address:', error);
      return null;
    }
  }
  
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM user_addresses WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      return new UserAddress(rows[0]);
    } catch (error) {
      console.error('Error finding user address by ID:', error);
      return null;
    }
  }
  
  static async deleteById(id) {
    try {
      const [result] = await pool.execute('DELETE FROM user_addresses WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting user address:', error);
      return false;
    }
  }
}

module.exports = UserAddress;