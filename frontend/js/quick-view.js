/**
 * Product Quick View Modal Utility
 * Handles fast product viewing without page navigation
 */

const QuickView = {
    /**
     * Open quick view modal for a product
     * @param {Object} product - Product data
     */
    open: function(product) {
        const modal = document.getElementById('product-modal');
        const modalBody = document.getElementById('product-modal-body');

        if (!modal || !modalBody) return;

        // Generate average rating
        const avgRating = product.reviews && product.reviews.length > 0
            ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
            : 0;

        // Generate stars HTML
        const starsHTML = this.generateStars(avgRating);

        // Generate review count
        const reviewCount = product.reviews ? product.reviews.length : 0;

        // Generate images gallery
        const imagesHTML = this.generateImagesGallery(product);

        // Check if product is in wishlist
        const isWishlisted = Wishlist.isInWishlist(product.id);

        // Generate HTML content
        const content = `
            <div class="quick-view-content">
                <div class="quick-view-images">
                    ${imagesHTML}
                </div>
                
                <div class="quick-view-info">
                    <div class="quick-view-header">
                        <h2>${this.escapeHtml(product.name)}</h2>
                        <button class="wishlist-quick-btn ${isWishlisted ? 'active' : ''}" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>

                    <div class="quick-view-rating">
                        <div class="rating-stars">${starsHTML}</div>
                        <span class="rating-count">(${reviewCount} reviews)</span>
                    </div>

                    <div class="quick-view-price">
                        <span class="price">₦${this.formatPrice(product.price)}</span>
                        ${product.discount ? `<span class="discount-badge">${product.discount}% OFF</span>` : ''}
                    </div>

                    <div class="quick-view-description">
                        <p>${this.escapeHtml(product.description)}</p>
                    </div>

                    <div class="quick-view-details">
                        <div class="detail-item">
                            <strong>Category:</strong>
                            <span>${this.escapeHtml(product.category_name || 'N/A')}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Availability:</strong>
                            <span class="availability ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                                ${product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                            </span>
                        </div>
                        ${product.preparation_time ? `
                        <div class="detail-item">
                            <strong>Prep Time:</strong>
                            <span>${product.preparation_time} mins</span>
                        </div>
                        ` : ''}
                    </div>

                    <div class="quick-view-actions">
                        <div class="quantity-selector">
                            <button class="qty-btn minus" onclick="QuickView.decreaseQty()">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" id="quick-view-qty" value="1" min="1" max="${product.stock || 999}">
                            <button class="qty-btn plus" onclick="QuickView.increaseQty(${product.stock || 999})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        
                        <button class="btn btn-primary btn-full" id="quick-view-add-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>

                    <button class="btn btn-outline btn-full" id="quick-view-view-details" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i> View Full Details
                    </button>
                </div>
            </div>
        `;

        modalBody.innerHTML = content;

        // Attach event listeners
        this.attachEventListeners(product);

        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },

    /**
     * Close quick view modal
     */
    close: function() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },

    /**
     * Attach event listeners to quick view elements
     */
    attachEventListeners: function(product) {
        // Add to cart button
        const addCartBtn = document.getElementById('quick-view-add-cart');
        if (addCartBtn) {
            addCartBtn.addEventListener('click', () => {
                const qty = parseInt(document.getElementById('quick-view-qty').value) || 1;
                if (typeof Cart !== 'undefined') {
                    Cart.add(product.id, qty);
                    this.close();
                    if (typeof Toast !== 'undefined') {
                        Toast.show(`${product.name} added to cart!`, 'success');
                    }
                }
            });
        }

        // View full details button
        const viewDetailsBtn = document.getElementById('quick-view-view-details');
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', () => {
                this.close();
                // Trigger full product view or navigation
                if (typeof App !== 'undefined' && App.showProductDetails) {
                    App.showProductDetails(product);
                }
            });
        }

        // Wishlist button
        const wishlistBtns = document.querySelectorAll('.wishlist-quick-btn');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.dataset.productId);
                if (typeof Wishlist !== 'undefined') {
                    Wishlist.toggle(productId);
                    btn.classList.toggle('active');
                }
            });
        });

        // Close modal on overlay click
        const modal = document.getElementById('product-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        // Close button
        const closeBtn = document.getElementById('product-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    },

    /**
     * Increase quantity
     */
    increaseQty: function(max) {
        const qtyInput = document.getElementById('quick-view-qty');
        if (qtyInput) {
            const current = parseInt(qtyInput.value) || 1;
            if (current < max) {
                qtyInput.value = current + 1;
            }
        }
    },

    /**
     * Decrease quantity
     */
    decreaseQty: function() {
        const qtyInput = document.getElementById('quick-view-qty');
        if (qtyInput) {
            const current = parseInt(qtyInput.value) || 1;
            if (current > 1) {
                qtyInput.value = current - 1;
            }
        }
    },

    /**
     * Generate images gallery HTML
     */
    generateImagesGallery: function(product) {
        const mainImage = product.image_url || 'images/placeholder.jpg';
        const additionalImages = product.additional_images || [];

        let html = `
            <div class="quick-view-main-image">
                <img id="quick-view-main-img" src="${mainImage}" alt="${this.escapeHtml(product.name)}">
            </div>
        `;

        if (additionalImages.length > 0) {
            html += '<div class="quick-view-thumbnail-gallery">';
            additionalImages.forEach((img, index) => {
                html += `
                    <img src="${img}" alt="View ${index + 1}" class="thumbnail" 
                         onclick="QuickView.switchImage('${img}')">
                `;
            });
            html += '</div>';
        }

        return html;
    },

    /**
     * Switch main image in gallery
     */
    switchImage: function(imageUrl) {
        const mainImg = document.getElementById('quick-view-main-img');
        if (mainImg) {
            mainImg.src = imageUrl;
        }
    },

    /**
     * Generate star rating HTML
     */
    generateStars: function(rating) {
        let html = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                html += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                html += '<i class="fas fa-star-half-alt"></i>';
            } else {
                html += '<i class="far fa-star"></i>';
            }
        }

        return html;
    },

    /**
     * Format price with commas
     */
    formatPrice: function(price) {
        return parseFloat(price).toLocaleString('en-NG', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml: function(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
};

// Add quick view button handler to product cards
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quick-view-btn')) {
            const btn = e.target.closest('.quick-view-btn');
            const productId = btn.dataset.productId;
            
            // Fetch product data and open quick view
            if (typeof API !== 'undefined' && API.getProduct) {
                API.getProduct(productId).then(product => {
                    QuickView.open(product);
                }).catch(err => {
                    console.error('Error loading product:', err);
                    if (typeof Toast !== 'undefined') {
                        Toast.show('Error loading product details', 'error');
                    }
                });
            }
        }
    });
});
