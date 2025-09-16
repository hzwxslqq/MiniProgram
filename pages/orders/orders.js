// Orders page logic
const api = require('../../utils/api.js');

Page({
  data: {
    orders: [],
    activeTab: 'all', // all, pending, shipped, delivered
    filteredOrders: [],
    loading: false
  },

  onLoad: function() {
    this.loadOrders();
  },

  onShow: function() {
    console.log('Orders page onShow called');
    // Refresh orders when page shows
    this.loadOrders();
  },

  // Load orders from API
  loadOrders: function() {
    console.log('Loading orders...');
    this.setData({ loading: true });
    
    // Fetch orders from API (always try to fetch real orders)
    api.orders.getList()
      .then(res => {
        console.log('Orders API response:', res);
        // Transform API response to match expected format
        const orders = res.data.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          statusText: this.getStatusText(order.status),
          totalAmount: order.totalAmount,
          items: order.items.map((item, index) => ({
            id: `${order.id}-${index}`, // Use unique id for list rendering
            name: item.productName,
            image: item.productImage,
            price: item.price,
            quantity: item.quantity
          })),
          trackingNumber: order.trackingNumber || '',
          estimatedDelivery: order.estimatedDelivery || '',
          createdAt: this.formatDate(order.createdAt)
        }));
        
        console.log('Processed orders:', orders);
        const filteredOrders = this.filterOrders(orders, this.data.activeTab);
        console.log('Filtered orders:', filteredOrders);
        this.setData({
          orders: orders,
          filteredOrders: filteredOrders,
          loading: false
        });
      })
      .catch(err => {
        console.error('Failed to load orders:', err);
        wx.showToast({
          title: 'Failed to load orders: ' + (err.message || 'Unknown error'),
          icon: 'none'
        });
        
        // Show fallback orders on error
        this.showFallbackOrders();
      });
  },

  // Format date for display
  formatDate: function(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  },

  // Show fallback orders
  showFallbackOrders: function() {
    console.log('Showing fallback orders');
    setTimeout(() => {
      const orders = [
        {
          id: 1,
          orderNumber: 'ORD-20230101-001',
          status: 'delivered',
          statusText: 'Delivered',
          totalAmount: 129.99,
          items: [
            { id: '1-0', name: 'Wireless Headphones', image: '/images/product1.png', price: 129.99, quantity: 1 }
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
            { id: '2-0', name: 'Bluetooth Speaker', image: '/images/product3.png', price: 79.99, quantity: 2 },
            { id: '2-1', name: 'Phone Case', image: '/images/product4.png', price: 24.99, quantity: 1 }
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
            { id: '3-0', name: 'Laptop Backpack', image: '/images/product5.png', price: 59.99, quantity: 1 }
          ],
          trackingNumber: '',
          estimatedDelivery: '',
          createdAt: '2023-01-03'
        }
      ];
      
      const filteredOrders = this.filterOrders(orders, this.data.activeTab);
      console.log('Fallback filtered orders:', filteredOrders);
      this.setData({
        orders: orders,
        filteredOrders: filteredOrders,
        loading: false
      });
    }, 500);
  },

  // Get status text based on status
  getStatusText: function(status) {
    switch (status) {
      case 'pending': return 'Pending Payment';
      case 'paid': return 'Paid';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  },

  // Switch tab
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    console.log('Switching to tab:', tab);
    const filteredOrders = this.filterOrders(this.data.orders, tab);
    console.log('Filtered orders after tab switch:', filteredOrders);
    this.setData({
      activeTab: tab,
      filteredOrders: filteredOrders
    });
  },

  // Filter orders by status
  filterOrders: function(orders, tab) {
    console.log('Filtering orders, tab:', tab);
    console.log('All orders:', orders);
    if (tab === 'all') {
      console.log('Returning all orders');
      return orders;
    }
    // Make sure we're comparing strings
    const filtered = orders.filter(order => order.status.toString() === tab.toString());
    console.log('Filtered orders:', filtered);
    return filtered;
  },

  // View order details
  viewOrderDetails: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/orders/detail/detail?id=${orderId}`
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
          // Show loading
          wx.showLoading({
            title: 'Processing payment...'
          });
          
          // Process payment via API
          api.orders.pay(order.id, {
            paymentMethod: 'wechat'
          })
            .then(res => {
              wx.hideLoading();
              wx.showToast({
                title: 'Payment successful!',
                icon: 'success'
              });
              
              // Refresh orders
              this.loadOrders();
            })
            .catch(err => {
              wx.hideLoading();
              wx.showToast({
                title: 'Payment failed: ' + (err.message || 'Unknown error'),
                icon: 'none'
              });
              console.error('Payment error:', err);
            });
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
  },
  
  // Navigate to address management page
  goToAddresses: function() {
    wx.navigateTo({
      url: '/pages/addresses/addresses'
    });
  }
});