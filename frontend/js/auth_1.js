// D'Tee & Gee Kitchen - Authentication Module

/**
 * Authentication Manager
 */
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authCallbacks = [];
    this.storageKey = 'dtee_gee_auth';
    
    // Initialize authentication state
    this.init();
  }

  /**
   * Initialize authentication
   */
  async init() {
    try {
      // Check if user is authenticated
      const authData = await API.checkAuth();
      if (authData.authenticated) {
        this.setUser(authData.user);
      }
    } catch (error) {
      console.log('User not authenticated');
      this.clearUser();
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Registration result
   */
  async register(userData) {
    try {
      // Validate registration data
      this.validateRegistrationData(userData);
      
      const response = await API.register(userData);
      
      if (response.user) {
        this.setUser(response.user);
        this.showToast('Registration successful! Welcome to D\'Tee & Gee Kitchen!', 'success');
        this.notifyAuthChange('register', response.user);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      this.showToast(error.message || 'Registration failed', 'error');
      return { success: false, error: error.message };
    }
  }

  /**
   * Login user
   * @param {string} usernameOrEmail - Username or email
   * @param {string} password - Password
   * @returns {Promise} Login result
   */
  async login(usernameOrEmail, password) {
    try {
      // Validate login data
      if (!usernameOrEmail || !password) {
        throw new Error('Username/email and password are required');
      }

      const response = await API.login(usernameOrEmail, password);
      
      if (response.user) {
        this.setUser(response.user);
        this.showToast(`Welcome back, ${response.user.first_name || response.user.username}!`, 'success');
        this.notifyAuthChange('login', response.user);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      this.showToast(error.message || 'Login failed', 'error');
      return { success: false, error: error.message };
    }
  }

  /**
   * Logout user
   * @returns {Promise} Logout result
   */
  async logout() {
    try {
      await API.logout();
      this.clearUser();
      this.showToast('You have been logged out successfully', 'info');
      this.notifyAuthChange('logout', null);
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local auth state
      this.clearUser();
      this.notifyAuthChange('logout', null);
      return { success: true };
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise} Update result
   */
  async updateProfile(profileData) {
    try {
      const response = await API.updateProfile(profileData);
      
      if (response.user) {
        this.setUser(response.user);
        this.showToast('Profile updated successfully', 'success');
        this.notifyAuthChange('profile_update', response.user);
        return { success: true, user: response.user };
      }
      
      return { success: false, error: 'Profile update failed' };
    } catch (error) {
      this.showToast(error.message || 'Profile update failed', 'error');
      return { success: false, error: error.message };
    }
  }

  /**
   * Set current user
   * @param {Object} user - User data
   */
  setUser(user) {
    this.currentUser = user;
    this.isAuthenticated = true;
    
    // Store in session storage for persistence across tabs
    Utils.sessionStorage.set(this.storageKey, {
      user: user,
      timestamp: Date.now()
    });
    
    this.updateUI();
  }

  /**
   * Clear current user
   */
  clearUser() {
    this.currentUser = null;
    this.isAuthenticated = false;
    
    // Clear storage
    Utils.sessionStorage.remove(this.storageKey);
    
    this.updateUI();
  }

  /**
   * Get current user
   * @returns {Object|null} Current user or null
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Is authenticated
   */
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Validate registration data
   * @param {Object} userData - User data to validate
   */
  validateRegistrationData(userData) {
    const errors = [];

    // Username validation
    if (!userData.username || userData.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    // Email validation
    if (!userData.email || !Utils.isValidEmail(userData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Password validation
    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    // Confirm password validation
    if (userData.password !== userData.confirm_password) {
      errors.push('Passwords do not match');
    }

    // Phone validation (if provided)
    if (userData.phone && !Utils.isValidPhone(userData.phone)) {
      errors.push('Please enter a valid phone number');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }

  /**
   * Update UI based on authentication state
   */
  updateUI() {
    const authToggle = Utils.getElementById('auth-toggle');
    const cartToggle = Utils.getElementById('cart-toggle');
    
    if (this.isAuthenticated) {
      // Update auth button to show user menu
      if (authToggle) {
        authToggle.innerHTML = '<i class="fas fa-user-circle"></i>';
        authToggle.title = `${this.currentUser.first_name || this.currentUser.username} - Account`;
      }
      
      // Show cart button
      if (cartToggle) {
        cartToggle.style.display = 'block';
      }
      
      // Update any user-specific content
      this.updateUserContent();
    } else {
      // Update auth button to show login
      if (authToggle) {
        authToggle.innerHTML = '<i class="fas fa-user"></i>';
        authToggle.title = 'Sign In / Register';
      }
      
      // Hide cart button for non-authenticated users
      if (cartToggle) {
        cartToggle.style.display = 'none';
      }
    }
  }

  /**
   * Update user-specific content
   */
  updateUserContent() {
    // Update welcome messages
    const welcomeElements = document.querySelectorAll('[data-user-welcome]');
    welcomeElements.forEach(element => {
      element.textContent = `Welcome, ${this.currentUser.first_name || this.currentUser.username}!`;
    });

    // Update user name displays
    const nameElements = document.querySelectorAll('[data-user-name]');
    nameElements.forEach(element => {
      element.textContent = this.currentUser.first_name || this.currentUser.username;
    });

    // Update user email displays
    const emailElements = document.querySelectorAll('[data-user-email]');
    emailElements.forEach(element => {
      element.textContent = this.currentUser.email;
    });
  }

  /**
   * Add authentication change callback
   * @param {Function} callback - Callback function
   */
  onAuthChange(callback) {
    if (typeof callback === 'function') {
      this.authCallbacks.push(callback);
    }
  }

  /**
   * Remove authentication change callback
   * @param {Function} callback - Callback function to remove
   */
  offAuthChange(callback) {
    const index = this.authCallbacks.indexOf(callback);
    if (index > -1) {
      this.authCallbacks.splice(index, 1);
    }
  }

  /**
   * Notify authentication change
   * @param {string} action - Action type (login, logout, register, profile_update)
   * @param {Object} user - User data
   */
  notifyAuthChange(action, user) {
    this.authCallbacks.forEach(callback => {
      try {
        callback(action, user);
      } catch (error) {
        console.error('Auth callback error:', error);
      }
    });
  }

  /**
   * Show toast notification
   * @param {string} message - Message to show
   * @param {string} type - Toast type (success, error, info)
   */
  showToast(message, type = 'info') {
    if (window.Toast) {
      window.Toast.show(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  /**
   * Require authentication for action
   * @param {Function} action - Action to perform if authenticated
   * @param {string} message - Message to show if not authenticated
   */
  requireAuth(action, message = 'Please sign in to continue') {
    if (this.isAuthenticated) {
      action();
    } else {
      this.showToast(message, 'info');
      this.showAuthModal();
    }
  }

  /**
   * Show authentication modal
   */
  showAuthModal() {
    const authModal = Utils.getElementById('auth-modal');
    if (authModal) {
      authModal.classList.add('active');
    }
  }

  /**
   * Hide authentication modal
   */
  hideAuthModal() {
    const authModal = Utils.getElementById('auth-modal');
    if (authModal) {
      authModal.classList.remove('active');
    }
  }

  /**
   * Switch between login and register forms
   * @param {string} mode - Form mode ('login' or 'register')
   */
  switchAuthMode(mode = 'login') {
    const loginForm = Utils.getElementById('login-form');
    const registerForm = Utils.getElementById('register-form');
    const modalTitle = Utils.getElementById('auth-modal-title');
    const switchText = Utils.getElementById('auth-switch-text');
    const switchLink = Utils.getElementById('auth-switch-link');

    if (mode === 'login') {
      if (loginForm) loginForm.classList.remove('hidden');
      if (registerForm) registerForm.classList.add('hidden');
      if (modalTitle) modalTitle.textContent = 'Sign In';
      if (switchText) switchText.innerHTML = 'Don\'t have an account? <a href="#" id="auth-switch-link">Sign up</a>';
    } else {
      if (loginForm) loginForm.classList.add('hidden');
      if (registerForm) registerForm.classList.remove('hidden');
      if (modalTitle) modalTitle.textContent = 'Create Account';
      if (switchText) switchText.innerHTML = 'Already have an account? <a href="#" id="auth-switch-link">Sign in</a>';
    }

    // Re-attach switch link event
    const newSwitchLink = Utils.getElementById('auth-switch-link');
    if (newSwitchLink) {
      newSwitchLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchAuthMode(mode === 'login' ? 'register' : 'login');
      });
    }
  }

  /**
   * Handle login form submission
   * @param {Event} event - Form submit event
   */
  async handleLoginSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const username = formData.get('username') || Utils.getElementById('login-username')?.value;
    const password = formData.get('password') || Utils.getElementById('login-password')?.value;

    if (!username || !password) {
      this.showToast('Please enter both username/email and password', 'error');
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;

    try {
      const result = await this.login(username, password);
      
      if (result.success) {
        this.hideAuthModal();
        form.reset();
      }
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  /**
   * Handle register form submission
   * @param {Event} event - Form submit event
   */
  async handleRegisterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const userData = {
      username: formData.get('username') || Utils.getElementById('register-username')?.value,
      email: formData.get('email') || Utils.getElementById('register-email')?.value,
      first_name: formData.get('first_name') || Utils.getElementById('register-firstname')?.value,
      last_name: formData.get('last_name') || Utils.getElementById('register-lastname')?.value,
      phone: formData.get('phone') || Utils.getElementById('register-phone')?.value,
      password: formData.get('password') || Utils.getElementById('register-password')?.value,
      confirm_password: formData.get('confirm_password') || Utils.getElementById('register-confirm-password')?.value
    };

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;

    try {
      const result = await this.register(userData);
      
      if (result.success) {
        this.hideAuthModal();
        form.reset();
      }
    } finally {
      // Reset button state
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  /**
   * Initialize authentication event listeners
   */
  initEventListeners() {
    // Auth toggle button
    const authToggle = Utils.getElementById('auth-toggle');
    if (authToggle) {
      authToggle.addEventListener('click', () => {
        if (this.isAuthenticated) {
          // Show user menu or profile
          this.showUserMenu();
        } else {
          this.showAuthModal();
        }
      });
    }

    // Auth modal close
    const authModalClose = Utils.getElementById('auth-modal-close');
    if (authModalClose) {
      authModalClose.addEventListener('click', () => {
        this.hideAuthModal();
      });
    }

    // Login form
    const loginForm = Utils.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
    }

    // Register form
    const registerForm = Utils.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => this.handleRegisterSubmit(e));
    }

    // Auth switch link
    const authSwitchLink = Utils.getElementById('auth-switch-link');
    if (authSwitchLink) {
      authSwitchLink.addEventListener('click', (e) => {
        e.preventDefault();
        const currentMode = Utils.getElementById('login-form')?.classList.contains('hidden') ? 'register' : 'login';
        this.switchAuthMode(currentMode === 'login' ? 'register' : 'login');
      });
    }

    // Modal backdrop click
    const authModal = Utils.getElementById('auth-modal');
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
          this.hideAuthModal();
        }
      });
    }
  }

  /**
   * Show user menu
   */
  showUserMenu() {
    // Create user menu if it doesn't exist
    let userMenu = Utils.getElementById('user-menu');
    if (!userMenu) {
      userMenu = this.createUserMenu();
    }
    
    userMenu.classList.toggle('active');
  }

  /**
   * Create user menu
   * @returns {Element} User menu element
   */
  createUserMenu() {
    const userMenu = document.createElement('div');
    userMenu.id = 'user-menu';
    userMenu.className = 'user-menu';
    
    userMenu.innerHTML = `
      <div class="user-menu-content">
        <div class="user-menu-header">
          <div class="user-avatar">
            <i class="fas fa-user-circle"></i>
          </div>
          <div class="user-info">
            <div class="user-name">${this.currentUser.first_name || this.currentUser.username}</div>
            <div class="user-email">${this.currentUser.email}</div>
          </div>
        </div>
        <div class="user-menu-items">
          <a href="#" class="user-menu-item" data-action="profile">
            <i class="fas fa-user"></i> Profile
          </a>
          <a href="#" class="user-menu-item" data-action="orders">
            <i class="fas fa-shopping-bag"></i> My Orders
          </a>
          <a href="#" class="user-menu-item" data-action="favorites">
            <i class="fas fa-heart"></i> Favorites
          </a>
          <a href="#" class="user-menu-item" data-action="logout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </a>
        </div>
      </div>
    `;

    // Add event listeners
    userMenu.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action) {
        e.preventDefault();
        this.handleUserMenuAction(action);
        userMenu.classList.remove('active');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target) && !Utils.getElementById('auth-toggle').contains(e.target)) {
        userMenu.classList.remove('active');
      }
    });

    document.body.appendChild(userMenu);
    return userMenu;
  }

  /**
   * Handle user menu actions
   * @param {string} action - Action to handle
   */
  handleUserMenuAction(action) {
    switch (action) {
      case 'profile':
        // Show profile modal or navigate to profile page
        console.log('Show profile');
        break;
      case 'orders':
        // Show orders or navigate to orders page
        console.log('Show orders');
        break;
      case 'favorites':
        // Show favorites
        console.log('Show favorites');
        break;
      case 'logout':
        this.logout();
        break;
    }
  }
}

// Create global auth manager instance
const Auth = new AuthManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Auth = Auth;
}

