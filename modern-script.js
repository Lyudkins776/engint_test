/**
 * Modern JavaScript for ENGINT Website
 * Optimized for performance and modern browser features
 */

class EngintWebsite {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupIntersectionObservers();
        this.initializeComponents();
    }

    init() {
        // Modern browser detection
        this.supportsIntersectionObserver = 'IntersectionObserver' in window;
        this.supportsWebP = this.checkWebPSupport();
        this.isMobile = window.innerWidth <= 768;
        
        // Performance optimizations
        this.debounceTimer = null;
        this.throttleTimer = null;
        
        // Component states
        this.carousel = {
            currentSlide: 0,
            totalSlides: 0,
            autoplayInterval: null,
            isPlaying: true
        };
        
        this.portfolio = {
            currentFilter: 'all',
            items: []
        };
        
        this.navigation = {
            isOpen: false,
            scrolled: false
        };
        
        console.log('🚀 ENGINT Website initialized');
    }

    bindEvents() {
        // Modern event listeners with passive optimization
        document.addEventListener('DOMContentLoaded', () => this.onDOMReady(), { once: true });
        window.addEventListener('scroll', () => this.throttle(this.handleScroll.bind(this), 16), { passive: true });
        window.addEventListener('resize', () => this.debounce(this.handleResize.bind(this), 250), { passive: true });
        
        // Navigation events
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => this.toggleNavigation());
            
            // Close navigation when clicking on links
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (this.isMobile) this.closeNavigation();
                    
                    const target = link.getAttribute('href');
                    if (target && target.startsWith('#')) {
                        this.smoothScrollTo(target);
                        
                        // Aggiorna URL senza reload
                        if (history.pushState) {
                            history.pushState(null, null, target);
                        }
                    }
                });
            });
        }
        
        // Smooth scroll for all internal links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (target) {
                    this.smoothScrollTo(target);
                    
                    // Chiudi menu mobile se aperto
                    if (this.navigation.isOpen) {
                        this.closeNavigation();
                    }
                    
                    // Aggiorna URL
                    if (history.pushState) {
                        history.pushState(null, null, target);
                    }
                }
            });
        });
        
        // Service toggles with modern approach
        document.querySelectorAll('.service-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.toggleServiceDetails(e.target.closest('.service-card')));
        });
        
        // Portfolio filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterPortfolio(e.target.dataset.filter));
        });
        
        // Portfolio modals
        document.querySelectorAll('.portfolio-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.openPortfolioModal(e.target));
        });
        
        // Contact form
        const sendEmailBtn = document.getElementById('send-email');
        const objettoSelect = document.getElementById('oggetto');
        
        if (objettoSelect) {
            objettoSelect.addEventListener('change', () => this.toggleFileUpload());
        }
        
        if (sendEmailBtn) {
            sendEmailBtn.addEventListener('click', () => this.handleContactForm());
        }
        
        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
                this.closeModal();
            }
        });
        
        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                if (this.navigation.isOpen) this.closeNavigation();
            }
        });
        
        // Gestione hash URL al caricamento
        window.addEventListener('load', () => {
            if (window.location.hash) {
                setTimeout(() => {
                    this.smoothScrollTo(window.location.hash);
                }, 100);
            }
        });
        
        // Gestione cambiamenti hash
        window.addEventListener('hashchange', () => {
            if (window.location.hash) {
                this.smoothScrollTo(window.location.hash);
            }
        });
    }

    onDOMReady() {
        // Initialize components when DOM is ready
        this.setupCarousel();
        this.initializePortfolio();
        this.setupAnimations();
        this.optimizeImages();
        
        // Add loaded class for animations
        document.body.classList.add('loaded');
        
        // Preload critical images
        this.preloadImages([
            'img/fotoCimolai.jpg',
            'img/fiumicino.jpg'
        ]);
    }

    // Modern utility functions
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => func.apply(this, args), wait);
        };
    }

    throttle(func, limit) {
        return (...args) => {
            if (!this.throttleTimer) {
                this.throttleTimer = setTimeout(() => {
                    func.apply(this, args);
                    this.throttleTimer = null;
                }, limit);
            }
        };
    }

    // Navigation Management
    toggleNavigation() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        this.navigation.isOpen = !this.navigation.isOpen;
        
        navMenu?.classList.toggle('active');
        navToggle?.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navigation.isOpen ? 'hidden' : '';
        
        // Accessibility
        navToggle?.setAttribute('aria-expanded', this.navigation.isOpen);
        navMenu?.setAttribute('aria-hidden', !this.navigation.isOpen);
    }

    closeNavigation() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        this.navigation.isOpen = false;
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
        document.body.style.overflow = '';
        
        navToggle?.setAttribute('aria-expanded', 'false');
        navMenu?.setAttribute('aria-hidden', 'true');
    }

    // Scroll Handling
    handleScroll() {
        const scrollY = window.pageYOffset;
        const navbar = document.getElementById('navbar');
        
        // Navbar background opacity
        if (scrollY > 100 !== this.navigation.scrolled) {
            this.navigation.scrolled = scrollY > 100;
            navbar?.classList.toggle('scrolled', this.navigation.scrolled);
        }
        
        // Update active navigation link
        this.updateActiveNavLink();
        
        // Parallax effects (performance optimized)
        this.applyParallaxEffects(scrollY);
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollY = window.pageYOffset + 150; // Aumentato offset per migliore rilevamento
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const sectionId = href.substring(1);
                link.classList.toggle('active', sectionId === current);
            }
        });
    }

    applyParallaxEffects(scrollY) {
        if (this.isMobile) return; // Disable on mobile for performance
        
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            const speed = scrollY * 0.5;
            heroImage.style.transform = `translate3d(0, ${speed}px, 0)`;
        }
    }

    handleResize() {
        this.isMobile = window.innerWidth <= 768;
        
        // Close mobile menu on resize to desktop
        if (!this.isMobile && this.navigation.isOpen) {
            this.closeNavigation();
        }
        
        // Recalculate carousel dimensions
        this.setupCarousel();
    }

    // Smooth Scrolling - CORRETTO
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) {
            console.warn(`Elemento ${target} non trovato`);
            return;
        }
        
        const offsetTop = element.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // Service Details Toggle
    toggleServiceDetails(card) {
        const toggle = card.querySelector('.service-toggle');
        const details = card.querySelector('.service-details');
        const icon = toggle.querySelector('.toggle-icon');
        
        const isOpen = toggle.classList.contains('active');
        
        // Close all other service details
        document.querySelectorAll('.service-card').forEach(otherCard => {
            if (otherCard !== card) {
                const otherToggle = otherCard.querySelector('.service-toggle');
                const otherDetails = otherCard.querySelector('.service-details');
                
                otherToggle?.classList.remove('active');
                otherDetails?.classList.remove('show');
            }
        });
        
        // Toggle current service
        toggle.classList.toggle('active');
        details.classList.toggle('show');
        
        // Accessibility
        toggle.setAttribute('aria-expanded', !isOpen);
        details.setAttribute('aria-hidden', isOpen);
    }

    // Portfolio Management
    initializePortfolio() {
        this.portfolio.items = Array.from(document.querySelectorAll('.portfolio-item'));
        this.filterPortfolio('all'); // Initialize with all items visible
    }

    filterPortfolio(filter) {
        if (this.portfolio.currentFilter === filter) return;
        
        this.portfolio.currentFilter = filter;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Filter items with smooth animation
        this.portfolio.items.forEach((item, index) => {
            const category = item.dataset.category;
            const shouldShow = filter === 'all' || category === filter;
            
            // Stagger animation for better UX
            setTimeout(() => {
                if (shouldShow) {
                    item.classList.remove('hidden');
                    item.style.transform = 'scale(1)';
                    item.style.opacity = '1';
                } else {
                    item.classList.add('hidden');
                    item.style.transform = 'scale(0.8)';
                    item.style.opacity = '0';
                }
            }, index * 50);
        });
    }

    openPortfolioModal(btn) {
        const modal = document.getElementById('portfolio-modal');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        
        if (modal && modalImage && modalTitle && modalDescription) {
            modalImage.src = btn.dataset.img;
            modalImage.alt = btn.dataset.title;
            modalTitle.textContent = btn.dataset.title;
            modalDescription.textContent = btn.dataset.desc;
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus trap for accessibility
            modalImage.focus();
        }
    }

    closeModal() {
        const modal = document.getElementById('portfolio-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Carousel Management
    setupCarousel() {
        const track = document.getElementById('carouselTrack');
        const slides = track?.querySelectorAll('.carousel-slide');
        const dotsContainer = document.getElementById('carouselDots');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!track || !slides.length) return;
        
        this.carousel.totalSlides = slides.length;
        
        // Create dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < this.carousel.totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Slide ${i + 1}`);
                dot.addEventListener('click', () => this.goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        
        // Carousel controls
        prevBtn?.addEventListener('click', () => this.previousSlide());
        nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe support for mobile
        this.setupCarouselSwipe(track);
        
        // Autoplay
        this.startCarouselAutoplay();
        
        // Pause on hover (desktop only)
        if (!this.isMobile) {
            track.addEventListener('mouseenter', () => this.pauseCarouselAutoplay());
            track.addEventListener('mouseleave', () => this.startCarouselAutoplay());
        }
    }

    setupCarouselSwipe(track) {
        let startX = 0;
        let startY = 0;
        let moveX = 0;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            moveX = e.touches[0].clientX - startX;
        }, { passive: true });
        
        track.addEventListener('touchend', () => {
            const threshold = 50;
            
            if (Math.abs(moveX) > threshold) {
                if (moveX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
            
            moveX = 0;
        });
    }

    goToSlide(index) {
        const track = document.getElementById('carouselTrack');
        const dots = document.querySelectorAll('.dot');
        
        if (!track) return;
        
        this.carousel.currentSlide = index;
        const translateX = -index * 100;
        
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    nextSlide() {
        const nextIndex = (this.carousel.currentSlide + 1) % this.carousel.totalSlides;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.carousel.currentSlide - 1 + this.carousel.totalSlides) % this.carousel.totalSlides;
        this.goToSlide(prevIndex);
    }

    startCarouselAutoplay() {
        if (!this.carousel.isPlaying) return;
        
        this.carousel.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // 5 seconds
    }

    pauseCarouselAutoplay() {
        clearInterval(this.carousel.autoplayInterval);
    }

    // Contact Form
    toggleFileUpload() {
        const fileUpload = document.getElementById('file-upload');
        const oggetto = document.getElementById('oggetto');
        
        if (fileUpload && oggetto) {
            const showFileUpload = oggetto.value === 'invio-cv';
            fileUpload.classList.toggle('hidden', !showFileUpload);
            
            // Reset file input if hiding
            if (!showFileUpload) {
                const fileInput = fileUpload.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
            }
        }
    }

    async handleContactForm() {
        const form = document.getElementById('contact-form');
        const btn = document.getElementById('send-email');
        
        if (!form || !btn) return;
        
        // Validate form
        const formData = new FormData(form);
        const nome = formData.get('nome');
        const email = formData.get('email');
        const oggetto = formData.get('oggetto');
        
        if (!nome || !email || !oggetto) {
            this.showNotification('Compila tutti i campi obbligatori', 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Inserisci un indirizzo email valido', 'error');
            return;
        }
        
        // Show loading state
        const originalText = btn.innerHTML;
        btn.innerHTML = `
            <span>Invio in corso...</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
        `;
        btn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Create mailto link as fallback
            const subject = encodeURIComponent(`ENGINT - ${oggetto}`);
            const body = encodeURIComponent(
                `Nome: ${nome}\nEmail: ${email}\nOggetto: ${oggetto}\n\nMessaggio:\n${formData.get('messaggio') || ''}`
            );
            
            window.location.href = `mailto:info@engint.it?subject=${subject}&body=${body}`;
            
            this.showNotification('Messaggio inviato con successo!', 'success');
            form.reset();
            this.toggleFileUpload();
            
        } catch (error) {
            console.error('Error sending email:', error);
            this.showNotification('Errore nell\'invio. Riprova più tardi.', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close" aria-label="Chiudi notifica">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
        
        // Add notification styles dynamically
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    max-width: 400px;
                    backdrop-filter: blur(10px);
                }
                .notification--success { background: linear-gradient(135deg, #10b981, #059669); }
                .notification--error { background: linear-gradient(135deg, #ef4444, #dc2626); }
                .notification--info { background: linear-gradient(135deg, #3b82f6, #2563eb); }
                .notification.show { transform: translateX(0); }
                .notification__content { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
                .notification__close { background: none; border: none; color: white; cursor: pointer; padding: 0; display: flex; }
                .notification__close:hover { opacity: 0.7; }
                @media (max-width: 768px) {
                    .notification { right: 10px; left: 10px; max-width: none; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto hide after 5 seconds
        const autoHideTimer = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification__close').addEventListener('click', () => {
            clearTimeout(autoHideTimer);
            this.hideNotification(notification);
        });
    }

    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Animation and Intersection Observer Setup
    setupIntersectionObservers() {
        if (!this.supportsIntersectionObserver) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animateObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll(`
            .section-header,
            .storia-text,
            .storia-image,
            .mission-text,
            .mission-image,
            .service-card,
            .team-member,
            .portfolio-item
        `);
        
        elementsToAnimate.forEach(el => animateObserver.observe(el));
    }

    setupAnimations() {
        // Add CSS for animations if not present
        if (!document.querySelector('#animation-styles')) {
            const styles = document.createElement('style');
            styles.id = 'animation-styles';
            styles.textContent = `
                .animate-in {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), 
                               transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .animate-in.animate-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .loaded .hero-content {
                    animation: fadeInUp 1s ease-out;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Performance Optimizations
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => resolve(webP.height === 2);
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    preloadImages(imageUrls) {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    optimizeImages() {
        // Lazy loading for images (modern browsers)
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
        
        // Add loading attribute to all images
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    }

    // Public API methods
    updateCarousel(direction) {
        if (direction === 'next') {
            this.nextSlide();
        } else if (direction === 'prev') {
            this.previousSlide();
        }
    }

    filterPortfolioItems(category) {
        this.filterPortfolio(category);
    }

    scrollToSection(sectionId) {
        this.smoothScrollTo(`#${sectionId}`);
    }
}

// Initialize the website when DOM is ready
const engintWebsite = new EngintWebsite();

// Expose some methods globally for potential external use
window.EngintWebsite = {
    scrollTo: (section) => engintWebsite.scrollToSection(section),
    filterPortfolio: (category) => engintWebsite.filterPortfolioItems(category),
    updateCarousel: (direction) => engintWebsite.updateCarousel(direction)
};

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => console.log('SW registered:', registration))
        .catch(error => console.log('SW registration failed:', error));
}

// Performance monitoring (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Monitor performance
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }
    });
}
// Scroll to bottom button
const scrollBtn = document.getElementById("scroll-bottom");

if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth"
    });
  });
}
