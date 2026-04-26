/**
 * D'Tee & Gee Kitchen - Admin Dashboard
 */

class AdminDashboard {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentPage = { orders: 1, products: 1, users: 1, reviews: 1 };
        this.init();
    }

    async init() {
        // Check if user is admin
        await this.checkAdminAccess();

        // Initialize navigation
        this.initNavigation();
        this.initModals();
        this.initForms();
        this.initFilters();
        this.initThemeToggle();
        this.initZoneEventListeners();

        // Load initial data
        this.loadDashboard();
    }

    async checkAdminAccess() {
        try {
            const response = await fetch('/api/admin/dashboard', {
                credentials: 'include'
            });

            if (response.status === 401 || response.status === 403) {
                window.location.href = '/?auth=login&redirect=admin';
                return;
            }

            // Set admin name
            const user = Auth.getCurrentUser();
            if (user) {
                document.getElementById('admin-name').textContent =
                    user.first_name || user.username || 'Admin';
            }
        } catch (error) {
            console.error('Admin access check failed:', error);
            window.location.href = '/';
        }
    }

    // ==================== Navigation ====================

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        const viewAllLinks = document.querySelectorAll('.view-all[data-section]');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });

        viewAllLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(link.dataset.section);
            });
        });

        // Sidebar toggle
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
            document.getElementById('admin-sidebar').classList.toggle('collapsed');
        });

        // Logout
        document.getElementById('admin-logout')?.addEventListener('click', async (e) => {
            e.preventDefault();
            await Auth.logout();
            window.location.href = '/';
        });
    }

    switchSection(section) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        // Update sections
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.toggle('active', sec.id === `section-${section}`);
        });

        this.currentSection = section;

        // Load section data
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'inventory':
                this.loadInventory();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'promos':
                this.loadPromos();
                break;
            case 'reviews':
                this.loadReviews();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'delivery':
                this.loadDeliveryZones();
                break;
        }
    }

    // ==================== Dashboard ====================

    async loadDashboard() {
        try {
            const response = await fetch('/api/admin/dashboard', {
                credentials: 'include'
            });
            const data = await response.json();

            // Update stats
            document.getElementById('today-revenue').textContent =
                this.formatCurrency(data.revenue.today);
            document.getElementById('today-orders').textContent = data.orders.today;
            document.getElementById('pending-orders').textContent = data.orders.pending;
            document.getElementById('new-users').textContent = data.users.new_today;

            // Update badges
            document.getElementById('pending-orders-badge').textContent = data.orders.pending;
            document.getElementById('low-stock-badge').textContent =
                data.products.low_stock + data.products.out_of_stock;

            // Revenue summary
            document.getElementById('week-revenue').textContent =
                this.formatCurrency(data.revenue.week);
            document.getElementById('month-revenue').textContent =
                this.formatCurrency(data.revenue.month);
            document.getElementById('total-revenue').textContent =
                this.formatCurrency(data.revenue.total);

            // Recent orders
            this.renderRecentOrders(data.recent_orders);

            // Top products
            this.renderTopProducts(data.top_products);

            // Load inventory alerts
            this.loadInventoryAlerts();

        } catch (error) {
            console.error('Failed to load dashboard:', error);
            this.showToast('Failed to load dashboard', 'error');
        }
    }

    renderRecentOrders(orders) {
        const container = document.getElementById('recent-orders-list');
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<p class="empty-message">No recent orders</p>';
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-item" onclick="admin.showOrderDetail(${order.id})">
                <div class="order-info">
                    <span class="order-number">#${order.order_number}</span>
                    <span class="order-customer">${order.guest_name || 'Customer'}</span>
                </div>
                <div class="order-meta">
                    <span class="order-amount">${this.formatCurrency(order.total_amount)}</span>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderTopProducts(products) {
        const container = document.getElementById('top-products-list');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = '<p class="empty-message">No sales data yet</p>';
            return;
        }

        container.innerHTML = products.map((product, index) => `
            <div class="top-product-item">
                <span class="rank">${index + 1}</span>
                <img src="${product.image_url || '/images/placeholder.jpg'}" alt="${product.name}">
                <div class="product-info">
                    <span class="name">${product.name}</span>
                    <span class="sold">${product.total_sold} sold</span>
                </div>
            </div>
        `).join('');
    }

    async loadInventoryAlerts() {
        try {
            const response = await fetch('/api/admin/inventory/alerts', {
                credentials: 'include'
            });
            const data = await response.json();

            const container = document.getElementById('inventory-alerts-list');
            if (!container) return;

            const allAlerts = [...data.out_of_stock, ...data.low_stock];

            if (allAlerts.length === 0) {
                container.innerHTML = `
                    <div class="no-alerts">
                        <i class="fas fa-check-circle"></i>
                        <p>All products are well stocked!</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = allAlerts.slice(0, 5).map(item => `
                <div class="alert-item ${item.stock_quantity === 0 ? 'out-of-stock' : 'low-stock'}">
                    <img src="${item.image_url || '/images/placeholder.jpg'}" alt="${item.name}">
                    <div class="alert-info">
                        <span class="name">${item.name}</span>
                        <span class="stock">${item.stock_quantity === 0 ? 'Out of stock' : `${item.stock_quantity} left`}</span>
                    </div>
                    <button class="btn btn-sm btn-outline" onclick="admin.showStockModal(${item.id}, '${item.name}', ${item.stock_quantity})">
                        Update
                    </button>
                </div>
            `).join('');

        } catch (error) {
            console.error('Failed to load inventory alerts:', error);
        }
    }

    // ==================== Orders ====================

    async loadOrders(page = 1) {
        try {
            const status = document.getElementById('orders-status-filter')?.value || '';
            const dateFrom = document.getElementById('orders-date-from')?.value || '';
            const dateTo = document.getElementById('orders-date-to')?.value || '';

            const params = new URLSearchParams({
                page,
                per_page: 20,
                ...(status && { status }),
                ...(dateFrom && { date_from: dateFrom }),
                ...(dateTo && { date_to: dateTo })
            });

            const response = await fetch(`/api/admin/orders?${params}`, {
                credentials: 'include'
            });
            const data = await response.json();

            this.renderOrdersTable(data.orders);
            this.renderPagination('orders', data, page);
            this.currentPage.orders = page;

        } catch (error) {
            console.error('Failed to load orders:', error);
            this.showToast('Failed to load orders', 'error');
        }
    }

    renderOrdersTable(orders) {
        const tbody = document.getElementById('orders-table-body');
        if (!tbody) return;

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-cell">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td><strong>#${order.order_number}</strong></td>
                <td>
                    ${order.guest_name || 'Guest'}
                    <br><small>${order.phone_number}</small>
                </td>
                <td>${order.items?.length || 0} items</td>
                <td>${this.formatCurrency(order.total_amount)}</td>
                <td>
                    <span class="payment-badge ${order.payment_status}">${order.payment_status}</span>
                    <br><small>${order.payment_method}</small>
                </td>
                <td>
                    <select class="status-select ${order.status}" onchange="admin.updateOrderStatus(${order.id}, this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>${this.formatDate(order.created_at)}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="admin.showOrderDetail(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    async showOrderDetail(orderId) {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                credentials: 'include'
            });
            const order = await response.json();

            const content = document.getElementById('order-detail-content');
            content.innerHTML = `
                <div class="order-detail-grid">
                    <div class="order-detail-info">
                        <h3>Order #${order.order_number}</h3>
                        <p class="order-date">${this.formatDate(order.created_at, true)}</p>

                        <div class="detail-section">
                            <h4>Status</h4>
                            <span class="order-status ${order.status}">${order.status}</span>
                            <span class="payment-badge ${order.payment_status}">${order.payment_status}</span>
                        </div>

                        <div class="detail-section">
                            <h4>Customer</h4>
                            <p>${order.guest_name || order.customer?.name || 'Guest'}</p>
                            <p>${order.phone_number}</p>
                            <p>${order.guest_email || order.customer?.email || ''}</p>
                        </div>

                        <div class="detail-section">
                            <h4>Delivery Address</h4>
                            <p>${order.delivery_address}</p>
                        </div>

                        ${order.notes ? `
                            <div class="detail-section">
                                <h4>Notes</h4>
                                <p>${order.notes}</p>
                            </div>
                        ` : ''}
                    </div>

                    <div class="order-detail-items">
                        <h4>Order Items</h4>
                        <div class="items-list">
                            ${order.items.map(item => `
                                <div class="item-row">
                                    <img src="${item.product?.image_url || '/images/placeholder.jpg'}" alt="${item.product?.name}">
                                    <div class="item-info">
                                        <span class="item-name">${item.product?.name || 'Product'}</span>
                                        <span class="item-qty">x${item.quantity}</span>
                                    </div>
                                    <span class="item-price">${this.formatCurrency(item.total_price)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-total">
                            <span>Total:</span>
                            <span>${this.formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>
                </div>

                <div class="order-actions">
                    <button class="btn btn-outline" onclick="admin.updatePaymentStatus(${order.id}, 'paid')">
                        <i class="fas fa-check"></i> Mark Paid
                    </button>
                    <button class="btn btn-primary" onclick="admin.updateOrderStatus(${order.id}, 'confirmed')">
                        <i class="fas fa-check-double"></i> Confirm Order
                    </button>
                </div>
            `;

            this.openModal('order-detail-modal');

        } catch (error) {
            console.error('Failed to load order detail:', error);
            this.showToast('Failed to load order details', 'error');
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                this.showToast('Order status updated', 'success');
                this.loadOrders(this.currentPage.orders);
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
            this.showToast('Failed to update order status', 'error');
        }
    }

    async updatePaymentStatus(orderId, status) {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/payment`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ payment_status: status })
            });

            if (response.ok) {
                this.showToast('Payment status updated', 'success');
                this.closeModal('order-detail-modal');
                this.loadOrders(this.currentPage.orders);
            } else {
                throw new Error('Failed to update payment');
            }
        } catch (error) {
            console.error('Failed to update payment status:', error);
            this.showToast('Failed to update payment status', 'error');
        }
    }

    // ==================== Products ====================

    async loadProducts(page = 1) {
        try {
            const search = document.getElementById('products-search')?.value || '';
            const category = document.getElementById('products-category-filter')?.value || '';

            const params = new URLSearchParams({
                page,
                per_page: 12,
                ...(search && { search }),
                ...(category && { category })
            });

            const response = await fetch(`/api/admin/products?${params}`, {
                credentials: 'include'
            });
            const data = await response.json();

            this.renderProductsGrid(data.products);
            this.renderPagination('products', data, page);
            this.currentPage.products = page;

        } catch (error) {
            console.error('Failed to load products:', error);
            this.showToast('Failed to load products', 'error');
        }
    }

    renderProductsGrid(products) {
        const container = document.getElementById('products-grid');
        if (!container) return;

        if (products.length === 0) {
            container.innerHTML = '<p class="empty-message">No products found</p>';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="admin-product-card ${!product.is_available ? 'unavailable' : ''}">
                <img src="${product.image_url || '/images/placeholder.jpg'}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="category">${product.category_name || 'Uncategorized'}</p>
                    <p class="price">${this.formatCurrency(product.price)}</p>
                    <div class="stock-info">
                        <span class="${this.getStockClass(product)}">
                            ${product.stock_quantity ?? 'N/A'} in stock
                        </span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-sm btn-outline" onclick="admin.editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="admin.showStockModal(${product.id}, '${product.name}', ${product.stock_quantity})">
                        <i class="fas fa-boxes"></i>
                    </button>
                    <button class="btn btn-sm btn-outline danger" onclick="admin.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getStockClass(product) {
        if (!product.stock_quantity && product.stock_quantity !== 0) return '';
        if (product.stock_quantity === 0) return 'out-of-stock';
        if (product.stock_quantity <= (product.low_stock_threshold || 10)) return 'low-stock';
        return 'in-stock';
    }

    showProductForm(product = null) {
        document.getElementById('product-form-title').textContent =
            product ? 'Edit Product' : 'Add Product';

        // Always load fresh categories before opening the form
        this._loadCategoryDropdown().then(() => {
            if (product) {
                document.getElementById('product-id').value = product.id;
                document.getElementById('product-name').value = product.name;
                // Use category_name (string) to match the dropdown option values
                document.getElementById('product-category').value = product.category_name || '';
                document.getElementById('product-description').value = product.description || '';
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-stock').value = product.stock_quantity ?? 100;
                document.getElementById('product-low-stock').value = product.low_stock_threshold ?? 10;
                document.getElementById('product-image').value = product.image_url || '';
                document.getElementById('product-available').checked = product.is_available;

                // Show existing image preview
                if (product.image_url) {
                    this._showImagePreview(product.image_url);
                } else {
                    this._clearImagePreview();
                }
            } else {
                document.getElementById('product-form').reset();
                document.getElementById('product-id').value = '';
                this._clearImagePreview();
            }
        });

        this.openModal('product-form-modal');
    }

    /**
     * Load categories from API and populate the product category dropdown.
     */
    async _loadCategoryDropdown() {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) return;
            const data = await response.json();
            const select = document.getElementById('product-category');
            if (!select) return;

            const currentValue = select.value;
            select.innerHTML = '<option value="">Select a category</option>';
            (data.categories || []).forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.name;   // send the name string to backend
                opt.textContent = cat.name;
                select.appendChild(opt);
            });
            // Restore selection if editing
            if (currentValue) select.value = currentValue;
        } catch (e) {
            console.warn('Could not load categories:', e);
        }
    }

    async editProduct(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();
            this.showProductForm(product);
        } catch (error) {
            console.error('Failed to load product:', error);
            this.showToast('Failed to load product', 'error');
        }
    }

    async saveProduct(formData) {
        const productId = document.getElementById('product-id').value;
        const url = productId
            ? `/api/admin/products/${productId}`
            : '/api/admin/products';
        const method = productId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showToast(`Product ${productId ? 'updated' : 'created'} successfully`, 'success');
                this.closeModal('product-form-modal');
                this.loadProducts(this.currentPage.products);
            } else {
                // Safely parse error — response might be HTML on a 500 crash
                let errorMsg = 'Failed to save product';
                try {
                    const errData = await response.json();
                    errorMsg = errData.error || errorMsg;
                } catch {
                    errorMsg = `Server error (${response.status}). Check the server logs.`;
                }
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Failed to save product:', error);
            this.showToast(error.message, 'error');
        }
    }

    /**
     * Upload a product image file to the server.
     * @param {File} file - The image file to upload
     * @returns {Promise<string|null>} The public URL or null on failure
     */
    async uploadProductImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            this.showToast('Uploading image...', 'info');
            // Get CSRF token — required by Flask-WTF for all state-changing requests
            const csrfToken = window.API?.getCSRFToken() || '';
            const response = await fetch('/api/admin/products/upload-image', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrfToken
                },
                body: formData  // No Content-Type header — browser sets multipart boundary automatically
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Upload failed');
            }

            const result = await response.json();
            this.showToast('Image uploaded successfully!', 'success');
            return result.url;
        } catch (error) {
            console.error('Image upload failed:', error);
            this.showToast(error.message || 'Image upload failed', 'error');
            return null;
        }
    }

    /**
     * Show image preview in the product form.
     * @param {string} url - Image URL
     */
    _showImagePreview(url) {
        const box = document.getElementById('image-preview-box');
        const img = document.getElementById('image-preview-img');
        if (box && img) {
            img.src = url;
            box.style.display = 'flex';
        }
        // Sync hidden field
        document.getElementById('product-image').value = url;
    }

    /**
     * Clear image preview and hidden URL field.
     */
    _clearImagePreview() {
        const box = document.getElementById('image-preview-box');
        const img = document.getElementById('image-preview-img');
        const fileInput = document.getElementById('product-image-file');
        const urlInput = document.getElementById('product-image-url');
        if (box) box.style.display = 'none';
        if (img) img.src = '';
        if (fileInput) fileInput.value = '';
        if (urlInput) urlInput.value = '';
        document.getElementById('product-image').value = '';
    }

    /**
     * Handle a file selected via file picker or drag-and-drop.
     * Uploads it to the server and shows preview.
     * @param {File} file
     */
    async _handleImageFile(file) {
        // Validate type client-side
        const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
        if (!allowed.includes(file.type)) {
            this.showToast('Invalid file type. Use PNG, JPG, JPEG, WEBP, or GIF.', 'error');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image too large. Max size is 5MB.', 'error');
            return;
        }

        // Show local preview immediately for fast UX
        const localUrl = URL.createObjectURL(file);
        this._showImagePreview(localUrl);

        // Upload to server
        const serverUrl = await this.uploadProductImage(file);
        if (serverUrl) {
            // Replace the blob URL with the real server URL
            this._showImagePreview(serverUrl);
        } else {
            // Upload failed, clear the preview
            this._clearImagePreview();
        }
    }

    async deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                this.showToast('Product deleted successfully', 'success');
                this.loadProducts(this.currentPage.products);
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Failed to delete product:', error);
            this.showToast('Failed to delete product', 'error');
        }
    }

    // ==================== Inventory ====================

    async loadInventory() {
        try {
            const response = await fetch('/api/admin/inventory/alerts', {
                credentials: 'include'
            });
            const data = await response.json();

            // Update counts
            document.getElementById('low-stock-count').textContent = data.low_stock_count;
            document.getElementById('out-of-stock-count').textContent = data.out_of_stock_count;

            // Render list based on active tab
            const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'low-stock';
            const items = activeTab === 'out-of-stock' ? data.out_of_stock : data.low_stock;

            this.renderInventoryList(items, activeTab);

        } catch (error) {
            console.error('Failed to load inventory:', error);
            this.showToast('Failed to load inventory', 'error');
        }
    }

    renderInventoryList(items, type) {
        const container = document.getElementById('inventory-list');
        if (!container) return;

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-inventory">
                    <i class="fas fa-check-circle"></i>
                    <p>No ${type === 'out-of-stock' ? 'out of stock' : 'low stock'} items!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="inventory-item ${type}">
                <img src="${item.image_url || '/images/placeholder.jpg'}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="category">${item.category}</p>
                </div>
                <div class="stock-badge ${type}">
                    ${item.stock_quantity === 0 ? 'Out of Stock' : `${item.stock_quantity} left`}
                </div>
                <button class="btn btn-primary" onclick="admin.showStockModal(${item.id}, '${item.name}', ${item.stock_quantity})">
                    Restock
                </button>
            </div>
        `).join('');
    }

    showStockModal(productId, productName, currentStock) {
        document.getElementById('stock-product-id').value = productId;
        document.getElementById('stock-product-name').textContent = productName;
        document.getElementById('stock-quantity').value = currentStock || 0;
        this.openModal('stock-modal');
    }

    async updateStock() {
        const productId = document.getElementById('stock-product-id').value;
        const quantity = document.getElementById('stock-quantity').value;

        try {
            const response = await fetch(`/api/admin/products/${productId}/stock`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ stock_quantity: parseInt(quantity) })
            });

            if (response.ok) {
                this.showToast('Stock updated successfully', 'success');
                this.closeModal('stock-modal');

                // Refresh relevant sections
                if (this.currentSection === 'inventory') {
                    this.loadInventory();
                } else if (this.currentSection === 'products') {
                    this.loadProducts(this.currentPage.products);
                } else {
                    this.loadDashboard();
                }
            } else {
                throw new Error('Failed to update stock');
            }
        } catch (error) {
            console.error('Failed to update stock:', error);
            this.showToast('Failed to update stock', 'error');
        }
    }

    // ==================== Users ====================

    async loadUsers(page = 1) {
        try {
            const search = document.getElementById('users-search')?.value || '';

            const params = new URLSearchParams({
                page,
                per_page: 20,
                ...(search && { search })
            });

            const response = await fetch(`/api/admin/users?${params}`, {
                credentials: 'include'
            });
            const data = await response.json();

            this.renderUsersTable(data.users);
            this.renderPagination('users', data, page);
            this.currentPage.users = page;

        } catch (error) {
            console.error('Failed to load users:', error);
            this.showToast('Failed to load customers', 'error');
        }
    }

    renderUsersTable(users) {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-cell">No customers found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${this.getInitials(user)}</div>
                        <span>${user.first_name || ''} ${user.last_name || user.username}</span>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td>${user.order_count}</td>
                <td>${this.formatCurrency(user.total_spent)}</td>
                <td>${this.formatDate(user.created_at)}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="admin.viewUserOrders(${user.id})">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getInitials(user) {
        const first = user.first_name?.[0] || user.username?.[0] || 'U';
        const last = user.last_name?.[0] || '';
        return (first + last).toUpperCase();
    }

    // ==================== Promos ====================

    async loadPromos() {
        try {
            const response = await fetch('/api/admin/promos', {
                credentials: 'include'
            });
            const data = await response.json();

            this.renderPromosGrid(data.promos);

        } catch (error) {
            console.error('Failed to load promos:', error);
            this.showToast('Failed to load promo codes', 'error');
        }
    }

    renderPromosGrid(promos) {
        const container = document.getElementById('promos-grid');
        if (!container) return;

        if (promos.length === 0) {
            container.innerHTML = '<p class="empty-message">No promo codes yet</p>';
            return;
        }

        container.innerHTML = promos.map(promo => `
            <div class="promo-card ${!promo.is_active ? 'inactive' : ''}">
                <div class="promo-header">
                    <span class="promo-code">${promo.code}</span>
                    <span class="promo-status ${promo.is_active ? 'active' : 'inactive'}">
                        ${promo.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div class="promo-details">
                    <p class="discount">
                        ${promo.discount_type === 'percentage'
                            ? `${promo.discount_value}% off`
                            : `${this.formatCurrency(promo.discount_value)} off`}
                    </p>
                    <p class="min-order">Min order: ${this.formatCurrency(promo.min_order_amount)}</p>
                    <p class="uses">${promo.current_uses}/${promo.max_uses || '∞'} uses</p>
                    ${promo.expires_at
                        ? `<p class="expires">Expires: ${this.formatDate(promo.expires_at)}</p>`
                        : ''}
                </div>
                <div class="promo-actions">
                    <button class="btn btn-sm btn-outline" onclick="admin.togglePromo(${promo.id}, ${!promo.is_active})">
                        ${promo.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-outline danger" onclick="admin.deletePromo(${promo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    showPromoForm(promo = null) {
        document.getElementById('promo-form-title').textContent =
            promo ? 'Edit Promo Code' : 'Create Promo Code';

        if (promo) {
            document.getElementById('promo-id').value = promo.id;
            document.getElementById('promo-code').value = promo.code;
            document.getElementById('promo-code').disabled = true;
            document.getElementById('promo-type').value = promo.discount_type;
            document.getElementById('promo-value').value = promo.discount_value;
            document.getElementById('promo-min-order').value = promo.min_order_amount;
            document.getElementById('promo-max-uses').value = promo.max_uses || '';
            document.getElementById('promo-expires').value = promo.expires_at?.split('T')[0] || '';
            document.getElementById('promo-active').checked = promo.is_active;
        } else {
            document.getElementById('promo-form').reset();
            document.getElementById('promo-id').value = '';
            document.getElementById('promo-code').disabled = false;
        }

        this.openModal('promo-form-modal');
    }

    async savePromo(formData) {
        const promoId = document.getElementById('promo-id').value;
        const url = promoId
            ? `/api/admin/promos/${promoId}`
            : '/api/admin/promos';
        const method = promoId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showToast(`Promo code ${promoId ? 'updated' : 'created'} successfully`, 'success');
                this.closeModal('promo-form-modal');
                this.loadPromos();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save promo');
            }
        } catch (error) {
            console.error('Failed to save promo:', error);
            this.showToast(error.message, 'error');
        }
    }

    async togglePromo(promoId, activate) {
        try {
            const response = await fetch(`/api/admin/promos/${promoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ is_active: activate })
            });

            if (response.ok) {
                this.showToast(`Promo ${activate ? 'activated' : 'deactivated'}`, 'success');
                this.loadPromos();
            } else {
                throw new Error('Failed to update promo');
            }
        } catch (error) {
            console.error('Failed to toggle promo:', error);
            this.showToast('Failed to update promo', 'error');
        }
    }

    async deletePromo(promoId) {
        if (!confirm('Are you sure you want to delete this promo code?')) return;

        try {
            const response = await fetch(`/api/admin/promos/${promoId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                this.showToast('Promo code deleted', 'success');
                this.loadPromos();
            } else {
                throw new Error('Failed to delete promo');
            }
        } catch (error) {
            console.error('Failed to delete promo:', error);
            this.showToast('Failed to delete promo', 'error');
        }
    }

    // ==================== Reviews ====================

    async loadReviews(page = 1) {
        try {
            const rating = document.getElementById('reviews-rating-filter')?.value || '';

            const params = new URLSearchParams({
                page,
                per_page: 20,
                ...(rating && { rating })
            });

            const response = await fetch(`/api/admin/reviews?${params}`, {
                credentials: 'include'
            });
            const data = await response.json();

            this.renderReviewsList(data.reviews);
            this.renderPagination('reviews', data, page);
            this.currentPage.reviews = page;

        } catch (error) {
            console.error('Failed to load reviews:', error);
            this.showToast('Failed to load reviews', 'error');
        }
    }

    renderReviewsList(reviews) {
        const container = document.getElementById('admin-reviews-list');
        if (!container) return;

        if (reviews.length === 0) {
            container.innerHTML = '<p class="empty-message">No reviews found</p>';
            return;
        }

        container.innerHTML = reviews.map(review => `
            <div class="admin-review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <span class="reviewer-name">${review.user_name || 'Anonymous'}</span>
                        ${review.verified_purchase ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
                    </div>
                    <div class="review-rating">
                        ${this.renderStars(review.rating)}
                    </div>
                </div>
                </div>
                <p class="product-name">On: ${review.product_name}</p>
                <p class="review-comment">${review.comment || 'No comment'}</p>
                <div class="review-footer">
                    <span class="review-date">${this.formatDate(review.created_at)}</span>
                    <button class="btn btn-sm btn-outline ${review.is_featured ? 'success' : ''}" onclick="admin.toggleReviewFeatured(${review.id}, ${!review.is_featured})">
                        <i class="fas fa-star"></i> ${review.is_featured ? 'Featured' : 'Feature'}
                    </button>
                    <button class="btn btn-sm btn-outline danger" onclick="admin.deleteReview(${review.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderStars(rating) {
        return Array(5).fill(0).map((_, i) =>
            `<i class="fas fa-star ${i < rating ? 'filled' : ''}"></i>`
        ).join('');
    }

    async deleteReview(reviewId) {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                this.showToast('Review deleted', 'success');
                this.loadReviews(this.currentPage.reviews);
            } else {
                throw new Error('Failed to delete review');
            }
        } catch (error) {
            console.error('Failed to delete review:', error);
            this.showToast('Failed to delete review', 'error');
        }
    }

    // ==================== Utilities ====================

    async toggleReviewFeatured(reviewId, isFeatured) {
        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ is_featured: isFeatured })
            });

            if (response.ok) {
                this.showToast(`Review ${isFeatured ? 'featured' : 'unfeatured'}`, 'success');
                this.loadReviews(this.currentPage.reviews);
            } else {
                throw new Error('Failed to update review status');
            }
        } catch (error) {
            console.error('Failed to toggle review features:', error);
            this.showToast('Failed to update review', 'error');
        }
    }

    async showReviewForm() {
        document.getElementById('review-form').reset();
        
        // Load products into dropdown
        const select = document.getElementById('review-product');
        select.innerHTML = '<option value="">Loading products...</option>';
        this.openModal('review-form-modal');

        try {
            // Load all products to let them pick which product to review
            const response = await fetch('/api/products?per_page=100');
            const data = await response.json();
            
            select.innerHTML = '<option value="">Select a product</option>';
            data.products.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.name}</option>`;
            });
        } catch (e) {
            select.innerHTML = '<option value="">Failed to load products</option>';
        }
    }

    async saveReview(formData) {
        try {
            const response = await fetch('/api/admin/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                this.showToast('Review created successfully', 'success');
                this.closeModal('review-form-modal');
                this.loadReviews();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save review');
            }
        } catch (error) {
            console.error('Failed to save review:', error);
            this.showToast(error.message, 'error');
        }
    }

    initModals() {
        // Close buttons
        document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal || btn.closest('.modal')?.id;
                if (modalId) this.closeModal(modalId);
            });
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal(modal.id);
            });
        });
    }

    openModal(modalId) {
        document.getElementById(modalId)?.classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId)?.classList.remove('active');
    }

    initForms() {
        // ---- Product form submit ----
        document.getElementById('product-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct({
                name: document.getElementById('product-name').value,
                category: document.getElementById('product-category').value,
                description: document.getElementById('product-description').value,
                price: parseFloat(document.getElementById('product-price').value),
                stock_quantity: parseInt(document.getElementById('product-stock').value),
                low_stock_threshold: parseInt(document.getElementById('product-low-stock').value),
                image_url: document.getElementById('product-image').value,
                is_available: document.getElementById('product-available').checked
            });
        });

        // ---- Image tab switching ----
        document.querySelectorAll('.img-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.img-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.img-tab-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`img-panel-${btn.dataset.tab}`)?.classList.add('active');
            });
        });

        // ---- File drop zone click ----
        const dropZone = document.getElementById('image-drop-zone');
        const fileInput = document.getElementById('product-image-file');
        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
            dropZone.addEventListener('drop', async (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                const file = e.dataTransfer.files[0];
                if (file) await this._handleImageFile(file);
            });

            fileInput.addEventListener('change', async () => {
                const file = fileInput.files[0];
                if (file) await this._handleImageFile(file);
            });
        }

        // ---- URL input sync ----
        document.getElementById('product-image-url')?.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            if (url) {
                this._showImagePreview(url);
            } else {
                this._clearImagePreview();
            }
        });

        // ---- Clear button ----
        document.getElementById('img-clear-btn')?.addEventListener('click', () => {
            this._clearImagePreview();
        });


        // Promo form
        document.getElementById('promo-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePromo({
                code: document.getElementById('promo-code').value,
                discount_type: document.getElementById('promo-type').value,
                discount_value: parseFloat(document.getElementById('promo-value').value),
                min_order_amount: parseFloat(document.getElementById('promo-min-order').value) || 0,
                max_uses: parseInt(document.getElementById('promo-max-uses').value) || null,
                expires_at: document.getElementById('promo-expires').value || null,
                is_active: document.getElementById('promo-active').checked
            });
        });

        // Stock form
        document.getElementById('stock-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateStock();
        });

        // Add product button
        document.getElementById('add-product-btn')?.addEventListener('click', () => {
            this.showProductForm();
        });

        // Add promo button
        document.getElementById('add-promo-btn')?.addEventListener('click', () => {
            this.showPromoForm();
        });

        // Add review button
        document.getElementById('add-review-btn')?.addEventListener('click', () => {
            this.showReviewForm();
        });

        // Review form
        document.getElementById('review-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveReview({
                reviewer_name: document.getElementById('review-customer-name').value,
                product_id: parseInt(document.getElementById('review-product').value),
                rating: parseInt(document.getElementById('review-rating').value),
                comment: document.getElementById('review-comment').value,
                is_featured: document.getElementById('review-featured').checked
            });
        });
    }

    initFilters() {
        // Orders filters
        ['orders-status-filter', 'orders-date-from', 'orders-date-to'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', () => this.loadOrders(1));
        });

        // Products filters
        document.getElementById('products-search')?.addEventListener('input',
            this.debounce(() => this.loadProducts(1), 300));
        document.getElementById('products-category-filter')?.addEventListener('change',
            () => this.loadProducts(1));

        // Users filter
        document.getElementById('users-search')?.addEventListener('input',
            this.debounce(() => this.loadUsers(1), 300));

        // Reviews filter
        document.getElementById('reviews-rating-filter')?.addEventListener('change',
            () => this.loadReviews(1));

        // Inventory tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadInventory();
            });
        });
    }

    initThemeToggle() {
        const toggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        toggle?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            const icon = toggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    renderPagination(section, data, currentPage) {
        const container = document.getElementById(`${section}-pagination`);
        if (!container || data.pages <= 1) {
            if (container) container.innerHTML = '';
            return;
        }

        let html = '';

        if (currentPage > 1) {
            html += `<button class="pagination-btn" onclick="admin.load${this.capitalize(section)}(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        }

        for (let i = 1; i <= data.pages; i++) {
            if (i === 1 || i === data.pages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}"
                    onclick="admin.load${this.capitalize(section)}(${i})">${i}</button>`;
            } else if (i === currentPage - 3 || i === currentPage + 3) {
                html += '<span class="pagination-dots">...</span>';
            }
        }

        if (currentPage < data.pages) {
            html += `<button class="pagination-btn" onclick="admin.load${this.capitalize(section)}(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        container.innerHTML = html;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount || 0);
    }

    formatDate(dateStr, includeTime = false) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...(includeTime && { hour: '2-digit', minute: '2-digit' })
        };
        return date.toLocaleDateString('en-NG', options);
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ============ Analytics Methods ============

    async loadAnalytics() {
        try {
            const fetchJSON = async (url) => {
                const res = await fetch(url, { credentials: 'include' });
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            };

            const [overview, salesChart, topProducts, statusBreakdown, paymentMethods, recentOrders] = await Promise.all([
                fetchJSON('/api/admin/analytics/overview'),
                fetchJSON('/api/admin/analytics/sales-chart?days=30'),
                fetchJSON('/api/admin/analytics/top-products?limit=5&days=30'),
                fetchJSON('/api/admin/analytics/order-status'),
                fetchJSON('/api/admin/analytics/payment-methods?days=30'),
                fetchJSON('/api/admin/analytics/recent-orders?limit=10')
            ]);

            this.renderAnalyticsOverview(overview);
            this.renderSalesChart(salesChart.chart_data);
            this.renderTopProducts(topProducts.top_products);
            this.renderStatusBreakdown(statusBreakdown.status_breakdown);
            this.renderPaymentMethods(paymentMethods.payment_methods);
            this.renderAnalyticsRecentOrders(recentOrders.recent_orders);

        } catch (error) {
            console.error('Failed to load analytics:', error);
            this.showToast('Failed to load analytics', 'error');
        }
    }

    renderAnalyticsOverview(data) {
        document.getElementById('today-revenue').textContent = this.formatCurrency(data.today.revenue);
        document.getElementById('today-orders').textContent = data.today.orders;
        document.getElementById('week-revenue').textContent = this.formatCurrency(data.week.revenue);
        document.getElementById('month-revenue').textContent = this.formatCurrency(data.month.revenue);

        // Growth indicators
        const revenueChange = document.getElementById('revenue-change');
        const ordersChange = document.getElementById('orders-change');

        revenueChange.textContent = `${data.today.revenue_growth >= 0 ? '+' : ''}${data.today.revenue_growth}%`;
        revenueChange.className = `analytics-change ${data.today.revenue_growth >= 0 ? 'positive' : 'negative'}`;

        ordersChange.textContent = `${data.today.orders_growth >= 0 ? '+' : ''}${data.today.orders_growth}%`;
        ordersChange.className = `analytics-change ${data.today.orders_growth >= 0 ? 'positive' : 'negative'}`;

        document.getElementById('week-avg').textContent = `Avg: ${this.formatCurrency(data.week.avg_daily_revenue)}/day`;
        document.getElementById('month-avg').textContent = `Avg: ${this.formatCurrency(data.month.avg_daily_revenue)}/day`;

        // Total stats
        const totalRevenueEl = document.getElementById('total-revenue');
        if (totalRevenueEl) totalRevenueEl.textContent = this.formatCurrency(data.total.revenue);

        const totalCustomersEl = document.getElementById('total-customers');
        if (totalCustomersEl) totalCustomersEl.textContent = data.total.customers;

        const totalProductsEl = document.getElementById('total-products');
        if (totalProductsEl) totalProductsEl.textContent = data.total.products;
    }

    renderSalesChart(chartData) {
        const ctx = document.getElementById('sales-chart-canvas');
        if (!ctx) return;

        // Destroy existing chart if any
        if (this.salesChart) {
            this.salesChart.destroy();
        }

        const labels = chartData.map(d => d.day);
        const revenues = chartData.map(d => d.revenue);
        const orders = chartData.map(d => d.orders);

        this.salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: revenues,
                        borderColor: '#e63946',
                        backgroundColor: 'rgba(230, 57, 70, 0.1)',
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Orders',
                        data: orders,
                        borderColor: '#457b9d',
                        backgroundColor: 'rgba(69, 123, 157, 0.1)',
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Revenue (NGN)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Orders' },
                        grid: { drawOnChartArea: false }
                    }
                },
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }

    renderTopProducts(products) {
        const container = document.getElementById('top-products-list');
        if (!container) return;

        if (!products || products.length === 0) {
            container.innerHTML = '<p class="no-data">No sales data available</p>';
            return;
        }

        container.innerHTML = products.map((p, index) => `
            <div class="top-product-item">
                <span class="rank">#${index + 1}</span>
                <div class="product-info">
                    <span class="product-name">${p.name}</span>
                    <span class="product-stats">${p.total_sold} sold | ${this.formatCurrency(p.total_revenue)}</span>
                </div>
            </div>
        `).join('');
    }

    renderStatusBreakdown(statuses) {
        const container = document.getElementById('status-breakdown');
        if (!container) return;

        const total = statuses.reduce((sum, s) => sum + s.count, 0);
        const statusColors = {
            pending: '#f4a261',
            confirmed: '#2a9d8f',
            preparing: '#457b9d',
            ready: '#6a994e',
            delivered: '#38b000',
            cancelled: '#e63946'
        };

        container.innerHTML = statuses.map(s => {
            const percent = total > 0 ? ((s.count / total) * 100).toFixed(1) : 0;
            return `
                <div class="status-item">
                    <div class="status-header">
                        <span class="status-badge status-${s.status}">${s.status}</span>
                        <span class="status-count">${s.count}</span>
                    </div>
                    <div class="status-bar">
                        <div class="status-fill" style="width: ${percent}%; background: ${statusColors[s.status] || '#666'}"></div>
                    </div>
                    <span class="status-percent">${percent}%</span>
                </div>
            `;
        }).join('');
    }

    renderPaymentMethods(methods) {
        const container = document.getElementById('payment-methods-breakdown');
        if (!container) return;

        const methodLabels = {
            paystack: 'Card/Bank (Paystack)',
            bank_transfer: 'Bank Transfer',
            cash_on_delivery: 'Cash on Delivery'
        };

        container.innerHTML = methods.map(m => `
            <div class="payment-method-item">
                <div class="method-info">
                    <span class="method-name">${methodLabels[m.method] || m.method}</span>
                    <span class="method-count">${m.count} orders</span>
                </div>
                <span class="method-amount">${this.formatCurrency(m.total_amount)}</span>
            </div>
        `).join('');
    }

    renderAnalyticsRecentOrders(orders) {
        const container = document.getElementById('analytics-recent-orders');
        if (!container) return;

        if (!orders || orders.length === 0) {
            container.innerHTML = '<p class="no-data">No recent orders</p>';
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(o => `
                        <tr>
                            <td><strong>${o.order_number}</strong></td>
                            <td>${o.customer_name}</td>
                            <td>${this.formatCurrency(o.total_amount)}</td>
                            <td><span class="status-badge status-${o.status}">${o.status}</span></td>
                            <td><span class="status-badge payment-${o.payment_status}">${o.payment_status}</span></td>
                            <td>${this.formatDate(o.created_at)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // ============ Delivery Zones Methods ============

    async loadDeliveryZones() {
        try {
            const response = await this.fetchAPI('/delivery/zones/all');
            this.renderDeliveryZones(response.zones);
        } catch (error) {
            console.error('Failed to load delivery zones:', error);
            // Try public endpoint if admin endpoint fails
            try {
                const response = await this.fetchAPI('/delivery/zones');
                this.renderDeliveryZones(response.zones);
            } catch (e) {
                this.showToast('Failed to load delivery zones', 'error');
            }
        }
    }

    renderDeliveryZones(zones) {
        const container = document.getElementById('delivery-zones-list');
        if (!container) return;

        if (!zones || zones.length === 0) {
            container.innerHTML = '<p class="no-data">No delivery zones configured</p>';
            return;
        }

        container.innerHTML = `
            <div class="zones-grid">
                ${zones.map(zone => `
                    <div class="zone-card ${!zone.is_active ? 'inactive' : ''}">
                        <div class="zone-header">
                            <h3>${zone.name}</h3>
                            <span class="zone-status ${zone.is_active ? 'active' : 'inactive'}">
                                ${zone.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div class="zone-details">
                            <p class="zone-fee">
                                <i class="fas fa-naira-sign"></i>
                                ${zone.delivery_fee === 0 ? 'FREE' : this.formatCurrency(zone.delivery_fee)}
                            </p>
                            <p class="zone-time">
                                <i class="fas fa-clock"></i>
                                ${zone.estimated_time}
                            </p>
                            <p class="zone-min">
                                <i class="fas fa-shopping-cart"></i>
                                Min: ${this.formatCurrency(zone.min_order_amount)}
                            </p>
                        </div>
                        <div class="zone-areas">
                            <strong>Areas:</strong>
                            <p>${zone.areas}</p>
                        </div>
                        <div class="zone-actions">
                            <button class="btn btn-sm btn-outline" onclick="admin.editZone(${zone.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="admin.deleteZone(${zone.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showZoneModal(zone = null) {
        const modal = document.getElementById('zone-modal');
        const title = document.getElementById('zone-modal-title');
        const form = document.getElementById('zone-form');

        if (zone) {
            title.textContent = 'Edit Delivery Zone';
            document.getElementById('zone-id').value = zone.id;
            document.getElementById('zone-name').value = zone.name;
            document.getElementById('zone-areas').value = zone.areas;
            document.getElementById('zone-fee').value = zone.delivery_fee;
            document.getElementById('zone-min-order').value = zone.min_order_amount;
            document.getElementById('zone-time').value = zone.estimated_time;
            document.getElementById('zone-active').checked = zone.is_active;
        } else {
            title.textContent = 'Add Delivery Zone';
            form.reset();
            document.getElementById('zone-id').value = '';
            document.getElementById('zone-active').checked = true;
        }

        modal.classList.add('active');
    }

    async editZone(zoneId) {
        try {
            const response = await this.fetchAPI(`/delivery/zones/${zoneId}`);
            this.showZoneModal(response);
        } catch (error) {
            this.showToast('Failed to load zone details', 'error');
        }
    }

    async saveZone(formData) {
        const zoneId = document.getElementById('zone-id').value;
        const data = {
            name: formData.get('zone-name') || document.getElementById('zone-name').value,
            areas: formData.get('zone-areas') || document.getElementById('zone-areas').value,
            delivery_fee: parseFloat(document.getElementById('zone-fee').value),
            min_order_amount: parseFloat(document.getElementById('zone-min-order').value),
            estimated_time: document.getElementById('zone-time').value,
            is_active: document.getElementById('zone-active').checked
        };

        try {
            if (zoneId) {
                await this.fetchAPI(`/delivery/zones/${zoneId}`, 'PUT', data);
                this.showToast('Zone updated successfully', 'success');
            } else {
                await this.fetchAPI('/delivery/zones', 'POST', data);
                this.showToast('Zone created successfully', 'success');
            }

            document.getElementById('zone-modal').classList.remove('active');
            this.loadDeliveryZones();
        } catch (error) {
            this.showToast(error.message || 'Failed to save zone', 'error');
        }
    }

    async deleteZone(zoneId) {
        if (!confirm('Are you sure you want to delete this delivery zone?')) return;

        try {
            await this.fetchAPI(`/delivery/zones/${zoneId}`, 'DELETE');
            this.showToast('Zone deleted successfully', 'success');
            this.loadDeliveryZones();
        } catch (error) {
            this.showToast('Failed to delete zone', 'error');
        }
    }

    initZoneEventListeners() {
        // Add zone button
        const addZoneBtn = document.getElementById('add-zone-btn');
        if (addZoneBtn) {
            addZoneBtn.addEventListener('click', () => this.showZoneModal());
        }

        // Zone form
        const zoneForm = document.getElementById('zone-form');
        if (zoneForm) {
            zoneForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveZone(new FormData(zoneForm));
            });
        }

        // Refresh analytics button
        const refreshBtn = document.getElementById('refresh-analytics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadAnalytics());
        }
    }
}

// Initialize admin dashboard
const admin = new AdminDashboard();

// Export for global access
if (typeof window !== 'undefined') {
    window.admin = admin;
}
