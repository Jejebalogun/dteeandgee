// D'Tee & Gee Kitchen - Shopping Cart Module

/**
 * Shopping Cart Manager
 */
class CartManager {
  constructor() {
    this.cartItems = [];
    this.cartCount = 0;
    this.cartTotal = 0;
    this.isLoading = false;
    this.cartCallbacks = [];
    this.storageKey = 'dtee_gee_cart';
    
    // Initialize cart
    this.init();
  }

  /**
   * Initialize cart
   */
  async init() {
    // Load cart from server if authenticated, otherwise from localStorage
    if (Auth.isUserAuthenticated()) {
      await this.loadCartFromServer();
    } else {
      this.loadCartFromStorage();
    }
    
    this.updateCartUI();
    this.initEventListeners();
  }

  /**
   * Load cart from server
   */
  async loadCartFromServer() {
    try {
      const response = await API.getCart();
      this.cartItems = response.items || [];
      this.cartTotal = response.total || 0;
      this.cartCount = response.item_count || 0;
      
      // Sync with localStorage for offline access
      this.saveCartToStorage();
    } catch (error) {
      console.error('Failed to load cart from server:', error);
      // Fallback to localStorage
      this.loadCartFromStorage();
    }
  }

  /**
   * Load cart from localStorage
   */
  loadCartFromStorage() {
    const savedCart = Utils.storage.get(this.storageKey, {
      items: [],
      total: 0,
      count: 0
    });
    
    this.cartItems = savedCart.items || [];
    this.cartTotal = savedCart.total || 0;
    this.cartCount = savedCart.count || 0;
  }

  /**
   * Save cart to localStorage
   */
  saveCartToStorage() {
    Utils.storage.set(this.storageKey, {
      items: this.cartItems,
      total: this.cartTotal,
      count: this.cartCount,
      timestamp: Date.now()
    });
  }

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @param {Object} productData - Product data (for offline mode)
   * @returns {Promise} Add to cart result
   */
  async addToCart(productId, quantity = 1, productData = null) {
    try {
      this.setLoading(true);
      
      if (Auth.isUserAuthenticated()) {
        // Add to server cart
        const response = await API.addToCart(productId, quantity);
        
        // Update local cart
        await this.loadCartFromServer();
        
        this.showToast(`Added ${quantity} item(s) to cart`, 'success');
        this.animateCartIcon();
        this.notifyCartChange('add', { productId, quantity });
        
        return { success: true, item: response };
      } else {
        // Add to local cart
        return this.addToLocalCart(productId, quantity, productData);
      }
    } catch (error) {
      this.showToast(error.message || 'Failed to add item to cart', 'error');
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Add item to local cart (for non-authenticated users)
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @param {Object} productData - Product data
   * @returns {Object} Add result
   */
  addToLocalCart(productId, quantity, productData) {
    if (!productData) {
      throw new Error('Product data required for local cart');
    }

    // Check if item already exists
    const existingItemIndex = this.cartItems.findIndex(item => item.product_id === productId);
    
    if (existingItemIndex > -1) {
      // Update existing item
      this.cartItems[existingItemIndex].quantity += quantity;
      this.cartItems[existingItemIndex].subtotal = 
        this.cartItems[existingItemIndex].quantity * this.cartItems[existingItemIndex].product.price;
    } else {
      // Add new item
      const cartItem = {
        id: Utils.generateId(),
        product_id: productId,
        product: productData,
        quantity: quantity,
        subtotal: quantity * productData.price
      };
      this.cartItems.push(cartItem);
    }

    this.updateCartTotals();
    this.saveCartToStorage();
    this.updateCartUI();
    
    this.showToast(`Added ${quantity} item(s) to cart`, 'success');
    this.animateCartIcon();
    this.notifyCartChange('add', { productId, quantity });
    
    return { success: true };
  }

  /**
   * Update cart item quantity
   * @param {number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise} Update result
   */
  async updateCartItem(itemId, quantity) {
    try {
      this.setLoading(true);
      
      if (quantity <= 0) {
        return this.removeCartItem(itemId);
      }

      if (Auth.isUserAuthenticated()) {
        // Update on server
        await API.updateCartItem(itemId, quantity);
        await this.loadCartFromServer();
      } else {
        // Update local cart
        const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
          this.cartItems[itemIndex].quantity = quantity;
          this.cartItems[itemIndex].subtotal = quantity * this.cartItems[itemIndex].product.price;
          this.updateCartTotals();
          this.saveCartToStorage();
        }
      }

      this.updateCartUI();
      this.notifyCartChange('update', { itemId, quantity });
      
      return { success: true };
    } catch (error) {
      this.showToast(error.message || 'Failed to update cart item', 'error');
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   * @returns {Promise} Remove result
   */
  async removeCartItem(itemId) {
    try {
      this.setLoading(true);
      
      if (Auth.isUserAuthenticated()) {
        // Remove from server
        await API.removeCartItem(itemId);
        await this.loadCartFromServer();
      } else {
        // Remove from local cart
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.updateCartTotals();
        this.saveCartToStorage();
      }

      this.updateCartUI();
      this.showToast('Item removed from cart', 'info');
      this.notifyCartChange('remove', { itemId });
      
      return { success: true };
    } catch (error) {
      this.showToast(error.message || 'Failed to remove cart item', 'error');
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Clear entire cart
   * @returns {Promise} Clear result
   */
  async clearCart() {
    try {
      this.setLoading(true);
      
      if (Auth.isUserAuthenticated()) {
        // Clear server cart
        await API.clearCart();
      }
      
      // Clear local cart
      this.cartItems = [];
      this.cartTotal = 0;
      this.cartCount = 0;
      
      this.saveCartToStorage();
      this.updateCartUI();
      this.showToast('Cart cleared', 'info');
      this.notifyCartChange('clear', {});
      
      return { success: true };
    } catch (error) {
      this.showToast(error.message || 'Failed to clear cart', 'error');
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Update cart totals
   */
  updateCartTotals() {
    this.cartTotal = this.cartItems.reduce((total, item) => total + item.subtotal, 0);
    this.cartCount = this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Update cart UI
   */
  updateCartUI() {
    // Update cart count badge
    const cartCountElement = Utils.getElementById('cart-count');
    if (cartCountElement) {
      cartCountElement.textContent = this.cartCount;
      cartCountElement.style.display = this.cartCount > 0 ? 'block' : 'none';
    }

    // Update cart modal content
    this.updateCartModal();
  }

  /**
   * Update cart modal content
   */
  updateCartModal() {
    const cartItemsContainer = Utils.getElementById('cart-items');
    const cartSummary = Utils.getElementById('cart-summary');
    
    if (!cartItemsContainer || !cartSummary) return;

    if (this.cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <h3>Your cart is empty</h3>
          <p>Add some delicious items to get started!</p>
        </div>
      `;
      cartSummary.innerHTML = '';
      return;
    }

    // Render cart items
    cartItemsContainer.innerHTML = this.cartItems.map(item => `
      <div class="cart-item" data-item-id="${item.id}">
        <img src="${item.product.image_url || '/images/placeholder.jpg'}" 
             alt="${item.product.name}" 
             class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.product.name}</div>
          <div class="cart-item-price">${Utils.formatCurrency(item.product.price)}</div>
          <div class="cart-item-controls">
            <button class="quantity-btn" data-action="decrease" data-item-id="${item.id}">
              <i class="fas fa-minus"></i>
            </button>
            <input type="number" class="quantity-input" value="${item.quantity}" 
                   min="1" data-item-id="${item.id}">
            <button class="quantity-btn" data-action="increase" data-item-id="${item.id}">
              <i class="fas fa-plus"></i>
            </button>
            <button class="remove-btn" data-action="remove" data-item-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="cart-item-subtotal">
          ${Utils.formatCurrency(item.subtotal)}
        </div>
      </div>
    `).join('');

    // Render cart summary
    cartSummary.innerHTML = `
      <div class="cart-total">
        <span>Total: ${Utils.formatCurrency(this.cartTotal)}</span>
      </div>
    `;

    // Add event listeners to cart controls
    this.attachCartItemListeners();
  }

  /**
   * Attach event listeners to cart item controls
   */
  attachCartItemListeners() {
    const cartItemsContainer = Utils.getElementById('cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.addEventListener('click', async (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const itemId = e.target.closest('[data-item-id]')?.dataset.itemId;
      
      if (!action || !itemId) return;

      e.preventDefault();
      
      const item = this.cartItems.find(item => item.id == itemId);
      if (!item) return;

      switch (action) {
        case 'increase':
          await this.updateCartItem(itemId, item.quantity + 1);
          break;
        case 'decrease':
          await this.updateCartItem(itemId, Math.max(1, item.quantity - 1));
          break;
        case 'remove':
          await this.removeCartItem(itemId);
          break;
      }
    });

    // Handle quantity input changes
    cartItemsContainer.addEventListener('change', async (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const itemId = e.target.dataset.itemId;
        const quantity = parseInt(e.target.value) || 1;
        
        if (itemId) {
          await this.updateCartItem(itemId, quantity);
        }
      }
    });
  }

  /**
   * Show cart modal
   */
  showCartModal() {
    const cartModal = Utils.getElementById('cart-modal');
    if (cartModal) {
      cartModal.classList.add('active');
      this.updateCartModal();
    }
  }

  /**
   * Hide cart modal
   */
  hideCartModal() {
    const cartModal = Utils.getElementById('cart-modal');
    if (cartModal) {
      cartModal.classList.remove('active');
    }
  }

  /**
   * Animate cart icon
   */
  animateCartIcon() {
    const cartToggle = Utils.getElementById('cart-toggle');
    if (cartToggle) {
      cartToggle.classList.add('cart-bounce');
      setTimeout(() => {
        cartToggle.classList.remove('cart-bounce');
      }, 300);
    }
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading(loading) {
    this.isLoading = loading;
    
    // Update UI to show loading state
    const cartModal = Utils.getElementById('cart-modal');
    if (cartModal) {
      if (loading) {
        cartModal.classList.add('loading');
      } else {
        cartModal.classList.remove('loading');
      }
    }
  }

  /**
   * Get cart items
   * @returns {Array} Cart items
   */
  getCartItems() {
    return this.cartItems;
  }

  /**
   * Get cart count
   * @returns {number} Cart count
   */
  getCartCount() {
    return this.cartCount;
  }

  /**
   * Get cart total
   * @returns {number} Cart total
   */
  getCartTotal() {
    return this.cartTotal;
  }

  /**
   * Check if cart is empty
   * @returns {boolean} Is cart empty
   */
  isEmpty() {
    return this.cartItems.length === 0;
  }

  /**
   * Sync cart with server (when user logs in)
   */
  async syncWithServer() {
    if (!Auth.isUserAuthenticated()) return;

    try {
      // If there are local cart items, merge with server cart
      if (this.cartItems.length > 0) {
        for (const item of this.cartItems) {
          await API.addToCart(item.product_id, item.quantity);
        }
      }
      
      // Load updated cart from server
      await this.loadCartFromServer();
      this.updateCartUI();
      
      // Clear local storage
      Utils.storage.remove(this.storageKey);
    } catch (error) {
      console.error('Failed to sync cart with server:', error);
    }
  }

  /**
   * Add cart change callback
   * @param {Function} callback - Callback function
   */
  onCartChange(callback) {
    if (typeof callback === 'function') {
      this.cartCallbacks.push(callback);
    }
  }

  /**
   * Remove cart change callback
   * @param {Function} callback - Callback function to remove
   */
  offCartChange(callback) {
    const index = this.cartCallbacks.indexOf(callback);
    if (index > -1) {
      this.cartCallbacks.splice(index, 1);
    }
  }

  /**
   * Notify cart change
   * @param {string} action - Action type
   * @param {Object} data - Action data
   */
  notifyCartChange(action, data) {
    this.cartCallbacks.forEach(callback => {
      try {
        callback(action, data, {
          items: this.cartItems,
          count: this.cartCount,
          total: this.cartTotal
        });
      } catch (error) {
        console.error('Cart callback error:', error);
      }
    });
  }

  /**
   * Show toast notification
   * @param {string} message - Message to show
   * @param {string} type - Toast type
   */
  showToast(message, type = 'info') {
    if (window.Toast) {
      window.Toast.show(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Cart toggle button
    const cartToggle = Utils.getElementById('cart-toggle');
    if (cartToggle) {
      cartToggle.addEventListener('click', () => {
        this.showCartModal();
      });
    }

    // Cart modal close
    const cartModalClose = Utils.getElementById('cart-modal-close');
    if (cartModalClose) {
      cartModalClose.addEventListener('click', () => {
        this.hideCartModal();
      });
    }

    // Continue shopping button
    const continueShoppingBtn = Utils.getElementById('continue-shopping');
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener('click', () => {
        this.hideCartModal();
      });
    }

    // Checkout button
    const checkoutBtn = Utils.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.proceedToCheckout();
      });
    }

    // Modal backdrop click
    const cartModal = Utils.getElementById('cart-modal');
    if (cartModal) {
      cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
          this.hideCartModal();
        }
      });
    }

    // Listen for auth changes to sync cart
    Auth.onAuthChange((action, user) => {
      if (action === 'login') {
        this.syncWithServer();
      } else if (action === 'logout') {
        this.clearCart();
      }
    });
  }

  /**
   * Proceed to checkout
   */
  proceedToCheckout() {
    if (this.isEmpty()) {
      this.showToast('Your cart is empty', 'info');
      return;
    }

    if (!Auth.isUserAuthenticated()) {
      this.showToast('Please sign in to proceed to checkout', 'info');
      Auth.showAuthModal();
      return;
    }

    // Navigate to checkout page or show checkout modal
    console.log('Proceeding to checkout with items:', this.cartItems);
    this.showToast('Checkout functionality coming soon!', 'info');
  }
}

// Create global cart manager instance
const Cart = new CartManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Cart = Cart;
}

