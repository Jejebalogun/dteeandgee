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
    this.appliedPromo = null;
    this.selectedPaymentMethod = 'monnify';
    this.monnifyConfig = null;
    // Debounce timers: itemId → { timer, pendingQty }
    this._quantityDebounce = {};
    // Guard: prevent attaching cart item listeners more than once
    this._cartListenersAttached = false;
    // Guard: prevent concurrent quantity changes from racing
    this._handlingQuantity = false;

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
    // Attach cart item listeners ONCE here, not inside updateCartModal
    this.attachCartItemListeners();
  }

  /**
   * Load cart from server
   */
  async loadCartFromServer() {
    try {
      const response = await window.API.getCart();
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
        const response = await window.API.addToCart(productId, quantity);
        
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
        await window.API.updateCartItem(itemId, quantity);
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
        await window.API.removeCartItem(itemId);
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
        await window.API.clearCart();
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

    // Update cart modal header with item count
    const cartModalHeader = document.querySelector('#cart-modal .modal-header h2');
    if (cartModalHeader) {
      cartModalHeader.innerHTML = this.cartCount > 0
        ? `Shopping Cart <span class="cart-header-count">(${this.cartCount} item${this.cartCount !== 1 ? 's' : ''})</span>`
        : 'Shopping Cart';
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
             alt="${Utils.sanitizeHtml(item.product.name)}" 
             class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${Utils.sanitizeHtml(item.product.name)}</div>
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

    // Render cart summary with promo code
    const discountedTotal = this.getDiscountedTotal();
    cartSummary.innerHTML = `
      <div class="promo-code-section">
        <div class="promo-input-group">
          <input type="text" id="promo-code-input" placeholder="Enter promo code"
                 value="${this.appliedPromo?.code || ''}" ${this.appliedPromo ? 'readonly' : ''}>
          ${this.appliedPromo ?
            `<button class="btn btn-sm btn-outline remove-promo-btn" onclick="Cart.removePromoCode()">Remove</button>` :
            `<button class="btn btn-sm btn-primary apply-promo-btn" onclick="Cart.handlePromoApply()">Apply</button>`
          }
        </div>
        ${this.appliedPromo ? `
          <div class="promo-applied">
            <i class="fas fa-check-circle"></i>
            <span>Code "${this.appliedPromo.code}" applied</span>
          </div>
        ` : ''}
      </div>

      <div class="cart-totals">
        <div class="items-count-row">
          <span>Items:</span>
          <span>${this.cartCount} item${this.cartCount !== 1 ? 's' : ''}</span>
        </div>
        <div class="subtotal-row">
          <span>Subtotal:</span>
          <span>${Utils.formatCurrency(this.cartTotal)}</span>
        </div>
        ${this.appliedPromo ? `
          <div class="discount-row">
            <span>Discount:</span>
            <span class="discount-amount">-${Utils.formatCurrency(this.appliedPromo.discountAmount)}</span>
          </div>
        ` : ''}
        <div class="total-row">
          <span>Total:</span>
          <span>${Utils.formatCurrency(discountedTotal)}</span>
        </div>
      </div>
    `;
    // NOTE: Do NOT call attachCartItemListeners() here.
    // It is called once in init() to prevent listener accumulation on re-renders.
  }

  /**
   * Apply promo code
   * @param {string} code - Promo code
   * @returns {Promise} Apply result
   */
  async applyPromoCode(code) {
    if (!code || !code.trim()) {
      this.showToast('Please enter a promo code', 'error');
      return { success: false };
    }

    if (!Auth.isUserAuthenticated()) {
      this.showToast('Please sign in to use promo codes', 'info');
      Auth.showAuthModal();
      return { success: false };
    }

    try {
      const response = await window.API.applyPromoCode(code.trim().toUpperCase(), this.cartTotal);

      this.appliedPromo = {
        code: response.code,
        discountAmount: response.discount_amount
      };

      this.updateCartUI();
      this.showToast(`Promo code applied! You save ${Utils.formatCurrency(response.discount_amount)}`, 'success');
      return { success: true, discount: response.discount_amount };
    } catch (error) {
      this.showToast(error.message || 'Invalid promo code', 'error');
      return { success: false };
    }
  }

  /**
   * Remove applied promo code
   * @returns {Promise} Remove result
   */
  async removePromoCode() {
    try {
      if (Auth.isUserAuthenticated()) {
        await window.API.removePromoCode();
      }

      this.appliedPromo = null;
      this.updateCartUI();
      this.showToast('Promo code removed', 'info');
      return { success: true };
    } catch (error) {
      this.showToast('Failed to remove promo code', 'error');
      return { success: false };
    }
  }

  /**
   * Handle promo code apply button click
   */
  handlePromoApply() {
    const input = document.getElementById('promo-code-input');
    if (input) {
      this.applyPromoCode(input.value);
    }
  }

  /**
   * Get total after discount
   * @returns {number} Discounted total
   */
  getDiscountedTotal() {
    if (!this.appliedPromo) return this.cartTotal;
    return Math.max(0, this.cartTotal - this.appliedPromo.discountAmount);
  }

  /**
   * Attach event listeners to cart item controls
   */
  attachCartItemListeners() {
    // Only wire up once — prevents listener accumulation on every cart re-render
    if (this._cartListenersAttached) return;
    this._cartListenersAttached = true;

    const cartItemsContainer = Utils.getElementById('cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.addEventListener('click', async (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      const itemId = e.target.closest('[data-item-id]')?.dataset.itemId;

      if (!action || !itemId) return;
      e.preventDefault();

      if (action === 'remove') {
        await this.removeCartItem(itemId);
        return;
      }

      if (action === 'increase' || action === 'decrease') {
        // Find the current item — use pending qty if already debouncing
        const pending = this._quantityDebounce[itemId];
        const item = this.cartItems.find(i => i.id == itemId);
        if (!item) return;

        const currentQty = pending ? pending.qty : item.quantity;
        const newQty = action === 'increase' ? currentQty + 1 : Math.max(1, currentQty - 1);

        // Optimistically update the local item so the UI reflects instantly
        item.quantity = newQty;
        item.subtotal = newQty * item.product.price;
        this.updateCartTotals();
        this.updateCartUI();

        // Clear any existing timer for this item
        if (pending) clearTimeout(pending.timer);

        // Schedule the actual API call
        this._quantityDebounce[itemId] = {
          qty: newQty,
          timer: setTimeout(async () => {
            delete this._quantityDebounce[itemId];
            await this.updateCartItem(itemId, newQty);
          }, 400)
        };
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
          await window.API.addToCart(item.product_id, item.quantity);
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

    // Allow both authenticated and guest checkout
    this.isGuestCheckout = !Auth.isUserAuthenticated();

    // Hide cart modal and show checkout modal
    this.hideCartModal();
    this.showCheckoutModal();
  }

  /**
   * Show checkout modal
   */
  showCheckoutModal() {
    const checkoutModal = Utils.getElementById('checkout-modal');
    if (checkoutModal) {
      // Reset to step 1
      this.currentCheckoutStep = 1;
      this.updateCheckoutStep(1);

      // Pre-fill user data if available
      this.prefillCheckoutForm();

      // Show/hide guest checkout fields
      this.updateGuestCheckoutFields();

      checkoutModal.classList.add('active');
      this.initCheckoutEventListeners();
    }
  }

  /**
   * Update guest checkout fields visibility
   */
  updateGuestCheckoutFields() {
    const guestFields = Utils.getElementById('guest-checkout-fields');
    if (guestFields) {
      guestFields.style.display = this.isGuestCheckout ? 'block' : 'none';
    }
  }

  /**
   * Hide checkout modal
   */
  hideCheckoutModal() {
    const checkoutModal = Utils.getElementById('checkout-modal');
    if (checkoutModal) {
      checkoutModal.classList.remove('active');
    }
  }

  /**
   * Initialize checkout event listeners
   */
  initCheckoutEventListeners() {
    // Close button
    const closeBtn = Utils.getElementById('checkout-modal-close');
    if (closeBtn && !closeBtn.hasAttribute('data-listener-added')) {
      closeBtn.addEventListener('click', () => this.hideCheckoutModal());
      closeBtn.setAttribute('data-listener-added', 'true');
    }

    // Modal backdrop click
    const checkoutModal = Utils.getElementById('checkout-modal');
    if (checkoutModal && !checkoutModal.hasAttribute('data-listener-added')) {
      checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
          this.hideCheckoutModal();
        }
      });
      checkoutModal.setAttribute('data-listener-added', 'true');
    }

    // Back to cart button
    const backToCartBtn = Utils.getElementById('checkout-back-to-cart');
    if (backToCartBtn && !backToCartBtn.hasAttribute('data-listener-added')) {
      backToCartBtn.addEventListener('click', () => {
        this.hideCheckoutModal();
        this.showCartModal();
      });
      backToCartBtn.setAttribute('data-listener-added', 'true');
    }

    // Delivery form submission (Step 1 -> Step 2)
    const deliveryForm = Utils.getElementById('checkout-delivery-form');
    if (deliveryForm && !deliveryForm.hasAttribute('data-listener-added')) {
      deliveryForm.addEventListener('submit', (e) => this.handleDeliveryFormSubmit(e));
      deliveryForm.setAttribute('data-listener-added', 'true');
    }

    // Back to delivery button (Step 2 -> Step 1)
    const backToDeliveryBtn = Utils.getElementById('checkout-back-to-delivery');
    if (backToDeliveryBtn && !backToDeliveryBtn.hasAttribute('data-listener-added')) {
      backToDeliveryBtn.addEventListener('click', () => this.updateCheckoutStep(1));
      backToDeliveryBtn.setAttribute('data-listener-added', 'true');
    }

    // Place order button
    const placeOrderBtn = Utils.getElementById('checkout-place-order');
    if (placeOrderBtn && !placeOrderBtn.hasAttribute('data-listener-added')) {
      placeOrderBtn.addEventListener('click', () => this.placeOrder());
      placeOrderBtn.setAttribute('data-listener-added', 'true');
    }

    // View order button (after success)
    const viewOrderBtn = Utils.getElementById('view-order-btn');
    if (viewOrderBtn && !viewOrderBtn.hasAttribute('data-listener-added')) {
      viewOrderBtn.addEventListener('click', () => {
        this.hideCheckoutModal();
        if (window.app) {
          window.app.showOrdersModal();
        }
      });
      viewOrderBtn.setAttribute('data-listener-added', 'true');
    }

    // Continue shopping after order
    const continueAfterBtn = Utils.getElementById('continue-shopping-after');
    if (continueAfterBtn && !continueAfterBtn.hasAttribute('data-listener-added')) {
      continueAfterBtn.addEventListener('click', () => {
        this.hideCheckoutModal();
      });
      continueAfterBtn.setAttribute('data-listener-added', 'true');
    }

    // Payment method selection
    this.initPaymentMethodListeners();
  }

  /**
   * Initialize payment method selection listeners
   */
  initPaymentMethodListeners() {
    const paymentMethods = document.querySelectorAll('.payment-method-option');
    const bankDetails = Utils.getElementById('bank-transfer-details');

    paymentMethods.forEach(option => {
      option.addEventListener('click', () => {
        // Update selection UI
        paymentMethods.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Update selected payment method
        const input = option.querySelector('input');
        if (input) {
          input.checked = true;
          this.selectedPaymentMethod = input.value;
        }

        // Show/hide bank transfer details
        if (bankDetails) {
          bankDetails.style.display = this.selectedPaymentMethod === 'bank_transfer' ? 'block' : 'none';
        }

        // Update place order button text
        this.updatePlaceOrderButton();
      });
    });
  }

  /**
   * Update place order button based on payment method
   */
  updatePlaceOrderButton() {
    const placeOrderBtn = Utils.getElementById('checkout-place-order');
    if (!placeOrderBtn) return;

    const buttonTexts = {
      'monnify': '<i class="fas fa-lock"></i> Pay Now',
      'bank_transfer': '<i class="fas fa-check"></i> Confirm Order',
      'cash_on_delivery': '<i class="fas fa-check"></i> Place Order'
    };

    placeOrderBtn.innerHTML = buttonTexts[this.selectedPaymentMethod] || '<i class="fas fa-check"></i> Place Order';
  }

  /**
   * Pre-fill checkout form with user data
   */
  prefillCheckoutForm() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const phoneInput = Utils.getElementById('checkout-phone');
    if (phoneInput && user.phone) {
      phoneInput.value = user.phone;
    }
  }

  /**
   * Update checkout step
   * @param {number} step - Step number (1, 2, or 3)
   */
  updateCheckoutStep(step) {
    this.currentCheckoutStep = step;

    // Update progress indicators
    const steps = document.querySelectorAll('.checkout-step');
    const lines = document.querySelectorAll('.checkout-step-line');

    steps.forEach((stepEl, index) => {
      const stepNum = index + 1;
      stepEl.classList.remove('active', 'completed');

      if (stepNum < step) {
        stepEl.classList.add('completed');
      } else if (stepNum === step) {
        stepEl.classList.add('active');
      }
    });

    lines.forEach((line, index) => {
      if (index < step - 1) {
        line.classList.add('completed');
      } else {
        line.classList.remove('completed');
      }
    });

    // Update content visibility
    const contents = document.querySelectorAll('.checkout-step-content');
    contents.forEach((content, index) => {
      if (index + 1 === step) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // Populate step content
    if (step === 2) {
      this.populateReviewStep();
    }
  }

  /**
   * Handle delivery form submission
   * @param {Event} event - Form submit event
   */
  handleDeliveryFormSubmit(event) {
    event.preventDefault();

    const address = Utils.getElementById('checkout-address')?.value.trim();
    const phone = Utils.getElementById('checkout-phone')?.value.trim();

    if (!address) {
      this.showToast('Please enter your delivery address', 'error');
      return;
    }

    if (!phone) {
      this.showToast('Please enter your phone number', 'error');
      return;
    }

    // Validate guest checkout fields if applicable
    let guestName = '';
    let guestEmail = '';
    if (this.isGuestCheckout) {
      guestName = Utils.getElementById('checkout-guest-name')?.value.trim();
      guestEmail = Utils.getElementById('checkout-guest-email')?.value.trim();

      if (!guestName) {
        this.showToast('Please enter your full name', 'error');
        return;
      }

      if (!guestEmail) {
        this.showToast('Please enter your email address', 'error');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        this.showToast('Please enter a valid email address', 'error');
        return;
      }
    }

    // Store delivery info
    this.checkoutData = {
      delivery_address: address,
      phone_number: phone,
      alt_phone: Utils.getElementById('checkout-alt-phone')?.value.trim() || '',
      notes: Utils.getElementById('checkout-notes')?.value.trim() || '',
      guest_name: guestName,
      guest_email: guestEmail
    };

    // Move to step 2
    this.updateCheckoutStep(2);
  }

  /**
   * Populate the review step with order details
   */
  populateReviewStep() {
    // Populate items
    const itemsContainer = Utils.getElementById('checkout-items');
    if (itemsContainer) {
      itemsContainer.innerHTML = this.cartItems.map(item => `
        <div class="checkout-item">
          <img src="${item.product.image_url || '/images/placeholder.jpg'}"
               alt="${item.product.name}" class="checkout-item-image">
          <div class="checkout-item-details">
            <div class="checkout-item-name">${item.product.name}</div>
            <div class="checkout-item-qty">Qty: ${item.quantity}</div>
          </div>
          <div class="checkout-item-price">${Utils.formatCurrency(item.subtotal)}</div>
        </div>
      `).join('');
    }

    // Populate delivery summary
    const deliverySummary = Utils.getElementById('checkout-delivery-summary');
    if (deliverySummary && this.checkoutData) {
      deliverySummary.innerHTML = `
        <h4><i class="fas fa-truck"></i> Delivery Details</h4>
        <div class="delivery-detail">
          <strong>Address:</strong>
          <p>${this.checkoutData.delivery_address}</p>
        </div>
        <div class="delivery-detail">
          <strong>Phone:</strong>
          <p>${this.checkoutData.phone_number}${this.checkoutData.alt_phone ? ` / ${this.checkoutData.alt_phone}` : ''}</p>
        </div>
        ${this.checkoutData.notes ? `
          <div class="delivery-detail">
            <strong>Notes:</strong>
            <p>${this.checkoutData.notes}</p>
          </div>
        ` : ''}
      `;
    }

    // Populate totals
    const totalsContainer = Utils.getElementById('checkout-totals');
    if (totalsContainer) {
      const discountedTotal = this.getDiscountedTotal();
      totalsContainer.innerHTML = `
        <div class="totals-row">
          <span>Subtotal:</span>
          <span>${Utils.formatCurrency(this.cartTotal)}</span>
        </div>
        ${this.appliedPromo ? `
          <div class="totals-row discount">
            <span>Discount (${this.appliedPromo.code}):</span>
            <span>-${Utils.formatCurrency(this.appliedPromo.discountAmount)}</span>
          </div>
        ` : ''}
        <div class="totals-row delivery">
          <span>Delivery Fee:</span>
          <span class="free-delivery">FREE</span>
        </div>
        <div class="totals-row total">
          <span>Total:</span>
          <span>${Utils.formatCurrency(discountedTotal)}</span>
        </div>
      `;
    }
  }

  /**
   * Place order
   */
  async placeOrder() {
    if (!this.checkoutData) {
      this.showToast('Please complete delivery information first', 'error');
      this.updateCheckoutStep(1);
      return;
    }

    const placeOrderBtn = Utils.getElementById('checkout-place-order');
    const originalText = placeOrderBtn.innerHTML;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    placeOrderBtn.disabled = true;

    try {
      const orderData = {
        delivery_address: this.checkoutData.delivery_address,
        phone_number: this.checkoutData.phone_number,
        notes: this.checkoutData.notes || '',
        payment_method: this.selectedPaymentMethod
      };

      // Add alt phone to notes if provided
      if (this.checkoutData.alt_phone) {
        orderData.notes = `Alt Phone: ${this.checkoutData.alt_phone}\n${orderData.notes}`;
      }

      // Add guest checkout data if applicable
      if (this.isGuestCheckout) {
        orderData.guest_name = this.checkoutData.guest_name;
        orderData.guest_email = this.checkoutData.guest_email;
        orderData.is_guest = true;
        // Include cart items for guest checkout (backend needs them since no session cart)
        orderData.items = this.cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }));
      }

      // Create the order
      const response = this.isGuestCheckout
        ? await window.API.createGuestOrder(orderData)
        : await window.API.createOrder(orderData);
      this.currentOrderId = response.id;
      this.currentOrderNumber = response.order_number;

      // Handle payment based on selected method
      if (this.selectedPaymentMethod === 'monnify') {
        // Initiate Monnify payment
        await this.initiateMonnifyPayment(response);
      } else {
        // For bank transfer and cash on delivery, complete order directly
        this.completeOrder(response);
      }

    } catch (error) {
      this.showToast(error.message || 'Failed to place order. Please try again.', 'error');
      placeOrderBtn.innerHTML = originalText;
      placeOrderBtn.disabled = false;
    }
  }

  /**
   * Initiate Monnify payment
   * @param {Object} order - Order data
   */
  async initiateMonnifyPayment(order) {
    const placeOrderBtn = Utils.getElementById('checkout-place-order');

    try {
      // Get email and name - from user account or guest checkout
      const user = Auth.getCurrentUser();
      const email = this.isGuestCheckout ? this.checkoutData.guest_email : (user?.email || '');
      const name = this.isGuestCheckout ? this.checkoutData.guest_name : (user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Customer');

      if (!email) {
        this.showToast('Email is required for payment', 'error');
        placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
        placeOrderBtn.disabled = false;
        return;
      }

      // Get Monnify config
      if (!this.monnifyConfig) {
        const config = await window.API.getPaymentConfig();
        this.monnifyConfig = config;
      }

      const amount = this.getDiscountedTotal();

      // Initialize Monnify SDK
      MonnifySDK.initialize({
        amount: amount,
        currency: 'NGN',
        reference: `DTG-${order.order_number}`,
        customerName: name,
        customerEmail: email,
        apiKey: this.monnifyConfig.api_key,
        contractCode: this.monnifyConfig.contract_code,
        paymentDescription: `D'Tee & Gee Kitchen - Order #${order.order_number}`,
        isTestMode: this.monnifyConfig.is_test_mode || false,
        metadata: {
          order_id: order.id,
          order_number: order.order_number
        },
        onComplete: (response) => {
          // Payment completed (success or failure)
          if (response.status === 'SUCCESS') {
            this.handlePaymentSuccess(response, order);
          } else {
            this.showToast('Payment was not successful. Please try again.', 'error');
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
            placeOrderBtn.disabled = false;
          }
        },
        onClose: (data) => {
          // Payment popup closed
          if (data.paymentStatus === 'SUCCESS') {
            this.handlePaymentSuccess(data, order);
          } else {
            this.showToast('Payment was not completed. Your order is saved as pending.', 'info');
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
            placeOrderBtn.disabled = false;
          }
        }
      });

    } catch (error) {
      console.error('Monnify initialization failed:', error);
      this.showToast('Failed to initialize payment. Please try again.', 'error');
      placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Pay Now';
      placeOrderBtn.disabled = false;
    }
  }

  /**
   * Handle successful payment
   * @param {Object} response - Monnify response
   * @param {Object} order - Order data
   */
  async handlePaymentSuccess(response, order) {
    try {
      // Get the transaction reference from Monnify response
      const reference = response.transactionReference || response.paymentReference || `DTG-${order.order_number}`;

      // Verify payment on backend
      const verification = await window.API.verifyPayment(reference);

      if (verification.status) {
        this.completeOrder(order, true);
        this.showToast('Payment successful!', 'success');
      } else {
        this.showToast('Payment verification failed. Please contact support.', 'error');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      // Still complete the order as the payment might have gone through
      this.completeOrder(order, true);
    }
  }

  /**
   * Complete order after payment/confirmation
   * @param {Object} order - Order data
   * @param {boolean} isPaid - Whether payment was completed
   */
  completeOrder(order, isPaid = false) {
    // Update order number display
    const orderNumberDisplay = Utils.getElementById('confirmed-order-number');
    if (orderNumberDisplay) {
      orderNumberDisplay.textContent = order.order_number || 'Processing';
    }

    // Update success message based on payment method
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
      if (this.selectedPaymentMethod === 'bank_transfer') {
        successMessage.textContent = 'Please transfer the total amount to our bank account. Your order will be confirmed once payment is received.';
      } else if (this.selectedPaymentMethod === 'cash_on_delivery') {
        successMessage.textContent = 'Thank you for your order! Please have the exact amount ready when your order arrives.';
      } else if (isPaid) {
        successMessage.textContent = 'Payment received! Thank you for your order. We\'ve started preparing it right away.';
      }
    }

    // Clear cart state
    this.cartItems = [];
    this.cartTotal = 0;
    this.cartCount = 0;
    this.appliedPromo = null;
    this.checkoutData = null;
    this.selectedPaymentMethod = 'monnify';
    this.saveCartToStorage();
    this.updateCartUI();

    // Show success step
    this.updateCheckoutStep(3);

    // Reset place order button
    const placeOrderBtn = Utils.getElementById('checkout-place-order');
    if (placeOrderBtn) {
      placeOrderBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';
      placeOrderBtn.disabled = false;
    }
  }
}

// Create global cart manager instance
const Cart = new CartManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Cart = Cart;
}

