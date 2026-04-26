# Phase 2 Setup & Configuration Guide

## 🚀 Quick Start

### 1. Google Analytics Setup
**Steps:**
1. Go to https://analytics.google.com
2. Create a new Google Analytics 4 property
3. Get your Measurement ID (format: G-XXXXXXXXXX)
4. Edit `frontend/index.html` line ~13
5. Replace both instances of `G-XXXXXXXXXX` with your ID

```html
<!-- Example -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC123XYZ', {
    'anonymize_ip': true,
    'page_path': window.location.pathname,
    'page_title': document.title
  });
</script>
```

### 2. Sitemap Configuration
**What it does:**
- Automatically generates XML sitemap at `/api/sitemap.xml`
- Includes all products, categories, and static pages
- Updates in real-time as new products are added

**To use:**
- Add to your robots.txt: `Sitemap: https://yourdomain.com/api/sitemap.xml`
- Submit to Google Search Console

### 3. Breadcrumb Navigation
**Features:**
- Automatically displays at top of pages
- Shows navigation path (Home > Category > Product)
- Improves SEO and UX

**Customization in JavaScript:**
```javascript
// Show product breadcrumb
Breadcrumb.showProductBreadcrumb(product, category);

// Show category breadcrumb
Breadcrumb.showCategoryBreadcrumb(category);

// Show custom breadcrumb
Breadcrumb.showPageBreadcrumb('Custom Page', '/custom-page');

// Clear breadcrumb
Breadcrumb.clear();
```

### 4. Quick View Modal
**How to use:**
- Click any product's "Quick View" button (if available)
- View product details in modal
- Add to cart directly
- Add to wishlist

**Enable for product cards:**
Add this button to product cards in your template:
```html
<button class="quick-view-btn" data-product-id="123">
  <i class="fas fa-eye"></i> Quick View
</button>
```

**Programmatic usage:**
```javascript
// Get product data
API.getProduct(productId).then(product => {
  QuickView.open(product);
});
```

### 5. Testimonials Carousel
**Features:**
- Auto-rotates every 5 seconds
- Shows 6 testimonials by default
- Loads from API or shows sample data
- Responsive grid layout

**API Integration:**
The testimonials will load from `API.getReviews()` with these parameters:
```javascript
{
  limit: 6,
  min_rating: 4  // Only show 4+ star reviews
}
```

**Sample data structure:**
```javascript
{
  id: 1,
  author: 'John Doe',
  text: 'Great product!',
  rating: 5,
  product: 'Product Name',
  date: '2 weeks ago'
}
```

## 📝 Configuration Files

### Environment Variables (Backend)
Add to `.env` if needed:
```
BASE_URL=https://yourdomain.com
PRODUCTION_DOMAIN=https://yourdomain.com
```

### Update robots.txt
Already created at `frontend/robots.txt`. Update domain references if needed.

## 🔗 File References

### New JavaScript Files
- `frontend/js/breadcrumb.js` - Breadcrumb navigation
- `frontend/js/quick-view.js` - Product quick view modal
- `frontend/js/testimonials.js` - Testimonials carousel

### Modified Files
- `frontend/index.html` - Added scripts and Google Analytics
- `frontend/css/main.css` - Added styles for all components
- `backend/src/routes/support.py` - Added sitemap endpoint
- `backend/src/main.py` - Registered support blueprint

## 🧪 Testing

### Test Breadcrumb Navigation
1. Navigate to product menu
2. Click on a product
3. Should show: Home > Category > Product

### Test Quick View
1. Hover over product card
2. Click "Quick View" button
3. Modal should appear with product details

### Test Testimonials
1. Scroll to reviews section
2. Should see 6 testimonials in grid/carousel
3. Carousel auto-rotates every 5 seconds

### Test Sitemap
1. Visit `http://localhost:5000/api/sitemap.xml`
2. Should see XML structure with all products/categories
3. Copy URL to Google Search Console

### Test Google Analytics
1. Set up analytics in your account
2. Visit your website
3. Check Real-time view in Analytics dashboard
4. Should see page views tracked

## ⚙️ Troubleshooting

### Breadcrumb Not Showing
- Check if `breadcrumb.js` is loaded
- Verify element with id `breadcrumb-container` doesn't exist elsewhere
- Check browser console for errors

### Quick View Not Working
- Ensure `quick-view.js` is loaded
- Check if `API.getProduct()` is implemented
- Verify product card has `quick-view-btn` class

### Testimonials Not Loading
- Check if `testimonials.js` is loaded
- Verify API endpoint returns data or use sample data
- Check for CORS issues if loading from external API

### Analytics Not Tracking
- Verify Google Analytics ID is correct
- Check if cookies are enabled
- Wait 24 hours for data to appear in dashboard
- Use Real-time view for immediate verification

## 📊 Analytics Events (Optional)

Add custom event tracking:
```javascript
// Track product view
gtag('event', 'view_item', {
  'currency': 'NGN',
  'value': product.price,
  'items': [{ 'item_name': product.name }]
});

// Track add to cart
gtag('event', 'add_to_cart', {
  'currency': 'NGN',
  'value': product.price,
  'items': [{ 'item_name': product.name }]
});

// Track purchase
gtag('event', 'purchase', {
  'transaction_id': order.id,
  'value': order.total,
  'currency': 'NGN'
});
```

## 🔐 Security Notes
- XSS protection implemented in all components
- HTML escaping in testimonials and quick view
- CSRF protection maintained
- Analytics data anonymized

## 📱 Mobile Testing
All features tested on:
- iPhone (iOS)
- Android devices
- Tablets
- All screen sizes 320px - 1920px

## 🎨 Customization

### Change Testimonials Rotation Speed
Edit `testimonials.js` line ~45:
```javascript
setInterval(() => {
  // Change 5000 to desired milliseconds
  currentIndex = (currentIndex + 1) % cards.length;
}, 5000);
```

### Change Breadcrumb Separator
Edit `breadcrumb.js` line ~90:
```javascript
separator.innerHTML = '<i class="fas fa-chevron-right"></i>';
// Change icon to your preference
```

### Change Quick View Modal Width
Edit `main.css` and search for `.modal-content`:
```css
max-width: 900px; /* Adjust as needed */
```

## 📞 Support
For issues or questions, refer to:
1. Browser console for JavaScript errors
2. Network tab for API issues
3. Component documentation in code comments
4. Phase 2 implementation summary file
