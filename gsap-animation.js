document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof ScrollSmoother === 'undefined') {
        console.warn('GSAP or the required plugins did not load correctly.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const hasTextPlugin = typeof TextPlugin !== 'undefined';

    if (hasTextPlugin) {
        gsap.registerPlugin(TextPlugin);
    } else {
        console.warn('GSAP TextPlugin did not load. Text animations will use basic fallbacks.');
    }

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

    const foundationSection = document.querySelector('#foundation');

    if (foundationSection) {
        const scrollContainer = foundationSection.querySelector('.foundation-scroll');
        const introTitle = foundationSection.querySelector('.foundation-intro-title');
        const introCopy = foundationSection.querySelector('.foundation-intro-copy');
        const progressDots = Array.from(foundationSection.querySelectorAll('.foundation-progress-dot'));
        const slides = gsap.utils.toArray(foundationSection.querySelectorAll('.foundation-slide'));

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

        if (scrollContainer && slides.length) {
            const slideData = slides.map((slide, index) => {
                const image = slide.querySelector('.foundation-slide-media img');

                if (image) {
                    gsap.set(image, {
                        scale: 1.12,
                        rotate: -2,
                        filter: 'saturate(0.8) brightness(0.9)'
                    });
                }

                gsap.set(slide, {
                    autoAlpha: index === 0 ? 1 : 0,
                    yPercent: index === 0 ? 0 : 34,
                    zIndex: slides.length - index
                });

                return {
                    slide,
                    image,
                    label: slide.querySelector('.foundation-slide-label'),
                    title: slide.querySelector('.foundation-slide-title'),
                    description: slide.querySelector('.foundation-slide-description'),
                    indexBadge: slide.querySelector('.foundation-slide-index')
                };
            });

            let activeSlideIndex = 0;

            const activateSlide = (index, immediate = false) => {
                const lang = document.documentElement.getAttribute('lang') || 'en';
                const data = slideData[index];

                if (!data) {
                    return;
                }

                slideData.forEach((item, idx) => {
                    item.slide.classList.toggle('is-active', idx === index);
                });

                progressDots.forEach((dot, dotIndex) => {
                    dot.classList.toggle('is-active', dotIndex === index);
                });

                if (data.label) {
                    const labelText = data.label.getAttribute(`data-${lang}`);
                    if (labelText) {
                        data.label.textContent = labelText;
                    }
                }

                if (immediate) {
                    gsap.set(data.slide, { autoAlpha: 1, yPercent: 0 });

                    if (data.indexBadge) {
                        gsap.set(data.indexBadge, { autoAlpha: 1, y: 0 });
                    }

                    if (data.label) {
                        gsap.set(data.label, { autoAlpha: 0.8, y: 0 });
                    }

                    if (data.title) {
                        if (hasTextPlugin) {
                            gsap.killTweensOf(data.title);
                            const titleText = data.title.getAttribute(`data-${lang}`) || data.title.textContent;
                            data.title.textContent = titleText;
                        } else {
                            gsap.set(data.title, { autoAlpha: 1, y: 0 });
                        }
                    }

                    if (data.description) {
                        if (hasTextPlugin) {
                            gsap.killTweensOf(data.description);
                            const descText = data.description.getAttribute(`data-${lang}`) || data.description.textContent;
                            data.description.textContent = descText;
                        } else {
                            gsap.set(data.description, { autoAlpha: 0.85, y: 0 });
                        }
                    }

                    return;
                }

                if (data.indexBadge) {
                    gsap.killTweensOf(data.indexBadge);
                    gsap.fromTo(data.indexBadge, {
                        y: 28,
                        autoAlpha: 0
                    }, {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.55,
                        ease: 'power2.out'
                    });
                }

                if (data.label) {
                    gsap.killTweensOf(data.label);
                    gsap.fromTo(data.label, {
                        y: 22,
                        autoAlpha: 0
                    }, {
                        y: 0,
                        autoAlpha: 0.75,
                        duration: 0.45,
                        ease: 'power2.out'
                    });
                }

                if (data.title) {
                    const titleText = data.title.getAttribute(`data-${lang}`) || data.title.textContent;
                    gsap.killTweensOf(data.title);

                    if (hasTextPlugin) {
                        data.title.textContent = '';
                        gsap.to(data.title, {
                            text: titleText,
                            duration: 0.95,
                            ease: 'power2.out'
                        });
                    } else {
                        gsap.fromTo(data.title, {
                            y: 24,
                            autoAlpha: 0
                        }, {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.55,
                            ease: 'power2.out'
                        });
                    }
                }

                if (data.description) {
                    const descText = data.description.getAttribute(`data-${lang}`) || data.description.textContent;
                    gsap.killTweensOf(data.description);

                    if (hasTextPlugin) {
                        data.description.textContent = '';
                        gsap.to(data.description, {
                            text: descText,
                            duration: 1.1,
                            ease: 'power2.out',
                            delay: 0.05
                        });
                    } else {
                        gsap.fromTo(data.description, {
                            y: 18,
                            autoAlpha: 0
                        }, {
                            y: 0,
                            autoAlpha: 0.85,
                            duration: 0.55,
                            ease: 'power2.out',
                            delay: 0.05
                        });
                    }
                }
            };

            activateSlide(0, true);

            const segmentDuration = 1.5;
            const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

            slideData.forEach((data, index) => {
                const slideStart = index * segmentDuration;

                timeline.addLabel(`foundation-slide-${index}`, slideStart);

                const introDuration = segmentDuration * 0.35;
                const focusDuration = segmentDuration * 0.3;
                const exitDuration = segmentDuration * 0.35;

                timeline.fromTo(data.slide, {
                    autoAlpha: index === 0 ? 1 : 0,
                    yPercent: index === 0 ? 0 : 34
                }, {
                    autoAlpha: 1,
                    yPercent: 0,
                    duration: introDuration,
                    ease: 'power2.out'
                }, slideStart);

                timeline.to(data.slide, {
                    yPercent: 0,
                    duration: focusDuration,
                    ease: 'none'
                }, slideStart + introDuration);

                if (data.image) {
                    timeline.fromTo(data.image, {
                        scale: 1.12,
                        rotate: -2,
                        filter: 'saturate(0.8) brightness(0.88)'
                    }, {
                        scale: 1,
                        rotate: 0,
                        filter: 'saturate(1) brightness(1)',
                        duration: introDuration + focusDuration,
                        ease: 'power2.out'
                    }, slideStart);
                }

                if (index !== slideData.length - 1) {
                    timeline.to(data.slide, {
                        autoAlpha: 0,
                        yPercent: -34,
                        duration: exitDuration,
                        ease: 'power2.in'
                    }, slideStart + introDuration + focusDuration);
                }
            });

            timeline.to({}, { duration: segmentDuration * 0.4 });

            const totalDuration = timeline.duration();
            let snapPoints = null;

            if (slideData.length > 1 && totalDuration > 0) {
                snapPoints = slideData.map((_, index) => {
                    const labelTime = timeline.labels[`foundation-slide-${index}`] ?? 0;
                    return labelTime / totalDuration;
                });

                snapPoints.push(1);
            }

            const triggerConfig = {
                trigger: scrollContainer,
                start: 'top top',
                end: () => `+=${slideData.length * 190}vh`,
                pin: true,
                scrub: true,
                anticipatePin: 1,
                animation: timeline,
                onUpdate: self => {
                    if (!slideData.length) {
                        return;
                    }

                    const rawIndex = Math.round(self.progress * (slideData.length - 1));
                    const boundedIndex = Math.max(0, Math.min(slideData.length - 1, rawIndex));

                    if (boundedIndex !== activeSlideIndex) {
                        activeSlideIndex = boundedIndex;
                        activateSlide(boundedIndex);
                    }
                }
            };

            if (snapPoints && snapPoints.length) {
                triggerConfig.snap = {
                    snapTo: snapPoints,
                    duration: 0.35,
                    ease: 'power1.inOut',
                    inertia: false
                };
            }

            ScrollTrigger.create(triggerConfig);
        }
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
                end: () => `+=${totalCards * 320}`,
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

    ScrollTrigger.addEventListener('refresh', () => smoother && smoother.refresh && smoother.refresh());
    ScrollTrigger.refresh();
});

