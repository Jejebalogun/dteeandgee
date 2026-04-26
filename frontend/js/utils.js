// D'Tee & Gee Kitchen - Utility Functions

/**
 * Utility functions for common operations
 */
const Utils = {
  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @param {boolean} immediate - Execute immediately
   * @returns {Function} Debounced function
   */
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  /**
   * Throttle function to limit function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Format currency value
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount, currency = 'NGN') {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  },

  /**
   * Format date
   * @param {Date|string} date - Date to format
   * @param {Object} options - Formatting options
   * @returns {string} Formatted date string
   */
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const formatOptions = { ...defaultOptions, ...options };
    return new Intl.DateTimeFormat('en-US', formatOptions).format(new Date(date));
  },

  /**
   * Format relative time
   * @param {Date|string} date - Date to format
   * @returns {string} Relative time string
   */
  formatRelativeTime(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return this.formatDate(date);
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Sanitize HTML string
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  sanitizeHtml(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  },

  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean} Is valid phone
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },

  /**
   * Get element by ID with error handling
   * @param {string} id - Element ID
   * @returns {Element|null} Element or null
   */
  getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID '${id}' not found`);
    }
    return element;
  },

  /**
   * Get elements by class name
   * @param {string} className - Class name
   * @returns {NodeList} Elements
   */
  getElementsByClass(className) {
    return document.querySelectorAll(`.${className}`);
  },

  /**
   * Add event listener with error handling
   * @param {Element} element - Element to add listener to
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  addEventListener(element, event, handler, options = {}) {
    if (!element) {
      console.warn('Cannot add event listener to null element');
      return;
    }
    element.addEventListener(event, handler, options);
  },

  /**
   * Remove event listener
   * @param {Element} element - Element to remove listener from
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  removeEventListener(element, event, handler) {
    if (!element) return;
    element.removeEventListener(event, handler);
  },

  /**
   * Show element with animation
   * @param {Element} element - Element to show
   * @param {string} animation - Animation class
   */
  showElement(element, animation = 'fadeInUp') {
    if (!element) return;
    element.classList.remove('hidden');
    element.classList.add('animate-on-scroll', animation);
    setTimeout(() => element.classList.add('animate'), 10);
  },

  /**
   * Hide element with animation
   * @param {Element} element - Element to hide
   * @param {string} animation - Animation class
   */
  hideElement(element, animation = 'fadeOut') {
    if (!element) return;
    element.classList.add(animation);
    setTimeout(() => {
      element.classList.add('hidden');
      element.classList.remove(animation);
    }, 300);
  },

  /**
   * Toggle element visibility
   * @param {Element} element - Element to toggle
   */
  toggleElement(element) {
    if (!element) return;
    if (element.classList.contains('hidden')) {
      this.showElement(element);
    } else {
      this.hideElement(element);
    }
  },

  /**
   * Scroll to element smoothly
   * @param {Element|string} target - Element or selector
   * @param {number} offset - Offset from top
   */
  scrollToElement(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  },

  /**
   * Get scroll position
   * @returns {Object} Scroll position {x, y}
   */
  getScrollPosition() {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  },

  /**
   * Check if element is in viewport
   * @param {Element} element - Element to check
   * @param {number} threshold - Threshold percentage (0-1)
   * @returns {boolean} Is in viewport
   */
  isInViewport(element, threshold = 0.1) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    return vertInView && horInView;
  },

  /**
   * Get device type
   * @returns {string} Device type (mobile, tablet, desktop)
   */
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  },

  /**
   * Check if device supports touch
   * @returns {boolean} Supports touch
   */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  /**
   * Get browser information
   * @returns {Object} Browser info
   */
  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Opera')) browser = 'Opera';
    
    return {
      name: browser,
      userAgent: ua,
      isMobile: /Mobi|Android/i.test(ua)
    };
  },

  /**
   * Local storage helper
   */
  storage: {
    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },

    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
      }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    },

    /**
     * Clear all localStorage
     */
    clear() {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  },

  /**
   * Session storage helper
   */
  sessionStorage: {
    /**
     * Set item in sessionStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set(key, value) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }
    },

    /**
     * Get item from sessionStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
      try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return defaultValue;
      }
    },

    /**
     * Remove item from sessionStorage
     * @param {string} key - Storage key
     */
    remove(key) {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from sessionStorage:', error);
      }
    },

    /**
     * Clear all sessionStorage
     */
    clear() {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Error clearing sessionStorage:', error);
      }
    }
  },

  /**
   * Cookie helper
   */
  cookies: {
    /**
     * Set cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Expiration in days
     */
    set(name, value, days = 7) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    /**
     * Get cookie
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null
     */
    get(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },

    /**
     * Delete cookie
     * @param {string} name - Cookie name
     */
    delete(name) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  },

  /**
   * URL helper
   */
  url: {
    /**
     * Get URL parameters
     * @returns {Object} URL parameters
     */
    getParams() {
      const params = {};
      const urlParams = new URLSearchParams(window.location.search);
      for (const [key, value] of urlParams) {
        params[key] = value;
      }
      return params;
    },

    /**
     * Get specific URL parameter
     * @param {string} name - Parameter name
     * @returns {string|null} Parameter value or null
     */
    getParam(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    },

    /**
     * Set URL parameter
     * @param {string} name - Parameter name
     * @param {string} value - Parameter value
     */
    setParam(name, value) {
      const url = new URL(window.location);
      url.searchParams.set(name, value);
      window.history.pushState({}, '', url);
    },

    /**
     * Remove URL parameter
     * @param {string} name - Parameter name
     */
    removeParam(name) {
      const url = new URL(window.location);
      url.searchParams.delete(name);
      window.history.pushState({}, '', url);
    }
  },

  /**
   * Image helper
   */
  image: {
    /**
     * Preload image
     * @param {string} src - Image source
     * @returns {Promise} Promise that resolves when image loads
     */
    preload(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    },

    /**
     * Get image dimensions
     * @param {string} src - Image source
     * @returns {Promise} Promise that resolves with dimensions
     */
    getDimensions(src) {
      return this.preload(src).then(img => ({
        width: img.naturalWidth,
        height: img.naturalHeight
      }));
    }
  },

  /**
   * Performance helper
   */
  performance: {
    /**
     * Measure function execution time
     * @param {Function} func - Function to measure
     * @param {string} label - Label for measurement
     * @returns {*} Function result
     */
    measure(func, label = 'Function') {
      const start = performance.now();
      const result = func();
      const end = performance.now();
      console.log(`${label} took ${end - start} milliseconds`);
      return result;
    },

    /**
     * Get page load time
     * @returns {number} Load time in milliseconds
     */
    getLoadTime() {
      const navigation = performance.getEntriesByType('navigation')[0];
      return navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}

