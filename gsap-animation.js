document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof ScrollSmoother === 'undefined') {
        console.warn('GSAP or the required plugins did not load correctly.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1.2,
        normalizeScroll: true,
        ignoreMobileResize: true,
        effects: true
    });

    window.gsapSmoother = smoother;

    gsap.utils.toArray('.floating-shapes .shape').forEach((shape, index) => {
        smoother.effects(shape, {
            speed: 1 + index * 0.2,
            lag: 0.12
        });
    });

    const heroSection = document.querySelector('#home');
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    if (heroSection && heroContent) {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 1024px)', () => {
            gsap.set(heroContent, { transformOrigin: 'center top' });

            const scaleTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            scaleTimeline.fromTo(
                heroContent,
                { scale: 1.08, yPercent: 0 },
                { scale: 0.85, yPercent: -12, ease: 'none' }
            );

            const titleMotion = heroTitle
                ? gsap.to(heroTitle, {
                      scrollTrigger: {
                          trigger: heroSection,
                          start: 'top top',
                          end: 'bottom top',
                          scrub: true
                      },
                      yPercent: -18,
                      ease: 'none'
                  })
                : null;

            const subtitleMotion = heroSubtitle
                ? gsap.to(heroSubtitle, {
                      scrollTrigger: {
                          trigger: heroSection,
                          start: 'top top',
                          end: 'bottom top',
                          scrub: true
                      },
                      opacity: 0.6,
                      yPercent: -10,
                      ease: 'none'
                  })
                : null;

            return () => {
                scaleTimeline.kill();
                titleMotion && titleMotion.kill();
                subtitleMotion && subtitleMotion.kill();
            };
        });

        mm.add('(min-width: 640px) and (max-width: 1023px)', () => {
            gsap.set(heroContent, { transformOrigin: 'center top' });

            const scaleTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            scaleTimeline.fromTo(
                heroContent,
                { scale: 1.04, yPercent: 0 },
                { scale: 0.92, yPercent: -6, ease: 'none' }
            );

            return () => {
                scaleTimeline.kill();
            };
        });

        mm.add('(max-width: 639px)', () => {
            gsap.set(heroContent, { clearProps: 'transform' });
        });
    }

    const aboutOverviewSection = document.querySelector('#about-overview');

    if (aboutOverviewSection) {
        const badge = aboutOverviewSection.querySelector('.about-badge');
        const heading = aboutOverviewSection.querySelector('.about-heading');
        const paragraph = aboutOverviewSection.querySelector('.about-paragraph');
        const statCards = aboutOverviewSection.querySelectorAll('.about-stat-card');
        const statNumbers = aboutOverviewSection.querySelectorAll('.about-stat-number');
        const mediaCard = aboutOverviewSection.querySelector('.about-media-card');
        const mediaOverlay = aboutOverviewSection.querySelector('.about-media-overlay');
        const mediaIconWrap = aboutOverviewSection.querySelector('.about-media-icon-wrap');
        const mediaIconPaths = aboutOverviewSection.querySelectorAll('.about-media-icon path');
        const overlayTitle = aboutOverviewSection.querySelector('.about-overlay-title');
        const overlayText = aboutOverviewSection.querySelector('.about-overlay-text');

        mediaIconPaths.forEach(path => {
            const length = path.getTotalLength();
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length
            });
        });

        const aboutTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: aboutOverviewSection,
                start: 'top 75%',
                end: 'bottom 60%',
                toggleActions: 'play none none reverse'
            }
        });

        if (badge) {
            aboutTimeline.from(badge, {
                y: 40,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            });
        }

        if (heading) {
            aboutTimeline.from(heading, {
                y: 50,
                opacity: 0,
                clipPath: 'inset(0 0 100% 0)',
                duration: 0.7,
                ease: 'power3.out'
            }, '-=0.3');

            aboutTimeline.to(heading, {
                backgroundSize: '100% 100%',
                duration: 0.8,
                ease: 'power2.out'
            }, '<');
        }

        if (paragraph) {
            aboutTimeline.from(paragraph, {
                y: 24,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.2');
        }

        if (statCards.length) {
            aboutTimeline.from(statCards, {
                y: 40,
                opacity: 0,
                stagger: 0.15,
                duration: 0.6,
                ease: 'power2.out'
            }, '-=0.2');
        }

        statNumbers.forEach((numberEl, index) => {
            const targetValue = parseFloat(numberEl.dataset.count);
            if (isNaN(targetValue)) {
                return;
            }

            const suffix = numberEl.dataset.suffix || '';
            const decimals = parseInt(numberEl.dataset.decimals || '0', 10);
            const counter = { value: 0 };

            numberEl.textContent = `0${suffix}`;

            const timelinePosition = index === 0 ? '-=0.35' : '<';

            aboutTimeline.to(counter, {
                value: targetValue,
                duration: 1.2,
                ease: 'power2.out',
                onStart: () => {
                    counter.value = 0;
                    numberEl.textContent = `0${suffix}`;
                },
                onUpdate: () => {
                    const currentValue = decimals > 0
                        ? counter.value.toFixed(decimals)
                        : Math.round(counter.value);
                    numberEl.textContent = `${currentValue}${suffix}`;
                },
                onReverseComplete: () => {
                    counter.value = 0;
                    numberEl.textContent = `0${suffix}`;
                }
            }, timelinePosition);
        });

        if (mediaCard) {
            aboutTimeline.from(mediaCard, {
                autoAlpha: 0,
                xPercent: 12,
                yPercent: 8,
                scale: 0.92,
                rotate: 2,
                duration: 0.9,
                ease: 'expo.out'
            }, '-=0.6');
        }

        if (mediaOverlay) {
            aboutTimeline.from(mediaOverlay, {
                y: 48,
                autoAlpha: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4');
        }

        if (mediaIconWrap) {
            aboutTimeline.from(mediaIconWrap, {
                scale: 0.6,
                autoAlpha: 0,
                duration: 0.5,
                ease: 'back.out(1.7)'
            }, '-=0.45');
        }

        if (overlayTitle || overlayText) {
            aboutTimeline.from([overlayTitle, overlayText].filter(Boolean), {
                y: 16,
                opacity: 0,
                stagger: 0.1,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.35');
        }

        if (mediaIconPaths.length) {
            aboutTimeline.to(mediaIconPaths, {
                strokeDashoffset: 0,
                duration: 0.9,
                ease: 'power2.out'
            }, '-=0.4');
        }
    }

    ScrollTrigger.addEventListener('refresh', () => smoother && smoother.update());
    ScrollTrigger.refresh();
});

