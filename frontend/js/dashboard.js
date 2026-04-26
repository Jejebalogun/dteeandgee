/**
 * D'Tee & Gee Kitchen - Customer Dashboard
 */
class CustomerDashboard {
  constructor() {
    this.user = null;
    this.orders = [];
    this.currentPage = 1;
    this.statusFilter = '';
    this.init();
  }

  async init() {
    // Auth guard
    try {
      const authData = await window.API.checkAuth();
      if (!authData.authenticated) {
        window.location.href = '/';
        return;
      }
      this.user = authData.user;
    } catch (e) {
      window.location.href = '/';
      return;
    }

    this.populateUserData();
    this.initTheme();
    this.initEventListeners();
    this.loadOverviewData();

    // Check hash for direct section linking
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`section-${hash}`)) {
      this.switchSection(hash);
    } else {
      this.switchSection('overview');
    }
  }

  // ==================== Theme Validation ====================

  initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      const icon = document.querySelector('#dash-theme-toggle i');
      if (icon) {
        icon.classList.replace('fa-moon', 'fa-sun');
      }
    }
  }

  // ==================== Navigation ====================

  initEventListeners() {
    // Theme toggle
    document.getElementById('dash-theme-toggle')?.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const toggleIcon = document.querySelector('#dash-theme-toggle i');

      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (toggleIcon) toggleIcon.classList.replace('fa-sun', 'fa-moon');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (toggleIcon) toggleIcon.classList.replace('fa-moon', 'fa-sun');
      }
    });

    // Nav links
    document.querySelectorAll('[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchSection(link.getAttribute('data-section'));
      });
    });

    // Mobile toggle
    const toggle = document.getElementById('dash-mobile-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        document.getElementById('dash-nav-links')?.classList.toggle('show');
      });
    }

    // Logout
    document.getElementById('dash-logout')?.addEventListener('click', async () => {
      try {
        await window.API.logout();
        window.location.href = '/';
      } catch (e) {
        window.location.href = '/';
      }
    });

    // Hash change listener for back/forward buttons
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`section-${hash}`)) {
        this.switchSection(hash);
      }
    });

    // Order status filter
    document.getElementById('order-status-filter')?.addEventListener('change', (e) => {
      this.statusFilter = e.target.value;
      this.currentPage = 1;
      this.loadOrders();
    });

    // Back to orders
    document.getElementById('back-to-orders')?.addEventListener('click', () => {
      this.switchSection('orders');
    });

    // Profile form
    document.getElementById('profile-info-form')?.addEventListener('submit', (e) => this.handleProfileSave(e));
    document.getElementById('password-change-form')?.addEventListener('submit', (e) => this.handlePasswordChange(e));

    // Make stat cards clickable
    document.getElementById('stat-card-orders')?.addEventListener('click', () => this.switchSection('orders'));
    document.getElementById('stat-card-pending')?.addEventListener('click', () => {
      this.statusFilter = 'pending';
      document.getElementById('order-status-filter').value = 'pending';
      this.switchSection('orders');
    });
    document.getElementById('stat-card-wishlist')?.addEventListener('click', () => this.switchSection('wishlist'));
  }

  switchSection(sectionId) {
    // Update nav links
    document.querySelectorAll('.dash-nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
    });

    // Update sections
    document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`section-${sectionId}`);
    if (target) target.classList.add('active');

    // Close mobile nav
    document.getElementById('dash-nav-links')?.classList.remove('show');

    // Update URL hash without triggering hashchange event
    if (window.location.hash !== `#${sectionId}`) {
        history.pushState(null, null, `#${sectionId}`);
    }

    // Load section data
    if (sectionId === 'orders') this.loadOrders();
    if (sectionId === 'profile') this.loadProfile();
    if (sectionId === 'wishlist') this.loadWishlist();
  }

  // ==================== Overview ====================

  populateUserData() {
    const name = this.user.first_name || this.user.username || 'Customer';
    document.getElementById('welcome-name').textContent = name;
  }

  async loadOverviewData() {
    try {
      const response = await window.API.getOrders({ page: 1, per_page: 5 });
      const orders = response.orders || [];
      const allOrdersResp = await window.API.getOrders({ page: 1, per_page: 100 });
      const allOrders = allOrdersResp.orders || [];

      // Stats
      const totalOrders = allOrdersResp.total || allOrders.length;
      const activeOrders = allOrders.filter(o =>
        ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status.toLowerCase())
      ).length;
      const totalSpent = allOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

      document.getElementById('stat-total-orders').textContent = totalOrders;
      document.getElementById('stat-active-orders').textContent = activeOrders;
      document.getElementById('stat-total-spent').textContent = Utils.formatCurrency(totalSpent);

      // Active orders badge
      const badge = document.getElementById('orders-badge');
      if (badge) {
        badge.textContent = activeOrders;
        badge.style.display = activeOrders > 0 ? 'inline-block' : 'none';
      }

      // Recent orders
      this.renderRecentOrders(orders.slice(0, 5));
    } catch (e) {
      console.error('Failed to load overview:', e);
    }

    // Wishlist count
    try {
      const wishlist = await window.API.getWishlist();
      const count = wishlist.items?.length || wishlist.length || 0;
      document.getElementById('stat-wishlist-count').textContent = count;
    } catch (e) {
      document.getElementById('stat-wishlist-count').textContent = '0';
    }
  }

  renderRecentOrders(orders) {
    const container = document.getElementById('recent-orders-list');
    if (!container) return;

    if (!orders.length) {
      container.innerHTML = `
        <div class="dash-empty">
          <i class="fas fa-receipt"></i>
          <h3>No Orders Yet</h3>
          <p>Start shopping to see your orders here!</p>
        </div>`;
      return;
    }

    container.innerHTML = orders.map(order => `
      <div class="recent-order-item" onclick="dashboard.showOrderDetail(${order.id})">
        <div class="recent-order-info">
          <span class="order-num">#${order.order_number}</span>
          <span class="order-date">${Utils.formatRelativeTime(order.created_at)}</span>
        </div>
        <div class="recent-order-meta">
          <span class="order-amount">${Utils.formatCurrency(order.total_amount)}</span>
          <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
        </div>
      </div>
    `).join('');
  }

  // ==================== My Orders ====================

  async loadOrders() {
    const container = document.getElementById('orders-list-container');
    if (!container) return;

    container.innerHTML = '<div class="dash-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading orders...</p></div>';

    try {
      const params = { page: this.currentPage, per_page: 8 };
      if (this.statusFilter) params.status = this.statusFilter;

      const response = await window.API.getOrders(params);
      const orders = response.orders || [];

      if (!orders.length) {
        container.innerHTML = `
          <div class="dash-empty">
            <i class="fas fa-receipt"></i>
            <h3>No Orders Found</h3>
            <p>${this.statusFilter ? 'No orders match this filter.' : 'You haven\'t placed any orders yet.'}</p>
            <a href="/#menu" class="btn btn-primary"><i class="fas fa-utensils"></i> Browse Menu</a>
          </div>`;
        return;
      }

      container.innerHTML = `<div class="dash-orders-list stagger-fade-in">
        ${orders.map(o => this.renderOrderCard(o)).join('')}
      </div>`;

      this.renderPagination(response);
    } catch (e) {
      console.error('Failed to load orders:', e);
      container.innerHTML = '<div class="dash-empty"><i class="fas fa-exclamation-circle"></i><h3>Failed to Load</h3><p>Please try again.</p></div>';
    }
  }

  renderOrderCard(order) {
    const items = order.items || [];
    const displayItems = items.slice(0, 3);
    const moreItemsImageCount = items.length - 3;
    const totalItemsQty = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const status = order.status ? order.status.toLowerCase() : 'pending';

    return `
      <div class="dash-order-card" onclick="dashboard.showOrderDetail(${order.id})">
        <div class="card-top">
          <span class="order-id">#${order.order_number}</span>
          <span class="order-when">${Utils.formatRelativeTime(order.created_at)}</span>
        </div>
        <div class="card-mid">
          <div class="card-items-preview">
            ${displayItems.map(i => `<img src="${i.product?.image_url || '/images/placeholder.jpg'}" alt="${Utils.sanitizeHtml(i.product?.name || 'Item')}">`).join('')}
            ${moreItemsImageCount > 0 ? `<div class="more-items">+${moreItemsImageCount}</div>` : ''}
          </div>
          <div class="card-price-info">
            <span class="price">${Utils.formatCurrency(order.total_amount)}</span>
            <span class="items-count">${totalItemsQty} item${totalItemsQty !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="card-bottom">
          <span class="order-status ${status}">${order.status}</span>
          <div class="actions">
            ${status === 'delivered' || status === 'completed' ? `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); dashboard.reorder(${order.id})"><i class="fas fa-redo"></i> Reorder</button>` : ''}
            ${status === 'pending' || status === 'confirmed' ? `<button class="btn btn-sm btn-outline" style="color:var(--appetite-red)" onclick="event.stopPropagation(); dashboard.cancelOrder(${order.id})"><i class="fas fa-times"></i> Cancel</button>` : ''}
          </div>
        </div>
      </div>`;
  }

  renderPagination(response) {
    const container = document.getElementById('orders-pagination-container');
    if (!container || !response.pages || response.pages <= 1) {
      if (container) container.innerHTML = '';
      return;
    }

    let html = '<div class="pagination">';
    if (response.current_page > 1) {
      html += `<button class="pagination-btn" onclick="dashboard.goToPage(${response.current_page - 1})"><i class="fas fa-chevron-left"></i></button>`;
    }
    for (let i = 1; i <= response.pages; i++) {
      if (i === 1 || i === response.pages || (i >= response.current_page - 1 && i <= response.current_page + 1)) {
        html += `<button class="pagination-btn ${i === response.current_page ? 'active' : ''}" onclick="dashboard.goToPage(${i})">${i}</button>`;
      } else if (i === response.current_page - 2 || i === response.current_page + 2) {
        html += '<span class="pagination-ellipsis">...</span>';
      }
    }
    if (response.current_page < response.pages) {
      html += `<button class="pagination-btn" onclick="dashboard.goToPage(${response.current_page + 1})"><i class="fas fa-chevron-right"></i></button>`;
    }
    html += '</div>';
    container.innerHTML = html;
  }

  goToPage(page) {
    this.currentPage = page;
    this.loadOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==================== Order Detail ====================

  async showOrderDetail(orderId) {
    // Switch to detail section
    document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-order-detail')?.classList.add('active');

    const container = document.getElementById('order-detail-content');
    if (!container) return;

    container.innerHTML = '<div class="dash-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading order...</p></div>';

    try {
      const order = await window.API.getOrder(orderId);
      this.renderOrderDetail(order);
    } catch (e) {
      container.innerHTML = '<div class="dash-empty"><i class="fas fa-exclamation-circle"></i><h3>Failed to Load</h3></div>';
    }
  }

  renderOrderDetail(order) {
    const container = document.getElementById('order-detail-content');
    const titleEl = document.getElementById('detail-order-title');
    if (!container) return;

    if (titleEl) titleEl.textContent = `Order #${order.order_number}`;

    const items = order.items || [];
    const status = order.status.toLowerCase();
    const statusSteps = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    const currentIdx = statusSteps.indexOf(status);
    const isCancelled = status === 'cancelled';

    const statusMsgs = {
      pending: { icon: 'fa-hourglass-half', text: 'Your order is awaiting confirmation. We\'ll process it shortly!' },
      confirmed: { icon: 'fa-thumbs-up', text: 'Order confirmed! We\'re getting your items ready.' },
      preparing: { icon: 'fa-fire', text: 'Your order is being prepared with love! Almost ready.' },
      ready: { icon: 'fa-motorcycle', text: 'Your order is out for delivery! Arriving soon.' },
      delivered: { icon: 'fa-check-circle', text: 'Order delivered! Thank you for choosing D\'Tee & Gee Kitchen. 🎉' },
      cancelled: { icon: 'fa-times-circle', text: 'This order has been cancelled.' }
    };
    const msg = statusMsgs[status] || { icon: 'fa-info-circle', text: 'Status unknown.' };

    const statusIcons = {
      pending: 'fa-clock', confirmed: 'fa-check', preparing: 'fa-utensils', ready: 'fa-box', delivered: 'fa-check-double'
    };

    container.innerHTML = `
      <div class="detail-header">
        <div class="detail-header-info">
          <h2>Order #${order.order_number}</h2>
          <div class="detail-header-meta">
            <span><i class="far fa-calendar"></i>${new Date(order.created_at).toLocaleDateString('en-NG', { dateStyle: 'long' })}</span>
            <span><i class="far fa-clock"></i>${new Date(order.created_at).toLocaleTimeString('en-NG', { timeStyle: 'short' })}</span>
          </div>
        </div>
        <span class="order-status ${status}">${order.status}</span>
      </div>

      <div class="detail-status-msg ${status}">
        <i class="fas ${msg.icon}"></i> ${msg.text}
      </div>

      ${!isCancelled ? `
      <div class="detail-timeline">
        ${statusSteps.map((step, i) => `
          <div class="tl-step ${i < currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}">
            <div class="tl-icon"><i class="fas ${statusIcons[step]}"></i></div>
            <span class="tl-label">${step.charAt(0).toUpperCase() + step.slice(1)}</span>
          </div>
        `).join('')}
      </div>` : ''}

      <div class="detail-items">
        <h3><i class="fas fa-shopping-bag"></i> Order Items</h3>
        ${items.map(item => `
          <div class="detail-item-row">
            <img src="${item.product?.image_url || '/images/placeholder.jpg'}" alt="${Utils.sanitizeHtml(item.product?.name || 'Item')}">
            <div class="detail-item-info">
              <span class="name">${Utils.sanitizeHtml(item.product?.name || 'Product')}</span>
              <span class="qty">Qty: ${item.quantity} × ${Utils.formatCurrency(item.unit_price)}</span>
            </div>
            <span class="item-total">${Utils.formatCurrency(item.total_price)}</span>
          </div>
        `).join('')}
      </div>

      <div class="detail-totals">
        <div class="row"><span>Subtotal</span><span>${Utils.formatCurrency(order.total_amount)}</span></div>
        <div class="row"><span>Delivery Fee</span><span>Free</span></div>
        ${order.discount_amount ? `<div class="row"><span>Discount</span><span style="color:#22c55e">-${Utils.formatCurrency(order.discount_amount)}</span></div>` : ''}
        <div class="row grand"><span>Total</span><span class="val">${Utils.formatCurrency(order.total_amount - (order.discount_amount || 0))}</span></div>
      </div>

      <div class="detail-delivery">
        <h3><i class="fas fa-map-marker-alt"></i> Delivery Information</h3>
        <p><strong>Address:</strong> ${Utils.sanitizeHtml(order.delivery_address || 'N/A')}</p>
        <p><strong>Phone:</strong> ${Utils.sanitizeHtml(order.phone_number || 'N/A')}</p>
        ${order.notes ? `<p><strong>Notes:</strong> ${Utils.sanitizeHtml(order.notes)}</p>` : ''}
      </div>

      ${(status === 'pending' || status === 'confirmed') ? `
      <div style="text-align:center; margin-top:var(--space-4);">
        <button class="btn btn-outline" style="color:var(--appetite-red)" onclick="dashboard.cancelOrder(${order.id})">
          <i class="fas fa-times"></i> Cancel Order
        </button>
      </div>` : ''}

      ${(status === 'delivered' || status === 'completed') ? `
      <div style="text-align:center; margin-top:var(--space-4);">
        <button class="btn btn-primary" onclick="dashboard.reorder(${order.id})">
          <i class="fas fa-redo"></i> Reorder
        </button>
      </div>` : ''}
    `;
  }

  // ==================== Order Actions ====================

  async cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await window.API.cancelOrder(orderId);
      this.showToast('Order cancelled successfully', 'success');
      this.loadOrders();
      this.loadOverviewData();
      this.switchSection('orders');
    } catch (e) {
      this.showToast(e.message || 'Failed to cancel', 'error');
    }
  }

  async reorder(orderId) {
    try {
      const response = await window.API.reorder(orderId);
      let msg = response.message || 'Items added to cart';
      if (response.unavailable_items?.length) {
        msg += ` (${response.unavailable_items.join(', ')} unavailable)`;
      }
      this.showToast(msg, 'success');
    } catch (e) {
      this.showToast(e.message || 'Failed to reorder', 'error');
    }
  }

  // ==================== Profile ====================

  async loadProfile() {
    try {
      const profile = await window.API.getProfile();
      this.user = profile;

      document.getElementById('dash-firstname').value = profile.first_name || '';
      document.getElementById('dash-lastname').value = profile.last_name || '';
      document.getElementById('dash-username').value = profile.username || '';
      document.getElementById('dash-email').value = profile.email || '';
      document.getElementById('dash-phone').value = profile.phone || '';

      if (profile.created_at) {
        document.getElementById('member-since').textContent =
          new Date(profile.created_at).toLocaleDateString('en-NG', { dateStyle: 'long' });
      }

      document.getElementById('account-status').textContent =
        profile.is_active ? 'Active' : 'Inactive';
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
  }

  async handleProfileSave(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    try {
      const data = {
        first_name: document.getElementById('dash-firstname').value.trim(),
        last_name: document.getElementById('dash-lastname').value.trim(),
        username: document.getElementById('dash-username').value.trim(),
        email: document.getElementById('dash-email').value.trim(),
        phone: document.getElementById('dash-phone').value.trim(),
      };

      const result = await window.API.updateProfile(data);
      this.user = result.user || this.user;
      this.populateUserData();
      this.showToast('Profile updated successfully!', 'success');
    } catch (e) {
      this.showToast(e.message || 'Failed to update profile', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  async handlePasswordChange(e) {
    e.preventDefault();
    const newPwd = document.getElementById('dash-new-password').value;
    const confirmPwd = document.getElementById('dash-confirm-password').value;

    if (!newPwd || newPwd.length < 6) {
      this.showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (newPwd !== confirmPwd) {
      this.showToast('Passwords do not match', 'error');
      return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    btn.disabled = true;

    try {
      await window.API.updateProfile({ password: newPwd });
      this.showToast('Password updated successfully!', 'success');
      e.target.reset();
    } catch (e) {
      this.showToast(e.message || 'Failed to update password', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  }

  // ==================== Wishlist ====================

  async loadWishlist() {
    const container = document.getElementById('wishlist-container');
    if (!container) return;

    container.innerHTML = '<div class="dash-loading"><i class="fas fa-spinner fa-spin"></i><p>Loading wishlist...</p></div>';

    try {
      const response = await window.API.getWishlist();
      const items = response.items || response || [];

      if (!items.length) {
        container.innerHTML = `
          <div class="dash-empty">
            <i class="fas fa-heart"></i>
            <h3>Wishlist Empty</h3>
            <p>Save your favorite items to find them here.</p>
            <a href="/#menu" class="btn btn-primary"><i class="fas fa-utensils"></i> Browse Menu</a>
          </div>`;
        return;
      }

      container.innerHTML = `<div class="wishlist-grid stagger-fade-in">
        ${items.map(item => {
          const product = item.product || item;
          return `
            <div class="wishlist-card">
              <img src="${product.image_url || '/images/placeholder.jpg'}" alt="${Utils.sanitizeHtml(product.name)}">
              <div class="wishlist-card-body">
                <h3>${Utils.sanitizeHtml(product.name)}</h3>
                <div class="price">${Utils.formatCurrency(product.price)}</div>
              </div>
              <div class="wishlist-card-actions">
                <button class="btn btn-sm btn-outline" onclick="dashboard.removeFromWishlist(${product.id})">
                  <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="dashboard.addToCartFromWishlist(${product.id})">
                  <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
              </div>
            </div>`;
        }).join('')}
      </div>`;
    } catch (e) {
      console.error('Failed to load wishlist:', e);
      container.innerHTML = '<div class="dash-empty"><i class="fas fa-exclamation-circle"></i><h3>Failed to Load</h3></div>';
    }
  }

  async removeFromWishlist(productId) {
    try {
      await window.API.removeFromWishlist(productId);
      this.showToast('Removed from wishlist', 'success');
      this.loadWishlist();
    } catch (e) {
      this.showToast(e.message || 'Failed to remove', 'error');
    }
  }

  async addToCartFromWishlist(productId) {
    try {
      await window.API.addToCart(productId, 1);
      this.showToast('Added to cart!', 'success');
    } catch (e) {
      this.showToast(e.message || 'Failed to add to cart', 'error');
    }
  }

  // ==================== Toast ====================

  showToast(message, type = 'info') {
    if (window.Toast) {
      window.Toast.show(message, type);
    } else {
      console.log(`${type}: ${message}`);
    }
  }
}

// Initialize
const dashboard = new CustomerDashboard();
