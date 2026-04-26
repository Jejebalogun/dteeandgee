/**
 * Testimonials/Reviews Display Utility
 * Manages customer testimonials and reviews carousel
 */

const Testimonials = {
    /**
     * Initialize testimonials carousel
     */
    init: function() {
        this.loadTestimonials();
        this.setupCarousel();
    },

    /**
     * Load testimonials from API or use sample data
     */
    loadTestimonials: async function() {
        try {
            const response = await fetch('/api/reviews/recent?limit=6');
            if (!response.ok) throw new Error('API failed');
            
            const reviews = await response.json();
            
            // Map backend reviews to frontend testimonial format
            if (reviews && reviews.length > 0) {
                const formattedReviews = reviews.map(r => ({
                    id: r.id,
                    author: r.user_name || 'Anonymous',
                    text: r.comment || '',
                    rating: r.rating,
                    product: r.product_name,
                    date: new Date(r.created_at).toLocaleDateString()
                }));
                this.renderTestimonials(formattedReviews);
            } else {
                this.renderTestimonials(this.getSampleTestimonials());
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
            this.renderTestimonials(this.getSampleTestimonials());
        }
    },

    /**
     * Get sample testimonials for demo
     */
    getSampleTestimonials: function() {
        return [
            {
                id: 1,
                author: 'Chioma Okafor',
                text: 'The smoothies are absolutely delicious and made with fresh ingredients. Delivery was fast and the service is excellent!',
                rating: 5,
                product: 'Mango Smoothie',
                date: '2 weeks ago'
            },
            {
                id: 2,
                author: 'Tunde Adeyemi',
                text: 'Love the zobo drinks! Authentic taste, exactly how my grandmother makes it. Highly recommended!',
                rating: 5,
                product: 'Zobo Drink',
                date: '3 weeks ago'
            },
            {
                id: 3,
                author: 'Zainab Mohammed',
                text: 'The parfaits are so creamy and the yogurt is premium quality. Worth every naira!',
                rating: 5,
                product: 'Yogurt Parfait',
                date: '1 week ago'
            },
            {
                id: 4,
                author: 'Emeka Nwosu',
                text: 'Finally found a place that makes authentic chin chin just like my mom! Amazing quality and taste.',
                rating: 4,
                product: 'Chin Chin',
                date: '4 days ago'
            },
            {
                id: 5,
                author: 'Adanna Obi',
                text: 'The small chops are perfect for gatherings. Fresh, tasty, and the presentation is lovely!',
                rating: 5,
                product: 'Small Chops Mix',
                date: '1 day ago'
            },
            {
                id: 6,
                author: 'David Oluwaseun',
                text: 'Great natural drinks. No artificial flavors, pure taste. Definitely ordering again!',
                rating: 5,
                product: 'Mixed Drinks Pack',
                date: '5 days ago'
            }
        ];
    },

    /**
     * Render testimonials in carousel
     */
    renderTestimonials: function(testimonials) {
        const carousel = document.getElementById('reviews-carousel');
        if (!carousel) return;

        carousel.innerHTML = testimonials.map((testimonial, index) => `
            <div class="review-card" data-index="${index}">
                <div class="review-header">
                    <div class="review-avatar">${this.getInitials(testimonial.author)}</div>
                    <div class="review-user-info">
                        <h4>${this.escapeHtml(testimonial.author)}</h4>
                        <p class="author-meta">${this.escapeHtml(testimonial.product)}</p>
                        <div class="review-rating">
                            ${this.generateStars(testimonial.rating)}
                        </div>
                    </div>
                </div>
                <p class="review-text">"${this.escapeHtml(testimonial.text)}"</p>
                <p class="testimonial-date">${testimonial.date}</p>
            </div>
        `).join('');

        // Add carousel controls if needed
        if (testimonials.length > 3) {
            this.addCarouselControls();
        }
    },

    /**
     * Setup carousel functionality
     */
    setupCarousel: function() {
        const carousel = document.getElementById('reviews-carousel');
        if (!carousel) return;

        let currentIndex = 0;
        const cards = carousel.querySelectorAll('.testimonial-card');
        const cardWidth = cards[0]?.offsetWidth || 300;

        // Auto-rotate testimonials
        setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            carousel.style.transform = `translateX(-${currentIndex * (cardWidth + 20)}px)`;
        }, 5000);
    },

    /**
     * Add carousel navigation controls
     */
    addCarouselControls: function() {
        const carousel = document.getElementById('reviews-carousel');
        if (!carousel || carousel.querySelector('.carousel-controls')) return;

        const controlsHTML = `
            <div class="carousel-controls">
                <button class="carousel-btn prev" id="testimonials-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="carousel-btn next" id="testimonials-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        const container = carousel.parentElement;
        container.innerHTML += controlsHTML;

        // Attach event listeners
        document.getElementById('testimonials-prev')?.addEventListener('click', () => {
            carousel.scrollBy({ left: -340, behavior: 'smooth' });
        });

        document.getElementById('testimonials-next')?.addEventListener('click', () => {
            carousel.scrollBy({ left: 340, behavior: 'smooth' });
        });
    },

    /**
     * Generate star rating HTML
     */
    generateStars: function(rating) {
        let html = '';
        for (let i = 0; i < 5; i++) {
            html += `<i class="fas fa-star${i < rating ? '' : ' empty'}"></i>`;
        }
        return html;
    },

    /**
     * Get initials from name
     */
    getInitials: function(name) {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
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
    },

    /**
     * Add new testimonial (admin function)
     */
    addTestimonial: function(testimonial) {
        const carousel = document.getElementById('reviews-carousel');
        if (!carousel) return;

        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-header">
                <div class="review-avatar">${this.getInitials(testimonial.author)}</div>
                <div class="review-user-info">
                    <h4>${this.escapeHtml(testimonial.author)}</h4>
                    <p class="author-meta">${this.escapeHtml(testimonial.product)}</p>
                    <div class="review-rating">
                        ${this.generateStars(testimonial.rating)}
                    </div>
                </div>
            </div>
            <p class="review-text">"${this.escapeHtml(testimonial.text)}"</p>
            <p class="testimonial-date">Just now</p>
        `;

        carousel.appendChild(card);

        // Show success message
        if (typeof Toast !== 'undefined') {
            Toast.show('Thank you for your testimonial!', 'success');
        }
    }
};

// Initialize testimonials when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('reviews-carousel')) {
        Testimonials.init();
    }
});
