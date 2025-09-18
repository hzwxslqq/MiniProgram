const { pool } = require('../../utils/mysql');

// CartItem class for MySQL
class CartItem {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.product_id = data.product_id;
    this.product_name = data.product_name;
    this.product_image = data.product_image;
    this.price = data.price;
    this.quantity = data.quantity || 1;  // Default quantity to 1
    this.selected = data.selected !== undefined ? data.selected : true;  // Default selected to true
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  // Save cart item
  async save() {
    try {
      if (this.id) {
        // Update existing cart item
        const [result] = await pool.execute(
          'UPDATE cart_items SET user_id = ?, product_id = ?, product_name = ?, product_image = ?, price = ?, quantity = ?, selected = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [this.user_id, this.product_id, this.product_name, this.product_image, this.price, this.quantity, this.selected, this.id]
        );
        return result.affectedRows > 0;
      } else {
        // Create new cart item
        const [result] = await pool.execute(
          'INSERT INTO cart_items (user_id, product_id, product_name, product_image, price, quantity, selected) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [this.user_id, this.product_id, this.product_name, this.product_image, this.price, this.quantity, this.selected]
        );
        
        this.id = result.insertId;
        return true;
      }
    } catch (error) {
      console.error('Error saving cart item:', error);
      return false;
    }
  }
  
  // Static methods
  static async find(filter) {
    try {
      let query = 'SELECT * FROM cart_items WHERE ';
      const conditions = [];
      const values = [];
      
      for (const key in filter) {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      }
      
      query += conditions.join(' AND ');
      
      const [rows] = await pool.execute(query, values);
      return rows.map(row => new CartItem(row));
    } catch (error) {
      console.error('Error finding cart items:', error);
      return [];
    }
  }
  
  static async findOne(filter) {
    try {
      let query = 'SELECT * FROM cart_items WHERE ';
      const conditions = [];
      const values = [];
      
      for (const key in filter) {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      }
      
      query += conditions.join(' AND ') + ' LIMIT 1';
      
      const [rows] = await pool.execute(query, values);
      if (rows.length === 0) return null;
      
      return new CartItem(rows[0]);
    } catch (error) {
      console.error('Error finding cart item:', error);
      return null;
    }
  }
  
  static async findOneAndDelete(filter) {
    try {
      // First find the item
      const item = await CartItem.findOne(filter);
      if (!item) return null;
      
      // Then delete it
      await pool.execute('DELETE FROM cart_items WHERE id = ?', [item.id]);
      
      return item;
    } catch (error) {
      console.error('Error finding and deleting cart item:', error);
      return null;
    }
  }
  
  static async deleteMany(filter) {
    try {
      let query = 'DELETE FROM cart_items WHERE ';
      const conditions = [];
      const values = [];
      
      for (const key in filter) {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      }
      
      query += conditions.join(' AND ');
      
      const [result] = await pool.execute(query, values);
      return { deletedCount: result.affectedRows };
    } catch (error) {
      console.error('Error deleting cart items:', error);
      return { deletedCount: 0 };
    }
  }
  
  static async populate(items, populateFields) {
    // For simplicity, we'll just return the items as is
    // In a real implementation, this would populate referenced documents
    return items;
  }
}

module.exports = CartItem;