// @ts-nocheck
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import TextPlugin from 'gsap/TextPlugin';
import MotionPathPlugin from 'gsap/MotionPathPlugin';

document.addEventListener('DOMContentLoaded', () => {
    if (!gsap || !ScrollTrigger || !ScrollSmoother) {
        console.warn('GSAP or the required plugins did not load correctly.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, TextPlugin, MotionPathPlugin);

    const hasTextPlugin = Boolean(TextPlugin);
    const hasMotionPathPlugin = Boolean(MotionPathPlugin);

    const wrapperElement = document.querySelector('#smooth-wrapper');
    const contentElement = document.querySelector('#smooth-content');

    if (!wrapperElement || !contentElement) {
        console.warn('ScrollSmoother skipped: required wrapper/content elements were not found on this page.');
        return;
    }

    const smoother = ScrollSmoother.create({
        wrapper: wrapperElement,
        content: contentElement,
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

    const createScrollScalePulse = (targets, options = {}) => {
        const elements = gsap.utils.toArray(targets);

        if (!elements.length) {
            return;
        }

        const {
            minScale = 0.96,
            maxScale = 1.04,
            start = 'top 85%',
            end = 'bottom 65%',
            scrub = 0.5,
            enterEase = 'power2.out',
            exitEase = 'power2.inOut',
            duration = 1
        } = options;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            elements.forEach(element => {
                gsap.set(element, { clearProps: 'transform' });
            });
            return;
        }

        elements.forEach(element => {
            gsap.set(element, { transformOrigin: 'center center', willChange: 'transform' });

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: element,
                    start,
                    end,
                    scrub,
                    invalidateOnRefresh: true
                }
            });

            timeline
                .fromTo(
                    element,
                    { scale: minScale },
                    { scale: maxScale, ease: enterEase, duration, force3D: true }
                )
                .to(element, {
                    scale: minScale,
                    ease: exitEase,
                    duration,
                    force3D: true
                });
        });
    };

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
                start: 'top 80%',
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
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.8');
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

    const foundationSection = document.querySelector('#foundation');

    if (foundationSection) {
        const cardsStage = foundationSection.querySelector('.foundation-cards-stage');
        const introTitle = foundationSection.querySelector('.foundation-intro-title');
        const introCopy = foundationSection.querySelector('.foundation-intro-copy');
        const foundationCards = gsap.utils.toArray(foundationSection.querySelectorAll('.foundation-card'));

        if (introTitle) {
            if (hasTextPlugin) {
                ScrollTrigger.create({
                    trigger: foundationSection,
                    start: 'top 80%',
                    once: true,
                    onEnter: () => {
                        const lang = document.documentElement.getAttribute('lang') || 'en';
                        const target = introTitle.getAttribute(`data-${lang}`) || introTitle.textContent;

                        gsap.fromTo(introTitle, { text: '' }, {
                            text: target,
                            duration: 1.2,
                            ease: 'power2.out'
                        });
                    }
                });
            } else {
                gsap.from(introTitle, {
                    y: 24,
                    autoAlpha: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: foundationSection,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        }

        if (introCopy) {
            if (hasTextPlugin) {
                ScrollTrigger.create({
                    trigger: foundationSection,
                    start: 'top 75%',
                    once: true,
                    onEnter: () => {
                        const lang = document.documentElement.getAttribute('lang') || 'en';
                        const target = introCopy.getAttribute(`data-${lang}`) || introCopy.textContent;

                        gsap.fromTo(introCopy, { text: '' }, {
                            text: target,
                            duration: 1,
                            ease: 'power2.out',
                            delay: 0.15
                        });
                    }
                });
            } else {
                gsap.from(introCopy, {
                    y: 20,
                    autoAlpha: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: foundationSection,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        }

        if (foundationCards.length) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const currentLang = document.documentElement.getAttribute('lang') || 'en';

            const syncCardCopy = (card, lang) => {
                const badge = card.querySelector('.foundation-card-badge');
                const title = card.querySelector('.foundation-card-title');
                const description = card.querySelector('.foundation-card-description');

                [badge, title, description].forEach(element => {
                    if (!element) {
                        return;
                    }

                    const textValue = element.getAttribute(`data-${lang}`);

                    if (textValue) {
                        element.textContent = textValue;
                    }
                });
            };

            foundationCards.forEach(card => syncCardCopy(card, currentLang));

            const matchMedia = gsap.matchMedia();

            matchMedia.add('(max-width: 767px)', () => {
                if (prefersReducedMotion) {
                    foundationCards.forEach(card => {
                        gsap.set(card, { clearProps: 'opacity,transform' });
                    });
                    return () => {};
                }

                return gsap.from(foundationCards, {
                    autoAlpha: 0,
                    y: 36,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: foundationSection,
                        start: 'top 80%'
                    }
                });
            });

            matchMedia.add('(min-width: 768px)', () => {
                if (!cardsStage) {
                    return () => {};
                }

                const cards = foundationCards.map(card => card);
                const middleIndex = Math.floor(cards.length / 2);
                const basePositions = cards.map((_, index) => (index - middleIndex) * 120);
                const images = cards.map(card => card.querySelector('.foundation-card-media img'));

                images.forEach(image => {
                    if (!image) {
                        return;
                    }

                    gsap.set(image, {
                        filter: 'saturate(0.78) brightness(0.92)'
                    });
                });

                gsap.set(cards, index => ({
                    xPercent: basePositions[index],
                    yPercent: -55,
                    scale: cards.length > 1 ? (index === middleIndex ? 1 : 0.92) : 1,
                    transformOrigin: 'center center',
                    autoAlpha: 1,
                    zIndex: cards.length - index
                }));

                const revealTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: foundationSection,
                        start: 'top 20%',
                        once: true
                    }
                });

                revealTimeline.from(cards, {
                    autoAlpha: 0,
                    y: 42,
                    duration: 0.65,
                    stagger: 0.12,
                    ease: 'power2.out'
                });

                if (prefersReducedMotion || cards.length < 2) {
                    return () => {};
                }

                const baseState = {
                    positions: basePositions,
                    scales: cards.map((_, index) => cards.length > 1 ? (index === middleIndex ? 1 : 0.92) : 1),
                    alphas: cards.map(() => 0.88),
                    z: cards.map((_, index) => cards.length - index),
                    active: -1
                };

                const highlightStates = cards.length === 3 ? [
                    baseState,
                    {
                        positions: [0, 120, 230],
                        scales: [1.28, 0.82, 0.68],
                        alphas: [1, 0.62, 0.35],
                        z: [9, 5, 3],
                        active: 0
                    },
                    {
                        positions: [-210, 0, 120],
                        scales: [0.65, 1.26, 0.82],
                        alphas: [0.32, 1, 0.72],
                        z: [3, 9, 5],
                        active: 1
                    },
                    {
                        positions: [-220, -130, 0],
                        scales: [0.6, 0.74, 1.26],
                        alphas: [0.28, 0.55, 1],
                        z: [3, 5, 9],
                        active: 2
                    }
                ] : [baseState];

                if (!highlightStates.length || cards.length !== 3) {
                    return () => {};
                }

                const getScrollTop = () => window.pageYOffset || document.documentElement.scrollTop || 0;
                const getStageTop = () => cardsStage.getBoundingClientRect().top + getScrollTop();
                const getSectionTop = () => foundationSection.getBoundingClientRect().top + getScrollTop();
                const getViewportHeight = () => window.innerHeight || document.documentElement.clientHeight;

                const totalTransitions = Math.max(1, highlightStates.length - 1);

                const getStartPosition = () => {
                    const stageTop = getStageTop();
                    const sectionTop = getSectionTop();
                    const offsetWithinSection = stageTop - sectionTop;
                    const stageHeight = cardsStage.offsetHeight;
                    const viewportHeight = getViewportHeight();
                    const availableSpace = viewportHeight - stageHeight;
                    const verticalOffset = availableSpace > 0 ? availableSpace / 2 : 0;

                    return sectionTop + offsetWithinSection - verticalOffset;
                };

                const getEndPosition = () => {
                    const stageHeight = cardsStage.offsetHeight;
                    const viewportHeight = getViewportHeight();
                    const extraDistance = Math.max(stageHeight * 0.6, viewportHeight * 0.45);

                    return getStartPosition() + (totalTransitions * stageHeight) + extraDistance;
                };

                const highlightTimeline = gsap.timeline({
                    defaults: {
                        duration: 1.15,
                        ease: 'power3.inOut'
                    },
                    scrollTrigger: {
                        trigger: foundationSection,
                        start: () => getStartPosition(),
                        end: () => getEndPosition(),
                        scrub: 0.75,
                        pin: cardsStage,
                        pinSpacing: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true
                    }
                });

                const applyState = state => {
                    cards.forEach((card, index) => {
                        const zIndex = state.z[index] ?? cards.length - index;
                        card.style.zIndex = String(zIndex);
                        card.classList.toggle('is-active', state.active === index);
                    });

                    images.forEach((image, index) => {
                        if (!image) {
                            return;
                        }

                        const isActiveImage = state.active === index;

                        gsap.to(image, {
                            filter: isActiveImage ? 'saturate(1) brightness(1)' : 'saturate(0.78) brightness(0.92)',
                            duration: 0.9,
                            ease: 'power2.out'
                        });
                    });
                };

                applyState(highlightStates[0]);

                highlightStates.slice(1).forEach((state, idx) => {
                    const position = idx + 1;

                    highlightTimeline.add(() => applyState(state), position);

                    cards.forEach((card, cardIndex) => {
                        highlightTimeline.to(card, {
                            xPercent: state.positions[cardIndex],
                            scale: state.scales[cardIndex],
                            autoAlpha: state.alphas[cardIndex]
                        }, position);
                    });
                });

                highlightTimeline.to({}, { duration: 0.4 });

                highlightTimeline.scrollTrigger?.refresh();

                return () => {
                    if (highlightTimeline.scrollTrigger) {
                        highlightTimeline.scrollTrigger.kill();
                    }
                    highlightTimeline.kill();
                    cards.forEach(card => {
                        card.style.removeProperty('z-index');
                        card.classList.remove('is-active');
                    });
                };
            });
        }
    }

    const processSection = document.querySelector('#process');

    if (processSection) {
        const processBadge = processSection.querySelector('.process-badge');
        const processHeading = processSection.querySelector('.process-heading');
        const processCopy = processSection.querySelector('.process-copy');
        const processCards = gsap.utils.toArray(processSection.querySelectorAll('.process-card'));
        const processStepBadges = gsap.utils.toArray(processSection.querySelectorAll('.process-step-badge'));
        const processMarker = processSection.querySelector('#process-marker');
        const processPath = processSection.querySelector('#process-motion-path');

        const processRevealTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: processSection,
                start: 'top 75%',
                end: 'bottom 65%',
                toggleActions: 'play none none reverse'
            }
        });

        if (processBadge) {
            processRevealTimeline.from(processBadge, {
                y: 30,
                autoAlpha: 0,
                duration: 0.45,
                ease: 'power2.out'
            });
        }

        if (processHeading) {
            processRevealTimeline.from(processHeading, {
                y: 40,
                autoAlpha: 0,
                duration: 0.6,
                ease: 'power3.out'
            }, processBadge ? '-=0.2' : 0);
        }

        if (processCopy) {
            processRevealTimeline.from(processCopy, {
                y: 24,
                autoAlpha: 0,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.2');
        }

        if (processCards.length) {
            processRevealTimeline.from(processCards, {
                y: 40,
                autoAlpha: 0,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.15
            }, '-=0.1');
        }

        if (processStepBadges.length) {
            processRevealTimeline.from(processStepBadges, {
                scale: 0.6,
                autoAlpha: 0,
                duration: 0.45,
                ease: 'back.out(1.8)',
                stagger: 0.08
            }, '-=0.45');
        }

        let activeProcessCardIndex = -1;

        const highlightProcessCard = index => {
            if (!processCards.length) {
                return;
            }

            const boundedIndex = Math.max(0, Math.min(processCards.length - 1, index));

            if (boundedIndex === activeProcessCardIndex) {
                return;
            }

            processCards.forEach((card, cardIndex) => {
                card.classList.toggle('is-active', cardIndex === boundedIndex);
            });

            activeProcessCardIndex = boundedIndex;
        };

        if (processCards.length) {
            highlightProcessCard(0);
        }

        const processMedia = gsap.matchMedia();

        processMedia.add('(max-width: 1023px)', () => {
            if (!processCards.length) {
                return () => {};
            }

            const triggers = processCards.map((card, index) =>
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 65%',
                    onEnter: () => highlightProcessCard(index),
                    onEnterBack: () => highlightProcessCard(index)
                })
            );

            return () => {
                triggers.forEach(trigger => trigger.kill());
                highlightProcessCard(0);
            };
        });

        processMedia.add('(min-width: 1024px)', () => {
            if (!processCards.length) {
                return () => {};
            }

            if (!hasMotionPathPlugin || !processMarker || !processPath) {
                const triggers = processCards.map((card, index) =>
                    ScrollTrigger.create({
                        trigger: card,
                        start: 'top 80%',
                        end: 'bottom 60%',
                        onEnter: () => highlightProcessCard(index),
                        onEnterBack: () => highlightProcessCard(index)
                    })
                );

                return () => {
                    triggers.forEach(trigger => trigger.kill());
                    highlightProcessCard(0);
                };
            }

            gsap.set(processMarker, { autoAlpha: 0, scale: 0.6 });

            const markerRevealTrigger = ScrollTrigger.create({
                trigger: processSection,
                start: 'top 70%',
                once: true,
                onEnter: () => {
                    gsap.to(processMarker, {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.45,
                        ease: 'back.out(1.7)'
                    });
                }
            });

            const markerTween = gsap.to(processMarker, {
                motionPath: {
                    path: processPath,
                    align: processPath,
                    autoRotate: false,
                    alignOrigin: [0.5, 0.5]
                },
                ease: 'none',
                scrollTrigger: {
                    trigger: processSection,
                    start: 'top 60%',
                    end: 'bottom top',
                    scrub: 1,
                    onUpdate: self => {
                        const progress = self.progress;
                        const index = Math.min(
                            processCards.length - 1,
                            Math.max(0, Math.round(progress * (processCards.length - 1)))
                        );
                        highlightProcessCard(index);
                    },
                    onLeaveBack: () => highlightProcessCard(0)
                }
            });

            return () => {
                markerRevealTrigger.kill();
                markerTween.kill();
                highlightProcessCard(0);
            };
        });
    }

    const servicesSection = document.querySelector('#services');

    if (servicesSection) {
        const stackCards = gsap.utils.toArray('#services .services-stack-track .service-card');
        const visualWrapper = servicesSection.querySelector('.services-visual');
        let currentBgEl = servicesSection.querySelector('.services-visual-image--current');
        let nextBgEl = servicesSection.querySelector('.services-visual-image--next');
        const detailIndex = servicesSection.querySelector('.services-detail-index');
        const detailLabel = servicesSection.querySelector('.services-detail-label');
        const detailTitle = servicesSection.querySelector('.services-detail-title');
        const detailDescription = servicesSection.querySelector('.services-detail-description');
        const detailTags = servicesSection.querySelector('.services-detail-tags');
        const previewCard = servicesSection.querySelector('.services-preview-card');
        const previewIcon = previewCard ? previewCard.querySelector('.services-preview-icon') : null;
        const previewBadge = previewCard ? previewCard.querySelector('.services-preview-badge') : null;
        const previewIndex = previewCard ? previewCard.querySelector('.services-preview-index') : null;
        const previewTitle = previewCard ? previewCard.querySelector('.services-preview-title') : null;
        const previewCTA = previewCard ? previewCard.querySelector('.services-preview-cta') : null;
        const previewArrowIcon = previewCard ? previewCard.querySelector('.services-preview-arrow-icon') : null;
        const previewGlow = previewCard ? previewCard.querySelector('.services-preview-glow') : null;
        const mm = gsap.matchMedia();

        let activeServiceIndex = -1;
        let backgroundTween = null;
        let previewTween = null;

        const hexToRgba = (hex, alpha = 0.18) => {
            if (!hex) {
                return `rgba(37, 99, 235, ${alpha})`;
            }

            let sanitized = hex.replace('#', '');

            if (sanitized.length === 3) {
                sanitized = sanitized
                    .split('')
                    .map(char => `${char}${char}`)
                    .join('');
            }

            const value = parseInt(sanitized, 16);

            if (Number.isNaN(value)) {
                return `rgba(37, 99, 235, ${alpha})`;
            }

            const r = (value >> 16) & 255;
            const g = (value >> 8) & 255;
            const b = value & 255;

            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        const setDetailTags = (card, accentColor) => {
            if (!detailTags) {
                return;
            }

            detailTags.innerHTML = '';

            const badges = card.querySelectorAll('.flex.flex-wrap span');

            badges.forEach(badge => {
                const span = document.createElement('span');
                span.textContent = badge.textContent.trim();
                span.style.backgroundColor = hexToRgba(accentColor, 0.18);
                span.style.color = accentColor || '#38bdf8';
                detailTags.appendChild(span);
            });
        };

        const swapBackgroundImage = (imageUrl, immediate = false) => {
            if (!currentBgEl || !nextBgEl || !visualWrapper || !imageUrl) {
                return;
            }

            if (backgroundTween) {
                backgroundTween.kill();
            }

            if (immediate) {
                gsap.set([currentBgEl, nextBgEl], { opacity: 0 });
                gsap.set(currentBgEl, {
                    backgroundImage: `url(${imageUrl})`,
                    opacity: 1,
                    scale: 1
                });
                return;
            }

            gsap.set(nextBgEl, {
                backgroundImage: `url(${imageUrl})`,
                opacity: 0,
                scale: 1.08
            });

            backgroundTween = gsap.timeline();

            backgroundTween.to(currentBgEl, {
                opacity: 0,
                scale: 1.05,
                duration: 0.85,
                ease: 'power2.out'
            });

            backgroundTween.to(nextBgEl, {
                opacity: 1,
                scale: 1,
                duration: 0.9,
                ease: 'power2.out'
            }, 0);

            backgroundTween.add(() => {
                const temp = currentBgEl;
                currentBgEl = nextBgEl;
                nextBgEl = temp;
            });
        };

        const animateTextContent = (element, content, options = {}) => {
            if (!element) {
                return;
            }

            const { duration = 0.85, delay = 0, immediate = false } = options;

            if (immediate || !hasTextPlugin) {
                gsap.killTweensOf(element);
                element.textContent = content;
                return;
            }

            gsap.killTweensOf(element);
            element.textContent = '';

            gsap.to(element, {
                text: content,
                duration,
                delay,
                ease: 'power2.out'
            });
        };

        const updatePreviewCard = (card, { index, accentColor, immediate = false } = {}) => {
            if (!previewCard) {
                return;
            }

            if (!card) {
                previewTween && previewTween.kill();
                if (immediate) {
                    gsap.set(previewCard, { autoAlpha: 0, pointerEvents: 'none' });
                } else {
                    gsap.to(previewCard, {
                        autoAlpha: 0,
                        duration: 0.35,
                        ease: 'power1.out',
                        onStart: () => gsap.set(previewCard, { pointerEvents: 'none' })
                    });
                }
                return;
            }

            const lang = document.documentElement.getAttribute('lang') || 'en';
            const nextTitleEl = card.querySelector('h3');
            const nextIcon = card.querySelector('.w-12.h-12');
            const nextBadge = card.querySelector('.flex.flex-wrap span');

            const nextTitle = nextTitleEl
                ? nextTitleEl.getAttribute(`data-${lang}`) || nextTitleEl.textContent.trim()
                : '';

            const badgeLabel = nextBadge ? nextBadge.textContent.trim() : 'Next';
            const color = accentColor || card.dataset.accent || '#38bdf8';

            const applyContent = () => {
                if (previewIndex) {
                    previewIndex.textContent = String((index ?? 0) + 1).padStart(2, '0');
                    previewIndex.style.color = color;
                }

                if (previewBadge) {
                    previewBadge.textContent = badgeLabel.toUpperCase();
                    previewBadge.style.backgroundColor = hexToRgba(color, 0.2);
                    previewBadge.style.color = color;
                }

                if (previewTitle) {
                    previewTitle.textContent = nextTitle;
                }

                if (previewCTA) {
                    previewCTA.style.color = hexToRgba(color, 0.85);
                }

                if (previewArrowIcon) {
                    previewArrowIcon.style.color = color;
                }

                if (previewIcon) {
                    previewIcon.innerHTML = nextIcon ? nextIcon.innerHTML : '';
                    previewIcon.style.color = color;
                    previewIcon.style.boxShadow = `inset 0 0 0 1px ${hexToRgba(color, 0.28)}`;
                    previewIcon.style.background = hexToRgba(color, 0.12);
                }

                if (previewGlow) {
                    previewGlow.style.background = `radial-gradient(circle at 32% 25%, ${hexToRgba(color, 0.55)}, transparent 60%)`;
                }
            };

            if (immediate) {
                previewTween && previewTween.kill();
                gsap.set(previewCard, { rotationY: 0, autoAlpha: 1, pointerEvents: 'auto' });
                applyContent();
                if (previewIcon) {
                    gsap.set(previewIcon, { scale: 1, rotate: 0 });
                }
                if (previewBadge) {
                    gsap.set(previewBadge, { y: 0, autoAlpha: 1 });
                }
                return;
            }

            previewTween && previewTween.kill();

            previewTween = gsap.timeline();

            previewTween.to(previewCard, {
                rotationY: 70,
                autoAlpha: 0,
                pointerEvents: 'none',
                duration: 0.35,
                ease: 'power2.in'
            });

            previewTween.add(applyContent);

            previewTween.fromTo(previewCard, {
                rotationY: -70,
                autoAlpha: 0
            }, {
                rotationY: 0,
                autoAlpha: 1,
                pointerEvents: 'auto',
                duration: 0.6,
                ease: 'power3.out'
            });

            if (previewIcon) {
                previewTween.fromTo(previewIcon, {
                    scale: 0.75,
                    rotate: -8
                }, {
                    scale: 1,
                    rotate: 0,
                    duration: 0.6,
                    ease: 'back.out(1.6)'
                }, '-=0.35');
            }

            if (previewBadge) {
                previewTween.fromTo(previewBadge, {
                    y: 10,
                    autoAlpha: 0
                }, {
                    y: 0,
                    autoAlpha: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                }, '-=0.4');
            }
        };

        const activateServiceCard = (index, { immediate = false } = {}) => {
            if (!stackCards.length) {
                return;
            }

            const boundedIndex = Math.max(0, Math.min(stackCards.length - 1, index));

            if (boundedIndex === activeServiceIndex && !immediate) {
                return;
            }

            const card = stackCards[boundedIndex];
            const lang = document.documentElement.getAttribute('lang') || 'en';
            const titleEl = card.querySelector('h3');
            const descriptionEl = card.querySelector('p');
            const firstBadge = card.querySelector('.flex.flex-wrap span');
            const accentColor = card.dataset.accent || '#38bdf8';
            const backgroundImage = card.dataset.bg;

            const titleText = titleEl
                ? titleEl.getAttribute(`data-${lang}`) || titleEl.textContent.trim()
                : '';

            const descriptionText = descriptionEl
                ? descriptionEl.getAttribute(`data-${lang}`) || descriptionEl.textContent.trim()
                : '';

            const labelText = firstBadge
                ? firstBadge.textContent.trim()
                : titleText;

            if (detailIndex) {
                detailIndex.textContent = String(boundedIndex + 1).padStart(2, '0');
                detailIndex.style.backgroundColor = hexToRgba(accentColor, 0.2);
                detailIndex.style.color = accentColor;
            }

            if (detailLabel) {
                animateTextContent(detailLabel, labelText.toUpperCase(), { immediate, duration: 0.65 });
                detailLabel.style.color = accentColor;
            }

            animateTextContent(detailTitle, titleText, { immediate, duration: 1 });
            animateTextContent(detailDescription, descriptionText, { immediate, duration: 1, delay: hasTextPlugin ? 0.05 : 0 });

            setDetailTags(card, accentColor);
            swapBackgroundImage(backgroundImage, immediate);

            const nextIndex = boundedIndex + 1 < stackCards.length ? boundedIndex + 1 : null;
            const nextCard = typeof nextIndex === 'number' ? stackCards[nextIndex] : null;

            updatePreviewCard(nextCard, {
                index: nextIndex,
                accentColor: nextCard ? nextCard.dataset.accent : undefined,
                immediate
            });

            activeServiceIndex = boundedIndex;
        };

        if (stackCards.length) {
            activateServiceCard(0, { immediate: true });
        }

        mm.add('(min-width: 1024px)', () => {
            if (!stackCards.length) {
                return;
            }

            const totalCards = stackCards.length;
            const segments = Math.max(totalCards - 1, 1);

            const snapConfig = totalCards > 1
                ? {
                      snapTo: value => {
                          const snapped = Math.round(value * segments) / segments;
                          return Math.min(1, Math.max(0, snapped));
                      },
                      duration: 0.45,
                      ease: 'power2.inOut',
                      inertia: false
                  }
                : false;

            const trigger = ScrollTrigger.create({
                trigger: servicesSection,
                start: 'top top',
                end: () => `+=${totalCards * 400}`,
                pin: true,
                scrub: true,
                anticipatePin: 1,
                snap: snapConfig,
                onUpdate: self => {
                    if (totalCards === 1) {
                        if (activeServiceIndex !== 0) {
                            activateServiceCard(0);
                        }
                        return;
                    }

                    const rawIndex = Math.round(self.progress * (totalCards - 1));
                    const boundedIndex = Math.max(0, Math.min(totalCards - 1, rawIndex));

                    if (boundedIndex !== activeServiceIndex) {
                        activateServiceCard(boundedIndex);
                    }
                }
            });

            return () => trigger.kill();
        });

        mm.add('(max-width: 1023px)', () => {
            if (!stackCards.length) {
                return;
            }

            const cardTriggers = stackCards.map((card, index) => ScrollTrigger.create({
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => activateServiceCard(index),
                onEnterBack: () => activateServiceCard(index)
            }));

            activateServiceCard(0, { immediate: true });

            return () => {
                cardTriggers.forEach(trigger => trigger.kill());
            };
        });
    }

    // ====================================
    // NAVBAR SCROLL BEHAVIOR
    // ====================================
    // Simple scroll-based hide/show: hide on scroll down, show on scroll up
    
    const header = document.querySelector('header');
    
    if (header) {
        // Scroll-based navbar hide/show
        let lastScrollY = window.scrollY;
        let isNavbarVisible = true;
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollingDown = currentScrollY > lastScrollY;
                    const scrollThreshold = 50; // Minimum scroll distance to trigger
                    
                    // Always show navbar at the top
                    if (currentScrollY < scrollThreshold) {
                        if (!isNavbarVisible) {
                            isNavbarVisible = true;
                            header.classList.remove('is-hidden');
                        }
                    } else {
                        // Hide/show based on scroll direction
                        if (scrollingDown && currentScrollY > scrollThreshold && isNavbarVisible) {
                            // Hide navbar when scrolling down
                            isNavbarVisible = false;
                            header.classList.add('is-hidden');
                        } else if (!scrollingDown && !isNavbarVisible) {
                            // Show navbar when scrolling up
                            isNavbarVisible = true;
                            header.classList.remove('is-hidden');
                        }
                    }
                    
                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Active section indicator (simple, no animations)
        const sections = document.querySelectorAll('section[id]');
        const navLinks = header.querySelectorAll('.nav-link');
        
        if (sections.length && navLinks.length) {
            const updateActiveLink = () => {
                const scrollPosition = window.scrollY + 100;
                
                sections.forEach(section => {
                    const sectionTop = (section as HTMLElement).offsetTop;
                    const sectionHeight = (section as HTMLElement).offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLinks.forEach(link => {
                            const href = link.getAttribute('href');
                            if (href === `#${sectionId}`) {
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        });
                    }
                });
            };
            
            window.addEventListener('scroll', updateActiveLink, { passive: true });
            updateActiveLink(); // Initial check
        }
    }

    // ====================================
    // PORTFOLIO SHOWCASE ANIMATIONS - FULL SCREEN PINNED
    // ====================================
    
    const portfolioSection = document.querySelector('#portfolio-showcase');
    
    if (portfolioSection) {
        const mm = gsap.matchMedia();
        
        // Desktop full-screen pinned animation
        mm.add('(min-width: 1024px)', () => {
            const pinContainer = document.querySelector('#portfolio-pin-container');
            const slides = gsap.utils.toArray('.portfolio-slide');
            const viewAllBtn = document.querySelector('#view-all-projects-btn');
            
            if (!pinContainer || !slides.length) return;
            
            // Set up background images for each slide
            slides.forEach(slide => {
                const bgElement = slide.querySelector('.portfolio-slide-bg');
                const bgImage = slide.dataset.bg;
                if (bgElement && bgImage) {
                    bgElement.style.backgroundImage = `url('${bgImage}')`;
                }
            });
            
            // Create master timeline for all slides
            const masterTimeline = gsap.timeline({
                defaults: { ease: 'power2.inOut' }
            });
            
            // Animate each slide
            slides.forEach((slide, index) => {
                const direction = slide.dataset.direction || 'right';
                const bgElement = slide.querySelector('.portfolio-slide-bg');
                const overlay = slide.querySelector('.portfolio-slide-overlay');
                const badge = slide.querySelector('.portfolio-slide-badge');
                const title = slide.querySelector('.portfolio-slide-title');
                const description = slide.querySelector('.portfolio-slide-description');
                const tags = slide.querySelector('.portfolio-slide-tags');
                const link = slide.querySelector('.portfolio-slide-link');
                
                const slideStart = index * 3.8; // Increased time allocation per slide for longer viewing
                
                masterTimeline.addLabel(`slide-${index}`, slideStart);
                
                // Initial position based on direction
                let fromVars = { opacity: 0 };
                let exitVars = { opacity: 0 };
                
                switch(direction) {
                    case 'right':
                        fromVars.x = '100%';
                        exitVars.x = '-100%';
                        break;
                    case 'left':
                        fromVars.x = '-100%';
                        exitVars.x = '100%';
                        break;
                    case 'top':
                        fromVars.y = '-100%';
                        exitVars.y = '100%';
                        break;
                }
                
                // Slide entrance
                masterTimeline.fromTo(slide,
                    fromVars,
                    {
                        x: 0,
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power3.out'
                    },
                    slideStart
                );
                
                // Background zoom in
                if (bgElement) {
                    masterTimeline.fromTo(bgElement,
                        {
                            scale: 1.3,
                            rotate: direction === 'left' ? -3 : 3
                        },
                        {
                            scale: 1,
                            rotate: 0,
                            duration: 1.2,
                            ease: 'power2.out'
                        },
                        slideStart
                    );
                }
                
                // Overlay fade
                if (overlay) {
                    masterTimeline.fromTo(overlay,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.6, ease: 'power2.out' },
                        slideStart + 0.2
                    );
                }
                
                // Content elements stagger
                const contentElements = [badge, title, description, tags, link].filter(Boolean);
                if (contentElements.length) {
                    masterTimeline.fromTo(contentElements,
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.7,
                            stagger: 0.12,
                            ease: 'power3.out'
                        },
                        slideStart + 0.4
                    );
                }
                
                // Hold the slide for viewing - increased for longer viewing time
                masterTimeline.to({}, { duration: 1.8 }, slideStart + 1.2);
                
                // Exit animation (except for last slide)
                if (index < slides.length - 1) {
                    masterTimeline.to(slide,
                        {
                            ...exitVars,
                            duration: 0.8,
                            ease: 'power3.in'
                        },
                        slideStart + 3.0 // Updated timing to account for longer hold duration
                    );
                }
            });
            
            // Add extra time at the end
            masterTimeline.to({}, { duration: 0.5 });
            
            // Create ScrollTrigger for pinning
            const totalDuration = masterTimeline.duration();
            
            ScrollTrigger.create({
                trigger: pinContainer,
                start: 'top top',
                end: () => `+=${slides.length * 200}%`, // Increased from 100% to 200% for longer viewing time
                pin: true,
                scrub: 1.5, // Increased from 1 to 1.5 for smoother, slower transitions
                anticipatePin: 1,
                animation: masterTimeline,
                snap: {
                    snapTo: 1 / (slides.length - 1),
                    duration: 0.6,
                    ease: 'power2.inOut',
                    inertia: false
                }
            });
            
            return () => {
                ScrollTrigger.getAll().forEach(trigger => {
                    if (trigger.trigger === pinContainer) {
                        trigger.kill();
                    }
                });
            };
        });
        
        // Mobile & Tablet - Simple scroll animations
        mm.add('(max-width: 1023px)', () => {
            const slides = gsap.utils.toArray('.portfolio-slide');
            
            slides.forEach(slide => {
                const bgElement = slide.querySelector('.portfolio-slide-bg');
                const bgImage = slide.dataset.bg;
                if (bgElement && bgImage) {
                    bgElement.style.backgroundImage = `url('${bgImage}')`;
                }
                
                const direction = slide.dataset.direction || 'right';
                const contentElements = slide.querySelectorAll(
                    '.portfolio-slide-badge, .portfolio-slide-title, .portfolio-slide-description, .portfolio-slide-tags, .portfolio-slide-link'
                );
                
                // Initial state
                let fromVars = { opacity: 0, y: 50 };
                
                switch(direction) {
                    case 'right':
                        fromVars.x = 100;
                        break;
                    case 'left':
                        fromVars.x = -100;
                        break;
                    case 'top':
                        fromVars.y = -50;
                        break;
                }
                
                // Entrance animation
                gsap.fromTo(slide,
                    fromVars,
                    {
                        scrollTrigger: {
                            trigger: slide,
                            start: 'top 80%',
                            end: 'top 30%',
                            toggleActions: 'play none none reverse'
                        },
                        x: 0,
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out'
                    }
                );
                
                // Content stagger
                if (contentElements.length) {
                    gsap.fromTo(contentElements,
                        { y: 40, opacity: 0 },
                        {
                            scrollTrigger: {
                                trigger: slide,
                                start: 'top 70%',
                                toggleActions: 'play none none reverse'
                            },
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            stagger: 0.15,
                            ease: 'power3.out'
                        }
                    );
                }
            });
        });
        
        // View All Projects Button Animation
        const viewAllBtn = document.querySelector('#view-all-projects-btn');
        
        if (viewAllBtn) {
            gsap.set(viewAllBtn, { y: 50, opacity: 0, scale: 0.9 });
            
            gsap.to(viewAllBtn, {
                scrollTrigger: {
                    trigger: viewAllBtn,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.4)'
            });
            
            // Floating animation
            gsap.to(viewAllBtn, {
                y: -8,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: viewAllBtn,
                    start: 'top 90%'
                }
            });
            
            // Glow effect
            const btnGradient = viewAllBtn.querySelector('div');
            if (btnGradient) {
                gsap.to(btnGradient, {
                    opacity: 0.3,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
            
            // Ripple on click
            viewAllBtn.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.pointerEvents = 'none';
                
                const rect = viewAllBtn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 2;
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = size + 'px';
                ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                viewAllBtn.appendChild(ripple);
                
                gsap.fromTo(ripple,
                    { scale: 0, opacity: 1 },
                    {
                        scale: 1,
                        opacity: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        onComplete: () => ripple.remove()
                    }
                );
            });
        }
        
        // Header animation
        const portfolioHeader = portfolioSection.querySelector('.portfolio-header');
        if (portfolioHeader) {
            const headerElements = portfolioHeader.querySelectorAll('.inline-flex, h2, p');
            
            gsap.set(headerElements, { y: 30, opacity: 0 });
            
            gsap.to(headerElements, {
                scrollTrigger: {
                    trigger: portfolioHeader,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    }

    // ====================================
    // SCALE PULSE FOR CONTENT SECTIONS
    // ====================================

    createScrollScalePulse('.testimonial-card', {
        minScale: 0.96,
        maxScale: 1.04,
        start: 'top 88%',
        end: 'bottom 62%',
        scrub: 0.55
    });

    createScrollScalePulse('#about .feature-card', {
        minScale: 0.95,
        maxScale: 1.05,
        start: 'top 90%',
        end: 'bottom 60%',
        scrub: 0.6
    });

    createScrollScalePulse('.faq-item', {
        minScale: 0.97,
        maxScale: 1.03,
        start: 'top 92%',
        end: 'bottom 65%',
        scrub: 0.5
    });

    createScrollScalePulse('#contact .rounded-2xl', {
        minScale: 0.95,
        maxScale: 1.05,
        start: 'top 90%',
        end: 'bottom 60%',
        scrub: 0.6
    });

    // ====================================
    // INDUSTRIES SECTION ANIMATIONS
    // ====================================
    
    const industriesSection = document.querySelector('#industries');
    
    if (industriesSection) {
        const industriesHeading = industriesSection.querySelector('h2');
        const industriesBadge = industriesSection.querySelector('.inline-flex');
        const industriesDescription = industriesSection.querySelector('p');
        const industryCards = gsap.utils.toArray('.industry-card');
        
        if (industriesHeading) {
            gsap.set(industriesHeading, {
                backgroundImage: 'none',
                backgroundSize: 'auto',
                backgroundPosition: '0% 100%'
            });
        }
        
        // Header animations
        if (industriesBadge || industriesHeading || industriesDescription) {
            const headerTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: industriesSection,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
            
            if (industriesBadge) {
                headerTimeline.from(industriesBadge, {
                    y: 30,
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.6,
                    ease: 'back.out(1.7)'
                });
            }
            
            if (industriesHeading) {
                headerTimeline.from(industriesHeading, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.3');
            }
            
            if (industriesDescription) {
                headerTimeline.from(industriesDescription, {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.5');
            }
        }
        
        // Cards animations
        if (industryCards.length) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const pointerFine = window.matchMedia('(pointer: fine)').matches;
            
            industryCards.forEach(card => {
                const iconWrapper = card.querySelector('.w-16.h-16');
                const svgPaths = card.querySelectorAll('svg path');
                const contentElements = Array.from(card.querySelectorAll('h3, p'));
                
                gsap.set(card, { autoAlpha: 1 });

                if (prefersReducedMotion) {
                    gsap.set(card, { opacity: 1, y: 0, scale: 1 });
                    if (iconWrapper) {
                        gsap.set(iconWrapper, { opacity: 1, y: 0, scale: 1, rotateX: 0 });
                    }
                    if (svgPaths.length) {
                        gsap.set(svgPaths, { strokeDashoffset: 0 });
                    }
                    if (contentElements.length) {
                        gsap.set(contentElements, { opacity: 1, y: 0 });
                    }
                    return;
                }

                if (svgPaths.length) {
                    svgPaths.forEach(path => {
                        const length = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 0;
                        if (length) {
                            gsap.set(path, {
                                strokeDasharray: length,
                                strokeDashoffset: length
                            });
                        }
                    });
                }

                const cardTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 83%',
                        end: 'bottom 65%',
                        toggleActions: 'play none none reverse'
                    }
                });

                cardTimeline.from(card, {
                    y: 40,
                    opacity: 0,
                    scale: 0.94,
                    duration: 0.6,
                    ease: 'power3.out'
                });

                if (iconWrapper) {
                    cardTimeline.from(iconWrapper, {
                        y: 14,
                        opacity: 0,
                        scale: 0.9,
                        rotateX: -8,
                        duration: 0.45,
                        ease: 'power2.out'
                    }, '-=0.4');
                }

                if (svgPaths.length) {
                    cardTimeline.to(svgPaths, {
                        strokeDashoffset: 0,
                        duration: 0.8,
                        ease: 'power2.out',
                        stagger: 0.05
                    }, '-=0.35');
                }

                if (contentElements.length) {
                    cardTimeline.from(contentElements, {
                        y: 12,
                        opacity: 0,
                        duration: 0.45,
                        ease: 'power2.out',
                        stagger: 0.08
                    }, '-=0.3');
                }

                if (pointerFine) {
                    const hoverTimeline = gsap.timeline({ paused: true });
                    
                    hoverTimeline.to(card, {
                        y: -8,
                        scale: 1.03,
                        boxShadow: '0 22px 45px -18px rgba(54, 177, 225, 0.35)',
                        duration: 0.35,
                        ease: 'power2.out'
                    }, 0);
                    
                    if (iconWrapper) {
                        hoverTimeline.to(iconWrapper, {
                            y: -4,
                            scale: 1.05,
                            duration: 0.35,
                            ease: 'power2.out'
                        }, 0);
                    }
                    
                    card.addEventListener('mouseenter', () => hoverTimeline.play());
                    card.addEventListener('mouseleave', () => hoverTimeline.reverse());
                }
            });
        }
    }

    ScrollTrigger.addEventListener('refresh', () => smoother && smoother.refresh && smoother.refresh());
    ScrollTrigger.refresh();
});

