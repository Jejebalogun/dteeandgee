// D'Tee & Gee Kitchen - Toast Notification System

/**
 * Toast Notification Manager
 */
class ToastManager {
  constructor() {
    this.toasts = [];
    this.container = null;
    this.defaultDuration = 5000;
    this.maxToasts = 5;
    
    this.init();
  }

  /**
   * Initialize toast manager
   */
  init() {
    this.createContainer();
  }

  /**
   * Create toast container
   */
  createContainer() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.className = 'toast-container';
    
    // Add styles if not already present
    if (!document.getElementById('toast-styles')) {
      this.addStyles();
    }
    
    document.body.appendChild(this.container);
  }

  /**
   * Add toast styles
   */
  addStyles() {
    const styles = document.createElement('style');
    styles.id = 'toast-styles';
    styles.textContent = `
      .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }

      .toast {
        background: var(--white, #ffffff);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 16px;
        min-width: 300px;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease-out;
        pointer-events: auto;
        border-left: 4px solid var(--primary-gold, #D4AF37);
      }

      .toast.show {
        transform: translateX(0);
        opacity: 1;
      }

      .toast.success {
        border-left-color: #10B981;
      }

      .toast.error {
        border-left-color: #EF4444;
      }

      .toast.warning {
        border-left-color: #F59E0B;
      }

      .toast.info {
        border-left-color: #3B82F6;
      }

      .toast-icon {
        font-size: 20px;
        flex-shrink: 0;
      }

      .toast.success .toast-icon {
        color: #10B981;
      }

      .toast.error .toast-icon {
        color: #EF4444;
      }

      .toast.warning .toast-icon {
        color: #F59E0B;
      }

      .toast.info .toast-icon {
        color: #3B82F6;
      }

      .toast-content {
        flex: 1;
      }

      .toast-title {
        font-weight: 600;
        color: var(--gray-900, #111827);
        margin-bottom: 4px;
        font-size: 14px;
      }

      .toast-message {
        color: var(--gray-600, #6B7280);
        font-size: 14px;
        line-height: 1.4;
      }

      .toast-close {
        background: none;
        border: none;
        color: var(--gray-400, #9CA3AF);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.2s ease;
        flex-shrink: 0;
      }

      .toast-close:hover {
        color: var(--gray-600, #6B7280);
      }

      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: var(--primary-gold, #D4AF37);
        border-radius: 0 0 8px 8px;
        transition: width linear;
      }

      .toast.success .toast-progress {
        background: #10B981;
      }

      .toast.error .toast-progress {
        background: #EF4444;
      }

      .toast.warning .toast-progress {
        background: #F59E0B;
      }

      .toast.info .toast-progress {
        background: #3B82F6;
      }

      /* Mobile responsive */
      @media (max-width: 480px) {
        .toast-container {
          top: 10px;
          right: 10px;
          left: 10px;
        }

        .toast {
          min-width: auto;
          max-width: none;
        }
      }

      /* Dark theme support */
      [data-theme="dark"] .toast {
        background: var(--dark-surface, #2D2D2D);
        color: var(--cream-white, #FFF8DC);
      }

      [data-theme="dark"] .toast-title {
        color: var(--cream-white, #FFF8DC);
      }

      [data-theme="dark"] .toast-message {
        color: var(--gray-300, #D1D5DB);
      }
    `;
    
    document.head.appendChild(styles);
  }

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {Object} options - Additional options
   */
  show(message, type = 'info', options = {}) {
    const config = {
      title: '',
      duration: this.defaultDuration,
      closable: true,
      progress: true,
      ...options
    };

    // Remove oldest toast if we have too many
    if (this.toasts.length >= this.maxToasts) {
      this.remove(this.toasts[0]);
    }

    const toast = this.createToast(message, type, config);
    this.toasts.push(toast);
    this.container.appendChild(toast.element);

    // Show toast with animation
    requestAnimationFrame(() => {
      toast.element.classList.add('show');
    });

    // Auto remove after duration
    if (config.duration > 0) {
      toast.timer = setTimeout(() => {
        this.remove(toast);
      }, config.duration);

      // Update progress bar
      if (config.progress) {
        this.updateProgress(toast, config.duration);
      }
    }

    return toast;
  }

  /**
   * Create toast element
   * @param {string} message - Toast message
   * @param {string} type - Toast type
   * @param {Object} config - Toast configuration
   * @returns {Object} Toast object
   */
  createToast(message, type, config) {
    const toastId = Utils.generateId();
    const element = document.createElement('div');
    element.className = `toast ${type}`;
    element.setAttribute('data-toast-id', toastId);

    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };

    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };

    element.innerHTML = `
      <div class="toast-icon">
        <i class="${icons[type] || icons.info}"></i>
      </div>
      <div class="toast-content">
        ${config.title ? `<div class="toast-title">${config.title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      ${config.closable ? '<button class="toast-close"><i class="fas fa-times"></i></button>' : ''}
      ${config.progress ? '<div class="toast-progress"></div>' : ''}
    `;

    const toast = {
      id: toastId,
      element: element,
      type: type,
      timer: null
    };

    // Add close button event listener
    if (config.closable) {
      const closeBtn = element.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => {
        this.remove(toast);
      });
    }

    // Add click to dismiss
    element.addEventListener('click', () => {
      if (config.duration > 0) {
        this.remove(toast);
      }
    });

    return toast;
  }

  /**
   * Update progress bar
   * @param {Object} toast - Toast object
   * @param {number} duration - Duration in milliseconds
   */
  updateProgress(toast, duration) {
    const progressBar = toast.element.querySelector('.toast-progress');
    if (!progressBar) return;

    progressBar.style.width = '100%';
    progressBar.style.transitionDuration = `${duration}ms`;
    
    requestAnimationFrame(() => {
      progressBar.style.width = '0%';
    });
  }

  /**
   * Remove toast
   * @param {Object} toast - Toast object to remove
   */
  remove(toast) {
    if (!toast || !toast.element) return;

    // Clear timer
    if (toast.timer) {
      clearTimeout(toast.timer);
    }

    // Remove from array
    const index = this.toasts.indexOf(toast);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }

    // Animate out
    toast.element.classList.remove('show');
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (toast.element && toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element);
      }
    }, 300);
  }

  /**
   * Remove all toasts
   */
  removeAll() {
    this.toasts.forEach(toast => {
      this.remove(toast);
    });
  }

  /**
   * Show success toast
   * @param {string} message - Success message
   * @param {Object} options - Additional options
   */
  success(message, options = {}) {
    return this.show(message, 'success', options);
  }

  /**
   * Show error toast
   * @param {string} message - Error message
   * @param {Object} options - Additional options
   */
  error(message, options = {}) {
    return this.show(message, 'error', { duration: 7000, ...options });
  }

  /**
   * Show warning toast
   * @param {string} message - Warning message
   * @param {Object} options - Additional options
   */
  warning(message, options = {}) {
    return this.show(message, 'warning', options);
  }

  /**
   * Show info toast
   * @param {string} message - Info message
   * @param {Object} options - Additional options
   */
  info(message, options = {}) {
    return this.show(message, 'info', options);
  }

  /**
   * Show loading toast
   * @param {string} message - Loading message
   * @param {Object} options - Additional options
   */
  loading(message = 'Loading...', options = {}) {
    return this.show(message, 'info', {
      duration: 0,
      closable: false,
      progress: false,
      ...options
    });
  }

  /**
   * Update existing toast
   * @param {Object} toast - Toast to update
   * @param {string} message - New message
   * @param {string} type - New type
   */
  update(toast, message, type = null) {
    if (!toast || !toast.element) return;

    const messageElement = toast.element.querySelector('.toast-message');
    if (messageElement) {
      messageElement.textContent = message;
    }

    if (type && type !== toast.type) {
      toast.element.className = `toast ${type} show`;
      toast.type = type;
    }
  }

  /**
   * Get toast by ID
   * @param {string} id - Toast ID
   * @returns {Object|null} Toast object or null
   */
  getToast(id) {
    return this.toasts.find(toast => toast.id === id) || null;
  }

  /**
   * Check if toast exists
   * @param {string} id - Toast ID
   * @returns {boolean} Toast exists
   */
  exists(id) {
    return this.getToast(id) !== null;
  }
}

// Create global toast manager instance
const Toast = new ToastManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.Toast = Toast;
}

// Export class for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToastManager;
}

