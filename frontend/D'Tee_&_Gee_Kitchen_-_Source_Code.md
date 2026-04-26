# D'Tee & Gee Kitchen - Source Code

This document contains the complete source code for the D'Tee & Gee Kitchen e-commerce website, organized by programming language and file.

---

## 📄 HTML Source Code

### `index.html`
```html



```html



```css
/* D'Tee & Gee Kitchen - Main Styles */

/* CSS Custom Properties (Variables) */
:root {
  /* Colors */
  --primary-gold: #D4AF37;
  --chef-blue: #7FB3D3;
  --appetite-red: #C41E3A;
  --wheat-gold: #F4D03F;
  --warm-brown: #8B4513;
  --cream-white: #FFF8DC;
  --soft-mint: #98FB98;
  --deep-teal: #008B8B;
  
  /* Neutral Colors */
  --white: #FFFFFF;
  --black: #000000;
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Dark Mode Colors */
  --dark-bg: #1A1A1A;
  --dark-surface: #2D2D2D;
  --dark-gold: #B8860B;
  --muted-blue: #4682B4;
  --soft-red: #CD5C5C;
  
  /* Typography */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-accent: 'Dancing Script', cursive;
  
  /* Font Sizes */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Transitions */
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.3s ease-in-out;
  --transition-slow: 0.5s ease-in-out;
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}

/* Dark Mode Variables */
[data-theme="dark"] {
  --white: var(--dark-bg);
  --black: var(--cream-white);
  --gray-50: var(--gray-900);
  --gray-100: var(--gray-800);
  --gray-200: var(--gray-700);
  --gray-300: var(--gray-600);
  --gray-400: var(--gray-500);
  --gray-500: var(--gray-400);
  --gray-600: var(--gray-300);
  --gray-700: var(--gray-200);
  --gray-800: var(--gray-100);
  --gray-900: var(--gray-50);
  --primary-gold: var(--dark-gold);
  --chef-blue: var(--muted-blue);
  --appetite-red: var(--soft-red);
}

/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: 1.6;
  color: var(--gray-800);
  background-color: var(--white);
  overflow-x: hidden;
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: var(--space-4);
  color: var(--gray-900);
}

h1 { font-size: var(--text-5xl); }
h2 { font-size: var(--text-4xl); }
h3 { font-size: var(--text-3xl); }
h4 { font-size: var(--text-2xl); }
h5 { font-size: var(--text-xl); }
h6 { font-size: var(--text-lg); }

p {
  margin-bottom: var(--space-4);
  color: var(--gray-600);
}

a {
  color: var(--primary-gold);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--appetite-red);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Loading Screen */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-gold), var(--chef-blue));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity var(--transition-slow), visibility var(--transition-slow);
}

.loading-screen.hidden {
  opacity: 0;
  visibility: hidden;
}

.loading-content {
  text-align: center;
  color: var(--white);
}

.loading-logo {
  width: 80px;
  height: 80px;
  margin-bottom: var(--space-6);
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid var(--white);
  border-radius: var(--radius-full);
  margin: 0 auto var(--space-4);
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: var(--text-lg);
  font-weight: 500;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
  z-index: var(--z-sticky);
  transition: all var(--transition-normal);
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--shadow-md);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-4);
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.nav-logo {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
}

.nav-brand-text {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--primary-gold);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.nav-link {
  font-weight: 500;
  color: var(--gray-700);
  position: relative;
  transition: color var(--transition-fast);
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-gold);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-gold);
  transition: width var(--transition-normal);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.nav-actions button {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  color: var(--gray-600);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-actions button:hover {
  background: var(--gray-100);
  color: var(--primary-gold);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--appetite-red);
  color: var(--white);
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 3px;
}

.nav-toggle span {
  width: 20px;
  height: 2px;
  background: var(--gray-600);
  transition: all var(--transition-fast);
}

/* Search Bar */
.search-bar {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  padding: var(--space-4);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-normal);
}

.search-bar.active {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.search-container input {
  width: 100%;
  padding: var(--space-3) var(--space-12) var(--space-3) var(--space-4);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}

.search-container input:focus {
  outline: none;
  border-color: var(--primary-gold);
}

.search-btn {
  position: absolute;
  right: var(--space-2);
  top: 50%;
  transform: translateY(-50%);
  background: var(--primary-gold);
  color: var(--white);
  border: none;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.search-btn:hover {
  background: var(--appetite-red);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-slow);
}

.btn:hover::before {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-gold), var(--appetite-red));
  color: var(--white);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: transparent;
  color: var(--white);
  border: 2px solid var(--white);
}

.btn-secondary:hover {
  background: var(--white);
  color: var(--primary-gold);
}

.btn-outline {
  background: transparent;
  color: var(--primary-gold);
  border: 2px solid var(--primary-gold);
}

.btn-outline:hover {
  background: var(--primary-gold);
  color: var(--white);
}

.btn-full {
  width: 100%;
  justify-content: center;
}

/* Hero Section */
.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}

.hero-video video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.8), rgba(127, 179, 211, 0.6));
  z-index: -1;
}

.hero-content {
  text-align: center;
  color: var(--white);
  max-width: 800px;
  padding: 0 var(--space-4);
}

.hero-title {
  margin-bottom: var(--space-6);
}

.hero-title-main {
  display: block;
  font-size: var(--text-6xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
  animation: fadeInUp 1s ease-out;
}

.hero-title-sub {
  display: block;
  font-size: var(--text-4xl);
  font-family: var(--font-accent);
  color: var(--wheat-gold);
  animation: fadeInUp 1s ease-out 0.3s both;
}

.hero-description {
  font-size: var(--text-lg);
  margin-bottom: var(--space-8);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease-out 0.9s both;
}

.hero-cta {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: var(--white);
  animation: bounce 2s infinite;
}

.scroll-mouse {
  width: 24px;
  height: 40px;
  border: 2px solid var(--white);
  border-radius: 12px;
  margin: 0 auto var(--space-2);
  position: relative;
}

.scroll-wheel {
  width: 4px;
  height: 8px;
  background: var(--white);
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  animation: scroll-wheel 2s infinite;
}

/* Sections */
section {
  padding: var(--space-20) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.section-title {
  font-size: var(--text-4xl);
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.section-subtitle {
  font-size: var(--text-lg);
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.section-actions {
  text-align: center;
  margin-top: var(--space-12);
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
}

.category-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.category-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.category-content {
  padding: var(--space-6);
  text-align: center;
}

.category-name {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.category-description {
  color: var(--gray-600);
  font-size: var(--text-sm);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

.product-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-content {
  padding: var(--space-5);
}

.product-name {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.product-description {
  color: var(--gray-600);
  font-size: var(--text-sm);
  margin-bottom: var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--primary-gold);
  margin-bottom: var(--space-4);
}

.product-actions {
  display: flex;
  gap: var(--space-2);
}

.product-actions .btn {
  flex: 1;
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

.product-badge {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  background: var(--appetite-red);
  color: var(--white);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: 600;
}

/* Menu Filters */
.menu-filters {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-12);
  flex-wrap: wrap;
}

.filter-btn {
  background: transparent;
  border: 2px solid var(--gray-300);
  color: var(--gray-600);
  padding: var(--space-2) var(--space-6);
  border-radius: var(--radius-full);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover,
.filter-btn.active {
  background: var(--primary-gold);
  border-color: var(--primary-gold);
  color: var(--white);
}

/* Reviews */
.reviews {
  background: var(--gray-50);
}

.reviews-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.review-card {
  background: var(--white);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  text-align: center;
}

.review-rating {
  display: flex;
  justify-content: center;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
}

.review-rating i {
  color: var(--wheat-gold);
  font-size: var(--text-lg);
}

.review-text {
  font-style: italic;
  color: var(--gray-600);
  margin-bottom: var(--space-4);
}

.review-author {
  font-weight: 600;
  color: var(--gray-900);
}

/* About Section */
.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

.about-features {
  display: grid;
  gap: var(--space-6);
  margin-top: var(--space-8);
}

.feature {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}

.feature i {
  font-size: var(--text-2xl);
  color: var(--primary-gold);
}

.feature-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.feature-description {
  color: var(--gray-600);
}

.about-image {
  width: 100%;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
}

/* Footer */
.footer {
  background: var(--gray-900);
  color: var(--gray-300);
  padding: var(--space-16) 0;
  text-align: center;
}

.footer-logo {
  width: 60px;
  height: 60px;
  margin-bottom: var(--space-4);
  border-radius: var(--radius-full);
}

.footer-text {
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.social-links {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.social-link {
  color: var(--gray-400);
  font-size: var(--text-2xl);
  transition: color var(--transition-fast);
}

.social-link:hover {
  color: var(--primary-gold);
}

.footer-nav {
  display: flex;
  justify-content: center;
  gap: var(--space-8);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.footer-nav-link {
  color: var(--gray-400);
  font-weight: 500;
  transition: color var(--transition-fast);
}

.footer-nav-link:hover {
  color: var(--primary-gold);
}

.copyright {
  font-size: var(--text-xs);
  color: var(--gray-500);
}

/* Modals */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal-backdrop);
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--transition-fast);
}

.modal-backdrop.active {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
  transform: translateY(-50px);
  opacity: 0;
  transition: all var(--transition-normal);
  position: relative;
}

.modal-backdrop.active .modal-content {
  transform: translateY(0);
  opacity: 1;
}

.modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  background: none;
  border: none;
  font-size: var(--text-xl);
  color: var(--gray-500);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.modal-close:hover {
  color: var(--gray-900);
}

.modal-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.modal-title {
  font-size: var(--text-2xl);
  color: var(--gray-900);
}

.modal-body {
  margin-bottom: var(--space-6);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-group label {
  display: block;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}

.form-group input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-gold);
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.form-link {
  text-align: center;
  font-size: var(--text-sm);
}

/* Dark Mode */
[data-theme="dark"] {
  background-color: var(--dark-bg);
  color: var(--gray-300);
}

[data-theme="dark"] .navbar {
  background: rgba(26, 26, 26, 0.95);
  border-bottom-color: var(--gray-800);
}

[data-theme="dark"] .nav-brand-text,
[data-theme="dark"] h1,
[data-theme="dark"] h2,
[data-theme="dark"] h3,
[data-theme="dark"] h4,
[data-theme="dark"] h5,
[data-theme="dark"] h6,
[data-theme="dark"] .modal-title {
  color: var(--cream-white);
}

[data-theme="dark"] .nav-link {
  color: var(--gray-400);
}

[data-theme="dark"] .nav-actions button {
  color: var(--gray-400);
}

[data-theme="dark"] .nav-actions button:hover {
  background: var(--gray-800);
  color: var(--dark-gold);
}

[data-theme="dark"] .search-bar {
  background: var(--dark-surface);
  border-bottom-color: var(--gray-700);
}

[data-theme="dark"] .search-container input {
  background: var(--gray-800);
  border-color: var(--gray-700);
  color: var(--cream-white);
}

[data-theme="dark"] .search-container input:focus {
  border-color: var(--dark-gold);
}

[data-theme="dark"] .category-card,
[data-theme="dark"] .product-card,
[data-theme="dark"] .modal-content,
[data-theme="dark"] .review-card {
  background: var(--dark-surface);
}

[data-theme="dark"] .category-name,
[data-theme="dark"] .product-name,
[data-theme="dark"] .review-author {
  color: var(--cream-white);
}

[data-theme="dark"] .category-description,
[data-theme="dark"] .product-description,
[data-theme="dark"] .review-text,
[data-theme="dark"] .form-group label {
  color: var(--gray-300);
}

[data-theme="dark"] .filter-btn {
  border-color: var(--gray-700);
  color: var(--gray-400);
}

[data-theme="dark"] .filter-btn:hover,
[data-theme="dark"] .filter-btn.active {
  background: var(--dark-gold);
  border-color: var(--dark-gold);
  color: var(--cream-white);
}

[data-theme="dark"] .form-group input {
  background: var(--gray-800);
  border-color: var(--gray-700);
  color: var(--cream-white);
}

[data-theme="dark"] .form-group input:focus {
  border-color: var(--dark-gold);
}

[data-theme="dark"] .modal-close {
  color: var(--gray-400);
}

[data-theme="dark"] .modal-close:hover {
  color: var(--cream-white);
}

[data-theme="dark"] .footer {
  background: var(--gray-900);
}

[data-theme="dark"] .social-link:hover,
[data-theme="dark"] .footer-nav-link:hover {
  color: var(--dark-gold);
}

[data-theme="dark"] .product-price {
  color: var(--dark-gold);
}

[data-theme="dark"] .btn-primary {
  background: linear-gradient(135deg, var(--dark-gold), var(--soft-red));
}

[data-theme="dark"] .btn-outline {
  border-color: var(--dark-gold);
  color: var(--dark-gold);
}

[data-theme="dark"] .btn-outline:hover {
  background: var(--dark-gold);
  color: var(--cream-white);
}

[data-theme="dark"] .hero-overlay {
  background: linear-gradient(135deg, rgba(184, 134, 11, 0.8), rgba(70, 130, 180, 0.6));
}

[data-theme="dark"] .scroll-mouse,
[data-theme="dark"] .scroll-wheel {
  border-color: var(--cream-white);
  background: var(--cream-white);
}

[data-theme="dark"] .review-rating i {
  color: var(--dark-gold);
}

[data-theme="dark"] .feature i {
  color: var(--dark-gold);
}

[data-theme="dark"] .product-badge {
  background: var(--soft-red);
}

/* General Utility Classes */
.text-center {
  text-align: center;
}

.hidden {
  display: none !important;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes scroll-wheel {
  0% { top: 6px; opacity: 1; }
  100% { top: 20px; opacity: 0; }
}

/* Micro-interactions */
.btn:active {
  transform: scale(0.98);
}

.category-card:active,
.product-card:active {
  transform: translateY(-4px) scale(0.98);
}

.nav-actions button:active {
  transform: scale(0.95);
}

/* Scroll to top button */
#scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--primary-gold);
  color: var(--white);
  border: none;
  border-radius: var(--radius-full);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-normal);
  z-index: var(--z-fixed);
}

#scroll-to-top.show {
  opacity: 1;
  visibility: visible;
}

#scroll-to-top:hover {
  background: var(--appetite-red);
  transform: translateY(-3px);
}

/* Placeholder for images */
img:not([src]):not([srcset]) {
  content: url("data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="); /* Transparent 1x1 GIF */
  background-color: var(--gray-200);
  display: block;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--gray-400);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gray-500);
}

/* Dark mode scrollbar */
[data-theme="dark"]::-webkit-scrollbar-track {
  background: var(--gray-800);
}

[data-theme="dark"]::-webkit-scrollbar-thumb {
  background: var(--gray-600);
}

[data-theme="dark"]::-webkit-scrollbar-thumb:hover {
  background: var(--gray-500);
}

/* Responsive video container */
.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
}

.video-container iframe,
.video-container object,
.video-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Accessibility (A11Y) */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-gold);
  color: var(--white);
  padding: var(--space-2) var(--space-4);
  z-index: 9999;
  transition: top var(--transition-fast);
}

.skip-link:focus {
  top: 0;
}

/* Print styles */
@media print {
  .navbar,
  .footer,
  .hero-video,
  .scroll-indicator,
  #scroll-to-top,
  .nav-actions button,
  .btn,
  .search-bar,
  .modal-backdrop {
    display: none !important;
  }

  body {
    background-color: var(--white);
    color: var(--black);
  }

  a {
    text-decoration: underline;
    color: inherit;
  }

  .container {
    max-width: none;
    padding: 0;
  }

  section {
    padding: var(--space-8) 0;
  }

  h1, h2, h3, h4, h5, h6 {
    color: var(--black);
  }

  p {
    color: var(--gray-800);
  }

  .category-card,
  .product-card,
  .review-card {
    box-shadow: none;
    border: 1px solid var(--gray-300);
  }
}
```



```css
/* D'Tee & Gee Kitchen - Advanced Animations */

/* Animation Variables */
:root {
  --animation-duration-fast: 0.2s;
  --animation-duration-normal: 0.3s;
  --animation-duration-slow: 0.5s;
  --animation-duration-slower: 0.8s;
  --animation-duration-slowest: 1.2s;
  
  --easing-ease-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --easing-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Scroll-triggered Animations */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all var(--animation-duration-slower) var(--easing-ease-out);
}

.animate-on-scroll.animate {
  opacity: 1;
  transform: translateY(0);
}

.animate-on-scroll.slide-left {
  transform: translateX(-30px);
}

.animate-on-scroll.slide-left.animate {
  transform: translateX(0);
}

.animate-on-scroll.slide-right {
  transform: translateX(30px);
}

.animate-on-scroll.slide-right.animate {
  transform: translateX(0);
}

.animate-on-scroll.scale-up {
  transform: scale(0.9);
}

.animate-on-scroll.scale-up.animate {
  transform: scale(1);
}

.animate-on-scroll.rotate-in {
  transform: rotate(-10deg) scale(0.9);
}

.animate-on-scroll.rotate-in.animate {
  transform: rotate(0deg) scale(1);
}

/* Stagger Animation for Grid Items */
.stagger-animation > * {
  opacity: 0;
  transform: translateY(20px);
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
}

.stagger-animation.animate > *:nth-child(1) { transition-delay: 0.1s; }
.stagger-animation.animate > *:nth-child(2) { transition-delay: 0.2s; }
.stagger-animation.animate > *:nth-child(3) { transition-delay: 0.3s; }
.stagger-animation.animate > *:nth-child(4) { transition-delay: 0.4s; }
.stagger-animation.animate > *:nth-child(5) { transition-delay: 0.5s; }
.stagger-animation.animate > *:nth-child(6) { transition-delay: 0.6s; }
.stagger-animation.animate > *:nth-child(7) { transition-delay: 0.7s; }
.stagger-animation.animate > *:nth-child(8) { transition-delay: 0.8s; }

.stagger-animation.animate > * {
  opacity: 1;
  transform: translateY(0);
}

/* Button Hover Animations */
.btn-hover-lift {
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
}

.btn-hover-lift:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.btn-hover-lift:active {
  transform: translateY(-1px);
  transition-duration: var(--animation-duration-fast);
}

.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::before {
  content: \'\';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width var(--animation-duration-slow), height var(--animation-duration-slow);
}

.btn-ripple:active::before {
  width: 300px;
  height: 300px;
}

/* Card Hover Effects */
.card-hover-float {
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
}

.card-hover-float:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-hover-tilt {
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
  transform-style: preserve-3d;
}

.card-hover-tilt:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateY(-5px);
}

.card-hover-glow {
  position: relative;
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
}

.card-hover-glow::before {
  content: \'\';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, var(--primary-gold), var(--chef-blue));
  opacity: 0;
  z-index: -1;
  transition: opacity var(--animation-duration-normal);
  filter: blur(20px);
}

.card-hover-glow:hover::before {
  opacity: 0.3;
}

/* Loading Animations */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-gold);
  animation: loading-dots 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes loading-dots {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.loading-spinner-custom {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top: 3px solid var(--primary-gold);
  border-radius: 50%;
  animation: spin-custom 1s linear infinite;
}

@keyframes spin-custom {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Text Animations */
.text-reveal {
  overflow: hidden;
}

.text-reveal span {
  display: inline-block;
  transform: translateY(100%);
  transition: transform var(--animation-duration-slower) var(--easing-ease-out);
}

.text-reveal.animate span {
  transform: translateY(0);
}

.text-typewriter {
  overflow: hidden;
  border-right: 2px solid var(--primary-gold);
  white-space: nowrap;
  animation: typewriter 3s steps(40, end), blink-caret 0.75s step-end infinite;
}

@keyframes typewriter {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: var(--primary-gold); }
}

.text-gradient {
  background: linear-gradient(135deg, var(--primary-gold), var(--appetite-red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Image Animations */
.image-zoom {
  overflow: hidden;
}

.image-zoom img {
  transition: transform var(--animation-duration-slower) var(--easing-ease-out);
}

.image-zoom:hover img {
  transform: scale(1.1);
}

.image-parallax {
  transition: transform var(--animation-duration-normal) ease-out;
}

.image-ken-burns {
  overflow: hidden;
}

.image-ken-burns img {
  animation: ken-burns 20s infinite alternate;
}

@keyframes ken-burns {
  0% {
    transform: scale(1) translate(0, 0);
  }
  100% {
    transform: scale(1.1) translate(-2%, -2%);
  }
}

/* Navigation Animations */
.nav-slide-down {
  transform: translateY(-100%);
  transition: transform var(--animation-duration-normal) var(--easing-ease-out);
}

.nav-slide-down.show {
  transform: translateY(0);
}

.nav-fade-in {
  opacity: 0;
  transition: opacity var(--animation-duration-normal) var(--easing-ease-out);
}

.nav-fade-in.show {
  opacity: 1;
}

/* Mobile Menu Animation */
.mobile-menu {
  transform: translateX(-100%);
  transition: transform var(--animation-duration-normal) var(--easing-ease-out);
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu-overlay {
  opacity: 0;
  visibility: hidden;
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
}

.mobile-menu-overlay.show {
  opacity: 1;
  visibility: visible;
}

/* Hamburger Menu Animation */
.hamburger {
  cursor: pointer;
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
}

.hamburger span {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--gray-600);
  margin: 3px 0;
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Modal Animations */
.modal-slide-up {
  transform: translateY(100%);
  transition: transform var(--animation-duration-normal) var(--easing-ease-out);
}

.modal-slide-up.show {
  transform: translateY(0);
}

.modal-scale {
  transform: scale(0.7);
  opacity: 0;
  transition: all var(--animation-duration-normal) var(--easing-bounce);
}

.modal-scale.show {
  transform: scale(1);
  opacity: 1;
}

.modal-backdrop {
  opacity: 0;
  transition: opacity var(--animation-duration-normal) var(--easing-ease-out);
}

.modal-backdrop.show {
  opacity: 1;
}

/* Form Animations */
.form-group {
  position: relative;
}

.floating-label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: var(--gray-500);
  pointer-events: none;
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
}

.form-group input:focus + .floating-label,
.form-group input:not(:placeholder-shown) + .floating-label {
  top: -8px;
  left: 8px;
  font-size: var(--text-xs);
  color: var(--primary-gold);
  background: var(--white);
  padding: 0 4px;
}

.form-shake {
  animation: shake var(--animation-duration-slow) var(--easing-ease-in-out);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Cart Animation */
.cart-bounce {
  animation: cart-bounce var(--animation-duration-normal) var(--easing-bounce);
}

@keyframes cart-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.cart-slide-in {
  transform: translateX(100%);
  transition: transform var(--animation-duration-normal) var(--easing-ease-out);
}

.cart-slide-in.show {
  transform: translateX(0);
}

/* Product Card Animations */
.product-card-flip {
  perspective: 1000px;
}

.product-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform var(--animation-duration-slower);
  transform-style: preserve-3d;
}

.product-card-flip:hover .product-card-inner {
  transform: rotateY(180deg);
}

.product-card-front,
.product-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: inherit;
}

.product-card-back {
  transform: rotateY(180deg);
  background: var(--primary-gold);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: var(--space-4);
}

/* Scroll Progress Indicator */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-gold), var(--appetite-red));
  z-index: var(--z-fixed);
  transition: width var(--animation-duration-fast) ease-out;
}

/* Floating Action Button */
.fab {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary-gold);
  color: var(--white);
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  z-index: var(--z-fixed);
  transition: all var(--animation-duration-normal) var(--easing-ease-out);
  transform: scale(0);
}

.fab.show {
  transform: scale(1);
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-xl);
}

.fab:active {
  transform: scale(0.95);
}

/* Pulse Animation for Notifications */
.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(212, 175, 55, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
  }
}

/* Glow Effect */
.glow {
  animation: glow-animation 2s ease-in-out infinite alternate;
}

@keyframes glow-animation {
  from {
    box-shadow: 0 0 5px var(--primary-gold), 0 0 10px var(--primary-gold), 0 0 15px var(--primary-gold);
  }
  to {
    box-shadow: 0 0 10px var(--primary-gold), 0 0 20px var(--primary-gold), 0 0 30px var(--primary-gold);
  }
}

/* Wobble Animation */
.wobble {
  animation: wobble-animation 1s ease-in-out;
}

@keyframes wobble-animation {
  0% { transform: translateX(0%); }
  15% { transform: translateX(-25%) rotate(-5deg); }
  30% { transform: translateX(20%) rotate(3deg); }
  45% { transform: translateX(-15%) rotate(-3deg); }
  60% { transform: translateX(10%) rotate(2deg); }
  75% { transform: translateX(-5%) rotate(-1deg); }
  100% { transform: translateX(0%); }
}

/* Heartbeat Animation */
.heartbeat {
  animation: heartbeat-animation 1.5s ease-in-out infinite;
}

@keyframes heartbeat-animation {
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}

/* Slide In Animations */
.slide-in-left {
  animation: slide-in-left 0.5s ease-out;
}

@keyframes slide-in-left {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-right {
  animation: slide-in-right 0.5s ease-out;
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in-top {
  animation: slide-in-top 0.5s ease-out;
}

@keyframes slide-in-top {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-in-bottom {
  animation: slide-in-bottom 0.5s ease-out;
}

@keyframes slide-in-bottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Zoom Animations */
.zoom-in {
  animation: zoom-in 0.5s ease-out;
}

@keyframes zoom-in {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.zoom-out {
  animation: zoom-out 0.5s ease-out;
}

@keyframes zoom-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0);
    opacity: 0;
  }
}

/* Rotate Animations */
.rotate-in {
  animation: rotate-in 0.5s ease-out;
}

@keyframes rotate-in {
  from {
    transform: rotate(-180deg) scale(0);
    opacity: 0;
  }
  to {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

/* Flip Animations */
.flip-in-x {
  animation: flip-in-x 0.6s ease-out;
}

@keyframes flip-in-x {
  from {
    transform: perspective(400px) rotateX(90deg);
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotateX(-20deg);
  }
  60% {
    transform: perspective(400px) rotateX(10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotateX(-5deg);
  }
  to {
    transform: perspective(400px) rotateX(0deg);
    opacity: 1;
  }
}

.flip-in-y {
  animation: flip-in-y 0.6s ease-out;
}

@keyframes flip-in-y {
  from {
    transform: perspective(400px) rotateY(90deg);
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotateY(-20deg);
  }
  60% {
    transform: perspective(400px) rotateY(10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotateY(-5deg);
  }
  to {
    transform: perspective(400px) rotateY(0deg);
    opacity: 1;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```



```css
/* D\'Tee & Gee Kitchen - Responsive Styles */

/* Breakpoint Variables */
:root {
  --breakpoint-xs: 320px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-xxl: 1400px;
}

/* Base Mobile-First Styles */
/* Already defined in main.css - these are overrides and additions */

/* Extra Small Devices (Portrait Phones) */
@media (max-width: 575.98px) {
  /* Typography Adjustments */
  :root {
    --text-xs: 0.7rem;
    --text-sm: 0.8rem;
    --text-base: 0.9rem;
    --text-lg: 1rem;
    --text-xl: 1.1rem;
    --text-2xl: 1.3rem;
    --text-3xl: 1.6rem;
    --text-4xl: 2rem;
    --text-5xl: 2.5rem;
    --text-6xl: 3rem;
  }

  /* Container */
  .container {
    padding: 0 var(--space-3);
  }

  /* Navigation */
  .nav-container {
    padding: var(--space-3);
  }

  .nav-menu {
    display: none;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-brand-text {
    font-size: var(--text-lg);
  }

  .nav-actions {
    gap: var(--space-2);
  }

  .nav-actions button {
    padding: var(--space-1);
  }

  /* Mobile Menu */
  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: var(--white);
    box-shadow: var(--shadow-xl);
    z-index: var(--z-modal);
    padding: var(--space-6) var(--space-4);
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
  }

  .mobile-menu.open {
    transform: translateX(0);
  }

  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: var(--z-modal-backdrop);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
  }

  .mobile-menu-overlay.show {
    opacity: 1;
    visibility: visible;
  }

  .mobile-nav-links {
    list-style: none;
    margin-top: var(--space-8);
  }

  .mobile-nav-links li {
    margin-bottom: var(--space-4);
  }

  .mobile-nav-links a {
    display: block;
    padding: var(--space-3);
    color: var(--gray-700);
    font-weight: 500;
    border-radius: var(--radius-lg);
    transition: all var(--transition-fast);
  }

  .mobile-nav-links a:hover,
  .mobile-nav-links a.active {
    background: var(--primary-gold);
    color: var(--white);
  }

  /* Hero Section */
  .hero {
    height: 80vh;
    min-height: 600px;
  }

  .hero-content {
    padding: 0 var(--space-3);
  }

  .hero-title-main {
    font-size: var(--text-5xl);
  }

  .hero-title-sub {
    font-size: var(--text-3xl);
  }

  .hero-description {
    font-size: var(--text-base);
    margin-bottom: var(--space-6);
  }

  .hero-actions {
    flex-direction: column;
    gap: var(--space-3);
  }

  .hero-cta {
    padding: var(--space-3) var(--space-6);
    font-size: var(--text-base);
    width: 100%;
    max-width: 280px;
  }

  /* Sections */
  section {
    padding: var(--space-12) 0;
  }

  .section-header {
    margin-bottom: var(--space-10);
  }

  .section-title {
    font-size: var(--text-3xl);
  }

  .section-subtitle {
    font-size: var(--text-base);
  }

  /* Grids */
  .categories-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  /* Product Cards */
  .product-card {
    max-width: 100%;
  }

  .product-actions {
    flex-direction: column;
    gap: var(--space-2);
  }

  .product-actions .btn {
    width: 100%;
    justify-content: center;
  }

  /* Menu Filters */
  .menu-filters {
    gap: var(--space-2);
    margin-bottom: var(--space-8);
  }

  .filter-btn {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
  }

  /* Reviews */
  .reviews-carousel {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  /* About Section */
  .about-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
    text-align: center;
  }

  .about-features {
    gap: var(--space-4);
  }

  .feature {
    flex-direction: column;
    text-align: center;
    gap: var(--space-2);
  }

  /* Contact Section */
  .contact-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .contact-info {
    gap: var(--space-4);
  }

  .contact-item {
    flex-direction: column;
    text-align: center;
    gap: var(--space-2);
  }

  /* Footer */
  .footer {
    padding: var(--space-12) 0 var(--space-6);
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    text-align: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: var(--space-3);
  }

  .footer-bottom-links {
    gap: var(--space-4);
  }

  /* Modals */
  .modal-content {
    width: 95%;
    margin: var(--space-4);
  }

  .modal-header,
  .modal-body {
    padding: var(--space-4);
  }

  /* Forms */
  .form-group input,
  .form-group textarea {
    padding: var(--space-3);
    font-size: var(--text-base);
  }

  /* Cart */
  .cart-actions {
    flex-direction: column;
  }

  .cart-item {
    flex-direction: column;
    text-align: center;
    gap: var(--space-3);
  }

  .cart-item-image {
    width: 80px;
    height: 80px;
    margin: 0 auto;
  }

  /* Toast */
  .toast {
    top: var(--space-4);
    right: var(--space-4);
    left: var(--space-4);
    transform: translateY(-100%);
  }

  .toast.show {
    transform: translateY(0);
  }

  /* Floating Action Button */
  .fab {
    bottom: var(--space-4);
    right: var(--space-4);
    width: 48px;
    height: 48px;
    font-size: var(--text-lg);
  }
}

/* Small Devices (Landscape Phones) */
@media (min-width: 576px) and (max-width: 767.98px) {
  /* Navigation */
  .nav-menu {
    display: none;
  }

  .nav-toggle {
    display: flex;
  }

  /* Hero */
  .hero-actions {
    flex-direction: row;
    justify-content: center;
  }

  /* Grids */
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Reviews */
  .reviews-carousel {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Footer */
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Medium Devices (Tablets) */
@media (min-width: 768px) and (max-width: 991.98px) {
  /* Navigation */
  .nav-menu {
    display: flex;
    gap: var(--space-6);
  }

  .nav-toggle {
    display: none;
  }

  .nav-actions {
    gap: var(--space-3);
  }

  /* Hero */
  .hero-title-main {
    font-size: var(--text-6xl);
  }

  .hero-title-sub {
    font-size: var(--text-4xl);
  }

  /* Grids */
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* About */
  .about-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
  }

  .about-features {
    gap: var(--space-5);
  }

  .feature {
    flex-direction: row;
    text-align: left;
  }

  /* Contact */
  .contact-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
  }

  .contact-item {
    flex-direction: row;
    text-align: left;
  }

  /* Footer */
  .footer-content {
    grid-template-columns: repeat(3, 1fr);
  }

  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
  }
}

/* Large Devices (Desktops) */
@media (min-width: 992px) and (max-width: 1199.98px) {
  /* Navigation */
  .nav-menu {
    gap: var(--space-8);
  }

  /* Grids */
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Reviews */
  .reviews-carousel {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Footer */
  .footer-content {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Extra Large Devices (Large Desktops) */
@media (min-width: 1200px) {
  /* Container */
  .container {
    max-width: 1200px;
  }

  /* Navigation */
  .nav-container {
    max-width: 1200px;
  }

  /* Grids */
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  /* Reviews */
  .reviews-carousel {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Extra Extra Large Devices */
@media (min-width: 1400px) {
  .container {
    max-width: 1400px;
  }

  .nav-container {
    max-width: 1400px;
  }

  .products-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

/* Landscape Orientation Adjustments */
@media (orientation: landscape) and (max-height: 600px) {
  .hero {
    height: 100vh;
  }

  .hero-content {
    padding: var(--space-4);
  }

  .hero-title-main {
    font-size: var(--text-4xl);
  }

  .hero-title-sub {
    font-size: var(--text-2xl);
  }

  .hero-description {
    font-size: var(--text-sm);
    margin-bottom: var(--space-4);
  }

  .hero-actions {
    gap: var(--space-3);
  }

  .hero-cta {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-sm);
  }

  .scroll-indicator {
    bottom: var(--space-4);
  }
}

/* High DPI Displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  /* Optimize for retina displays */
  .nav-logo,
  .footer-logo,
  .loading-logo {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* Print Styles */
@media print {
  * {
    background: transparent !important;
    color: black !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  .navbar,
  .footer,
  .modal,
  .toast,
  .fab,
  .loading-screen {
    display: none !important;
  }

  .hero {
    height: auto;
    page-break-after: always;
  }

  .hero-video,
  .hero-overlay {
    display: none;
  }

  .hero-content {
    color: black;
    text-align: center;
    padding: var(--space-8);
  }

  section {
    page-break-inside: avoid;
    padding: var(--space-8) 0;
  }

  .section-title {
    border-bottom: 2px solid black;
    padding-bottom: var(--space-2);
  }

  .product-card,
  .category-card,
  .review-card {
    border: 1px solid black;
    page-break-inside: avoid;
  }

  .btn {
    border: 1px solid black;
    background: transparent;
    color: black;
  }

  a {
    color: black;
    text-decoration: underline;
  }

  a[href^=\"http\"]:after {
    content: \" (\" attr(href) \")\";
    font-size: var(--text-sm);
  }
}

/* Accessibility Improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .hero-video video {
    animation: none;
  }

  .loading-spinner,
  .scroll-indicator {
    animation: none;
  }
}

@media (prefers-contrast: high) {
  :root {
    --primary-gold: #B8860B;
    --chef-blue: #4682B4;
    --appetite-red: #8B0000;
    --gray-600: #000000;
    --gray-700: #000000;
    --gray-800: #000000;
    --gray-900: #000000;
  }

  .btn {
    border: 2px solid currentColor;
  }

  .product-card,
  .category-card {
    border: 2px solid var(--gray-300);
  }
}

/* Dark Mode Responsive Adjustments */
@media (prefers-color-scheme: dark) {
  [data-theme=\"auto\"] {
    --white: var(--dark-bg);
    --black: var(--cream-white);
    --gray-50: var(--gray-900);
    --gray-100: var(--gray-800);
    --gray-200: var(--gray-700);
    --gray-300: var(--gray-600);
    --gray-400: var(--gray-500);
    --gray-500: var(--gray-400);
    --gray-600: var(--gray-300);
    --gray-700: var(--gray-200);
    --gray-800: var(--gray-100);
    --gray-900: var(--gray-50);
  }
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  /* Remove hover effects on touch devices */
  .btn:hover,
  .nav-link:hover,
  .product-card:hover,
  .category-card:hover {
    transform: none;
    box-shadow: var(--shadow-md);
  }

  /* Increase touch targets */
  .nav-actions button {
    min-width: 44px;
    min-height: 44px;
  }

  .btn {
    min-height: 44px;
    padding: var(--space-3) var(--space-6);
  }

  /* Improve form controls for touch */
  .form-group input,
  .form-group textarea {
    min-height: 44px;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  /* Optimize cart controls */
  .quantity-btn {
    min-width: 44px;
    min-height: 44px;
  }

  /* Better modal interaction */
  .modal-content {
    max-height: 80vh;
  }
}

/* Foldable Device Support */
@media (spanning: single-fold-vertical) {
  .hero-content {
    max-width: 50%;
  }

  .about-content,
  .contact-content {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-20);
  }
}

@media (spanning: single-fold-horizontal) {
  .hero {
    height: 50vh;
  }

  .section-header {
    margin-bottom: var(--space-8);
  }

  section {
    padding: var(--space-10) 0;
  }
}

/* Container Queries (Future-proofing) */
@supports (container-type: inline-size) {
  .product-card {
    container-type: inline-size;
  }

  @container (max-width: 250px) {
    .product-actions {
      flex-direction: column;
    }

    .product-actions .btn {
      font-size: var(--text-xs);
      padding: var(--space-2);
    }
  }
}

/* Utility Classes for Responsive Design */
.d-none { display: none !important; }
.d-block { display: block !important; }
.d-flex { display: flex !important; }
.d-grid { display: grid !important; }

@media (max-width: 575.98px) {
  .d-xs-none { display: none !important; }
  .d-xs-block { display: block !important; }
  .d-xs-flex { display: flex !important; }
  .d-xs-grid { display: grid !important; }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .d-sm-none { display: none !important; }
  .d-sm-block { display: block !important; }
  .d-sm-flex { display: flex !important; }
  .d-sm-grid { display: grid !important; }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .d-md-none { display: none !important; }
  .d-md-block { display: block !important; }
  .d-md-flex { display: flex !important; }
  .d-md-grid { display: grid !important; }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .d-lg-none { display: none !important; }
  .d-lg-block { display: block !important; }
  .d-lg-flex { display: flex !important; }
  .d-lg-grid { display: grid !important; }
}

@media (min-width: 1200px) {
  .d-xl-none { display: none !important; }
  .d-xl-block { display: block !important; }
  .d-xl-flex { display: flex !important; }
  .d-xl-grid { display: grid !important; }
}

/* Text Alignment Utilities */
.text-xs-center { text-align: center !important; }
.text-xs-left { text-align: left !important; }
.text-xs-right { text-align: right !important; }

@media (min-width: 576px) {
  .text-sm-center { text-align: center !important; }
  .text-sm-left { text-align: left !important; }
  .text-sm-right { text-align: right !important; }
}

@media (min-width: 768px) {
  .text-md-center { text-align: center !important; }
  .text-md-left { text-align: left !important; }
  .text-md-right { text-align: right !important; }
}

@media (min-width: 992px) {
  .text-lg-center { text-align: center !important; }
  .text-lg-left { text-align: left !important; }
  .text-lg-right { text-align: right !important; }
}

@media (min-width: 1200px) {
  .text-xl-center { text-align: center !important; }
  .text-xl-left { text-align: left !important; }
  .text-xl-right { text-align: right !important; }
}

```




---

## 💻 JavaScript Source Code

### `app.js`
```javascript



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
      this.showToast('Product added to cart!', 'success');
    } else {
      this.showToast(result.message || 'Failed to add to cart', 'error');
    }
  }

  /**
   * Show product quick view modal
   * @param {number} productId - Product ID
   */
  async showProductQuickView(productId) {
    try {
      const product = await API.getProductDetails(productId);
      if (!product) {
        this.showToast('Product details not found', 'error');
        return;
      }

      const modal = Utils.getElementById('quick-view-modal');
      const modalContent = Utils.getElementById('quick-view-modal-content');

      if (modal && modalContent) {
        modalContent.innerHTML = `
          <div class="quick-view-product-details">
            <img src="${product.image_url || '/images/placeholder.jpg'}" alt="${product.name}" class="quick-view-image">
            <div class="quick-view-info">
              <h3 class="quick-view-title">${product.name}</h3>
              <p class="quick-view-price">$${product.price.toFixed(2)}</p>
              <p class="quick-view-description">${product.description}</p>
              <div class="quick-view-actions">
                <input type="number" value="1" min="1" class="quick-view-quantity-input" id="quick-view-quantity-${product.id}">
                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}" data-quantity="1">
                  <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
              </div>
              <button class="btn btn-secondary" onclick="window.location.href='/product/${product.id}'">View Full Details</button>
            </div>
          </div>
        `;
        modal.classList.add('active');

        // Update quantity on input change
        const quantityInput = Utils.getElementById(`quick-view-quantity-${product.id}`);
        if (quantityInput) {
          quantityInput.addEventListener('input', (e) => {
            const newQuantity = parseInt(e.target.value);
            const addToCartBtn = modalContent.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
              addToCartBtn.dataset.quantity = newQuantity;
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to load product quick view:', error);
      this.showToast('Failed to load product details', 'error');
    }
  }

  /**
   * Render categories to the DOM
   */
  renderCategories() {
    const categoriesGrid = Utils.getElementById('categories-grid');
    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = '';
    this.categories.forEach(category => {
      const categoryCard = `
        <div class="category-card animate-on-scroll">
          <img src="${category.image_url || '/images/placeholder.jpg'}" alt="${category.name}" class="category-image">
          <div class="category-content">
            <h3 class="category-name">${category.name}</h3>
            <p class="category-description">${category.description}</p>
          </div>
        </div>
      `;
      categoriesGrid.insertAdjacentHTML('beforeend', categoryCard);
    });
  }

  /**
   * Render featured products to the DOM
   */
  renderFeaturedProducts() {
    const featuredProductsGrid = Utils.getElementById('featured-products-grid');
    if (!featuredProductsGrid) return;

    featuredProductsGrid.innerHTML = '';
    this.featuredProducts.forEach(product => {
      const productCard = `
        <div class="product-card animate-on-scroll">
          <img src="${product.image_url || '/images/placeholder.jpg'}" alt="${product.name}" class="product-image">
          <div class="product-content">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-actions">
              <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                <i class="fas fa-cart-plus"></i> Add to Cart
              </button>
              <button class="btn btn-outline quick-view-btn" data-product-id="${product.id}">
                <i class="fas fa-eye"></i> Quick View
              </button>
            </div>
          </div>
        </div>
      `;
      featuredProductsGrid.insertAdjacentHTML('beforeend', productCard);
    });
  }

  /**
   * Render all products to the DOM
   */
  renderProducts() {
    const productsGrid = Utils.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    if (this.products.length === 0) {
      productsGrid.innerHTML = '<p class="text-center">No products found matching your criteria.</p>';
      return;
    }

    this.products.forEach(product => {
      const productCard = `
        <div class="product-card animate-on-scroll">
          <img src="${product.image_url || '/images/placeholder.jpg'}" alt="${product.name}" class="product-image">
          <div class="product-content">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-actions">
              <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                <i class="fas fa-cart-plus"></i> Add to Cart
              </button>
              <button class="btn btn-outline quick-view-btn" data-product-id="${product.id}">
                <i class="fas fa-eye"></i> Quick View
              </button>
            </div>
          </div>
        </div>
      `;
      productsGrid.insertAdjacentHTML('beforeend', productCard);
    });
  }

  /**
   * Initialize animations
   */
  initializeAnimations() {
    // Add class to trigger stagger animation on grids
    const staggerGrids = document.querySelectorAll('.stagger-animation');
    staggerGrids.forEach(grid => {
      grid.classList.add('animate');
    });
  }

  /**
   * Initialize theme (light/dark mode)
   */
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark';
    }
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    this.updateThemeToggleIcon();
  }

  /**
   * Toggle theme (light/dark mode)
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
    this.updateThemeToggleIcon();
  }

  /**
   * Update theme toggle icon
   */
  updateThemeToggleIcon() {
    const themeToggle = Utils.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = this.currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
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
      loadingScreen.classList.add('hidden');
    }
  }

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of toast (success, error, info)
   */
  showToast(message, type = 'info') {
    if (window.Toast) {
      Toast.show(message, type);
    }
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showError(message) {
    const errorContainer = Utils.getElementById('error-container');
    if (errorContainer) {
      errorContainer.innerHTML = `<div class="alert alert-error">${message}</div>`;
      errorContainer.classList.remove('hidden');
    }
  }
}

// Initialize the app
const app = new DTeeGeeApp();
window.app = app; // Make app accessible globally for debugging

// Cache API calls for better performance
const CachedAPI = {
  _cache: {},
  _cacheExpiry: 5 * 60 * 1000, // 5 minutes

  async get(key, fetchFunction) {
    const now = Date.now();
    if (this._cache[key] && (now - this._cache[key].timestamp < this._cacheExpiry)) {
      return this._cache[key].data;
    }
    const data = await fetchFunction();
    this._cache[key] = { data, timestamp: now };
    return data;
  },

  getCategories: () => CachedAPI.get('categories', () => API.getCategories()),
  getProducts: (filters) => CachedAPI.get(`products-${JSON.stringify(filters)}`, () => API.getProducts(filters)),
  getFeaturedProducts: (limit) => CachedAPI.get(`featured-products-${limit}`, () => API.getFeaturedProducts(limit)),
  getProductDetails: (productId) => CachedAPI.get(`product-${productId}`, () => API.getProductDetails(productId)),
};




```javascript
// D\`Tee & Gee Kitchen - API Communication Layer

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
      \`Content-Type\`: \`application/json\`,
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
      credentials: \`include\`, // Include cookies for session management
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      const contentType = response.headers.get(\`content-type\`);
      let data;
      
      if (contentType && contentType.includes(\`application/json\`)) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || \`HTTP error! status: ${response.status}\`);
      }

      return data;
    } catch (error) {
      console.error(\`API request failed:\`, error);
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

    return this.request(url.toString(), { method: \`GET\` });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response promise
   */
  async post(endpoint, data = {}) {
    return this.request(`${this.apiURL}${endpoint}`, {
      method: \`POST\`,
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
      method: \`PUT\`,
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
      method: \`DELETE\`
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
      method: \`POST\`,
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
      method: \`POST\`,
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
      method: \`POST\`
    });
  }

  /**
   * Get user profile
   * @returns {Promise} Profile response
   */
  async getProfile() {
    return this.request(`${this.authURL}/profile`, {
      method: \`GET\`
    });
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise} Update response
   */
  async updateProfile(profileData) {
    return this.request(`${this.authURL}/profile`, {
      method: \`PUT\`,
      body: JSON.stringify(profileData)
    });
  }

  /**
   * Check authentication status
   * @returns {Promise} Auth status response
   */
  async checkAuth() {
    return this.request(`${this.authURL}/check-auth`, {
      method: \`GET\`
    });
  }

  // Product Methods
  /**
   * Get all products
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Products response
   */
  async getProducts(filters = {}) {
    return this.get(\'/products\', filters);
  }

  /**
   * Get single product
   * @param {number} productId - Product ID
   * @returns {Promise} Product response
   */
  async getProduct(productId) {
    return this.get(`'/products/${productId}'`);
  }

  /**
   * Get featured products
   * @param {number} limit - Number of products to fetch
   * @returns {Promise} Featured products response
   */
  async getFeaturedProducts(limit = 8) {
    return this.get(\'/featured-products\', { limit });
  }

  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} Search results
   */
  async searchProducts(query, filters = {}) {
    return this.get(\'/products\', { search: query, ...filters });
  }

  // Category Methods
  /**
   * Get all categories
   * @returns {Promise} Categories response
   */
  async getCategories() {
    return this.get(\'/categories\');
  }

  /**
   * Get single category
   * @param {number} categoryId - Category ID
   * @returns {Promise} Category response
   */
  async getCategory(categoryId) {
    return this.get(`'/categories/${categoryId}'`);
  }

  // Cart Methods
  /**
   * Get cart items
   * @returns {Promise} Cart response
   */
  async getCart() {
    return this.get(\'/cart\');
  }

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @returns {Promise} Add to cart response
   */
  async addToCart(productId, quantity = 1) {
    return this.post(\'/cart/add\', {
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
    return this.put(`'/cart/update/${itemId}'`, { quantity });
  }

  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   * @returns {Promise} Remove response
   */
  async removeCartItem(itemId) {
    return this.delete(`'/cart/remove/${itemId}'`);
  }

  /**
   * Clear entire cart
   * @returns {Promise} Clear cart response
   */
  async clearCart() {
    return this.delete(\'/cart/clear\');
  }

  /**
   * Get cart item count
   * @returns {Promise} Cart count response
   */
  async getCartCount() {
    return this.get(\'/cart/count\');
  }

  // Order Methods
  /**
   * Get user orders
   * @param {Object} params - Query parameters
   * @returns {Promise} Orders response
   */
  async getOrders(params = {}) {
    return this.get(\'/orders\', params);
  }

  /**
   * Get single order
   * @param {number} orderId - Order ID
   * @returns {Promise} Order response
   */
  async getOrder(orderId) {
    return this.get(`'/orders/${orderId}'`);
  }

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise} Create order response
   */
  async createOrder(orderData) {
    return this.post(\'/orders\', orderData);
  }

  /**
   * Cancel order
   * @param {number} orderId - Order ID
   * @returns {Promise} Cancel response
   */
  async cancelOrder(orderId) {
    return this.put(`'/orders/${orderId}/cancel'`);
  }

  // Review Methods
  /**
   * Get product reviews
   * @param {number} productId - Product ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Reviews response
   */
  async getProductReviews(productId, params = {}) {
    return this.get(`'/products/${productId}/reviews'`, params);
  }

  /**
   * Create product review
   * @param {number} productId - Product ID
   * @param {Object} reviewData - Review data
   * @returns {Promise} Create review response
   */
  async createReview(productId, reviewData) {
    return this.post(`'/products/${productId}/reviews'`, reviewData);
  }

  /**
   * Update review
   * @param {number} reviewId - Review ID
   * @param {Object} reviewData - Updated review data
   * @returns {Promise} Update review response
   */
  async updateReview(reviewId, reviewData) {
    return this.put(`'/reviews/${reviewId}'`, reviewData);
  }

  /**
   * Delete review
   * @param {number} reviewId - Review ID
   * @returns {Promise} Delete review response
   */
  async deleteReview(reviewId) {
    return this.delete(`'/reviews/${reviewId}'`);
  }

  /**
   * Get user reviews
   * @param {number} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} User reviews response
   */
  async getUserReviews(userId, params = {}) {
    return this.get(`'/users/${userId}/reviews'`, params);
  }

  /**
   * Get recent reviews
   * @param {number} limit - Number of reviews to fetch
   * @returns {Promise} Recent reviews response
   */
  async getRecentReviews(limit = 5) {
    return this.get(\'/reviews/recent\', { limit });
  }

  // Utility Methods
  /**
   * Upload file
   * @param {File} file - File to upload
   * @param {string} endpoint - Upload endpoint
   * @returns {Promise} Upload response
   */
  async uploadFile(file, endpoint = \'/upload\') {
    const formData = new FormData();
    formData.append(\'file\', file);

    return this.request(`${this.apiURL}${endpoint}`, {
      method: \`POST\`,
      body: formData,
      headers: {} // Let browser set content-type for FormData
    });
  }

  /**
   * Get server health status
   * @returns {Promise} Health status response
   */
  async getHealthStatus() {
    return this.get(\'/health\');
  }

  /**
   * Send contact form
   * @param {Object} contactData - Contact form data
   * @returns {Promise} Contact response
   */
  async sendContactForm(contactData) {
    return this.post(\'/contact\', contactData);
  }

  /**
   * Subscribe to newsletter
   * @param {string} email - Email address
   * @returns {Promise} Newsletter subscription response
   */
  async subscribeNewsletter(email) {
    return this.post(\'/newsletter/subscribe\', { email });
  }
}

/**
 * API Error Handler
 */
class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = \'APIError\';
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
    const cacheKey = \`products_${JSON.stringify(filters)}\`;
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
    const cacheKey = \'categories\';
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
if (typeof window !== \'undefined\') {
  window.API = api;
  window.CachedAPI = cachedAPI;
  window.APICache = apiCache;
  window.APIError = APIError;
}

```



```javascript
// D\`Tee & Gee Kitchen - Authentication Module

/**
 * Authentication Manager
 */
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authCallbacks = [];
    this.storageKey = \`dtee_gee_auth\
    
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
      console.log(\`User not authenticated\
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
        this.showToast(\`Registration successful! Welcome to D\\\`Tee & Gee Kitchen!\
        this.notifyAuthChange(\`register\
        return { success: true, user: response.user };
      }
      
      return { success: false, error: \`Registration failed\
    } catch (error) {
      this.showToast(error.message || \`Registration failed\
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
        throw new Error(\`Username/email and password are required\
      }

      const response = await API.login(usernameOrEmail, password);
      
      if (response.user) {
        this.setUser(response.user);
        this.showToast(`Welcome back, ${response.user.first_name || response.user.username}!`, \`success\
        this.notifyAuthChange(\`login\
        return { success: true, user: response.user };
      }
      
      return { success: false, error: \`Login failed\
    } catch (error) {
      this.showToast(error.message || \`Login failed\
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
      this.showToast(\`You have been logged out successfully\
      this.notifyAuthChange(\`logout\
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local auth state
      this.clearUser();
      this.notifyAuthChange(\`logout\
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
        this.showToast(\`Profile updated successfully\
        this.notifyAuthChange(\`profile_update\
        return { success: true, user: response.user };
      }
      
      return { success: false, error: \`Profile update failed\
    } catch (error) {
      this.showToast(error.message || \`Profile update failed\
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
      errors.push(\`Username must be at least 3 characters long\
    }

    // Email validation
    if (!userData.email || !Utils.isValidEmail(userData.email)) {
      errors.push(\`Please enter a valid email address\
    }

    // Password validation
    if (!userData.password || userData.password.length < 6) {
      errors.push(\`Password must be at least 6 characters long\
    }

    // Confirm password validation
    if (userData.password !== userData.confirm_password) {
      errors.push(\`Passwords do not match\
    }

    // Phone validation (if provided)
    if (userData.phone && !Utils.isValidPhone(userData.phone)) {
      errors.push(\`Please enter a valid phone number\
    }

    if (errors.length > 0) {
      throw new Error(errors.join(\", \"));
    }
  }

  /**
   * Update UI based on authentication state
   */
  updateUI() {
    const authToggle = Utils.getElementById(\`auth-toggle\
    const cartToggle = Utils.getElementById(\`cart-toggle\
    
    if (this.isAuthenticated) {
      // Update auth button to show user menu
      if (authToggle) {
        authToggle.innerHTML = \`<i class=\"fas fa-user-circle\"></i>\
        authToggle.title = `${this.currentUser.first_name || this.currentUser.username} - Account`;
      }
      
      // Show cart button
      if (cartToggle) {
        cartToggle.style.display = \`block\
      }
      
      // Update any user-specific content
      this.updateUserContent();
    } else {
      // Update auth button to show login
      if (authToggle) {
        authToggle.innerHTML = \`<i class=\"fas fa-user\"></i>\
        authToggle.title = \`Sign In / Register\
      }
      
      // Hide cart button for non-authenticated users
      if (cartToggle) {
        cartToggle.style.display = \`none\
      }
    }
  }

  /**
   * Update user-specific content
   */
  updateUserContent() {
    // Update welcome messages
    const welcomeElements = document.querySelectorAll(\`[data-user-welcome]\`);
    welcomeElements.forEach(element => {
      element.textContent = `Welcome, ${this.currentUser.first_name || this.currentUser.username}!`;
    });

    // Update user name displays
    const nameElements = document.querySelectorAll(\`[data-user-name]\`);
    nameElements.forEach(element => {
      element.textContent = this.currentUser.first_name || this.currentUser.username;
    });

    // Update user email displays
    const emailElements = document.querySelectorAll(\`[data-user-email]\`);
    emailElements.forEach(element => {
      element.textContent = this.currentUser.email;
    });
  }

  /**
   * Add authentication change callback
   * @param {Function} callback - Callback function
   */
  onAuthChange(callback) {
    if (typeof callback === \`function\") {
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
        console.error(\`Auth callback error:\`, error);
      }
    });
  }

  /**
   * Show toast notification
   * @param {string} message - Message to show
   * @param {string} type - Toast type (success, error, info)
   */
  showToast(message, type = \`info\") {
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
  requireAuth(action, message = \`Please sign in to continue\") {
    if (this.isAuthenticated) {
      action();
    } else {
      this.showToast(message, \`info\");
      this.showAuthModal();
    }
  }

  /**
   * Show authentication modal
   */
  showAuthModal() {
    const authModal = Utils.getElementById(\`auth-modal\");
    if (authModal) {
      authModal.classList.add(\`active\");
    }
  }

  /**
   * Hide authentication modal
   */
  hideAuthModal() {
    const authModal = Utils.getElementById(\`auth-modal\");
    if (authModal) {
      authModal.classList.remove(\`active\");
    }
  }

  /**
   * Switch between login and register forms
   * @param {string} mode - Form mode (\`login\` or \`register\")
   */
  switchAuthMode(mode = \`login\") {
    const loginForm = Utils.getElementById(\`login-form\");
    const registerForm = Utils.getElementById(\`register-form\");
    const modalTitle = Utils.getElementById(\`auth-modal-title\");
    const switchText = Utils.getElementById(\`auth-switch-text\");
    const switchLink = Utils.getElementById(\`auth-switch-link\");

    if (mode === \`login\") {
      if (loginForm) loginForm.classList.remove(\`hidden\");
      if (registerForm) registerForm.classList.add(\`hidden\");
      if (modalTitle) modalTitle.textContent = \`Sign In\";
      if (switchText) switchText.innerHTML = \`Don\\\`t have an account? <a href=\"#\" id=\"auth-switch-link\">Sign up</a>\";
    } else {
      if (loginForm) loginForm.classList.add(\`hidden\");
      if (registerForm) registerForm.classList.remove(\`hidden\");
      if (modalTitle) modalTitle.textContent = \`Create Account\";
      if (switchText) switchText.innerHTML = \`Already have an account? <a href=\"#\" id=\"auth-switch-link\">Sign in</a>\";
    }

    // Re-attach switch link event
    const newSwitchLink = Utils.getElementById(\`auth-switch-link\");
    if (newSwitchLink) {
      newSwitchLink.addEventListener(\`click\", (e) => {
        e.preventDefault();
        this.switchAuthMode(mode === \`login\` ? \`register\` : \`login\");
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
    const username = formData.get(\`username\") || Utils.getElementById(\`login-username\")?.value;
    const password = formData.get(\`password\") || Utils.getElementById(\`login-password\")?.value;

    if (!username || !password) {
      this.showToast(\`Please enter both username/email and password\", \`error\");
      return;
    }

    // Show loading state
    const submitBtn = form.querySelector(\`button[type=\"submit\"]\");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = \`Signing in...\";
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
      username: formData.get(\`username\") || Utils.getElementById(\`register-username\")?.value,
      email: formData.get(\`email\") || Utils.getElementById(\`register-email\")?.value,
      first_name: formData.get(\`first_name\") || Utils.getElementById(\`register-firstname\")?.value,
      last_name: formData.get(\`last_name\") || Utils.getElementById(\`register-lastname\")?.value,
      phone: formData.get(\`phone\") || Utils.getElementById(\`register-phone\")?.value,
      password: formData.get(\`password\") || Utils.getElementById(\`register-password\")?.value,
      confirm_password: formData.get(\`confirm_password\") || Utils.getElementById(\`register-confirm-password\")?.value
    };

    // Show loading state
    const submitBtn = form.querySelector(\`button[type=\"submit\"]\");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = \`Creating account...\";
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
    const authToggle = Utils.getElementById(\`auth-toggle\");
    if (authToggle) {
      authToggle.addEventListener(\`click\", () => {
        if (this.isAuthenticated) {
          // Show user menu or profile
          this.showUserMenu();
        } else {
          this.showAuthModal();
        }
      });
    }

    // Auth modal close
    const authModalClose = Utils.getElementById(\`auth-modal-close\");
    if (authModalClose) {
      authModalClose.addEventListener(\`click\", () => {
        this.hideAuthModal();
      });
    }

    // Login form
    const loginForm = Utils.getElementById(\`login-form\");
    if (loginForm) {
      loginForm.addEventListener(\`submit\", (e) => this.handleLoginSubmit(e));
    }

    // Register form
    const registerForm = Utils.getElementById(\`register-form\");
    if (registerForm) {
      registerForm.addEventListener(\`submit\", (e) => this.handleRegisterSubmit(e));
    }

    // Auth switch link
    const authSwitchLink = Utils.getElementById(\`auth-switch-link\");
    if (authSwitchLink) {
      authSwitchLink.addEventListener(\`click\", (e) => {
        e.preventDefault();
        const currentMode = Utils.getElementById(\`login-form\")?.classList.contains(\`hidden\") ? \`register\` : \`login\";
        this.switchAuthMode(currentMode === \`login\` ? \`register\` : \`login\");
      });
    }

    // Modal backdrop click
    const authModal = Utils.getElementById(\`auth-modal\");
    if (authModal) {
      authModal.addEventListener(\`click\", (e) => {
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
    // Create user menu if it doesn\`t exist
    let userMenu = Utils.getElementById(\`user-menu\");
    if (!userMenu) {
      userMenu = this.createUserMenu();
    }
    
    userMenu.classList.toggle(\`active\");
  }

  /**
   * Create user menu
   * @returns {Element} User menu element
   */
  createUserMenu() {
    const userMenu = document.createElement(\`div\");
    userMenu.id = \`user-menu\";
    userMenu.className = \`user-menu\";
    
    userMenu.innerHTML = \`
      <div class=\"user-menu-content\">\
        <div class=\"user-menu-header\">\
          <div class=\"user-avatar\">\
            <i class=\"fas fa-user-circle\"></i>\
          </div>\
          <div class=\"user-info\">\
            <div class=\"user-name\">${this.currentUser.first_name || this.currentUser.username}</div>\
            <div class=\"user-email\">${this.currentUser.email}</div>\
          </div>\
        </div>\
        <div class=\"user-menu-items\">\
          <a href=\"#\" class=\"user-menu-item\" id=\"user-profile-link\"><i class=\"fas fa-user-alt\"></i> My Profile</a>\
          <a href=\"#\" class=\"user-menu-item\" id=\"user-orders-link\"><i class=\"fas fa-box\"></i> My Orders</a>\
          <a href=\"#\" class=\"user-menu-item\" id=\"user-reviews-link\"><i class=\"fas fa-star\"></i> My Reviews</a>\
          <button class=\"user-menu-item logout-btn\" id=\"logout-btn\"><i class=\"fas fa-sign-out-alt\"></i> Logout</button>\
        </div>\
      </div>\
    \
    document.body.appendChild(userMenu);

    // Position the menu next to the auth toggle button
    const authToggle = Utils.getElementById(\`auth-toggle\");
    if (authToggle) {
      const rect = authToggle.getBoundingClientRect();
      userMenu.style.top = `${rect.bottom + 10}px`;
      userMenu.style.right = `${window.innerWidth - rect.right}px`;
    }

    // Add event listeners for menu items
    Utils.getElementById(\`logout-btn\")?.addEventListener(\`click\", () => this.logout());
    Utils.getElementById(\`user-profile-link\")?.addEventListener(\`click\", (e) => {
      e.preventDefault();
      this.showToast(\`Navigating to profile page... (Not implemented yet)\", \`info\");
      userMenu.classList.remove(\`active\");
    });
    Utils.getElementById(\`user-orders-link\")?.addEventListener(\`click\", (e) => {
      e.preventDefault();
      this.showToast(\`Navigating to orders page... (Not implemented yet)\", \`info\");
      userMenu.classList.remove(\`active\");
    });
    Utils.getElementById(\`user-reviews-link\")?.addEventListener(\`click\", (e) => {
      e.preventDefault();
      this.showToast(\`Navigating to reviews page... (Not implemented yet)\", \`info\");
      userMenu.classList.remove(\`active\");
    });

    // Close menu when clicking outside
    document.addEventListener(\`click\", (e) => {
      if (userMenu && !userMenu.contains(e.target) && !authToggle.contains(e.target)) {
        userMenu.classList.remove(\`active\");
      }
    });

    return userMenu;
  }
}

// Create global Auth instance
const Auth = new AuthManager();
if (typeof window !== \`undefined\") {
  window.Auth = Auth;
}

```



```javascript
// D\`Tee & Gee Kitchen - Shopping Cart Module

/**
 * Shopping Cart Manager
 */
class CartManager {
  constructor() {
    this.cartItems = [];
    this.cartCount = 0;
    this.cartTotal = 0;
    this.isLoading = false;
    this.cartCallbacks = [];
    this.storageKey = \`dtee_gee_cart\
    
    // Initialize cart
    this.init();
  }

  /**
   * Initialize cart
   */
  async init() {
    // Load cart from server if authenticated, otherwise from localStorage
    if (Auth.isUserAuthenticated()) {
      await this.loadCartFromServer();
    } else {
      this.loadCartFromStorage();
    }
    
    this.updateCartUI();
    this.initEventListeners();
  }

  /**
   * Load cart from server
   */
  async loadCartFromServer() {
    try {
      const response = await API.getCart();
      this.cartItems = response.items || [];
      this.cartTotal = response.total || 0;
      this.cartCount = response.item_count || 0;
      
      // Sync with localStorage for offline access
      this.saveCartToStorage();
    } catch (error) {
      console.error(\`Failed to load cart from server:\`, error);
      // Fallback to localStorage
      this.loadCartFromStorage();
    }
  }

  /**
   * Load cart from localStorage
   */
  loadCartFromStorage() {
    const savedCart = Utils.storage.get(this.storageKey, {
      items: [],
      total: 0,
      count: 0
    });
    
    this.cartItems = savedCart.items || [];
    this.cartTotal = savedCart.total || 0;
    this.cartCount = savedCart.count || 0;
  }

  /**
   * Save cart to localStorage
   */
  saveCartToStorage() {
    Utils.storage.set(this.storageKey, {
      items: this.cartItems,
      total: this.cartTotal,
      count: this.cartCount,
      timestamp: Date.now()
    });
  }

  /**
   * Add item to cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @param {Object} productData - Product data (for offline mode)
   * @returns {Promise} Add to cart result
   */
  async addToCart(productId, quantity = 1, productData = null) {
    try {
      this.setLoading(true);
      
      if (Auth.isUserAuthenticated()) {
        // Add to server cart
        const response = await API.addToCart(productId, quantity);
        
        // Update local cart
        await this.loadCartFromServer();
        
        this.showToast(`Added ${quantity} item(s) to cart`, \`success\");
        this.animateCartIcon();
        this.notifyCartChange(\`add\", { productId, quantity });
        
        return { success: true, item: response };
      } else {
        // Add to local cart
        return this.addToLocalCart(productId, quantity, productData);
      }
    } catch (error) {
      this.showToast(error.message || \`Failed to add item to cart\`, \`error\");
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Add item to local cart (for non-authenticated users)
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @param {Object} productData - Product data
   * @returns {Object} Add result
   */
  addToLocalCart(productId, quantity, productData) {
    if (!productData) {
      throw new Error(\`Product data required for local cart\");
    }

    // Check if item already exists
    const existingItemIndex = this.cartItems.findIndex(item => item.product_id === productId);
    
    if (existingItemIndex > -1) {
      // Update existing item
      this.cartItems[existingItemIndex].quantity += quantity;
      this.cartItems[existingItemIndex].subtotal = 
        this.cartItems[existingItemIndex].quantity * this.cartItems[existingItemIndex].product.price;
    } else {
      // Add new item
      const cartItem = {
        id: Utils.generateId(),
        product_id: productId,
        product: productData,
        quantity: quantity,
        subtotal: quantity * productData.price
      };
      this.cartItems.push(cartItem);
    }

    this.updateCartTotals();
    this.saveCartToStorage();
    this.updateCartUI();
    
    this.showToast(`Added ${quantity} item(s) to cart`, \`success\");
    this.animateCartIcon();
    this.notifyCartChange(\`add\", { productId, quantity });
    
    return { success: true };
  }

  /**
   * Update cart item quantity
   * @param {number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise} Update result
   */
  async updateCartItem(itemId, quantity) {
    try {
      this.setLoading(true);
      
      if (quantity <= 0) {
        return this.removeCartItem(itemId);
      }

      if (Auth.isUserAuthenticated()) {
        // Update on server
        await API.updateCartItem(itemId, quantity);
        await this.loadCartFromServer();
      } else {
        // Update local cart
        const itemIndex = this.cartItems.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
          this.cartItems[itemIndex].quantity = quantity;
          this.cartItems[itemIndex].subtotal = quantity * this.cartItems[itemIndex].product.price;
          this.updateCartTotals();
          this.saveCartToStorage();
        }
      }

      this.updateCartUI();
      this.notifyCartChange(\`update\", { itemId, quantity });
      
      return { success: true };
    } catch (error) {
      this.showToast(error.message || \`Failed to update cart item\`, \`error\");
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Remove item from cart
   * @param {number} itemId - Cart item ID
   * @returns {Promise} Remove result
   */
  async removeCartItem(itemId) {
    try {
      this.setLoading(true);
      
      if (Auth.isUserAuthenticated()) {
        // Remove from server
        await API.removeCartItem(itemId);
        await this.loadCartFromServer();
      } else {
        // Remove from local cart
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
        this.updateCartTotals();
        this.saveCartToStorage();
      }

      this.updateCartUI();
      this.showToast(\`Item removed from cart\`, \`info\");
      this.notifyCartChange(\`remove\", { itemId });
      
      return { success: true };
    } catch (error) {
      this.showToast(error.message || \`Failed to remove cart item\`, \`error\");
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Clear entire cart
   * @returns {Promise} Clear result
   */
  async clearCart() {
    try {
      this.setLoading(true);
      
      if (Auth.isUserAuthenticated()) {
        // Clear server cart
        await API.clearCart();
      }
      
      // Clear local cart
      this.cartItems = [];
      this.cartTotal = 0;
      this.cartCount = 0;
      
      this.saveCartToStorage();
      this.updateCartUI();
      this.showToast(\`Cart cleared\`, \`info\");
      this.notifyCartChange(\`clear\", {});
      
      return { success: true };
    } catch (error) {
      this.showToast(error.message || \`Failed to clear cart\`, \`error\");
      return { success: false, error: error.message };
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Update cart totals
   */
  updateCartTotals() {
    this.cartTotal = this.cartItems.reduce((total, item) => total + item.subtotal, 0);
    this.cartCount = this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Update cart UI
   */
  updateCartUI() {
    // Update cart count badge
    const cartCountElement = Utils.getElementById(\`cart-count\");
    if (cartCountElement) {
      cartCountElement.textContent = this.cartCount;
      cartCountElement.style.display = this.cartCount > 0 ? \`block\` : \`none\";
    }

    // Update cart modal content
    this.updateCartModal();
  }

  /**
   * Update cart modal content
   */
  updateCartModal() {
    const cartItemsContainer = Utils.getElementById(\`cart-items\");
    const cartSummary = Utils.getElementById(\`cart-summary\");
    
    if (!cartItemsContainer || !cartSummary) return;

    if (this.cartItems.length === 0) {
      cartItemsContainer.innerHTML = \`
        <div class=\"empty-cart\">\
          <i class=\"fas fa-shopping-cart\"></i>\
          <h3>Your cart is empty</h3>\
          <p>Add some delicious items to get started!</p>\
        </div>\
      \
      cartSummary.innerHTML = \`\";
      return;
    }

    // Render cart items
    cartItemsContainer.innerHTML = this.cartItems.map(item => \`
      <div class=\"cart-item\" data-item-id=\"${item.id}\">\
        <img src=\"${item.product.image_url || \`/images/placeholder.jpg\`}\" \n             alt=\"${item.product.name}\" \n             class=\"cart-item-image\">\
        <div class=\"cart-item-details\">\
          <div class=\"cart-item-name\">${item.product.name}</div>\
          <div class=\"cart-item-price\">${Utils.formatCurrency(item.product.price)}</div>\
          <div class=\"cart-item-controls\">\
            <button class=\"quantity-btn\" data-action=\"decrease\" data-item-id=\"${item.id}\">\
              <i class=\"fas fa-minus\"></i>\
            </button>\
            <input type=\"number\" class=\"quantity-input\" value=\"${item.quantity}\" \n                   min=\"1\" data-item-id=\"${item.id}\">\
            <button class=\"quantity-btn\" data-action=\"increase\" data-item-id=\"${item.id}\">\
              <i class=\"fas fa-plus\"></i>\
            </button>\
            <button class=\"remove-btn\" data-action=\"remove\" data-item-id=\"${item.id}\">\
              <i class=\"fas fa-trash\"></i>\
            </button>\
          </div>\
        </div>\
        <div class=\"cart-item-subtotal\">\
          ${Utils.formatCurrency(item.subtotal)}\
        </div>\
      </div>\
    \").join(\`\");

    // Render cart summary
    cartSummary.innerHTML = \`
      <div class=\"cart-total\">\
        <span>Total: ${Utils.formatCurrency(this.cartTotal)}</span>\
      </div>\
    \";

    // Add event listeners to cart controls
    this.attachCartItemListeners();
  }

  /**
   * Attach event listeners to cart item controls
   */
  attachCartItemListeners() {
    const cartItemsContainer = Utils.getElementById(\`cart-items\");
    if (!cartItemsContainer) return;

    cartItemsContainer.addEventListener(\`click\`, async (e) => {
      const action = e.target.closest(\`[data-action]\`)?.dataset.action;
      const itemId = e.target.closest(\`[data-item-id]\`)?.dataset.itemId;
      
      if (!action || !itemId) return;

      e.preventDefault();
      
      const item = this.cartItems.find(item => item.id == itemId);
      if (!item) return;

      switch (action) {
        case \`increase\
          await this.updateCartItem(itemId, item.quantity + 1);
          break;
        case \`decrease\
          await this.updateCartItem(itemId, Math.max(1, item.quantity - 1));
          break;
        case \`remove\
          await this.removeCartItem(itemId);
          break;
      }
    });

    // Handle quantity input changes
    cartItemsContainer.addEventListener(\`change\`, async (e) => {
      if (e.target.classList.contains(\`quantity-input\")) {
        const itemId = e.target.dataset.itemId;
        const quantity = parseInt(e.target.value) || 1;
        
        if (itemId) {
          await this.updateCartItem(itemId, quantity);
        }
      }
    });
  }

  /**
   * Show cart modal
   */
  showCartModal() {
    const cartModal = Utils.getElementById(\`cart-modal\");
    if (cartModal) {
      cartModal.classList.add(\`active\");
      this.updateCartModal();
    }
  }

  /**
   * Hide cart modal
   */
  hideCartModal() {
    const cartModal = Utils.getElementById(\`cart-modal\");
    if (cartModal) {
      cartModal.classList.remove(\`active\");
    }
  }

  /**
   * Animate cart icon
   */
  animateCartIcon() {
    const cartToggle = Utils.getElementById(\`cart-toggle\");
    if (cartToggle) {
      cartToggle.classList.add(\`cart-bounce\");
      setTimeout(() => {
        cartToggle.classList.remove(\`cart-bounce\");
      }, 300);
    }
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading(loading) {
    this.isLoading = loading;
    
    // Update UI to show loading state
    const cartModal = Utils.getElementById(\`cart-modal\");
    if (cartModal) {
      if (loading) {
        cartModal.classList.add(\`loading\");
      } else {
        cartModal.classList.remove(\`loading\");
      }
    }
  }

  /**
   * Get cart items
   * @returns {Array} Cart items
   */
  getCartItems() {
    return this.cartItems;
  }

  /**
   * Get cart count
   * @returns {number} Cart count
   */
  getCartCount() {
    return this.cartCount;
  }

  /**
   * Get cart total
   * @returns {number} Cart total
   */
  getCartTotal() {
    return this.cartTotal;
  }

  /**
   * Check if cart is empty
   * @returns {boolean} Is cart empty
   */
  isEmpty() {
    return this.cartItems.length === 0;
  }

  /**
   * Sync cart with server (when user logs in)
   */
  async syncWithServer() {
    if (!Auth.isUserAuthenticated()) return;

    try {
      // If there are local cart items, merge with server cart
      if (this.cartItems.length > 0) {
        for (const item of this.cartItems) {
          await API.addToCart(item.product_id, item.quantity);
        }
      }
      
      // Load updated cart from server
      await this.loadCartFromServer();
      this.updateCartUI();
      
      // Clear local storage
      Utils.storage.remove(this.storageKey);
    } catch (error) {
      console.error(\`Failed to sync cart with server:\`, error);
    }
  }

  /**
   * Add cart change callback
   * @param {Function} callback - Callback function
   */
  onCartChange(callback) {
    if (typeof callback === \`function\") {
      this.cartCallbacks.push(callback);
    }
  }

  /**
   * Remove cart change callback
   * @param {Function} callback - Callback function to remove
   */
  offCartChange(callback) {
    const index = this.cartCallbacks.indexOf(callback);
    if (index > -1) {
      this.cartCallbacks.splice(index, 1);
    }
  }

  /**
   * Notify cart change
   * @param {string} action - Action type
   * @param {Object} data - Action data
   */
  notifyCartChange(action, data) {
    this.cartCallbacks.forEach(callback => {
      try {
        callback(action, data, {
          items: this.cartItems,
          count: this.cartCount,
          total: this.cartTotal
        });
      } catch (error) {
        console.error(\`Cart callback error:\`, error);
      }
    });
  }

  /**
   * Show toast notification
   * @param {string} message - Message to show
   * @param {string} type - Toast type
   */
  showToast(message, type = \`info\") {
    if (window.Toast) {
      window.Toast.show(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Cart toggle button
    const cartToggle = Utils.getElementById(\`cart-toggle\");
    if (cartToggle) {
      cartToggle.addEventListener(\`click\`, () => {
        this.showCartModal();
      });
    }

    // Cart modal close
    const cartModalClose = Utils.getElementById(\`cart-modal-close\");
    if (cartModalClose) {
      cartModalClose.addEventListener(\`click\`, () => {
        this.hideCartModal();
      });
    }

    // Continue shopping button
    const continueShoppingBtn = Utils.getElementById(\`continue-shopping\");
    if (continueShoppingBtn) {
      continueShoppingBtn.addEventListener(\`click\`, () => {
        this.hideCartModal();
      });
    }

    // Checkout button
    const checkoutBtn = Utils.getElementById(\`checkout-btn\");
    if (checkoutBtn) {
      checkoutBtn.addEventListener(\`click\`, () => {
        this.proceedToCheckout();
      });
    }

    // Modal backdrop click
    const cartModal = Utils.getElementById(\`cart-modal\");
    if (cartModal) {
      cartModal.addEventListener(\`click\`, (e) => {
        if (e.target === cartModal) {
          this.hideCartModal();
        }
      });
    }

    // Listen for auth changes to sync cart
    Auth.onAuthChange((action, user) => {
      if (action === \`login\` && user) {
        this.syncWithServer();
      } else if (action === \`logout\") {
        this.clearCart();
      }
    });
  }

  /**
   * Proceed to checkout
   */
  proceedToCheckout() {
    if (this.isEmpty()) {
      this.showToast(\`Your cart is empty. Please add items before checking out.\`, \`info\");
      return;
    }

    if (!Auth.isUserAuthenticated()) {
      this.showToast(\`Please sign in to proceed to checkout.\`, \`info\");
      Auth.showAuthModal();
      return;
    }

    // Here you would typically navigate to a checkout page or initiate a payment process
    this.showToast(\`Proceeding to checkout... (Not implemented yet)\", \`info\");
    this.hideCartModal();
    // Example: window.location.href = \`/checkout\";
  }
}

// Create global Cart instance
const Cart = new CartManager();
if (typeof window !== \`undefined\") {
  window.Cart = Cart;
}

```



```javascript
// D\`Tee & Gee Kitchen - Toast Notification System

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

    this.container = document.createElement(\`div\");
    this.container.id = \`toast-container\";
    this.container.className = \`toast-container\";
    
    // Add styles if not already present
    if (!document.getElementById(\`toast-styles\")) {
      this.addStyles();
    }
    
    document.body.appendChild(this.container);
  }

  /**
   * Add toast styles
   */
  addStyles() {
    const styles = document.createElement(\`style\");
    styles.id = \`toast-styles\";
    styles.textContent = \`
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
      [data-theme=\"dark\"] .toast {
        background: var(--dark-surface, #2D2D2D);
        color: var(--cream-white, #FFF8DC);
      }

      [data-theme=\"dark\"] .toast-title {
        color: var(--cream-white, #FFF8DC);
      }

      [data-theme=\"dark\"] .toast-message {
        color: var(--gray-300, #D1D5DB);
      }
    
    
    document.head.appendChild(styles);
  }

  /**
   * Show toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {Object} options - Additional options
   */
  show(message, type = \`info\", options = {}) {
    const config = {
      title: \`\
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
      toast.element.classList.add(\`show\");
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
    const element = document.createElement(\`div\");
    element.className = `toast ${type}`;
    element.setAttribute(\`data-toast-id\`, toastId);

    const icons = {
      success: \`fas fa-check-circle\
      error: \`fas fa-exclamation-circle\
      warning: \`fas fa-exclamation-triangle\
      info: \`fas fa-info-circle\
    };

    const titles = {
      success: \`Success\
      error: \`Error\
      warning: \`Warning\
      info: \`Info\
    };

    element.innerHTML = \`
      <div class=\"toast-icon\">\
        <i class=\"${icons[type] || icons.info}\"></i>\
      </div>\
      <div class=\"toast-content\">\
        ${config.title ? `<div class=\"toast-title\">${config.title}</div>` : \`\
        <div class=\"toast-message\">${message}</div>\
      </div>\
      ${config.closable ? \`<button class=\"toast-close\"><i class=\"fas fa-times\"></i></button>\` : \`\
      ${config.progress ? \`<div class=\"toast-progress\"></div>\` : \`\
    \

    const toast = {
      id: toastId,
      element: element,
      type: type,
      timer: null
    };

    // Add close button event listener
    if (config.closable) {
      const closeBtn = element.querySelector(\`.toast-close\");
      closeBtn.addEventListener(\`click\`, () => {
        this.remove(toast);
      });
    }

    // Add click to dismiss
    element.addEventListener(\`click\`, () => {
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
    const progressBar = toast.element.querySelector(\`.toast-progress\");
    if (!progressBar) return;

    progressBar.style.width = \`100%\";
    progressBar.style.transitionDuration = `${duration}ms`;
    
    requestAnimationFrame(() => {
      progressBar.style.width = \`0%\";
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
    toast.element.classList.remove(\`show\");
    
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
    return this.show(message, \`success\`, options);
  }

  /**
   * Show error toast
   * @param {string} message - Error message
   * @param {Object} options - Additional options
   */
  error(message, options = {}) {
    return this.show(message, \`error\`, { duration: 7000, ...options });
  }

  /**
   * Show warning toast
   * @param {string} message - Warning message
   * @param {Object} options - Additional options
   */
  warning(message, options = {}) {
    return this.show(message, \`warning\`, options);
  }

  /**
   * Show info toast
   * @param {string} message - Info message
   * @param {Object} options - Additional options
   */
  info(message, options = {}) {
    return this.show(message, \`info\`, options);
  }

  /**
   * Show loading toast
   * @param {string} message - Loading message
   * @param {Object} options - Additional options
   */
  loading(message = \`Loading...\", options = {}) {
    return this.show(message, \`info\`, {
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

    const messageElement = toast.element.querySelector(\`.toast-message\");
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
if (typeof window !== \`undefined\") {
  window.Toast = Toast;
}

// Export class for module use
if (typeof module !== \`undefined\` && module.exports) {
  module.exports = ToastManager;
}

```



```javascript
// D\`Tee & Gee Kitchen - Utility Functions

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
  formatCurrency(amount, currency = \`NGN\") {
    return new Intl.NumberFormat(\`en-NG\`, {
      style: \`currency\
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
      year: \`numeric\
      month: \`long\
      day: \`numeric\
    };
    const formatOptions = { ...defaultOptions, ...options };
    return new Intl.DateTimeFormat(\`en-US\`, formatOptions).format(new Date(date));
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

    if (diffInSeconds < 60) return \`Just now\";
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
    const temp = document.createElement(\`div\");
    temp.textContent = str;
    return temp.innerHTML;
  },

  /**
   * Validate email address
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean} Is valid phone
   */
  isValidPhone(phone) {
    const phoneRegex = /^[\\+]?[1-9][\\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\\s\\-\\(\\)]/g, \`\"));
  },

  /**
   * Get element by ID with error handling
   * @param {string} id - Element ID
   * @returns {Element|null} Element or null
   */
  getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID \'${id}\' not found`);
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
      console.warn(\`Cannot add event listener to null element\");
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
  showElement(element, animation = \`fadeInUp\") {
    if (!element) return;
    element.classList.remove(\`hidden\");
    element.classList.add(\`animate-on-scroll\`, animation);
    setTimeout(() => element.classList.add(\`animate\"), 10);
  },

  /**
   * Hide element with animation
   * @param {Element} element - Element to hide
   * @param {string} animation - Animation class
   */
  hideElement(element, animation = \`fadeOut\") {
    if (!element) return;
    element.classList.add(animation);
    setTimeout(() => {
      element.classList.add(\`hidden\");
      element.classList.remove(animation);
    }, 300);
  },

  /**
   * Toggle element visibility
   * @param {Element} element - Element to toggle
   */
  toggleElement(element) {
    if (!element) return;
    if (element.classList.contains(\`hidden\")) {
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
    const element = typeof target === \`string\` ? document.querySelector(target) : target;
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: \`smooth\
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
    if (width < 768) return \`mobile\";
    if (width < 1024) return \`tablet\";
    return \`desktop\";
  },

  /**
   * Check if device supports touch
   * @returns {boolean} Supports touch
   */
  isTouchDevice() {
    return \`ontouchstart\` in window || navigator.maxTouchPoints > 0;
  },

  /**
   * Get browser information
   * @returns {Object} Browser info
   */
  getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = \`Unknown\";
    
    if (ua.includes(\`Chrome\")) browser = \`Chrome\";
    else if (ua.includes(\`Firefox\")) browser = \`Firefox\";
    else if (ua.includes(\`Safari\")) browser = \`Safari\";
    else if (ua.includes(\`Edge\")) browser = \`Edge\";
    else if (ua.includes(\`Opera\")) browser = \`Opera\";
    
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
        console.error(\`Error saving to localStorage:\`, error);
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
        console.error(\`Error reading from localStorage:\`, error);
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
        console.error(\`Error removing from localStorage:\`, error);
      }
    },

    /**
     * Clear all localStorage
     */
    clear() {
      try {
        localStorage.clear();
      } catch (error) {
        console.error(\`Error clearing localStorage:\`, error);
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
        console.error(\`Error saving to sessionStorage:\`, error);
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
        console.error(\`Error reading from sessionStorage:\`, error);
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
        console.error(\`Error removing from sessionStorage:\`, error);
      }
    },

    /**
     * Clear all sessionStorage
     */
    clear() {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error(\`Error clearing sessionStorage:\`, error);
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
      const nameEQ = name + \`=\";
      const ca = document.cookie.split(\
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === \` \") c = c.substring(1, c.length);
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
      window.history.pushState({}, \`\", url);
    },

    /**
     * Remove URL parameter
     * @param {string} name - Parameter name
     */
    removeParam(name) {
      const url = new URL(window.location);
      url.searchParams.delete(name);
      window.history.pushState({}, \`\", url);
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
    measure(func, label = \`Function\") {
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
      const navigation = performance.getEntriesByType(\`navigation\`)[0];
      return navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;
    }
  }
};

// Export for use in other modules
if (typeof module !== \`undefined\` && module.exports) {
  module.exports = Utils;
}

```




---

## 🐍 Python Backend Source Code

### `main.py`
```python



```python
import os
import sys
# DON\`T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.product import product_bp
from src.routes.cart import cart_bp
from src.routes.order import order_bp
from src.routes.review import review_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), \`static\"))
app.config[\`SECRET_KEY\"] = \`dtee-gee-kitchen-secret-key-2024\

# Enable CORS for all routes
CORS(app, supports_credentials=True, origins=[\`*\"])

# Register all blueprints
app.register_blueprint(auth_bp, url_prefix=\"/api/auth\")
app.register_blueprint(user_bp, url_prefix=\"/api\")
app.register_blueprint(product_bp, url_prefix=\"/api\")
app.register_blueprint(cart_bp, url_prefix=\"/api\")
app.register_blueprint(order_bp, url_prefix=\"/api\")
app.register_blueprint(review_bp, url_prefix=\"/api\")

# uncomment if you need to use database
app.config[\`SQLALCHEMY_DATABASE_URI\"] = f\`sqlite:///{os.path.join(os.path.dirname(__file__), \`database\`, \`app.db\`)}\`"
app.config[\`SQLALCHEMY_TRACK_MODIFICATIONS\"] = False
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route(\"/\", defaults={\`path\`: \`\")
@app.route(\"/<path:path>\")
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return \`Static folder not configured\`, 404

    if path != \`\` and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, \`index.html\")
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, \`index.html\")
        else:
            return \`index.html not found\`, 404


if __name__ == \`__main__\
    app.run(host=\`0.0.0.0\`, port=5000, debug=True)
```



### `user.py`
```python
from flask import Blueprint, jsonify, request
from src.models.user import User, db

user_bp = Blueprint(\'user\', __name__)

@user_bp.route(\'/users\', methods=[\'GET\'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route(\'/users\', methods=[\'POST\'])
def create_user():
    
    data = request.json
    user = User(username=data[\'username\'], email=data[\'email\'])
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@user_bp.route(\'/users/<int:user_id>\', methods=[\'GET\'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route(\'/users/<int:user_id>\', methods=[\'PUT\'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data.get(\'username\', user.username)
    user.email = data.get(\'email\', user.email)
    db.session.commit()
    return jsonify(user.to_dict())

@user_bp.route(\'/users/<int:user_id>\', methods=[\'DELETE\'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return \'\', 204
```



### `auth.py`
```python
from flask import Blueprint, jsonify, request, session
from src.models.user import User, db

auth_bp = Blueprint(\'auth\', __name__)

@auth_bp.route(\'/register\', methods=[\'POST\'])
def register():
    """Register a new user"""
    data = request.json
    
    # Validate required fields
    required_fields = [\'username\', \'email\', \'password\']
    for field in required_fields:
        if not data.get(field):
            return jsonify({\'error\': f\'{field} is required\'}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data[\'username\']).first():
        return jsonify({\'error\': \'Username already exists\'}), 400
    
    if User.query.filter_by(email=data[\'email\']).first():
        return jsonify({\'error\': \'Email already exists\'}), 400
    
    # Create new user
    user = User(
        username=data[\'username\'],
        email=data[\'email\'],
        first_name=data.get(\'first_name\', \'\'),
        last_name=data.get(\'last_name\', \'\'),
        phone=data.get(\'phone\', \'\')
    )
    user.set_password(data[\'password\'])
    
    db.session.add(user)
    db.session.commit()
    
    # Log user in
    session[\'user_id\'] = user.id
    session[\'username\'] = user.username
    
    return jsonify({
        \'message\': \'Registration successful\',
        \'user\': user.to_dict()
    }), 201

@auth_bp.route(\'/login\', methods=[\'POST\'])
def login():
    """Login user"""
    data = request.json
    
    username_or_email = data.get(\'username_or_email\')
    password = data.get(\'password\')
    
    if not username_or_email or not password:
        return jsonify({\'error\': \'Username/email and password are required\'}), 400
    
    # Find user by username or email
    user = User.query.filter(
        (User.username == username_or_email) | \
        (User.email == username_or_email)
    ).first()
    
    if not user or not user.check_password(password):
        return jsonify({\'error\': \'Invalid credentials\'}), 401
    
    if not user.is_active:
        return jsonify({\'error\': \'Account is deactivated\'}), 401
    
    # Log user in
    session[\'user_id\'] = user.id
    session[\'username\'] = user.username
    
    return jsonify({
        \'message\': \'Login successful\',
        \'user\': user.to_dict()
    })

@auth_bp.route(\'/logout\', methods=[\'POST\'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({\'message\': \'Logout successful\'}))

@auth_bp.route(\'/profile\', methods=[\'GET\'])
def get_profile():
    """Get current user profile"""
    user_id = session.get(\'user_id\')
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@auth_bp.route(\'/profile\', methods=[\'PUT\'])
def update_profile():
    """Update current user profile"""
    user_id = session.get(\'user_id\')
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    user = User.query.get_or_404(user_id)
    data = request.json
    
    # Update allowed fields
    user.first_name = data.get(\'first_name\', user.first_name)
    user.last_name = data.get(\'last_name\', user.last_name)
    user.phone = data.get(\'phone\', user.phone)
    
    # Update email if provided and not already taken
    new_email = data.get(\'email\')
    if new_email and new_email != user.email:
        if User.query.filter_by(email=new_email).first():
            return jsonify({\'error\': \'Email already exists\'}), 400
        user.email = new_email
    
    # Update password if provided
    new_password = data.get(\'password\')
    if new_password:
        user.set_password(new_password)
    
    db.session.commit()
    
    return jsonify({
        \'message\': \'Profile updated successfully\',
        \'user\': user.to_dict()
    })

@auth_bp.route(\'/check-auth\', methods=[\'GET\'])
def check_auth():
    """Check if user is authenticated"""
    user_id = session.get(\'user_id\')
    if not user_id:
        return jsonify({\'authenticated\': False})
    
    user = User.query.get(user_id)
    if not user or not user.is_active:
        session.clear()
        return jsonify({\'authenticated\': False})
    
    return jsonify({
        \'authenticated\': True,
        \'user\': user.to_dict()
    })

```



### `cart.py`
```python
from flask import Blueprint, jsonify, request, session
from src.models.user import CartItem, Product, User, db

cart_bp = Blueprint(\'cart\', __name__)

def get_current_user_id():
    """Get current user ID from session or return None"""
    return session.get(\'user_id\')

@cart_bp.route(\'/cart\', methods=[\'GET\'])
def get_cart():
    """Get current user\'s cart items"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    total = sum(item.product.price * item.quantity for item in cart_items if item.product)
    
    return jsonify({
        \'items\': [item.to_dict() for item in cart_items],
        \'total\': float(total),
        \'item_count\': len(cart_items)
    })

@cart_bp.route(\'/cart/add\', methods=[\'POST\'])
def add_to_cart():
    """Add item to cart"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    data = request.json
    product_id = data.get(\'product_id\')
    quantity = data.get(\'quantity\', 1)
    
    if not product_id:
        return jsonify({\'error\': \'Product ID is required\'}), 400
    
    # Check if product exists and is available
    product = Product.query.get(product_id)
    if not product or not product.is_available:
        return jsonify({\'error\': \'Product not found or unavailable\'}), 404
    
    # Check if item already exists in cart
    existing_item = CartItem.query.filter_by(
        user_id=user_id, \
        product_id=product_id\
    ).first()
    
    if existing_item:
        existing_item.quantity += quantity
        db.session.commit()
        return jsonify(existing_item.to_dict())
    else:
        cart_item = CartItem(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity\
        )
        db.session.add(cart_item)
        db.session.commit()
        return jsonify(cart_item.to_dict()), 201

@cart_bp.route(\'/cart/update/<int:item_id>\', methods=[\'PUT\'])
def update_cart_item(item_id):
    """Update cart item quantity"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    cart_item = CartItem.query.filter_by(
        id=item_id, \
        user_id=user_id\
    ).first_or_404()
    
    data = request.json
    quantity = data.get(\'quantity\', 1)
    
    if quantity <= 0:
        db.session.delete(cart_item)
    else:
        cart_item.quantity = quantity
    
    db.session.commit()
    
    if quantity <= 0:
        return \'\', 204
    else:
        return jsonify(cart_item.to_dict())

@cart_bp.route(\'/cart/remove/<int:item_id>\', methods=[\'DELETE\'])
def remove_cart_item(item_id):
    """Remove item from cart"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    cart_item = CartItem.query.filter_by(
        id=item_id, \
        user_id=user_id\
    ).first_or_404()
    
    db.session.delete(cart_item)
    db.session.commit()
    
    return \'\', 204

@cart_bp.route(\'/cart/clear\', methods=[\'DELETE\'])
def clear_cart():
    """Clear all items from cart"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return \'\', 204

@cart_bp.route(\'/cart/count\', methods=[\'GET\'])
def get_cart_count():
    """Get cart item count"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'count\': 0})
    
    count = CartItem.query.filter_by(user_id=user_id).count()
    return jsonify({\'count\': count})

```



### `order.py`
```python
from flask import Blueprint, jsonify, request, session
from src.models.user import Order, OrderItem, CartItem, Product, User, db
import uuid
from datetime import datetime

order_bp = Blueprint(\'order\', __name__)

def get_current_user_id():
    """Get current user ID from session or return None"""
    return session.get(\'user_id\')

def generate_order_number():
    """Generate unique order number"""
    timestamp = datetime.now().strftime(\'%Y%m%d%H%M%S\')
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"DG{timestamp}{random_suffix}"

@order_bp.route(\'/orders\', methods=[\'GET\'])
def get_orders():
    """Get current user\'s orders"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    page = request.args.get(\'page\', 1, type=int)
    per_page = request.args.get(\'per_page\', 10, type=int)
    
    orders = Order.query.filter_by(user_id=user_id)\
                       .order_by(Order.created_at.desc())\
                       .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        \'orders\': [order.to_dict() for order in orders.items],
        \'total\': orders.total,
        \'pages\': orders.pages,
        \'current_page\': page,
        \'per_page\': per_page
    })

@order_bp.route(\'/orders/<int:order_id>\', methods=[\'GET\'])
def get_order(order_id):
    """Get a specific order"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    order = Order.query.filter_by(id=order_id, user_id=user_id).first_or_404()
    return jsonify(order.to_dict())

@order_bp.route(\'/orders\', methods=[\'POST\'])
def create_order():
    """Create a new order from cart items"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    data = request.json
    
    # Validate required fields
    required_fields = [\'delivery_address\', \'phone_number\']
    for field in required_fields:
        if not data.get(field):
            return jsonify({\'error\': f\'{field} is required\'}), 400
    
    # Get cart items
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({\'error\': \'Cart is empty\'}), 400
    
    # Calculate total
    total_amount = sum(item.product.price * item.quantity for item in cart_items if item.product)
    
    # Create order
    order = Order(
        user_id=user_id,
        order_number=generate_order_number(),
        total_amount=total_amount,
        delivery_address=data[\'delivery_address\'],
        phone_number=data[\'phone_number\'],
        notes=data.get(\'notes\', \'\')
    )
    
    db.session.add(order)
    db.session.flush()  # Get order ID
    
    # Create order items
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            unit_price=cart_item.product.price,
            total_price=cart_item.product.price * cart_item.quantity
        )
        db.session.add(order_item)
    
    # Clear cart
    CartItem.query.filter_by(user_id=user_id).delete()
    
    db.session.commit()
    
    return jsonify(order.to_dict()), 201

@order_bp.route(\'/orders/<int:order_id>/status\', methods=[\'PUT\'])
def update_order_status(order_id):
    """Update order status (admin function)"""
    data = request.json
    new_status = data.get(\'status\')
    
    valid_statuses = [\'pending\', \'confirmed\', \'preparing\', \'ready\', \'delivered\', \'cancelled\']
    if new_status not in valid_statuses:
        return jsonify({\'error\': \'Invalid status\'}), 400
    
    order = Order.query.get_or_404(order_id)
    order.status = new_status
    db.session.commit()
    
    return jsonify(order.to_dict())

@order_bp.route(\'/orders/<int:order_id>/cancel\', methods=[\'PUT\'])
def cancel_order(order_id):
    """Cancel an order"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    order = Order.query.filter_by(id=order_id, user_id=user_id).first_or_404()
    
    # Only allow cancellation if order is still pending or confirmed
    if order.status not in [\'pending\', \'confirmed\']:
        return jsonify({\'error\': \'Order cannot be cancelled at this stage\'}), 400
    
    order.status = \'cancelled\'
    db.session.commit()
    
    return jsonify(order.to_dict())

@order_bp.route(\'/admin/orders\', methods=[\'GET\'])
def get_all_orders():
    """Get all orders (admin function)"""
    page = request.args.get(\'page\', 1, type=int)
    per_page = request.args.get(\'per_page\', 20, type=int)
    status = request.args.get(\'status\')
    
    query = Order.query
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.order_by(Order.created_at.desc())\
                  .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        \'orders\': [order.to_dict() for order in orders.items],
        \'total\': orders.total,
        \'pages\': orders.pages,
        \'current_page\': page,
        \'per_page\': per_page
    })

```



### `product.py`
```python
from flask import Blueprint, jsonify, request
from src.models.user import Product, Category, db

product_bp = Blueprint(\'product\', __name__)

@product_bp.route(\'/products\', methods=[\'GET\'])
def get_products():
    """Get all products with optional filtering"""
    category_id = request.args.get(\'category_id\', type=int)
    search = request.args.get(\'search\', \'\')
    page = request.args.get(\'page\', 1, type=int)
    per_page = request.args.get(\'per_page\', 12, type=int)
    
    query = Product.query.filter(Product.is_available == True)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if search:
        query = query.filter(Product.name.contains(search))
    
    products = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        \'products\': [product.to_dict() for product in products.items],
        \'total\': products.total,
        \'pages\': products.pages,
        \'current_page\': page,
        \'per_page\': per_page
    })

@product_bp.route(\'/products/<int:product_id>\', methods=[\'GET\'])
def get_product(product_id):
    """Get a single product by ID"""
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

@product_bp.route(\'/products\', methods=[\'POST\'])
def create_product():
    """Create a new product"""
    data = request.json
    
    product = Product(
        name=data[\'name\'],
        description=data.get(\'description\', \'\'),
        price=data[\'price\'],
        image_url=data.get(\'image_url\', \'\'),
        category_id=data[\'category_id\'],
        stock_quantity=data.get(\'stock_quantity\', 0)
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@product_bp.route(\'/products/<int:product_id>\', methods=[\'PUT\'])
def update_product(product_id):
    """Update a product"""
    product = Product.query.get_or_404(product_id)
    data = request.json
    
    product.name = data.get(\'name\', product.name)
    product.description = data.get(\'description\', product.description)
    product.price = data.get(\'price\', product.price)
    product.image_url = data.get(\'image_url\', product.image_url)
    product.category_id = data.get(\'category_id\', product.category_id)
    product.is_available = data.get(\'is_available\', product.is_available)
    product.stock_quantity = data.get(\'stock_quantity\', product.stock_quantity)
    
    db.session.commit()
    
    return jsonify(product.to_dict())

@product_bp.route(\'/products/<int:product_id>\', methods=[\'DELETE\'])
def delete_product(product_id):
    """Delete a product"""
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    
    return \'\', 204

@product_bp.route(\'/categories\', methods=[\'GET\'])
def get_categories():
    """Get all categories"""
    categories = Category.query.filter(Category.is_active == True).all()
    return jsonify([category.to_dict() for category in categories])

@product_bp.route(\'/categories/<int:category_id>\', methods=[\'GET\'])
def get_category(category_id):
    """Get a single category by ID"""
    category = Category.query.get_or_404(category_id)
    return jsonify(category.to_dict())

@product_bp.route(\'/categories\', methods=[\'POST\'])
def create_category():
    """Create a new category"""
    data = request.json
    
    category = Category(
        name=data[\'name\'],
        description=data.get(\'description\', \'\'),
        image_url=data.get(\'image_url\', \'\')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201

@product_bp.route(\'/categories/<int:category_id>\', methods=[\'PUT\'])
def update_category(category_id):
    """Update a category"""
    category = Category.query.get_or_404(category_id)
    data = request.json
    
    category.name = data.get(\'name\', category.name)
    category.description = data.get(\'description\', category.description)
    category.image_url = data.get(\'image_url\', category.image_url)
    category.is_active = data.get(\'is_active\', category.is_active)
    
    db.session.commit()
    
    return jsonify(category.to_dict())

@product_bp.route(\'/categories/<int:category_id>\', methods=[\'DELETE\'])
def delete_category(category_id):
    """Delete a category"""
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    
    return \'\', 204

@product_bp.route(\'/featured-products\', methods=[\'GET\'])
def get_featured_products():
    """Get featured products (latest or most popular)"""
    limit = request.args.get(\'limit\', 8, type=int)
    
    # Get latest products as featured
    products = Product.query.filter(Product.is_available == True)\
                           .order_by(Product.created_at.desc())\
                           .limit(limit)\
                           .all()
    
    return jsonify([product.to_dict() for product in products])

```



### `review.py`
```python
from flask import Blueprint, jsonify, request, session
from src.models.user import Review, Product, User, db

review_bp = Blueprint(\'review\', __name__)

def get_current_user_id():
    """Get current user ID from session or return None"""
    return session.get(\'user_id\')

@review_bp.route(\'/products/<int:product_id>/reviews\', methods=[\'GET\'])
def get_product_reviews(product_id):
    """Get all reviews for a product"""
    page = request.args.get(\'page\', 1, type=int)
    per_page = request.args.get(\'per_page\', 10, type=int)
    
    reviews = Review.query.filter_by(product_id=product_id)\
                         .order_by(Review.created_at.desc())\
                         .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        \'reviews\': [review.to_dict() for review in reviews.items],
        \'total\': reviews.total,
        \'pages\': reviews.pages,
        \'current_page\': page,
        \'per_page\': per_page
    })

@review_bp.route(\'/products/<int:product_id>/reviews\', methods=[\'POST\'])
def create_review(product_id):
    """Create a new review for a product"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    data = request.json
    
    # Validate required fields
    if not data.get(\'rating\') or not isinstance(data[\'rating\'], int):
        return jsonify({\'error\': \'Rating is required and must be an integer\'}), 400
    
    if data[\'rating\'] < 1 or data[\'rating\'] > 5:
        return jsonify({\'error\': \'Rating must be between 1 and 5\'}), 400
    
    # Check if product exists
    product = Product.query.get(product_id)
    if not product:
        return jsonify({\'error\': \'Product not found\'}), 404
    
    # Check if user already reviewed this product
    existing_review = Review.query.filter_by(
        user_id=user_id, \
        product_id=product_id\
    ).first()
    
    if existing_review:
        return jsonify({\'error\': \'You have already reviewed this product\'}), 400
    
    # Create review
    review = Review(
        user_id=user_id,
        product_id=product_id,
        rating=data[\'rating\'],
        comment=data.get(\'comment\', \'\')
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify(review.to_dict()), 201

@review_bp.route(\'/reviews/<int:review_id>\', methods=[\'PUT\'])
def update_review(review_id):
    """Update a review"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    review = Review.query.filter_by(id=review_id, user_id=user_id).first_or_404()
    data = request.json
    
    # Validate rating if provided
    if \'rating\' in data:
        if not isinstance(data[\'rating\'], int) or data[\'rating\'] < 1 or data[\'rating\'] > 5:
            return jsonify({\'error\': \'Rating must be an integer between 1 and 5\'}), 400
        review.rating = data[\'rating\']
    
    if \'comment\' in data:
        review.comment = data[\'comment\']
    
    db.session.commit()
    
    return jsonify(review.to_dict())

@review_bp.route(\'/reviews/<int:review_id>\', methods=[\'DELETE\'])
def delete_review(review_id):
    """Delete a review"""
    user_id = get_current_user_id()
    if not user_id:
        return jsonify({\'error\': \'Authentication required\'}), 401
    
    review = Review.query.filter_by(id=review_id, user_id=user_id).first_or_404()
    
    db.session.delete(review)
    db.session.commit()
    
    return \'\', 204

@review_bp.route(\'/users/<int:user_id>/reviews\', methods=[\'GET\'])
def get_user_reviews(user_id):
    """Get all reviews by a user"""
    current_user_id = get_current_user_id()
    
    # Only allow users to see their own reviews or make this admin-only
    if current_user_id != user_id:
        return jsonify({\'error\': \'Access denied\'}), 403
    
    page = request.args.get(\'page\', 1, type=int)
    per_page = request.args.get(\'per_page\', 10, type=int)
    
    reviews = Review.query.filter_by(user_id=user_id)\
                         .order_by(Review.created_at.desc())\
                         .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        \'reviews\': [review.to_dict() for review in reviews.items],
        \'total\': reviews.total,
        \'pages\': reviews.pages,
        \'current_page\': page,
        \'per_page\': per_page
    })

@review_bp.route(\'/reviews/recent\', methods=[\'GET\'])
def get_recent_reviews():
    """Get recent reviews across all products"""
    limit = request.args.get(\'limit\', 5, type=int)
    
    reviews = Review.query.order_by(Review.created_at.desc())\
                         .limit(limit)\
                         .all()
    
    return jsonify([review.to_dict() for review in reviews])

```



### `product.py`
```python
from flask import Blueprint, jsonify, request
from src.models.user import Product, Category, db

product_bp = Blueprint(\'product\', __name__)

@product_bp.route(\'/products\', methods=[\'GET\'])
def get_products():
    """Get all products with optional filtering"""
    category_id = request.args.get(\'category_id\', type=int)
    search = request.args.get(\'search\', \'\')
    page = request.args.get(\'page\', 1, type=int)
    per_page = request.args.get(\'per_page\', 12, type=int)
    
    query = Product.query.filter(Product.is_available == True)
    
    if category_id:
        query = query.filter(Product.category_id == category_id)
    
    if search:
        query = query.filter(Product.name.contains(search))
    
    products = query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        \'products\': [product.to_dict() for product in products.items],
        \'total\': products.total,
        \'pages\': products.pages,
        \'current_page\': page,
        \'per_page\': per_page
    })

@product_bp.route(\'/products/<int:product_id>\', methods=[\'GET\'])
def get_product(product_id):
    """Get a single product by ID"""
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

@product_bp.route(\'/products\', methods=[\'POST\'])
def create_product():
    """Create a new product"""
    data = request.json
    
    product = Product(
        name=data[\'name\'],
        description=data.get(\'description\', \'\'),
        price=data[\'price\'],
        image_url=data.get(\'image_url\', \'\'),
        category_id=data[\'category_id\'],
        stock_quantity=data.get(\'stock_quantity\', 0)
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@product_bp.route(\'/products/<int:product_id>\', methods=[\'PUT\'])
def update_product(product_id):
    """Update a product"""
    product = Product.query.get_or_404(product_id)
    data = request.json
    
    product.name = data.get(\'name\', product.name)
    product.description = data.get(\'description\', product.description)
    product.price = data.get(\'price\', product.price)
    product.image_url = data.get(\'image_url\', product.image_url)
    product.category_id = data.get(\'category_id\', product.category_id)
    product.is_available = data.get(\'is_available\', product.is_available)
    product.stock_quantity = data.get(\'stock_quantity\', product.stock_quantity)
    
    db.session.commit()
    
    return jsonify(product.to_dict())

@product_bp.route(\'/products/<int:product_id>\', methods=[\'DELETE\'])
def delete_product(product_id):
    """Delete a product"""
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    
    return \'\', 204

@product_bp.route(\'/categories\', methods=[\'GET\'])
def get_categories():
    """Get all categories"""
    categories = Category.query.filter(Category.is_active == True).all()
    return jsonify([category.to_dict() for category in categories])

@product_bp.route(\'/categories/<int:category_id>\', methods=[\'GET\'])
def get_category(category_id):
    """Get a single category by ID"""
    category = Category.query.get_or_404(category_id)
    return jsonify(category.to_dict())

@product_bp.route(\'/categories\', methods=[\'POST\'])
def create_category():
    """Create a new category"""
    data = request.json
    
    category = Category(
        name=data[\'name\'],
        description=data.get(\'description\', \'\'),
        image_url=data.get(\'image_url\', \'\')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201

@product_bp.route(\'/categories/<int:category_id>\', methods=[\'PUT\'])
def update_category(category_id):
    """Update a category"""
    category = Category.query.get_or_404(category_id)
    data = request.json
    
    category.name = data.get(\'name\', category.name)
    category.description = data.get(\'description\', category.description)
    category.image_url = data.get(\'image_url\', category.image_url)
    category.is_active = data.get(\'is_active\', category.is_active)
    
    db.session.commit()
    
    return jsonify(category.to_dict())

@product_bp.route(\'/categories/<int:category_id>\', methods=[\'DELETE\'])
def delete_category(category_id):
    """Delete a category"""
    category = Category.query.get_or_404(category_id)
    db.session.delete(category)
    db.session.commit()
    
    return \'\', 204

@product_bp.route(\'/featured-products\', methods=[\'GET\'])
def get_featured_products():
    """Get featured products (latest or most popular)"""
    limit = request.args.get(\'limit\', 8, type=int)
    
    # Get latest products as featured
    products = Product.query.filter(Product.is_available == True)\
                           .order_by(Product.created_at.desc())\
                           .limit(limit)\
                           .all()
    
    return jsonify([product.to_dict() for product in products])

```



### `user_model.py`
```python
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    addresses = db.relationship(\'Address\', backref=\'user\', lazy=True, cascade=\'all, delete-orphan\')
    orders = db.relationship(\'Order\', backref=\'user\', lazy=True)
    cart_items = db.relationship(\'CartItem\', backref=\'user\', lazy=True, cascade=\'all, delete-orphan\')
    reviews = db.relationship(\'Review\', backref=\'user\', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f\'\\<User {self.username}>\'

    def to_dict(self):
        return {
            \'id\': self.id,
            \'username\': self.username,
            \'email\': self.email,
            \'first_name\': self.first_name,
            \'last_name\': self.last_name,
            \'phone\': self.phone,
            \'created_at\': self.created_at.isoformat() if self.created_at else None,
            \'is_active\': self.is_active
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    products = db.relationship(\'Product\', backref=\'category\', lazy=True)

    def __repr__(self):
        return f\'\\<Category {self.name}>\'

    def to_dict(self):
        return {
            \'id\': self.id,
            \'name\': self.name,
            \'description\': self.description,
            \'image_url\': self.image_url,
            \'is_active\': self.is_active,
            \'created_at\': self.created_at.isoformat() if self.created_at else None,
            \'product_count\': len(self.products) if self.products else 0
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    image_url = db.Column(db.String(255))
    category_id = db.Column(db.Integer, db.ForeignKey(\'category.id\'), nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    stock_quantity = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship(\'OrderItem\', backref=\'product\', lazy=True)
    cart_items = db.relationship(\'CartItem\', backref=\'product\', lazy=True)
    reviews = db.relationship(\'Review\', backref=\'product\', lazy=True)

    def __repr__(self):
        return f\'\\<Product {self.name}>\'

    def to_dict(self):
        return {
            \'id\': self.id,
            \'name\': self.name,
            \'description\': self.description,
            \'price\': float(self.price),
            \'image_url\': self.image_url,
            \'category_id\': self.category_id,
            \'category_name\': self.category.name if self.category else None,
            \'is_available\': self.is_available,
            \'stock_quantity\': self.stock_quantity,
            \'created_at\': self.created_at.isoformat() if self.created_at else None,
            \'updated_at\': self.updated_at.isoformat() if self.updated_at else None,
            \'average_rating\': self.get_average_rating(),
            \'review_count\': len(self.reviews) if self.reviews else 0
        }
    
    def get_average_rating(self):
        if not self.reviews:
            return 0
        total_rating = sum(review.rating for review in self.reviews)
        return round(total_rating / len(self.reviews), 1)

class Address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(\'user.id\'), nullable=False)
    title = db.Column(db.String(50), nullable=False)  # Home, Work, etc.
    street_address = db.Column(db.String(255), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False, default=\'Nigeria\')
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f\'\\<Address {self.title} - {self.city}>\'

    def to_dict(self):
        return {
            \'id\': self.id,
            \'user_id\': self.user_id,
            \'title\': self.title,
            \'street_address\': self.street_address,
            \'city\': self.city,
            \'state\': self.state,
            \'postal_code\': self.postal_code,
            \'country\': self.country,
            \'is_default\': self.is_default,
            \'created_at\': self.created_at.isoformat() if self.created_at else None
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(\'user.id\'), nullable=False)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(db.String(50), nullable=False, default=\'pending\')  # pending, confirmed, preparing, ready, delivered, cancelled
    total_amount = db.Column(db.Numeric(10, 2), nullable=False)
    delivery_address = db.Column(db.Text, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    order_items = db.relationship(\'OrderItem\', backref=\'order\', lazy=True, cascade=\'all, delete-orphan\')

    def __repr__(self):
        return f\'\\<Order {self.order_number}>\'

    def to_dict(self):
        return {
            \'id\': self.id,
            \'user_id\': self.user_id,
            \'order_number\': self.order_number,
            \'status\': self.status,
            \'total_amount\': float(self.total_amount),
            \'delivery_address\': self.delivery_address,
            \'phone_number\': self.phone_number,
            \'notes\': self.notes,
            \'created_at\': self.created_at.isoformat() if self.created_at else None,
            \'updated_at\': self.updated_at.isoformat() if self.updated_at else None,
            \'items\': [item.to_dict() for item in self.order_items] if self.order_items else []
        }

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey(\'order.id\'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(\'product.id\'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False)

    def __repr__(self):
        return f\'\\<OrderItem {self.product.name} x {self.quantity}>\'

    def to_dict(self):
        return {
            \'id\': self.id,
            \'order_id\': self.order_id,
            \'product_id\': self.product_id,
            \'product_name\': self.product.name if self.product else None,
            \'quantity\': self.quantity,
            \'unit_price\': float(self.unit_price),
            \'total_price\': float(self.total_price)
        }

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(\'user.id\'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(\'product.id\'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f\'\\<CartItem {self.product.name} x {self.quantity}>\'

    def to_dict(self):
        return {
            \'id\': self.id,
            \'user_id\': self.user_id,
            \'product_id\': self.product_id,
            \'product\': self.product.to_dict() if self.product else None,
            \'quantity\': self.quantity,
            \'subtotal\': float(self.product.price * self.quantity) if self.product else 0,
            \'created_at\': self.created_at.isoformat() if self.created_at else None,
            \'updated_at\': self.updated_at.isoformat() if self.updated_at else None
        }

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(\'user.id\'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(\'product.id\'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f\'\\<Review {self.rating} stars for {self.product.name}>\'

    def to_dict(self):
        return {
            \'id\': self.id,
            \'user_id\': self.user_id,
            \'user_name\': f\"\\"{self.user.first_name} {self.user.last_name}\\"".strip() or self.user.username if self.user else None,
            \'product_id\': self.product_id,
            \'product_name\': self.product.name if self.product else None,
            \'rating\': self.rating,
            \'comment\': self.comment,
            \'created_at\': self.created_at.isoformat() if self.created_at else None,
            \'updated_at\': self.updated_at.isoformat() if self.updated_at else None
        }

```


