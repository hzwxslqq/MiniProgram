const { pool } = require('../../utils/mysql');

// Order class for MySQL
class Order {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.order_number = data.order_number;
    this.items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    this.subtotal = data.subtotal;
    this.shipping_fee = data.shipping_fee;
    this.total_amount = data.total_amount;
    this.status = data.status;
    this.shipping_address = typeof data.shipping_address === 'string' ? JSON.parse(data.shipping_address) : data.shipping_address;
    this.payment_method = data.payment_method;
    this.payment_id = data.payment_id;
    this.tracking_number = data.tracking_number;
    this.estimated_delivery = data.estimated_delivery;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
  
  // Generate order number
  generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}${month}${day}-${random}`;
  }
  
  // Save order
  async save() {
    try {
      if (this.id) {
        // Update existing order
        const [result] = await pool.execute(
          'UPDATE orders SET user_id = ?, order_number = ?, items = ?, subtotal = ?, shipping_fee = ?, total_amount = ?, status = ?, shipping_address = ?, payment_method = ?, payment_id = ?, tracking_number = ?, estimated_delivery = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [this.user_id, this.order_number, JSON.stringify(this.items), this.subtotal, this.shipping_fee, this.total_amount, this.status, JSON.stringify(this.shipping_address), this.payment_method, this.payment_id, this.tracking_number, this.estimated_delivery, this.id]
        );
        return result.affectedRows > 0;
      } else {
        // Create new order
        // Generate order number if not provided
        if (!this.order_number) {
          this.order_number = this.generateOrderNumber();
        }
        
        const [result] = await pool.execute(
          'INSERT INTO orders (user_id, order_number, items, subtotal, shipping_fee, total_amount, status, shipping_address, payment_method, payment_id, tracking_number, estimated_delivery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [this.user_id, this.order_number, JSON.stringify(this.items), this.subtotal, this.shipping_fee, this.total_amount, this.status, JSON.stringify(this.shipping_address), this.payment_method, this.payment_id, this.tracking_number, this.estimated_delivery]
        );
        
        this.id = result.insertId;
        return true;
      }
    } catch (error) {
      console.error('Error saving order:', error);
      return false;
    }
  }
  
  // Static methods
  static async find(filter, options = {}) {
    try {
      let query = 'SELECT * FROM orders';
      const conditions = [];
      const values = [];
      
      // Apply filters
      for (const key in filter) {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      // Apply sorting
      if (options.sort) {
        const sortField = Object.keys(options.sort)[0];
        const sortOrder = options.sort[sortField] === -1 ? 'DESC' : 'ASC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;
      } else {
        query += ' ORDER BY created_at DESC';
      }
      
      const [rows] = await pool.execute(query, values);
      return rows.map(row => new Order(row));
    } catch (error) {
      console.error('Error finding orders:', error);
      return [];
    }
  }
  
  static async findOne(filter) {
    try {
      let query = 'SELECT * FROM orders WHERE ';
      const conditions = [];
      const values = [];
      
      for (const key in filter) {
        conditions.push(`${key} = ?`);
        values.push(filter[key]);
      }
      
      query += conditions.join(' AND ') + ' LIMIT 1';
      
      const [rows] = await pool.execute(query, values);
      if (rows.length === 0) return null;
      
      return new Order(rows[0]);
    } catch (error) {
      console.error('Error finding order:', error);
      return null;
    }
  }
  
  static async findById(id) {
    try {
      const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      return new Order(rows[0]);
    } catch (error) {
      console.error('Error finding order by ID:', error);
      return null;
    }
  }
}

module.exports = Order;