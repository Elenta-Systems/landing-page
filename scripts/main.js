// Language Toggle Functionality
let currentLang = 'en';
const html = document.documentElement;
const langEnBtn = document.getElementById('lang-en');
const langArBtn = document.getElementById('lang-ar');

function scrollToElement(target) {
    if (!target) return;

    if (window.gsapSmoother && typeof window.gsapSmoother.scrollTo === 'function') {
        window.gsapSmoother.scrollTo(target, true, "top top");
    } else {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function updateLanguage(lang) {
    currentLang = lang;
    
    // Update HTML attributes
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update font family
    if (lang === 'ar') {
        document.body.classList.remove('font-inter');
        document.body.classList.add('font-kufi');
    } else {
        document.body.classList.remove('font-kufi');
        document.body.classList.add('font-inter');
    }
    
    // Update button states
    if (lang === 'en') {
        langEnBtn.classList.add('bg-white', 'text-primary', 'shadow-sm');
        langEnBtn.classList.remove('text-gray-600');
        langArBtn.classList.remove('bg-white', 'text-primary', 'shadow-sm');
        langArBtn.classList.add('text-gray-600');
    } else {
        langArBtn.classList.add('bg-white', 'text-primary', 'shadow-sm');
        langArBtn.classList.remove('text-gray-600');
        langEnBtn.classList.remove('bg-white', 'text-primary', 'shadow-sm');
        langEnBtn.classList.add('text-gray-600');
    }
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-en][data-ar]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-placeholder-en][data-placeholder-ar]');
    placeholderElements.forEach(element => {
        const placeholder = element.getAttribute(`data-placeholder-${lang}`);
        if (placeholder) {
            element.setAttribute('placeholder', placeholder);
        }
    });
}

// Initialize language toggle event listeners
function initLanguageToggle() {
    langEnBtn.addEventListener('click', () => updateLanguage('en'));
    langArBtn.addEventListener('click', () => updateLanguage('ar'));
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                scrollToElement(target);
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
    });
}

// Contact Form Submission
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return; // Exit if contact form doesn't exist on this page
    
    contactForm.addEventListener('submit', function(e) {
        // Get form data for validation
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            e.preventDefault();
            alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
            return;
        }
        
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            alert(currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
        submitBtn.disabled = true;
        
        // Show success toast after a short delay (form will submit normally)
        setTimeout(() => {
            showSuccessToast();
        }, 500);
        
        // The form will submit normally to FormSubmit
        // FormSubmit will redirect back to the page with the _next parameter
    });
}

function showSuccessToast() {
    const toast = document.getElementById('success-toast');
    if (!toast) return; // Exit if success toast doesn't exist on this page
    
    const toastMessage = toast.querySelector('.toast-message');
    
    // Update toast message based on current language
    toastMessage.textContent = toastMessage.getAttribute(`data-${currentLang}`);
    
    // Show toast
    toast.classList.remove('translate-x-full');
    toast.classList.add('translate-x-0');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('translate-x-0');
        toast.classList.add('translate-x-full');
    }, 3000);
}

// CTA Button Click Handler
function initCtaButton() {
    const ctaBtns = document.querySelectorAll('.cta-btn');
    ctaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                scrollToElement(contactSection);
            } else {
                // If contact section doesn't exist on this page, redirect to index.html#contact
                window.location.href = 'index.html#contact';
            }
        });
    });
    
    // Learn More Button Handler
    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            const servicesSection = document.querySelector('#services');
            if (servicesSection) {
                scrollToElement(servicesSection);
            } else {
                // If services section doesn't exist on this page, redirect to index.html#services
                window.location.href = 'index.html#services';
            }
        });
    }
}

// Newsletter Subscription Handler
function initNewsletterForm() {
    const newsletterForm = document.querySelector('form');
    const newsletterForms = document.querySelectorAll('form');
    
    newsletterForms.forEach(form => {
        // Skip the contact form
        if (form.id === 'contact-form') return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Simple email validation
            if (!email || !email.includes('@')) {
                alert(currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email');
                return;
            }
            
            // Simulate newsletter subscription
            submitBtn.textContent = currentLang === 'ar' ? 'جاري الاشتراك...' : 'Subscribing...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Show success message
                alert(currentLang === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    });
}

// Statistics Counter Animation
function initStatsAnimation() {
    const stats = document.querySelectorAll('.text-2xl.sm\\:text-3xl');
    
    const animateStats = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetText = target.textContent;
                const targetNumber = parseInt(targetText);
                
                if (!isNaN(targetNumber)) {
                    let current = 0;
                    const increment = targetNumber / 30;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= targetNumber) {
                            target.textContent = targetText;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current) + targetText.replace(/\d+/, '');
                        }
                    }, 50);
                }
            }
        });
    };
    
    const observer = new IntersectionObserver(animateStats, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Enhanced Scroll Animations (Fade-in removed)
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Just add a simple class for visibility, no fade animation
                entry.target.classList.add('visible');
                
                // Add staggered hover effects for grid items
                if (entry.target.parentElement.classList.contains('grid')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.05}s`;
                }
            }
        });
    }, observerOptions);

    // Observe multiple elements
    document.querySelectorAll('.service-card, .feature-card, .testimonial-card, .industry-card, .faq-item, .process-card').forEach(card => {
        observer.observe(card);
    });
}

// Parallax Effect for Hero Section
function initParallaxEffect() {
    const hero = document.querySelector('#home');
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero && scrolled < hero.offsetHeight) {
            shapes.forEach((shape, index) => {
                const speed = 0.2 + (index * 0.1);
                shape.style.transform = `translateY(${rate * speed}px)`;
            });
        }
    });
}

// Sticky Navigation Behavior
function initStickyNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return; // Exit if navbar doesn't exist on this page
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.remove('-translate-y-full');
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.add('-translate-y-full');
            navbar.classList.remove('shadow-lg');
        }
    });
}

// Service Cards Enhancement
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle tilt effect
            card.style.transform = 'translateY(-8px) rotateX(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0deg)';
        });
    });
}

// Image Modal Functionality
function initImageModal() {
    // Create modal elements
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.className = 'fixed inset-0 bg-black/90 z-50 hidden flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="relative max-w-4xl max-h-full">
            <img id="modal-image" src="" alt="" class="max-w-full max-h-full object-contain rounded-lg">
            <button id="close-modal" class="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center">
                ×
            </button>
        </div>
    `;
    document.body.appendChild(modal);

    // Add click handlers to all images in project sections
    const projectImages = document.querySelectorAll('.project-detail img');
    projectImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const modalImg = document.getElementById('modal-image');
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal functionality
    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    document.getElementById('close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initLanguageToggle();
    initMobileMenu();
    initSmoothScrolling();
    initHeaderScrollEffect();
    initContactForm();
    initCtaButton();
    initScrollAnimations();
    initNewsletterForm();
    initStatsAnimation();
    initParallaxEffect();
    initStickyNavigation();
    initServiceCards();
    initImageModal(); // Add the new image modal functionality
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Enhanced mobile touch gestures
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
});
