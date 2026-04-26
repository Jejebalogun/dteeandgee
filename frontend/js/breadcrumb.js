/**
 * Breadcrumb Navigation Utility
 * Manages breadcrumb navigation for better user orientation
 */

const Breadcrumb = {
    /**
     * Initialize breadcrumb container
     */
    init: function() {
        if (!document.getElementById('breadcrumb-container')) {
            this.createContainer();
        }
    },

    /**
     * Create breadcrumb container in the DOM
     */
    createContainer: function() {
        const container = document.createElement('div');
        container.id = 'breadcrumb-container';
        container.className = 'breadcrumb-container';
        container.innerHTML = '<nav class="breadcrumb" id="breadcrumb" role="navigation" aria-label="breadcrumb"></nav>';
        
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.after(container);
        } else {
            document.body.insertBefore(container, document.body.firstChild);
        }
    },

    /**
     * Update breadcrumb trail
     * @param {Array} trail - Array of {label, url, active} objects
     */
    update: function(trail = []) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (!breadcrumb) {
            this.init();
        }

        const breadcrumbElement = document.getElementById('breadcrumb');
        breadcrumbElement.innerHTML = '';

        // Always add Home link
        const homeItem = document.createElement('li');
        homeItem.className = 'breadcrumb-item';
        homeItem.innerHTML = '<a href="index.html"><i class="fas fa-home"></i> Home</a>';
        breadcrumbElement.appendChild(homeItem);

        // Add trail items
        trail.forEach((item, index) => {
            // Add separator
            if (trail.length > 0) {
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
                breadcrumbElement.appendChild(separator);
            }

            // Add item
            const listItem = document.createElement('li');
            listItem.className = 'breadcrumb-item' + (item.active ? ' active' : '');

            if (item.active) {
                listItem.innerHTML = `<span>${item.label}</span>`;
            } else {
                listItem.innerHTML = `<a href="${item.url}">${item.label}</a>`;
            }

            breadcrumbElement.appendChild(listItem);
        });
    },

    /**
     * Show breadcrumb for product page
     * @param {Object} product - Product object
     * @param {Object} category - Category object
     */
    showProductBreadcrumb: function(product, category) {
        const trail = [
            {
                label: category ? category.name : 'Products',
                url: category ? `#menu?category=${category.id}` : '#menu',
                active: false
            },
            {
                label: product.name,
                url: `#menu?product=${product.id}`,
                active: true
            }
        ];
        this.update(trail);
    },

    /**
     * Show breadcrumb for category page
     * @param {Object} category - Category object
     */
    showCategoryBreadcrumb: function(category) {
        const trail = [
            {
                label: category.name,
                url: `#menu?category=${category.id}`,
                active: true
            }
        ];
        this.update(trail);
    },

    /**
     * Show breadcrumb for custom page
     * @param {String} pageName - Page name
     * @param {String} pageUrl - Page URL
     */
    showPageBreadcrumb: function(pageName, pageUrl) {
        const trail = [
            {
                label: pageName,
                url: pageUrl,
                active: true
            }
        ];
        this.update(trail);
    },

    /**
     * Show breadcrumb for search results
     * @param {String} searchTerm - Search term used
     */
    showSearchBreadcrumb: function(searchTerm) {
        const trail = [
            {
                label: `Search Results`,
                url: `#menu?search=${encodeURIComponent(searchTerm)}`,
                active: true
            }
        ];
        this.update(trail);
    },

    /**
     * Clear breadcrumb (show only home)
     */
    clear: function() {
        this.update([]);
    }
};

// Initialize breadcrumb when page loads
document.addEventListener('DOMContentLoaded', function() {
    Breadcrumb.init();
});

// Listen for hash changes to update breadcrumb
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.toLowerCase();
    
    if (hash === '#menu' || hash === '' || hash === '#home') {
        Breadcrumb.clear();
    }
});
