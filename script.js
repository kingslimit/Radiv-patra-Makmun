// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== ACTIVE NAVIGATION ====================
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ==================== HERO SLIDER ====================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

// Auto slide every 5 seconds
if (slides.length > 0) {
    setInterval(nextSlide, 5000);
}

// ==================== PRODUCT FILTER ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Filter products
        productCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ==================== CONTACT FORM VALIDATION ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Check if all fields are filled
        if (name === '' || email === '' || message === '') {
            showNotification('Semua field harus diisi!', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Format email tidak valid!', 'error');
            return;
        }

        // Success
        showNotification('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.', 'success');
        contactForm.reset();
    });
}

// ==================== SHOPPING CART FUNCTIONALITY ====================
let cart = JSON.parse(localStorage.getItem('sneakerhub-cart')) || [];

const cartIcon = document.getElementById('cartIcon');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const checkoutBtn = document.getElementById('checkoutBtn');

// Update cart badge
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        // Hide badge if empty
        if (totalItems === 0) {
            cartBadge.style.display = 'none';
        } else {
            cartBadge.style.display = 'flex';
        }
    }
}

// Update cart display
function updateCartDisplay() {
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Keranjang belanja Anda kosong</p>';
            if (cartTotal) cartTotal.textContent = 'Rp 0';
            if (checkoutBtn) checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
                        <div class="cart-item-controls">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="cart-item-qty">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            if (cartTotal) cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
            if (checkoutBtn) checkoutBtn.disabled = false;
        }
    }
}

// Add to cart function
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('sneakerhub-cart', JSON.stringify(cart));
    updateCartBadge();
    updateCartDisplay();
    showNotification('Produk berhasil ditambahkan ke keranjang!', 'success');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('sneakerhub-cart', JSON.stringify(cart));
            updateCartBadge();
            updateCartDisplay();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('sneakerhub-cart', JSON.stringify(cart));
    updateCartBadge();
    updateCartDisplay();
    showNotification('Produk dihapus dari keranjang', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f56565' : type === 'success' ? '#48bb78' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        font-weight: 500;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Event listeners for cart
if (cartIcon && cartModal) {
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('show');
    });

    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('show');
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('show');
        }
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            showNotification('Terima kasih! Pesanan Anda sedang diproses.', 'success');
            cart = [];
            localStorage.setItem('sneakerhub-cart', JSON.stringify(cart));
            updateCartBadge();
            updateCartDisplay();
            if (cartModal) cartModal.classList.remove('show');
        }
    });
}

// Add to cart buttons for product listing
document.addEventListener('DOMContentLoaded', function() {
    // For product listing page
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const product = {
                id: parseInt(this.dataset.id),
                name: this.dataset.name,
                price: parseInt(this.dataset.price),
                image: this.dataset.image
            };
            addToCart(product);
        });
    });
    
    // For product detail page
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if size is selected
            const selectedSize = document.querySelector('.size-btn.active');
            if (!selectedSize) {
                const sizeWarning = document.getElementById('sizeWarning');
                if (sizeWarning) {
                    sizeWarning.style.display = 'flex';
                    setTimeout(() => {
                        sizeWarning.style.display = 'none';
                    }, 3000);
                }
                showNotification('Silakan pilih ukuran terlebih dahulu!', 'error');
                return;
            }
            
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            const selectedCondition = document.querySelector('.condition-tab.active');
            const condition = selectedCondition ? selectedCondition.dataset.condition : 'brandnew';
            const size = selectedSize.dataset.size;
            
            const product = {
                id: Date.now(), // Unique ID for this variant
                name: `New Balance 530 White Silver Navy - ${size} (${condition})`,
                price: 850000,
                image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop',
                size: size,
                condition: condition,
                quantity: quantity
            };
            addToCart(product);
        });
    }
    
    // Size selection functionality
    const sizeButtons = document.querySelectorAll('.size-btn:not(.sold-out)');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Hide size warning if shown
            const sizeWarning = document.getElementById('sizeWarning');
            if (sizeWarning) {
                sizeWarning.style.display = 'none';
            }
        });
    });
    
    // Condition tabs functionality
    const conditionTabs = document.querySelectorAll('.condition-tab');
    conditionTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            conditionTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Quantity selector functionality
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const quantityInput = document.getElementById('quantity');
    
    if (qtyMinus && qtyPlus && quantityInput) {
        qtyMinus.addEventListener('click', function() {
            let currentQty = parseInt(quantityInput.value);
            if (currentQty > 1) {
                quantityInput.value = currentQty - 1;
            }
        });
        
        qtyPlus.addEventListener('click', function() {
            let currentQty = parseInt(quantityInput.value);
            if (currentQty < 10) {
                quantityInput.value = currentQty + 1;
            }
        });
    }
    
    // Thumbnail image functionality
    const thumbs = document.querySelectorAll('.thumb');
    const mainImage = document.getElementById('mainImage');
    
    if (thumbs.length > 0 && mainImage) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                thumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // In a real app, you would change the main image source
                // mainImage.querySelector('img').src = this.src;
            });
        });
    }
    
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Close all accordions
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.display = 'none';
                h.querySelector('i').className = 'fas fa-plus';
            });
            
            // If wasn't active, open this one
            if (!isActive) {
                this.classList.add('active');
                content.style.display = 'block';
                icon.className = 'fas fa-minus';
            }
        });
    });
    
    // Share buttons functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList[1];
            const productUrl = window.location.href;
            const productName = 'New Balance 530 White Silver Navy';
            
            let shareUrl = '';
            switch(platform) {
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=Check out this product: ${productName} - ${productUrl}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(productUrl)}`;
                    break;
                case 'copy':
                    navigator.clipboard.writeText(productUrl).then(() => {
                        showNotification('Link berhasil disalin!', 'success');
                    });
                    return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // Initialize cart display
    updateCartBadge();
    updateCartDisplay();
});

// ==================== SCROLL TO TOP BUTTON ====================
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);