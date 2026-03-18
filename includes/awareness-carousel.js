// Swiper-based Awareness Carousel (uses CDN for Swiper)
// Fetches data based on page: carousel.json for index.html, awareness.json for others
// Different designs for slides based on page

async function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

async function initAwarenessSwiper() {
    try {
        // Load Swiper if not available
        if (typeof Swiper === 'undefined') {
            await loadScript('https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js');
        }

        const isIndex = window.location.pathname.includes('index.html');
        const dataUrl = isIndex ? 'data/carousel.json' : 'data/awareness.json';
        const resp = await fetch(dataUrl);
        let blocks;
        if (isIndex) {
            blocks = await resp.json(); // array of {image, h, p}
        } else {
            const data = await resp.json();
            blocks = data.expert_blocks || [];
        }

        const wrapper = document.getElementById('awarenessWrapper');
        const indicators = document.getElementById('carouselIndicators');
        if (!wrapper) return;

        // Inject styles based on page
        const style = document.createElement('style');
        if (isIndex) {
            style.innerHTML = `
                #awarenessWrapper .swiper-slide { display:block; box-sizing:border-box; }
                .swiper { width: 100%; }
                .aw-indicator { position:relative; overflow:hidden; cursor:pointer; height:6px; width:16px; border-radius:9999px; background:rgba(255,255,255,0.25); margin:0 2px; }
                .aw-indicator-fill { position:absolute; top:0; left:0; height:100%; width:0; background:rgba(255,255,255,0.9); border-radius:inherit; }
            `;
        } else {
            style.innerHTML = `
                #awarenessWrapper .swiper-slide { display:flex; justify-content:center; box-sizing:border-box; }
                #awarenessWrapper .aw-card { width:100%; box-sizing:border-box; }
                #awarenessWrapper .aw-card-body { position:relative; padding-bottom:18px; }
                .swiper { width: 100%; }
                .aw-indicator { position:relative; overflow:hidden; cursor:pointer; height:6px; width:16px; border-radius:9999px; background:rgba(255,255,255,0.25); margin:0 2px; }
                .aw-indicator-fill { position:absolute; top:0; left:0; height:100%; width:0; background:rgba(255,255,255,0.9); border-radius:inherit; }
            `;
        }
        document.head.appendChild(style);

        // Populate slides based on page
        blocks.forEach(b => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            if (isIndex) {
                slide.classList.add('flex-shrink-0', 'w-full', 'h-full', 'bg-cover', 'bg-center', "bg-no-repeat", 'rounded-xl');
                slide.style.backgroundImage = `url(${b.image})`;
                slide.innerHTML = `
                    <div class="w-full flex flex-col justify-end rounded-xl h-[450px] xs:h-[600px] sm:h-[570px] md:h-[690px] lg:h-[512px] xl:h-[580px] 2xl:h-[700px] 3xl:h-[870px]">
                        <div class="flex flex-col gap-2 justify-end items-start p-[8%] sm:p-[6%] xl:p-[4%] rounded-b-xl bg-gradient-to-t from-black to-transparent">
                            <h1 class="text-base xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl font-bold text-white">${b.h}</h1>
                            <p class="text-sm xs:text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl text-white/70">${b.p}</p>
                        </div>
                    </div>
                `;
            } else {
                slide.innerHTML = `
                    <div class="aw-card">
                        <div class="flex flex-col aw-card-body bg-white/60 rounded-xl p-[3%] xs:p-[4%] 2xl:p-[2%] gap-[2vh]">
                            <div class="flex items-center gap-[1vh] 2xl:gap-[2vh]">
                                <img src="${b.expert.image}" class="h-[6vh] w-[6vh] 2xl:h-[10vh] 2xl:w-[10vh] object-contain object-center rounded-full">
                                <div class="flex flex-col text-black/85 font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl">
                                    <div class="flex gap-1"><p>${b.expert.name}</p><p>${b.expert.surname}</p></div>
                                    <div class="flex text-nowrap gap-1 font-bold"><p>${b.expert.title_mk}</p><p class="hidden xs:flex">во</p><p class="hidden xs:flex">${b.expert.organization_mk}</p></div>
                                </div>
                            </div>
                            ${Array.isArray(b.quotes_mk) ? b.quotes_mk.map(q => `<p class="text-sm md:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl text-black/75">${q}</p>`).join('') : `<p class="text-lg text-black/75">${b.quotes_mk}</p>`}
                            <p class="text-black/50 text-xs sm:text-sm 2xl:text-base 3xl:text-lg pt-[3vh]">Цитатот е превземен од <a target="_blank" class="text-black/75 hover:text-black transition-all duration-300" href="${b.expert.source_link}">${b.expert.source_publication}</a></p>
                        </div>
                    </div>
                `;
            }
            wrapper.appendChild(slide);
        });

        // Build indicators
        if (indicators) {
            indicators.innerHTML = '';
            blocks.forEach((_, i) => {
                const el = document.createElement('div');
                el.className = 'aw-indicator';
                el.dataset.index = i;

                const fill = document.createElement('div');
                fill.className = 'aw-indicator-fill';
                el.appendChild(fill);

                el.addEventListener('click', () => {
                    swiper.slideTo(i);
                    resetTimer();
                });

                indicators.appendChild(el);
            });
        }

        // Initialize Swiper
        const swiper = new Swiper('#awarenessSwiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            slidesPerGroup: 1,
            loop: false,
        });

        // Timer variables
        const timerDelay = 12000;
        let timerRaf = null;
        let startTime = null;
        let paused = false;
        let pausedTime = 0;
        let lastFrameTime = performance.now();

        // Helpers
        function clearAllFills() {
            if (!indicators) return;
            Array.from(indicators.children).forEach(ind => {
                const f = ind.querySelector('.aw-indicator-fill');
                if (f) f.style.width = '0';
            });
        }

        function setActiveFill(progress) {
            if (!indicators) return;
            const active = indicators.children[swiper.activeIndex];
            if (!active) return;
            const f = active.querySelector('.aw-indicator-fill');
            if (f) f.style.width = `${Math.min(100, progress * 100)}%`;
        }

        function updateIndicatorsWidth() {
            if (!indicators) return;
            Array.from(indicators.children).forEach((n, i) => {
                n.style.width = (i === swiper.activeIndex ? '80px' : '20px');
            });
        }

        // Ultra-smooth tick
        function tick(time) {
            if (paused) {
                startTime += time - lastFrameTime; // freeze progress
                lastFrameTime = time;
                timerRaf = requestAnimationFrame(tick);
                return;
            }

            if (!startTime) startTime = time - pausedTime;
            const elapsed = time - startTime;
            const progress = Math.min(1, elapsed / timerDelay);
            setActiveFill(progress);

            if (progress >= 1) {
                startTime = null;
                pausedTime = 0;
                clearAllFills();
                if (swiper.activeIndex === swiper.slides.length - 1) swiper.slideTo(0);
                else swiper.slideNext();
                startTime = performance.now();
            }

            lastFrameTime = time;
            timerRaf = requestAnimationFrame(tick);
        }

        // Restart or reset timer
        function restartTimer() {
            if (timerRaf) cancelAnimationFrame(timerRaf);
            paused = false;
            pausedTime = 0;
            startTime = performance.now();
            updateIndicatorsWidth();
            clearAllFills();
            timerRaf = requestAnimationFrame(tick);
        }

        function resetTimer() {
            // called whenever slide changes via buttons or indicators
            if (timerRaf) cancelAnimationFrame(timerRaf);
            paused = false;
            pausedTime = 0;
            startTime = null; // reset progress for new slide
            updateIndicatorsWidth();
            clearAllFills();
            timerRaf = requestAnimationFrame(tick);
        }

        // Initial setup
        updateIndicatorsWidth();
        restartTimer();

        // Slide change event resets timer
        swiper.on('slideChange', () => {
            resetTimer();
        });

        // Prev/Next buttons
        const prevBtnEl = document.getElementById('prevBtn');
        const nextBtnEl = document.getElementById('nextBtn');

        if (prevBtnEl) prevBtnEl.disabled = false;
        if (nextBtnEl) nextBtnEl.disabled = false;

        prevBtnEl?.addEventListener('click', e => {
            e.preventDefault();
            if (swiper.activeIndex === 0) swiper.slideTo(swiper.slides.length - 1);
            else swiper.slidePrev();
            resetTimer();
        });

        nextBtnEl?.addEventListener('click', e => {
            e.preventDefault();
            if (swiper.activeIndex === swiper.slides.length - 1) swiper.slideTo(0);
            else swiper.slideNext();
            resetTimer();
        });

        // Pause on hover, resume on leave
        if (isIndex) {
            Array.from(wrapper.querySelectorAll('.swiper-slide')).forEach(slideEl => {
                slideEl.addEventListener('mouseenter', () => {
                    paused = true;
                    pausedTime = performance.now() - startTime;
                });
                slideEl.addEventListener('mouseleave', () => {
                    paused = false;
                    startTime = performance.now() - pausedTime;
                    timerRaf = requestAnimationFrame(tick);
                });
            });
        } else {
            Array.from(wrapper.querySelectorAll('.swiper-slide')).forEach(slideEl => {
                const card = slideEl.querySelector('.aw-card');
                if (!card) return;
                card.addEventListener('mouseenter', () => {
                    paused = true;
                    pausedTime = performance.now() - startTime;
                });
                card.addEventListener('mouseleave', () => {
                    paused = false;
                    startTime = performance.now() - pausedTime;
                    timerRaf = requestAnimationFrame(tick);
                });
            });
        }

    } catch (err) {
        console.error('Awareness swiper init failed', err);
    }
}

// Init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAwarenessSwiper);
} else {
    initAwarenessSwiper();
}