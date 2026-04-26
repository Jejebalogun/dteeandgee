// D'Tee & Gee Kitchen - Main Application

/**
 * Main Application Class
 */
class DTeeGeeApp {
  constructor() {
    this.isInitialized = false;
    this.currentTheme = 'light';
    this.products = [];
    this.categories = [];
    this.featuredProducts = [];
    this.currentFilters = {};
    this.searchQuery = '';
    
    // Initialize app when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  /**
   * Initialize application
   */
  async init() {
    if (this.isInitialized) return;
    
    try {
      // Show loading screen
      this.showLoadingScreen();
      
      // Initialize core modules
      await this.initializeModules();
      
      // Load initial data
      await this.loadInitialData();
      
      // Initialize UI components
      this.initializeUI();
      
      // Initialize event listeners
      this.initializeEventListeners();
      
      // Initialize animations
      this.initializeAnimations();
      
      // Initialize theme
      this.initializeTheme();
      
      // Hide loading screen
      this.hideLoadingScreen();
      
      this.isInitialized = true;
      console.log('D\'Tee & Gee Kitchen app initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Failed to load application. Please refresh the page.');
    }
  }

  /**
   * Initialize core modules
   */
  async initializeModules() {
    // Initialize authentication
    if (window.Auth) {
      Auth.initEventListeners();
    }
    
    // Initialize cart
    if (window.Cart) {
      await Cart.init();
    }
  }

  /**
   * Load initial data
   */
  async loadInitialData() {
    try {
      // Load categories
      const categoriesResponse = await CachedAPI.getCategories();
      this.categories = categoriesResponse.categories || [];
      
      // Load featured products
      const featuredResponse = await CachedAPI.getFeaturedProducts(8);
      this.featuredProducts = featuredResponse.products || [];
      
      // Load all products
      const productsResponse = await CachedAPI.getProducts();
      this.products = productsResponse.products || [];
      
      // Render initial content
      this.renderCategories();
      this.renderFeaturedProducts();
      this.renderProducts();
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }

  /**
   * Initialize UI components
   */
  initializeUI() {
    // Initialize navigation
    this.initializeNavigation();
    
    // Initialize search
    this.initializeSearch();
    
    // Initialize modals
    this.initializeModals();
    
    // Initialize forms
    this.initializeForms();
    
    // Initialize scroll effects
    this.initializeScrollEffects();
  }

  /**
   * Initialize navigation
   */
  initializeNavigation() {
    const navbar = Utils.getElementById('navbar');
    if (!navbar) return;

    // Handle scroll effects
    let lastScrollY = window.scrollY;
    
    const handleScroll = Utils.throttle(() => {
      const currentScrollY = window.scrollY;
      
      // Add scrolled class for styling
      if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      // Hide/show navbar on scroll
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    }, 100);

    window.addEventListener('scroll', handleScroll);

    // Handle mobile menu
    const navToggle = Utils.getElementById('nav-toggle');
    const mobileMenu = Utils.getElementById('mobile-menu');
    const mobileMenuOverlay = Utils.getElementById('mobile-menu-overlay');

    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        mobileMenuOverlay?.classList.toggle('show');
        navToggle.classList.toggle('active');
      });

      // Close mobile menu when clicking overlay
      mobileMenuOverlay?.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenuOverlay.classList.remove('show');
        navToggle.classList.remove('active');
      });
    }

    // Handle navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            Utils.scrollToElement(target, 80);
          }
        }
      });
    });
  }

  /**
   * Initialize search functionality
   */
  initializeSearch() {
    const searchToggle = Utils.getElementById('search-toggle');
    const searchBar = Utils.getElementById('search-bar');
    const searchInput = Utils.getElementById('search-input');
    const searchBtn = Utils.getElementById('search-btn');

    if (searchToggle && searchBar) {
      searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
          searchInput?.focus();
        }
      });
    }

    if (searchInput) {
      // Handle search input
      const handleSearch = Utils.debounce(async (query) => {
        if (query.length >= 2) {
          await this.performSearch(query);
        } else if (query.length === 0) {
          this.clearSearch();
        }
      }, 300);

      searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value.trim());
      });

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.performSearch(searchInput.value.trim());
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const query = searchInput?.value.trim();
        if (query) {
          this.performSearch(query);
        }
      });
    }
  }

  /**
   * Perform search
   * @param {string} query - Search query
   */
  async performSearch(query) {
    try {
      this.searchQuery = query;
      const response = await API.searchProducts(query, this.currentFilters);
      this.products = response.products || [];
      this.renderProducts();
      
      // Update URL
      Utils.url.setParam('search', query);
      
      // Show search results message
      this.showSearchResults(query, this.products.length);
    } catch (error) {
      console.error('Search failed:', error);
      this.showToast('Search failed. Please try again.', 'error');
    }
  }

  /**
   * Clear search
   */
  clearSearch() {
    this.searchQuery = '';
    this.loadInitialData();
    Utils.url.removeParam('search');
    this.hideSearchResults();
  }

  /**
   * Show search results message
   * @param {string} query - Search query
   * @param {number} count - Results count
   */
  showSearchResults(query, count) {
    const searchResults = Utils.getElementById('search-results');
    if (searchResults) {
      searchResults.innerHTML = `
        <div class="search-results-info">
          <h3>Search Results for "${query}"</h3>
          <p>Found ${count} product${count !== 1 ? 's' : ''}</p>
          <button class="btn btn-outline" onclick="app.clearSearch()">Clear Search</button>
        </div>
      `;
      searchResults.style.display = 'block';
    }
  }

  /**
   * Hide search results message
   */
  hideSearchResults() {
    const searchResults = Utils.getElementById('search-results');
    if (searchResults) {
      searchResults.style.display = 'none';
    }
  }

  /**
   * Initialize modals
   */
  initializeModals() {
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
      }
    });

    // Close modals with escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          activeModal.classList.remove('active');
        }
      }
    });
  }

  /**
   * Initialize forms
   */
  initializeForms() {
    // Contact form
    const contactForm = Utils.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
    }

    // Newsletter form
    const newsletterForm = Utils.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => this.handleNewsletterForm(e));
    }
  }

  /**
   * Handle contact form submission
   * @param {Event} event - Form submit event
   */
  async handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    try {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      await API.sendContactForm(contactData);
      
      this.showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
      form.reset();
    } catch (error) {
      this.showToast(error.message || 'Failed to send message', 'error');
    } finally {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  }

  /**
   * Handle newsletter form submission
   * @param {Event} event - Form submit event
   */
  async handleNewsletterForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');

    if (!Utils.isValidEmail(email)) {
      this.showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;

      await API.subscribeNewsletter(email);
      
      this.showToast('Successfully subscribed to our newsletter!', 'success');
      form.reset();
    } catch (error) {
      this.showToast(error.message || 'Failed to subscribe', 'error');
    } finally {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Subscribe';
      submitBtn.disabled = false;
    }
  }

  /**
   * Initialize scroll effects
   */
  initializeScrollEffects() {
    // Scroll progress indicator
    const scrollProgress = Utils.getElementById('scroll-progress');
    if (scrollProgress) {
      const updateScrollProgress = Utils.throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = `${scrollPercent}%`;
      }, 10);

      window.addEventListener('scroll', updateScrollProgress);
    }

    // Back to top button
    const backToTopBtn = Utils.getElementById('back-to-top');
    if (backToTopBtn) {
      const toggleBackToTop = Utils.throttle(() => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      }, 100);

      window.addEventListener('scroll', toggleBackToTop);
      
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Animate elements on scroll
    this.initializeScrollAnimations();
  }

  /**
   * Initialize scroll animations
   */
  initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Theme toggle
    const themeToggle = Utils.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Product filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => this.handleFilterClick(btn));
    });

    // Add to cart buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-cart-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.add-to-cart-btn');
        const productId = btn.dataset.productId;
        const quantity = parseInt(btn.dataset.quantity) || 1;
        
        if (productId) {
          this.addToCart(productId, quantity);
        }
      }
    });

    // Product quick view
    document.addEventListener('click', (e) => {
      if (e.target.closest('.quick-view-btn')) {
        e.preventDefault();
        const btn = e.target.closest('.quick-view-btn');
        const productId = btn.dataset.productId;
        
        if (productId) {
          this.showProductQuickView(productId);
        }
      }
    });
  }

  /**
   * Handle filter button click
   * @param {Element} button - Filter button
   */
  async handleFilterClick(button) {
    const category = button.dataset.category;
    
    // Update active filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Apply filter
    if (category === 'all') {
      this.currentFilters = {};
    } else {
      this.currentFilters = { category: category };
    }
    
    // Load filtered products
    try {
      const response = await API.getProducts(this.currentFilters);
      this.products = response.products || [];
      this.renderProducts();
    } catch (error) {
      console.error('Failed to filter products:', error);
      this.showToast('Failed to filter products', 'error');
    }
  }

  /**
   * Add product to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity
   */
  async addToCart(productId, quantity = 1) {
    // Find product data
    const product = this.products.find(p => p.id == productId) || 
                   this.featuredProducts.find(p => p.id == productId);
    
    if (!product) {
      this.showToast('Product not found', 'error');
      return;
    }

    // Add to cart
    const result = await Cart.addToCart(productId, quantity, product);
    
    if (result.success) {
      // Update button state temporarily
      const buttons = document.querySelectorAll(`[data-product-id="${productId}"]`);
      buttons.forEach(btn => {
        if (btn.classList.contains('add-to-cart-btn')) {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Added!';
          btn.disabled = true;
          
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }, 2000);
        }
      });
    }
  }

  /**
   * Show product quick view
   * @param {number} productId - Product ID
   */
  async showProductQuickView(productId) {
    try {
      const product = await API.getProduct(productId);
      
      // Create and show quick view modal
      this.createQuickViewModal(product);
    } catch (error) {
      console.error('Failed to load product:', error);
      this.showToast('Failed to load product details', 'error');
    }
  }

  /**
   * Create quick view modal
   * @param {Object} product - Product data
   */
  createQuickViewModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal quick-view-modal active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>${product.name}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="quick-view-content">
            <div class="quick-view-image">
              <img src="${product.image_url || '/images/placeholder.jpg'}" alt="${product.name}">
            </div>
            <div class="quick-view-details">
              <div class="product-price">${Utils.formatCurrency(product.price)}</div>
              <div class="product-description">${product.description}</div>
              <div class="product-actions">
                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                  <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    document.body.appendChild(modal);
  }

  /**
   * Render categories
   */
  renderCategories() {
    const categoriesContainer = Utils.getElementById('categories-grid');
    if (!categoriesContainer || !this.categories.length) return;

    categoriesContainer.innerHTML = this.categories.map(category => `
      <div class="category-card animate-on-scroll" data-category="${category.name}">
        <img src="${category.image_url || '/images/placeholder.jpg'}" 
             alt="${category.name}" 
             class="category-image">
        <div class="category-content">
          <h3 class="category-name">${category.name}</h3>
          <p class="category-description">${category.description || ''}</p>
        </div>
      </div>
    `).join('');

    // Add click handlers
    categoriesContainer.addEventListener('click', (e) => {
      const categoryCard = e.target.closest('.category-card');
      if (categoryCard) {
        const categoryName = categoryCard.dataset.category;
        this.filterByCategory(categoryName);
      }
    });
  }

  /**
   * Filter products by category
   * @param {string} categoryName - Category name
   */
  async filterByCategory(categoryName) {
    // Update filter buttons
    const filterBtn = document.querySelector(`[data-category="${categoryName}"]`);
    if (filterBtn) {
      this.handleFilterClick(filterBtn);
    } else {
      // If no filter button exists, apply filter directly
      this.currentFilters = { category: categoryName };
      try {
        const response = await API.getProducts(this.currentFilters);
        this.products = response.products || [];
        this.renderProducts();
      } catch (error) {
        console.error('Failed to filter products:', error);
      }
    }

    // Scroll to products section
    const productsSection = Utils.getElementById('menu');
    if (productsSection) {
      Utils.scrollToElement(productsSection, 80);
    }
  }

  /**
   * Render featured products
   */
  renderFeaturedProducts() {
    const featuredContainer = Utils.getElementById('featured-products');
    if (!featuredContainer || !this.featuredProducts.length) return;

    featuredContainer.innerHTML = this.featuredProducts.map(product => `
      <div class="product-card animate-on-scroll" data-product-id="${product.id}">
        <img src="${product.image_url || '/images/placeholder.jpg'}" 
             alt="${product.name}" 
             class="product-image">
        <div class="product-content">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">${Utils.formatCurrency(product.price)}</div>
          <div class="product-actions">
            <button class="btn btn-outline quick-view-btn" data-product-id="${product.id}">
              <i class="fas fa-eye"></i> Quick View
            </button>
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Render products
   */
  renderProducts() {
    const productsContainer = Utils.getElementById('products-grid');
    if (!productsContainer) return;

    if (!this.products.length) {
      productsContainer.innerHTML = `
        <div class="no-products">
          <i class="fas fa-search"></i>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      `;
      return;
    }

    productsContainer.innerHTML = this.products.map(product => `
      <div class="product-card animate-on-scroll" data-product-id="${product.id}">
        ${product.featured ? '<div class="product-badge">Featured</div>' : ''}
        <img src="${product.image_url || '/images/placeholder.jpg'}" 
             alt="${product.name}" 
             class="product-image">
        <div class="product-content">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">${Utils.formatCurrency(product.price)}</div>
          <div class="product-actions">
            <button class="btn btn-outline quick-view-btn" data-product-id="${product.id}">
              <i class="fas fa-eye"></i> Quick View
            </button>
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Re-initialize scroll animations for new elements
    this.initializeScrollAnimations();
  }

  /**
   * Initialize theme system
   */
  initializeTheme() {
    // Load saved theme
    const savedTheme = Utils.storage.get('theme', 'light');
    this.setTheme(savedTheme);
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Set theme
   * @param {string} theme - Theme name
   */
  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    Utils.storage.set('theme', theme);

    // Update theme toggle icon
    const themeToggle = Utils.getElementById('theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
      }
    }
  }

  /**
   * Initialize animations
   */
  initializeAnimations() {
    // Add stagger animation to grids
    const grids = document.querySelectorAll('.categories-grid, .products-grid');
    grids.forEach(grid => {
      grid.classList.add('stagger-animation');
    });
  }

  /**
   * Show loading screen
   */
  showLoadingScreen() {
    const loadingScreen = Utils.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }
  }

  /**
   * Hide loading screen
   */
  hideLoadingScreen() {
    const loadingScreen = Utils.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 500);
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    this.showToast(message, 'error');
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
}

// Initialize app
const app = new DTeeGeeApp();

// Export for global access
if (typeof window !== 'undefined') {
  window.DTeeGeeApp = app;
}

