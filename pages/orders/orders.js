// Orders page logic
Page({
  data: {
    orders: [],
    activeTab: 'all', // all, pending, shipped, delivered
    loading: false
  },

  onLoad: function() {
    this.loadOrders();
  },

  onShow: function() {
    // Refresh orders when page shows
    this.loadOrders();
  },

  // Load orders from API
  loadOrders: function() {
    this.setData({ loading: true });
    
    // Simulate API call
    setTimeout(() => {
      const orders = [
        {
          id: 1,
          orderNumber: 'ORD-20230101-001',
          status: 'delivered',
          statusText: 'Delivered',
          totalAmount: 129.99,
          items: [
            { id: 1, name: 'Wireless Headphones', image: '/images/product1.png', price: 129.99, quantity: 1 }
          ],
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2023-01-15',
          createdAt: '2023-01-01'
        },
        {
          id: 2,
          orderNumber: 'ORD-20230102-002',
          status: 'shipped',
          statusText: 'Shipped',
          totalAmount: 239.97,
          items: [
            { id: 3, name: 'Bluetooth Speaker', image: '/images/product3.png', price: 79.99, quantity: 2 },
            { id: 4, name: 'Phone Case', image: '/images/product4.png', price: 24.99, quantity: 1 }
          ],
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2023-01-20',
          createdAt: '2023-01-02'
        },
        {
          id: 3,
          orderNumber: 'ORD-20230103-003',
          status: 'pending',
          statusText: 'Pending Payment',
          totalAmount: 59.99,
          items: [
            { id: 5, name: 'Laptop Backpack', image: '/images/product5.png', price: 59.99, quantity: 1 }
          ],
          trackingNumber: '',
          estimatedDelivery: '',
          createdAt: '2023-01-03'
        }
      ];
      
      this.setData({
        orders: orders,
        loading: false
      });
    }, 500);
  },

  // Switch tab
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // Filter orders by status
  getFilteredOrders: function() {
    if (this.data.activeTab === 'all') {
      return this.data.orders;
    }
    return this.data.orders.filter(order => order.status === this.data.activeTab);
  },

  // View order details
  viewOrderDetails: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/orders/detail?id=${orderId}`
    });
  },

  // Pay for pending order
  payOrder: function(e) {
    const order = e.currentTarget.dataset.order;
    
    wx.showModal({
      title: 'Confirm Payment',
      content: `Do you want to pay $${order.totalAmount} for order ${order.orderNumber}?`,
      success: (res) => {
        if (res.confirm) {
          // Simulate payment process
          wx.showToast({
            title: 'Payment processing...',
            icon: 'loading',
            duration: 2000
          });
          
          // After payment simulation
          setTimeout(() => {
            wx.showToast({
              title: 'Payment successful!',
              icon: 'success'
            });
            
            // Update order status
            const orders = this.data.orders.map(item => {
              if (item.id === order.id) {
                return { ...item, status: 'shipped', statusText: 'Shipped' };
              }
              return item;
            });
            
            this.setData({
              orders: orders
            });
          }, 2000);
        }
      }
    });
  },

  // View logistics information
  viewLogistics: function(e) {
    const order = e.currentTarget.dataset.order;
    if (!order.trackingNumber) {
      wx.showToast({
        title: 'No tracking information available',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/orders/tracking?orderId=${order.id}`
    });
  }
});