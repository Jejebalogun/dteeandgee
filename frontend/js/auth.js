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
      // Check if user is authenticated - use window.API explicitly
      if (!window.API || typeof window.API.checkAuth !== 'function') {
        console.log('API not ready for auth check');
        return;
      }
      const authData = await window.API.checkAuth();
      if (authData.authenticated) {
        this.setUser(authData.user);
      }
    } catch (error) {
      console.log('User not authenticated');
      this.clearUser();
    }

    // Check for password reset token in URL
    this.checkForResetToken();
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
      
      const response = await window.API.register(userData);
      
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

      const response = await window.API.login(usernameOrEmail, password);

      if (response.user) {
        this.setUser(response.user);
        this.showToast(`Welcome back, ${response.user.first_name || response.user.username}!`, 'success');
        this.notifyAuthChange('login', response.user);

        // Check for pending redirect (e.g., to admin dashboard)
        const pendingRedirect = sessionStorage.getItem('auth_redirect');
        if (pendingRedirect) {
          sessionStorage.removeItem('auth_redirect');
          if (pendingRedirect === 'admin' && response.user.is_admin) {
            setTimeout(() => {
              window.location.href = '/admin.html';
            }, 500);
          }
        }

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
      await window.API.logout();
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
      const response = await window.API.updateProfile(profileData);
      
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

    // Initialize user dropdown listeners
    this.initUserDropdownListeners();
  }

  /**
   * Show user dropdown menu
   */
  showUserMenu() {
    const userDropdown = Utils.getElementById('user-dropdown');
    if (userDropdown) {
      userDropdown.classList.toggle('active');
      this.updateDropdownUserInfo();
    }
  }

  /**
   * Hide user dropdown menu
   */
  hideUserMenu() {
    const userDropdown = Utils.getElementById('user-dropdown');
    if (userDropdown) {
      userDropdown.classList.remove('active');
    }
  }

  /**
   * Update user info in dropdown
   */
  updateDropdownUserInfo() {
    if (!this.currentUser) return;

    const userName = Utils.getElementById('dropdown-user-name');
    const userEmail = Utils.getElementById('dropdown-user-email');
    const userAvatar = Utils.getElementById('user-avatar');
    const adminDashboardBtn = Utils.getElementById('admin-dashboard-btn');

    if (userName) {
      userName.textContent = this.currentUser.first_name
        ? `${this.currentUser.first_name} ${this.currentUser.last_name || ''}`.trim()
        : this.currentUser.username;
    }
    if (userEmail) {
      userEmail.textContent = this.currentUser.email;
    }
    if (userAvatar) {
      const initials = this.currentUser.first_name
        ? this.currentUser.first_name.charAt(0).toUpperCase()
        : this.currentUser.username.charAt(0).toUpperCase();
      userAvatar.textContent = initials;
    }
    // Show admin dashboard link only for admin users
    if (adminDashboardBtn) {
      adminDashboardBtn.style.display = this.currentUser.is_admin ? 'flex' : 'none';
    }
  }

  /**
   * Initialize user dropdown event listeners
   */
  initUserDropdownListeners() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const userMenuContainer = Utils.getElementById('user-menu-container');
      if (userMenuContainer && !userMenuContainer.contains(e.target)) {
        this.hideUserMenu();
      }
    });

    // My Orders button
    const myOrdersBtn = Utils.getElementById('my-orders-btn');
    if (myOrdersBtn) {
      myOrdersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideUserMenu();
        if (window.app) {
          window.app.showOrdersModal();
        }
      });
    }

    // My Wishlist button
    const myWishlistBtn = Utils.getElementById('my-wishlist-btn');
    if (myWishlistBtn) {
      myWishlistBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideUserMenu();
        if (window.Wishlist) {
          window.Wishlist.showWishlistModal();
        }
      });
    }

    // My Profile button
    const myProfileBtn = Utils.getElementById('my-profile-btn');
    if (myProfileBtn) {
      myProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideUserMenu();
        this.showProfileModal();
      });
    }

    // Logout button
    const logoutBtn = Utils.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hideUserMenu();
        this.logout();
      });
    }
  }

  /**
   * Show profile modal
   */
  showProfileModal() {
    if (!this.isAuthenticated) {
      this.showToast('Please sign in to view your profile', 'info');
      this.showAuthModal();
      return;
    }

    const profileModal = Utils.getElementById('profile-modal');
    if (profileModal) {
      this.populateProfileForm();
      profileModal.classList.add('active');
      this.initProfileEventListeners();
    }
  }

  /**
   * Hide profile modal
   */
  hideProfileModal() {
    const profileModal = Utils.getElementById('profile-modal');
    if (profileModal) {
      profileModal.classList.remove('active');
    }
  }

  /**
   * Populate profile form with current user data
   */
  populateProfileForm() {
    if (!this.currentUser) return;

    // Profile header
    const profileAvatar = Utils.getElementById('profile-avatar');
    const displayName = Utils.getElementById('profile-display-name');
    const memberSince = Utils.getElementById('profile-member-since');

    if (profileAvatar) {
      const initials = this.currentUser.first_name
        ? this.currentUser.first_name.charAt(0).toUpperCase()
        : this.currentUser.username.charAt(0).toUpperCase();
      profileAvatar.textContent = initials;
    }

    if (displayName) {
      displayName.textContent = this.currentUser.first_name
        ? `${this.currentUser.first_name} ${this.currentUser.last_name || ''}`.trim()
        : this.currentUser.username;
    }

    if (memberSince) {
      const joinDate = this.currentUser.created_at
        ? new Date(this.currentUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : 'Recently';
      memberSince.textContent = `Member since ${joinDate}`;
    }

    // Form fields
    const firstNameInput = Utils.getElementById('profile-firstname');
    const lastNameInput = Utils.getElementById('profile-lastname');
    const usernameInput = Utils.getElementById('profile-username');
    const emailInput = Utils.getElementById('profile-email');
    const phoneInput = Utils.getElementById('profile-phone');

    if (firstNameInput) firstNameInput.value = this.currentUser.first_name || '';
    if (lastNameInput) lastNameInput.value = this.currentUser.last_name || '';
    if (usernameInput) usernameInput.value = this.currentUser.username || '';
    if (emailInput) emailInput.value = this.currentUser.email || '';
    if (phoneInput) phoneInput.value = this.currentUser.phone || '';
  }

  /**
   * Initialize profile event listeners
   */
  initProfileEventListeners() {
    // Close button
    const closeBtn = Utils.getElementById('profile-modal-close');
    if (closeBtn && !closeBtn.hasAttribute('data-listener-added')) {
      closeBtn.addEventListener('click', () => this.hideProfileModal());
      closeBtn.setAttribute('data-listener-added', 'true');
    }

    // Modal backdrop click
    const profileModal = Utils.getElementById('profile-modal');
    if (profileModal && !profileModal.hasAttribute('data-listener-added')) {
      profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) {
          this.hideProfileModal();
        }
      });
      profileModal.setAttribute('data-listener-added', 'true');
    }

    // Tab switching
    const tabs = document.querySelectorAll('.profile-tab');
    tabs.forEach(tab => {
      if (!tab.hasAttribute('data-listener-added')) {
        tab.addEventListener('click', () => this.switchProfileTab(tab.dataset.tab));
        tab.setAttribute('data-listener-added', 'true');
      }
    });

    // Info form submission
    const infoForm = Utils.getElementById('profile-info-form');
    if (infoForm && !infoForm.hasAttribute('data-listener-added')) {
      infoForm.addEventListener('submit', (e) => this.handleProfileInfoSubmit(e));
      infoForm.setAttribute('data-listener-added', 'true');
    }

    // Password form submission
    const passwordForm = Utils.getElementById('profile-password-form');
    if (passwordForm && !passwordForm.hasAttribute('data-listener-added')) {
      passwordForm.addEventListener('submit', (e) => this.handlePasswordSubmit(e));
      passwordForm.setAttribute('data-listener-added', 'true');
    }

    // Password visibility toggles
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
      if (!toggle.hasAttribute('data-listener-added')) {
        toggle.addEventListener('click', (e) => {
          const wrapper = e.target.closest('.password-input-wrapper');
          const input = wrapper.querySelector('input');
          const icon = wrapper.querySelector('.password-toggle i');

          if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
          } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
          }
        });
        toggle.setAttribute('data-listener-added', 'true');
      }
    });
  }

  /**
   * Switch between profile tabs
   * @param {string} tabId - Tab ID to switch to
   */
  switchProfileTab(tabId) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.profile-tab');
    tabs.forEach(tab => {
      if (tab.dataset.tab === tabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update tab content
    const contents = document.querySelectorAll('.profile-tab-content');
    contents.forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }

  /**
   * Handle profile info form submission
   * @param {Event} event - Form submit event
   */
  async handleProfileInfoSubmit(event) {
    event.preventDefault();

    const firstName = Utils.getElementById('profile-firstname')?.value.trim();
    const lastName = Utils.getElementById('profile-lastname')?.value.trim();
    const username = Utils.getElementById('profile-username')?.value.trim();
    const email = Utils.getElementById('profile-email')?.value.trim();
    const phone = Utils.getElementById('profile-phone')?.value.trim();

    // Validate username
    if (username && username.length < 3) {
      this.showToast('Username must be at least 3 characters', 'error');
      return;
    }

    // Validate email
    if (email && !Utils.isValidEmail(email)) {
      this.showToast('Please enter a valid email address', 'error');
      return;
    }

    // Validate phone (if provided)
    if (phone && !Utils.isValidPhone(phone)) {
      this.showToast('Please enter a valid phone number', 'error');
      return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    try {
      const result = await this.updateProfile({
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        phone: phone
      });

      if (result.success) {
        this.populateProfileForm(); // Refresh form with updated data
      }
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }

  /**
   * Handle password form submission
   * @param {Event} event - Form submit event
   */
  async handlePasswordSubmit(event) {
    event.preventDefault();

    const newPassword = Utils.getElementById('profile-new-password')?.value;
    const confirmPassword = Utils.getElementById('profile-confirm-password')?.value;

    // Validate passwords
    if (!newPassword || newPassword.length < 6) {
      this.showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showToast('Passwords do not match', 'error');
      return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
    submitBtn.disabled = true;

    try {
      const result = await this.updateProfile({ password: newPassword });

      if (result.success) {
        this.showToast('Password updated successfully', 'success');
        // Clear password fields
        Utils.getElementById('profile-new-password').value = '';
        Utils.getElementById('profile-confirm-password').value = '';
      }
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  }
}

// Create global auth manager instance
const Auth = new AuthManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Auth = Auth;
}

// ============================================
// Password Reset & Forgot Password Extensions
// ============================================
(function() {
  // Check for reset token in URL on page load
  AuthManager.prototype.checkForResetToken = function() {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('reset_token');
    if (resetToken) {
      this.resetToken = resetToken;
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Show reset password modal
      setTimeout(() => this.showResetPasswordModal(), 500);
    }
  };

  // Show reset password modal
  AuthManager.prototype.showResetPasswordModal = function() {
    const modal = Utils.getElementById('reset-password-modal');
    if (modal) {
      modal.classList.add('active');
      this.initResetPasswordListeners();
    }
  };

  // Initialize reset password listeners
  AuthManager.prototype.initResetPasswordListeners = function() {
    const closeBtn = Utils.getElementById('reset-password-modal-close');
    if (closeBtn && !closeBtn.hasAttribute('data-listener-added')) {
      closeBtn.addEventListener('click', () => {
        Utils.getElementById('reset-password-modal')?.classList.remove('active');
      });
      closeBtn.setAttribute('data-listener-added', 'true');
    }

    const modal = Utils.getElementById('reset-password-modal');
    if (modal && !modal.hasAttribute('data-listener-added')) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
      modal.setAttribute('data-listener-added', 'true');
    }

    const form = Utils.getElementById('reset-password-form');
    if (form && !form.hasAttribute('data-listener-added')) {
      form.addEventListener('submit', (e) => this.handleResetPasswordSubmit(e));
      form.setAttribute('data-listener-added', 'true');
    }
  };

  // Handle reset password form submission
  AuthManager.prototype.handleResetPasswordSubmit = async function(event) {
    event.preventDefault();

    const newPassword = Utils.getElementById('reset-new-password')?.value;
    const confirmPassword = Utils.getElementById('reset-confirm-password')?.value;

    if (!newPassword || newPassword.length < 6) {
      this.showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      this.showToast('Passwords do not match', 'error');
      return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
    submitBtn.disabled = true;

    try {
      const response = await window.API.resetPassword(this.resetToken, newPassword);
      this.showToast(response.message || 'Password reset successfully!', 'success');
      Utils.getElementById('reset-password-modal')?.classList.remove('active');
      this.resetToken = null;
      // Show login form
      setTimeout(() => this.showAuthModal(), 500);
    } catch (error) {
      this.showToast(error.message || 'Failed to reset password', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  };

  // Forgot password form switching & submission
  AuthManager.prototype.switchToForgotPassword = function() {
    Utils.getElementById('login-form')?.classList.add('hidden');
    Utils.getElementById('register-form')?.classList.add('hidden');
    Utils.getElementById('forgot-password-form')?.classList.remove('hidden');
    Utils.getElementById('auth-modal-title').textContent = 'Forgot Password';
    Utils.getElementById('auth-switch-text')?.classList.add('hidden');
  };

  AuthManager.prototype.switchToLogin = function() {
    Utils.getElementById('forgot-password-form')?.classList.add('hidden');
    Utils.getElementById('register-form')?.classList.add('hidden');
    Utils.getElementById('login-form')?.classList.remove('hidden');
    Utils.getElementById('auth-modal-title').textContent = 'Sign In';
    Utils.getElementById('auth-switch-text')?.classList.remove('hidden');
  };

  AuthManager.prototype.handleForgotPasswordSubmit = async function(event) {
    event.preventDefault();

    const email = Utils.getElementById('forgot-email')?.value.trim();
    if (!email) {
      this.showToast('Please enter your email address', 'error');
      return;
    }

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const response = await window.API.forgotPassword(email);
      this.showToast(response.message || 'If an account exists, a reset link has been sent.', 'success');
      // Switch back to login
      this.switchToLogin();
      event.target.reset();
    } catch (error) {
      this.showToast(error.message || 'Failed to send reset link', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  };

  // Initialize forgot password listeners (called after DOM ready)
  const origInitListeners = AuthManager.prototype.initEventListeners;
  AuthManager.prototype.initEventListeners = function() {
    origInitListeners.call(this);

    // Forgot password link
    const forgotLink = Utils.getElementById('forgot-password-link');
    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToForgotPassword();
      });
    }

    // Back to login link
    const backToLoginLink = Utils.getElementById('back-to-login-link');
    if (backToLoginLink) {
      backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToLogin();
      });
    }

    // Forgot password form
    const forgotForm = Utils.getElementById('forgot-password-form');
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => this.handleForgotPasswordSubmit(e));
    }
  };
})();
