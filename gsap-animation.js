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
    // NAVBAR ANIMATIONS
    // ====================================
    
    const header = document.querySelector('header');
    const logo = header ? header.querySelector('img') : null;
    const navLinks = header ? header.querySelectorAll('.nav-link') : null;
    const langButtons = header ? header.querySelectorAll('.lang-btn') : null;
    const mobileMenuBtn = header ? header.querySelector('#mobile-menu-btn') : null;
    const mobileMenu = document.querySelector('#mobile-menu');
    
    if (header) {
        // Initial state - hide navbar
        gsap.set(header, { y: -100, opacity: 0 });
        
        // Navbar entrance animation on page load
        const navbarTimeline = gsap.timeline({ delay: 0.3 });
        
        navbarTimeline.to(header, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Logo animation with rotation and scale
        if (logo) {
            gsap.set(logo, { scale: 0, rotate: -180, opacity: 0 });
            navbarTimeline.to(logo, {
                scale: 1,
                rotate: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'elastic.out(1, 0.6)'
            }, '-=0.5');
        }
        
        // Nav links staggered animation
        if (navLinks && navLinks.length) {
            gsap.set(navLinks, { y: -20, opacity: 0 });
            navbarTimeline.to(navLinks, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out'
            }, '-=0.6');
            
            // Magnetic hover effect for nav links
            navLinks.forEach(link => {
                // Create animated underline
                const underline = document.createElement('span');
                underline.classList.add('nav-link-underline');
                link.style.position = 'relative';
                link.style.display = 'inline-block';
                link.appendChild(underline);
                
                gsap.set(underline, {
                    position: 'absolute',
                    bottom: '-4px',
                    left: '0',
                    width: '0%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #36B1E1, #2563eb)',
                    borderRadius: '2px',
                    transformOrigin: 'left center'
                });
                
                // Hover animations
                link.addEventListener('mouseenter', () => {
                    gsap.to(link, {
                        y: -2,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    gsap.to(underline, {
                        width: '100%',
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                });
                
                link.addEventListener('mouseleave', () => {
                    gsap.to(link, {
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    gsap.to(underline, {
                        width: '0%',
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                });
                
                // Click ripple effect
                link.addEventListener('click', (e) => {
                    const ripple = document.createElement('span');
                    ripple.classList.add('nav-ripple');
                    
                    const rect = link.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    Object.assign(ripple.style, {
                        position: 'absolute',
                        width: `${size}px`,
                        height: `${size}px`,
                        left: `${x}px`,
                        top: `${y}px`,
                        background: 'radial-gradient(circle, rgba(54, 177, 225, 0.4), transparent)',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        transform: 'scale(0)',
                        zIndex: '-1'
                    });
                    
                    link.appendChild(ripple);
                    
                    gsap.to(ripple, {
                        scale: 2,
                        opacity: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        onComplete: () => ripple.remove()
                    });
                });
            });
        }
        
        // Language buttons animation
        if (langButtons && langButtons.length) {
            gsap.set(langButtons, { scale: 0, opacity: 0 });
            navbarTimeline.to(langButtons, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            }, '-=0.4');
            
            // Add smooth transition for language toggle
            langButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    gsap.to(btn, {
                        scale: 0.9,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.inOut'
                    });
                });
            });
        }
        
        // Mobile menu button animation
        if (mobileMenuBtn) {
            gsap.set(mobileMenuBtn, { scale: 0, opacity: 0 });
            navbarTimeline.to(mobileMenuBtn, {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'back.out(1.7)'
            }, '-=0.4');
            
            // Mobile menu toggle animation
            let isMenuOpen = false;
            
            mobileMenuBtn.addEventListener('click', () => {
                isMenuOpen = !isMenuOpen;
                
                // Button icon animation
                const icon = mobileMenuBtn.querySelector('svg');
                gsap.to(icon, {
                    rotation: isMenuOpen ? 90 : 0,
                    scale: isMenuOpen ? 0.9 : 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                if (mobileMenu) {
                    if (isMenuOpen) {
                        // Open animation
                        mobileMenu.classList.remove('hidden');
                        gsap.set(mobileMenu, { height: 0, opacity: 0 });
                        
                        gsap.to(mobileMenu, {
                            height: 'auto',
                            opacity: 1,
                            duration: 0.4,
                            ease: 'power3.out'
                        });
                        
                        const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
                        gsap.fromTo(mobileLinks, {
                            x: -30,
                            opacity: 0
                        }, {
                            x: 0,
                            opacity: 1,
                            duration: 0.4,
                            stagger: 0.08,
                            ease: 'power2.out',
                            delay: 0.1
                        });
                    } else {
                        // Close animation
                        gsap.to(mobileMenu, {
                            height: 0,
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => {
                                mobileMenu.classList.add('hidden');
                            }
                        });
                    }
                }
            });
        }
        
        // Scroll-based navbar animations
        let lastScrollY = 0;
        let isNavbarVisible = true;
        let isNavbarShrunk = false;
        
        ScrollTrigger.create({
            start: 'top top',
            end: 'max',
            onUpdate: (self) => {
                const currentScrollY = self.scroll();
                const scrollingDown = currentScrollY > lastScrollY;
                const scrollDistance = Math.abs(currentScrollY - lastScrollY);
                
                // Hide/Show navbar based on scroll direction
                if (scrollDistance > 10) {
                    if (scrollingDown && currentScrollY > 100 && isNavbarVisible) {
                        // Hide navbar when scrolling down
                        isNavbarVisible = false;
                        gsap.to(header, {
                            y: -100,
                            duration: 0.3,
                            ease: 'power2.in'
                        });
                    } else if (!scrollingDown && !isNavbarVisible) {
                        // Show navbar when scrolling up
                        isNavbarVisible = true;
                        gsap.to(header, {
                            y: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                }
                
                // Shrink navbar on scroll
                if (currentScrollY > 50 && !isNavbarShrunk) {
                    isNavbarShrunk = true;
                    
                    gsap.to(header, {
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    gsap.to(header.querySelector('.container > div'), {
                        height: '60px',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    if (logo) {
                        gsap.to(logo, {
                            scale: 0.85,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                    
                } else if (currentScrollY <= 50 && isNavbarShrunk) {
                    isNavbarShrunk = false;
                    
                    gsap.to(header, {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    gsap.to(header.querySelector('.container > div'), {
                        height: '64px',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    if (logo) {
                        gsap.to(logo, {
                            scale: 1,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                }
                
                lastScrollY = currentScrollY;
            }
        });
        
        // Active section indicator
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length && navLinks) {
            ScrollTrigger.batch(sections, {
                onEnter: (batch) => {
                    const currentSection = batch[0];
                    const sectionId = currentSection.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        const isActive = href === `#${sectionId}`;
                        
                        if (isActive) {
                            gsap.to(link, {
                                color: '#36B1E1',
                                fontWeight: 600,
                                duration: 0.3,
                                ease: 'power2.out'
                            });
                        } else {
                            gsap.to(link, {
                                color: '#111827',
                                fontWeight: 400,
                                duration: 0.3,
                                ease: 'power2.out'
                            });
                        }
                    });
                },
                start: 'top center',
                end: 'bottom center'
            });
        }
        
        // Logo hover animation
        if (logo) {
            const logoParent = logo.parentElement;
            
            logoParent.addEventListener('mouseenter', () => {
                gsap.to(logo, {
                    scale: 1.1,
                    rotate: 5,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
            
            logoParent.addEventListener('mouseleave', () => {
                gsap.to(logo, {
                    scale: isNavbarShrunk ? 0.85 : 1,
                    rotate: 0,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        }
        
        // Parallax effect on navbar
        gsap.to(header, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.5
            },
            ease: 'none'
        });
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

    ScrollTrigger.addEventListener('refresh', () => smoother && smoother.refresh && smoother.refresh());
    ScrollTrigger.refresh();
});

