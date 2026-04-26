// D'Tee & Gee Kitchen - API Communication Layer

/**
 * API client for communicating with the backend
 */
class API {
  constructor() {
    this.baseURL = window.location.origin;
    this.apiURL = `${this.baseURL}/api`;
    this.authURL = `${this.baseURL}/api/auth`;
    
    // Default headers
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Make HTTP request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} Response promise
   */
  async request(url, options = {}) {
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      credentials: 'include', // Include cookies for session management
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} Response promise
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.apiURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    return this.request(url.toString(), { method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response promise
   */
  async post(endpoint, data = {}) {
    return this.request(`${this.apiURL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response promise
   */
  async put(endpoint, data = {}) {
    return this.request(`${this.apiURL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} Response promise
   */
  async delete(endpoint) {
    return this.request(`${this.apiURL}${endpoint}`, {
      method: 'DELETE'
    });
  }

  // Authentication Methods
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration response
   */
  async register(userData) {
    return this.request(`${this.authURL}/register`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  /**
   * Login user
   * @param {string} usernameOrEmail - Username or email
   * @param {string} password - Password
   * @returns {Promise} Login response
   */
  async login(usernameOrEmail, password) {
    return this.request(`${this.authURL}/login`, {
      method: 'POST',
      body: JSON.stringify({
        username_or_email: usernameOrEmail,
        password: password
      })
    });
  }

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  async logout() {
    return this.request(`${this.authURL}/logout`, {
      method: 'POST'
    });
  }

  /**
   * Get user profile
   * @returns {Promise} Profile response
   */
  async getProfile() {
    return this.request(`${this.authURL}/profile`, {
      method: 'GET'
    });
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise} Update response
   */
  async updateProfile(profileData) {
    return this.request(`${this.authURL}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  /**
   * Check authentication status
   * @returns {Promise} Auth status response
   */
  async checkAuth() {
    return this.request(`${this.authURL}/check-auth`, {
      method: 'GET'
    });
  }

  // Product Methods
  /**
   * Get all products
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Products response
   */
  async getProducts(filters = {}) {
    return this.get('/products', filters);
  }

  /**
   * Get single product
   * @param {number} productId - Product ID
   * @returns {Promise} Product response
   */
  async getProduct(productId) {
    return this.get(`/products/${productId}`);
  }

  /**
   * Get featured products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise} Featured products response
   */
  async getFeaturedProducts(limit = 8) {
    return this.get('/featured-products', { limit });
  }

  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} Search results
   */
  async searchProducts(query, filters = {}) {
    return this.get('/products', { search: query, ...filters });
  }

  // Category Methods
  /**
   * Get all categories
   * @returns {Promise} Categories response
   */
  async getCategories() {
    return this.get('/categories');
  }

  /**
   * Get single category
   * @param {number} categoryId - Category ID
   * @returns {Promise} Category response
   */
  async getCategory(categoryId) {
    return this.get(`/categories/${categoryId}`);
  }

  // Cart Methods
  /**
   * Get cart items
   * @returns {Promise} Cart response
   */
  async getCart() {
    return this.get('/cart');
  }

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise} Add to cart response
   */
  async addToCart(productId, quantity = 1) {
    return this.post('/cart/add', {
      product_id: productId,
      quantity: quantity
    });
  }

  /**
   * Update cart item
   * @param {number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise} Update response
   */
  async updateCartItem(itemId, quantity) {
    return this.put(`/cart/update/${itemId}`, { quantity });
  }

  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   * @returns {Promise} Remove response
   */
  async removeCartItem(itemId) {
    return this.delete(`/cart/remove/${itemId}`);
  }

  /**
   * Clear entire cart
   * @returns {Promise} Clear cart response
   */
  async clearCart() {
    return this.delete('/cart/clear');
  }

  /**
   * Get cart item count
   * @returns {Promise} Cart count response
   */
  async getCartCount() {
    return this.get('/cart/count');
  }

  // Order Methods
  /**
   * Get user orders
   * @param {Object} params - Query parameters
   * @returns {Promise} Orders response
   */
  async getOrders(params = {}) {
    return this.get('/orders', params);
  }

  /**
   * Get single order
   * @param {number} orderId - Order ID
   * @returns {Promise} Order response
   */
  async getOrder(orderId) {
    return this.get(`/orders/${orderId}`);
  }

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise} Create order response
   */
  async createOrder(orderData) {
    return this.post('/orders', orderData);
  }

  /**
   * Cancel order
   * @param {number} orderId - Order ID
   * @returns {Promise} Cancel response
   */
  async cancelOrder(orderId) {
    return this.put(`/orders/${orderId}/cancel`);
  }

  // Review Methods
  /**
   * Get product reviews
   * @param {number} productId - Product ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Reviews response
   */
  async getProductReviews(productId, params = {}) {
    return this.get(`/products/${productId}/reviews`, params);
  }

  /**
   * Create product review
   * @param {number} productId - Product ID
   * @param {Object} reviewData - Review data
   * @returns {Promise} Create review response
   */
  async createReview(productId, reviewData) {
    return this.post(`/products/${productId}/reviews`, reviewData);
  }

  /**
   * Update review
   * @param {number} reviewId - Review ID
   * @param {Object} reviewData - Updated review data
   * @returns {Promise} Update review response
   */
  async updateReview(reviewId, reviewData) {
    return this.put(`/reviews/${reviewId}`, reviewData);
  }

  /**
   * Delete review
   * @param {number} reviewId - Review ID
   * @returns {Promise} Delete review response
   */
  async deleteReview(reviewId) {
    return this.delete(`/reviews/${reviewId}`);
  }

  /**
   * Get user reviews
   * @param {number} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} User reviews response
   */
  async getUserReviews(userId, params = {}) {
    return this.get(`/users/${userId}/reviews`, params);
  }

  /**
   * Get recent reviews
   * @param {number} limit - Number of reviews to fetch
   * @returns {Promise} Recent reviews response
   */
  async getRecentReviews(limit = 5) {
    return this.get('/reviews/recent', { limit });
  }

  // Utility Methods
  /**
   * Upload file
   * @param {File} file - File to upload
   * @param {string} endpoint - Upload endpoint
   * @returns {Promise} Upload response
   */
  async uploadFile(file, endpoint = '/upload') {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(`${this.apiURL}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set content-type for FormData
    });
  }

  /**
   * Get server health status
   * @returns {Promise} Health status response
   */
  async getHealthStatus() {
    return this.get('/health');
  }

  /**
   * Send contact form
   * @param {Object} contactData - Contact form data
   * @returns {Promise} Contact response
   */
  async sendContactForm(contactData) {
    return this.post('/contact', contactData);
  }

  /**
   * Subscribe to newsletter
   * @param {string} email - Email address
   * @returns {Promise} Newsletter subscription response
   */
  async subscribeNewsletter(email) {
    return this.post('/newsletter/subscribe', { email });
  }
}

/**
 * API Error Handler
 */
class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

/**
 * API Response Cache
 */
class APICache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  /**
   * Get cached response
   * @param {string} key - Cache key
   * @returns {*} Cached data or null
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Set cached response
   * @param {string} key - Cache key
   * @param {*} data - Data to cache
   * @param {number} ttl - Time to live (optional)
   */
  set(key, data, ttl = this.ttl) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  /**
   * Clear cache
   * @param {string} key - Specific key to clear (optional)
   */
  clear(key = null) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache size
   * @returns {number} Number of cached items
   */
  size() {
    return this.cache.size;
  }
}

// Create global API instance
const api = new API();
const apiCache = new APICache();

// Enhanced API with caching
const cachedAPI = {
  ...api,
  
  /**
   * Get products with caching
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Products response
   */
  async getProducts(filters = {}) {
    const cacheKey = `products_${JSON.stringify(filters)}`;
    const cached = apiCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await api.getProducts(filters);
    apiCache.set(cacheKey, response);
    return response;
  },

  /**
   * Get categories with caching
   * @returns {Promise} Categories response
   */
  async getCategories() {
    const cacheKey = 'categories';
    const cached = apiCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await api.getCategories();
    apiCache.set(cacheKey, response, 10 * 60 * 1000); // Cache for 10 minutes
    return response;
  },

  /**
   * Clear product cache
   */
  clearProductCache() {
    apiCache.clear();
  }
};

// Export API instances
if (typeof window !== 'undefined') {
  window.API = api;
  window.CachedAPI = cachedAPI;
  window.APICache = apiCache;
  window.APIError = APIError;
}

