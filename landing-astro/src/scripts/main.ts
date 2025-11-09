import { translations } from '../i18n/translations';

type SupportedLang = 'en' | 'ar';

declare global {
  interface Window {
    gsapSmoother?: {
      scrollTo: (target: Element, smooth?: boolean, position?: string) => void;
    };
  }
}

let currentLang: SupportedLang = 'en';
const html = document.documentElement;
const langEnBtn = document.getElementById('lang-en') as HTMLButtonElement | null;
const langArBtn = document.getElementById('lang-ar') as HTMLButtonElement | null;

function applyTranslationsFromDictionary() {
  const textElements = document.querySelectorAll<HTMLElement>('[data-en]');
  textElements.forEach((element) => {
    const key = element.getAttribute('data-en');
    if (!key) return;
    const entry = translations[key];
    if (!entry) return;

    element.setAttribute('data-en', entry.en);
    element.setAttribute('data-ar', entry.ar);

    if (currentLang === 'en' && element.children.length === 0 && element.textContent?.trim() !== entry.en) {
      element.textContent = entry.en;
    }
  });

  const placeholderElements = document.querySelectorAll<HTMLElement>('[data-placeholder-en]');
  placeholderElements.forEach((element) => {
    const key = element.getAttribute('data-placeholder-en');
    if (!key) return;
    const entry = translations[`placeholder::${key}`];
    if (!entry) return;

    element.setAttribute('data-placeholder-en', entry.en);
    element.setAttribute('data-placeholder-ar', entry.ar);

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const placeholder = currentLang === 'ar' ? entry.ar : entry.en;
      element.placeholder = placeholder;
    }
  });
}

function scrollToElement(target: Element | null) {
  if (!target) return;

  if (window.gsapSmoother && typeof window.gsapSmoother.scrollTo === 'function') {
    window.gsapSmoother.scrollTo(target, true, 'top top');
  } else {
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

function updateLanguage(lang: SupportedLang) {
  currentLang = lang;

  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  if (lang === 'ar') {
    document.body.classList.remove('font-inter');
    document.body.classList.add('font-kufi');
  } else {
    document.body.classList.remove('font-kufi');
    document.body.classList.add('font-inter');
  }

  if (lang === 'en') {
    langEnBtn?.classList.add('is-active');
    langEnBtn?.setAttribute('aria-pressed', 'true');
    langArBtn?.classList.remove('is-active');
    langArBtn?.setAttribute('aria-pressed', 'false');
  } else {
    langArBtn?.classList.add('is-active');
    langArBtn?.setAttribute('aria-pressed', 'true');
    langEnBtn?.classList.remove('is-active');
    langEnBtn?.setAttribute('aria-pressed', 'false');
  }

  const elements = document.querySelectorAll<HTMLElement>('[data-en][data-ar]');
  elements.forEach((element) => {
    const text = element.getAttribute(`data-${lang}`);
    if (text) {
      element.textContent = text;
    }
  });

  const placeholderElements = document.querySelectorAll<HTMLElement>(
    '[data-placeholder-en][data-placeholder-ar]',
  );
  placeholderElements.forEach((element) => {
    const placeholder = element.getAttribute(`data-placeholder-${lang}`);
    if (placeholder) {
      element.setAttribute('placeholder', placeholder);
    }
  });
}

function initLanguageToggle() {
  langEnBtn?.addEventListener('click', () => updateLanguage('en'));
  langArBtn?.addEventListener('click', () => updateLanguage('ar'));
}

function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.toggle('hidden');
    mobileMenuBtn.setAttribute('aria-expanded', (!isHidden).toString());
  });
}

function initSmoothScrolling() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const selector = anchor.getAttribute('href') ?? '';
      const target = selector ? document.querySelector(selector) : null;
      if (target instanceof Element) {
        scrollToElement(target);

        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenu) {
          mobileMenu.classList.add('hidden');
        }
        if (mobileMenuBtn) {
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

function initHeaderScrollEffect() {
  const header = document.getElementById('navbar');
  if (!header) return;

  const updateState = () => {
    const isScrolled = window.scrollY > 24;
    header.classList.toggle('is-scrolled', isScrolled);
  };

  updateState();
  window.addEventListener('scroll', updateState);
}

function initContactForm() {
  const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email') as string | null;
    const message = formData.get('message');

    if (!name || !email || !message) {
      event.preventDefault();
      alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      event.preventDefault();
      alert(currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }

    const submitBtn = contactForm.querySelector<HTMLButtonElement>('.submit-btn');
    if (!submitBtn) return;

    const originalText = submitBtn.textContent ?? '';

    submitBtn.textContent = currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showSuccessToast(originalText);
    }, 500);
  });
}

function showSuccessToast(originalText: string) {
  const toast = document.getElementById('success-toast');
  if (!toast) return;

  const toastMessage = toast.querySelector<HTMLElement>('.toast-message');
  if (toastMessage) {
    const message = toastMessage.getAttribute(`data-${currentLang}`);
    if (message) {
      toastMessage.textContent = message;
    }
  }

  toast.classList.remove('translate-x-full');
  toast.classList.add('translate-x-0');

  setTimeout(() => {
    toast.classList.remove('translate-x-0');
    toast.classList.add('translate-x-full');

    const submitBtn = document.querySelector<HTMLButtonElement>('.submit-btn');
    if (submitBtn) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }, 3000);
}

function initCtaButton() {
  const ctaBtns = document.querySelectorAll<HTMLButtonElement>('.cta-btn');
  ctaBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        scrollToElement(contactSection);
      } else {
        window.location.href = 'index.html#contact';
      }
    });
  });

  const learnMoreBtn = document.querySelector<HTMLButtonElement>('.learn-more-btn');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      const servicesSection = document.querySelector('#services');
      if (servicesSection) {
        scrollToElement(servicesSection);
      } else {
        window.location.href = 'index.html#services';
      }
    });
  }
}

function initNewsletterForm() {
  const newsletterForms = document.querySelectorAll<HTMLFormElement>('form');

  newsletterForms.forEach((form) => {
    if (form.id === 'contact-form') return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]');
      const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');

      if (!emailInput || !submitBtn) return;

      const email = emailInput.value ?? '';
      const originalText = submitBtn.textContent ?? '';

      if (!email || !email.includes('@')) {
        alert(currentLang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email');
        return;
      }

      submitBtn.textContent = currentLang === 'ar' ? 'جاري الاشتراك...' : 'Subscribing...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert(currentLang === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  });
}

function initStatsAnimation() {
  const stats = document.querySelectorAll<HTMLElement>('.text-2xl.sm\\:text-3xl');

  const animateStats: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLElement;
        const targetText = target.textContent ?? '';
        const digitsMatch = targetText.match(/\d+/);
        const targetNumber = digitsMatch ? parseInt(digitsMatch[0], 10) : NaN;

        if (!Number.isNaN(targetNumber)) {
          let current = 0;
          const increment = targetNumber / 30;
          const timer = window.setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
              target.textContent = targetText;
              clearInterval(timer);
            } else {
              target.textContent = `${Math.floor(current)}${targetText.replace(/\d+/, '')}`;
            }
          }, 50);
        }

        observer.unobserve(target);
      }
    });
  };

  const observer = new IntersectionObserver(animateStats, {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px',
  });

  stats.forEach((stat) => observer.observe(stat));
}

function initScrollAnimations() {
  const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        if (entry.target.parentElement?.classList.contains('grid')) {
          const siblings = Array.from(entry.target.parentElement.children);
          const index = siblings.indexOf(entry.target);
          (entry.target as HTMLElement).style.transitionDelay = `${index * 0.05}s`;
        }
      }
    });
  }, observerOptions);

  document
    .querySelectorAll<HTMLElement>(
      '.service-card, .feature-card, .testimonial-card, .industry-card, .faq-item, .process-card',
    )
    .forEach((card) => {
      observer.observe(card);
    });
}

function initParallaxEffect() {
  const hero = document.querySelector<HTMLElement>('#home');
  const shapes = document.querySelectorAll<HTMLElement>('.shape');

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    if (hero && scrolled < hero.offsetHeight) {
      shapes.forEach((shape, index) => {
        const speed = 0.2 + index * 0.1;
        shape.style.transform = `translateY(${rate * speed}px)`;
      });
    }
  });
}

// Removed initStickyNavigation - scroll behavior now handled in gsapAnimation.ts

function initServiceCards() {
  const serviceCards = document.querySelectorAll<HTMLElement>('.service-card');

  serviceCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px) rotateX(5deg)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0deg)';
    });
  });
}

function initImageModal() {
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

  const projectImages = document.querySelectorAll<HTMLImageElement>('.project-detail img');
  projectImages.forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      const modalImg = document.getElementById('modal-image') as HTMLImageElement | null;
      if (!modalImg) return;

      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslationsFromDictionary();
  initLanguageToggle();
  updateLanguage(currentLang);
  initMobileMenu();
  initSmoothScrolling();
  initHeaderScrollEffect();
  initContactForm();
  initCtaButton();
  initScrollAnimations();
  initNewsletterForm();
  initStatsAnimation();
  initParallaxEffect();
  initServiceCards();
  initImageModal();

  document.body.classList.add('loaded');

  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
  }
});

export {};
