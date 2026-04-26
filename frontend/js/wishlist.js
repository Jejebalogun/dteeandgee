// D'Tee & Gee Kitchen - Wishlist Manager

/**
 * Wishlist Manager Class
 */
class WishlistManager {
  constructor() {
    this.wishlistItems = [];
    this.wishlistIds = new Set();
    this.initialized = false;
  }

  /**
   * Initialize wishlist manager
   */
  async init() {
    if (this.initialized) return;

    // Load wishlist if user is authenticated
    if (window.Auth && Auth.isUserAuthenticated()) {
      await this.loadWishlist();
    }

    this.initEventListeners();
    this.initialized = true;
  }

  /**
   * Load wishlist from server
   */
  async loadWishlist() {
    try {
      const response = await window.API.getWishlist();
      this.wishlistItems = response.items || [];
      this.wishlistIds = new Set(this.wishlistItems.map(item => item.product_id));
      this.updateAllWishlistButtons();
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  }

  /**
   * Clear local wishlist data
   */
  clearWishlist() {
    this.wishlistItems = [];
    this.wishlistIds = new Set();
    this.updateAllWishlistButtons();
  }

  /**
   * Check if product is in wishlist
   * @param {number} productId - Product ID
   * @returns {boolean} Is in wishlist
   */
  isInWishlist(productId) {
    return this.wishlistIds.has(parseInt(productId));
  }

  /**
   * Toggle product in wishlist
   * @param {number} productId - Product ID
   * @returns {Object} Result object
   */
  async toggleWishlist(productId) {
    if (!window.Auth || !Auth.isUserAuthenticated()) {
      if (window.Toast) {
        Toast.show('Please sign in to add items to your wishlist', 'info');
      }
      if (window.Auth) {
        Auth.showAuthModal();
      }
      return { success: false };
    }

    try {
      const response = await window.API.toggleWishlist(productId);

      if (response.in_wishlist) {
        this.wishlistIds.add(parseInt(productId));
        if (response.item) {
          this.wishlistItems.push(response.item);
        }
        if (window.Toast) {
          Toast.show('Added to wishlist', 'success');
        }
      } else {
        this.wishlistIds.delete(parseInt(productId));
        this.wishlistItems = this.wishlistItems.filter(item => item.product_id !== parseInt(productId));
        if (window.Toast) {
          Toast.show('Removed from wishlist', 'info');
        }
      }

      this.updateWishlistButton(productId, response.in_wishlist);
      return { success: true, in_wishlist: response.in_wishlist };
    } catch (error) {
      if (window.Toast) {
        Toast.show(error.message || 'Failed to update wishlist', 'error');
      }
      return { success: false };
    }
  }

  /**
   * Move item from wishlist to cart
   * @param {number} productId - Product ID
   * @returns {Object} Result object
   */
  async moveToCart(productId) {
    try {
      const response = await window.API.moveWishlistToCart(productId);
      this.wishlistIds.delete(parseInt(productId));
      this.wishlistItems = this.wishlistItems.filter(item => item.product_id !== parseInt(productId));
      this.updateWishlistButton(productId, false);

      if (window.Toast) {
        Toast.show('Moved to cart', 'success');
      }

      // Refresh cart
      if (window.Cart) {
        Cart.loadCartFromServer();
      }

      // Refresh wishlist modal if open
      this.refreshWishlistModal();

      return { success: true };
    } catch (error) {
      if (window.Toast) {
        Toast.show(error.message || 'Failed to move to cart', 'error');
      }
      return { success: false };
    }
  }

  /**
   * Update wishlist button state
   * @param {number} productId - Product ID
   * @param {boolean} inWishlist - Is in wishlist
   */
  updateWishlistButton(productId, inWishlist) {
    const buttons = document.querySelectorAll(`[data-wishlist-product="${productId}"], .wishlist-btn[data-product-id="${productId}"]`);
    buttons.forEach(btn => {
      const icon = btn.querySelector('i');
      if (inWishlist) {
        btn.classList.add('wishlisted');
        if (icon) {
          icon.classList.remove('far');
          icon.classList.add('fas');
        }
      } else {
        btn.classList.remove('wishlisted');
        if (icon) {
          icon.classList.remove('fas');
          icon.classList.add('far');
        }
      }
    });
  }

  /**
   * Update all wishlist buttons on page
   */
  updateAllWishlistButtons() {
    const buttons = document.querySelectorAll('[data-wishlist-product], .wishlist-btn[data-product-id]');
    buttons.forEach(btn => {
      const productId = parseInt(btn.dataset.wishlistProduct || btn.dataset.productId);
      if (productId) {
        this.updateWishlistButton(productId, this.isInWishlist(productId));
      }
    });
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Global click listener for wishlist buttons
    document.addEventListener('click', async (e) => {
      const wishlistBtn = e.target.closest('.wishlist-btn');
      if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        const productId = wishlistBtn.dataset.wishlistProduct || wishlistBtn.dataset.productId;
        if (productId) {
          await this.toggleWishlist(productId);
        }
      }
    });

    // Listen for auth changes
    if (window.Auth) {
      // Check periodically for auth state changes
      let lastAuthState = Auth.isUserAuthenticated();
      setInterval(() => {
        const currentAuthState = Auth.isUserAuthenticated();
        if (currentAuthState !== lastAuthState) {
          if (currentAuthState) {
            this.loadWishlist();
          } else {
            this.clearWishlist();
          }
          lastAuthState = currentAuthState;
        }
      }, 1000);
    }
  }

  /**
   * Show wishlist modal
   */
  showWishlistModal() {
    this.createWishlistModal();
  }

  /**
   * Create and display wishlist modal
   */
  createWishlistModal() {
    // Remove existing modal if present
    const existingModal = document.getElementById('wishlist-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'wishlist-modal';
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-heart"></i> My Wishlist</h2>
          <button class="modal-close" id="wishlist-modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          ${this.renderWishlistItems()}
        </div>
      </div>
    `;

    // Add event listeners
    modal.querySelector('#wishlist-modal-close').addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 300);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
      }
    });

    document.body.appendChild(modal);
  }

  /**
   * Refresh wishlist modal content
   */
  refreshWishlistModal() {
    const modalBody = document.querySelector('#wishlist-modal .modal-body');
    if (modalBody) {
      modalBody.innerHTML = this.renderWishlistItems();
    }
  }

  /**
   * Render wishlist items HTML
   * @returns {string} HTML string
   */
  renderWishlistItems() {
    if (this.wishlistItems.length === 0) {
      return `
        <div class="empty-wishlist">
          <i class="far fa-heart"></i>
          <h3>Your wishlist is empty</h3>
          <p>Save items you love by clicking the heart icon</p>
        </div>
      `;
    }

    return `
      <div class="wishlist-items">
        ${this.wishlistItems.map(item => {
          const safeName = window.Utils ? Utils.sanitizeHtml(item.product?.name || 'Product') : (item.product?.name || 'Product');
          return `
          <div class="wishlist-item" data-product-id="${item.product_id}">
            <img src="${item.product?.image_url || '/images/placeholder.jpg'}" alt="${safeName}">
            <div class="wishlist-item-details">
              <h4>${safeName}</h4>
              <span class="price">${window.Utils ? Utils.formatCurrency(item.product?.price || 0) : item.product?.price}</span>
              <div class="wishlist-item-actions">
                <button class="btn btn-sm btn-primary move-to-cart-btn" data-product-id="${item.product_id}">
                  <i class="fas fa-shopping-cart"></i> Move to Cart
                </button>
                <button class="btn btn-sm btn-outline remove-wishlist-btn" data-product-id="${item.product_id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        `;}).join('')}
      </div>
    `;
  }

  /**
   * Get wishlist count
   * @returns {number} Number of items in wishlist
   */
  getCount() {
    return this.wishlistIds.size;
  }
}

// Create global instance
const Wishlist = new WishlistManager();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Wishlist.init();
  });
} else {
  Wishlist.init();
}

// Add event delegation for move to cart and remove buttons
document.addEventListener('click', async (e) => {
  if (e.target.closest('.move-to-cart-btn')) {
    const btn = e.target.closest('.move-to-cart-btn');
    const productId = btn.dataset.productId;
    if (productId) {
      await Wishlist.moveToCart(productId);
    }
  }

  if (e.target.closest('.remove-wishlist-btn')) {
    const btn = e.target.closest('.remove-wishlist-btn');
    const productId = btn.dataset.productId;
    if (productId) {
      await Wishlist.toggleWishlist(productId);
      Wishlist.refreshWishlistModal();
    }
  }
});

// Export for global access
if (typeof window !== 'undefined') {
  window.Wishlist = Wishlist;
}
