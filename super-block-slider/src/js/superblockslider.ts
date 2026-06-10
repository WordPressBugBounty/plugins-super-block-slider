interface SliderSettings {
    initialActiveSlide: number;
    loopSlide: boolean;
    autoplay: boolean;
    autoplayIntervalMs: number;
    slideNavigation: string;
    hoverPause: boolean;
    transitionEffect: string;
    transitionDuration: string;
    animation: string;
    arrowNavigation: boolean;
    variableHeight: boolean;
}

interface SliderState {
    currentSlideIndex: number;
    currentSlideId: number;
    previousSlideId: number;
    isAnimating: boolean;
    autoplayStatus: 'playing' | 'paused' | 'stopped';
    autoplayTime?: number;
    pressDownX: number | null;
}

class SuperBlockSlider {
    private el: HTMLElement;
    private track: HTMLElement;
    private buttons: NodeListOf<HTMLElement>;
    private btnPrev: HTMLElement | null;
    private btnNext: HTMLElement | null;
    private parallaxSlides: NodeListOf<HTMLElement>;

    private settings: SliderSettings;
    private state: SliderState;
    private offsetPercent: number;

    constructor(el: HTMLElement) {
        this.el = el;
        this.track = el.querySelector('.superblockslider__track') as HTMLElement;
        this.buttons = el.querySelectorAll('.superblockslider__button');
        this.btnPrev = el.querySelector('.superblockslider__button__previous');
        this.btnNext = el.querySelector('.superblockslider__button__next');
        this.parallaxSlides = el.querySelectorAll('.superblockslider__slide[data-parallax="true"]');

        this.settings = this.parseSettings(el);

        this.state = {
            currentSlideIndex: this.settings.initialActiveSlide,
            currentSlideId: this.settings.initialActiveSlide,
            previousSlideId: this.settings.initialActiveSlide,
            isAnimating: false,
            autoplayStatus: this.settings.autoplay ? 'playing' : 'stopped',
            pressDownX: null,
        };

        const slides = this.getSlides();
        this.offsetPercent = slides.length > 0 ? 100 / slides.length : 100;

        this.init();
    }

    private parseSettings(el: HTMLElement): SliderSettings {
        const parseBool = (attr: string | null, def: boolean) => attr ? true : def;
        const parseInverseBool = (attr: string | null, def: boolean) => attr ? false : def;

        const autoplayIntervalAttr = el.getAttribute('data-autoplay-interval') || '1.5s';
        let autoplayIntervalMs = 1500;
        if (autoplayIntervalAttr.includes('ms')) {
            autoplayIntervalMs = parseInt(autoplayIntervalAttr.replace('ms', ''));
        } else {
            autoplayIntervalMs = parseFloat(autoplayIntervalAttr.replace('s', '')) * 1000;
        }

        return {
            initialActiveSlide: parseInt(el.getAttribute('data-initial-active-slide') || '0'),
            loopSlide: parseInverseBool(el.getAttribute('data-loop-slide'), true),
            autoplay: parseInverseBool(el.getAttribute('data-autoplay'), true),
            autoplayIntervalMs,
            slideNavigation: el.getAttribute('data-slide-navigation') || 'dots',
            hoverPause: parseInverseBool(el.getAttribute('data-hover-pause'), true),
            transitionEffect: el.getAttribute('data-transition-effect') || 'slide',
            transitionDuration: el.getAttribute('data-transition-duration') || '.6s',
            animation: el.getAttribute('data-animation') || 'cubic-bezier(0.46, 0.03, 0.52, 0.96)',
            arrowNavigation: parseInverseBool(el.getAttribute('data-arrow-navigation'), true),
            variableHeight: parseBool(el.getAttribute('data-variable-height'), false),
        };
    }

    private init() {
        // Initial setup
        this.applyTrackTransform(this.state.currentSlideIndex * this.offsetPercent);

        // Bind Events
        this.track.addEventListener('transitionstart', () => this.handleTransitionStart());
        this.track.addEventListener('transitionend', () => this.handleTransitionEnd());

        if (this.btnPrev && this.btnNext) {
            this.btnPrev.addEventListener('click', () => this.prevSlide(true));
            this.btnNext.addEventListener('click', () => this.nextSlide(true));
        }

        if (this.settings.slideNavigation !== 'none') {
            this.buttons.forEach((button) => {
                button.addEventListener('click', () => {
                    if (!this.state.isAnimating) {
                        const slideId = parseInt(button.getAttribute('data-button-id') || '0');
                        this.animateTrackToSlideId(slideId, true);
                    }
                });
            });
        }

        // Touch & Mouse Drag
        this.bindDragEvents();

        // Autoplay Hover
        if (this.settings.autoplay && this.settings.hoverPause) {
            this.el.addEventListener('mouseover', () => {
                if (this.state.autoplayStatus === 'playing') this.state.autoplayStatus = 'paused';
            });
            this.el.addEventListener('mouseout', () => {
                if (this.state.autoplayStatus === 'paused') this.state.autoplayStatus = 'playing';
            });
        }

        // Parallax & Variable Height Initialization
        if (this.parallaxSlides.length > 0) this.initParallax();
        if (this.settings.variableHeight) this.updateSliderHeight();
    }

    private getSlides(): HTMLElement[] {
        return Array.from(this.el.querySelectorAll('.superblockslider__slide'));
    }

    private getSlideById(id: number): HTMLElement | null {
        return this.el.querySelector(`[data-slide-index="${id}"]`);
    }

    private applyTrackTransform(percentOffset: number) {
        this.track.style.transform = `translateX(-${percentOffset}%)`;
    }

    private applyTrackTransition(duration: string, timing: string) {
        this.track.style.transition = `all ${duration} ${timing}`;
    }

    private removeTrackTransition() {
        this.track.style.transition = 'none';
    }

    public onResize() {
        if (this.parallaxSlides.length > 0) this.initParallax();
        if (this.settings.variableHeight) this.updateSliderHeight();
    }

    public onScroll() {
        if (this.parallaxSlides.length === 0) return;

        const windowHeight = window.innerHeight;
        this.parallaxSlides.forEach(slide => {
            const speedAttr = slide.getAttribute('data-parallax-speed');
            if (!speedAttr) return;

            const speed = parseInt(speedAttr) / 100;
            const rect = slide.getBoundingClientRect();
            const bg = slide.querySelector('.superblockslider__slide__bg') as HTMLElement;

            if (rect.y <= windowHeight && rect.y >= -windowHeight) {
                const offset = speed * (windowHeight - rect.y);
                const totalOffset = speed * windowHeight;
                bg.style.transform = `translateY(${offset - totalOffset}px)`;
            } else {
                bg.style.transform = `translateY(0px)`;
            }
        });
    }

    public onFrame(timestamp: number) {
        if (this.state.autoplayStatus !== 'playing') {
            this.state.autoplayTime = undefined;
            return;
        }

        if (this.state.autoplayTime === undefined) {
            this.state.autoplayTime = timestamp;
        }

        const elapsed = timestamp - this.state.autoplayTime;
        if (elapsed >= this.settings.autoplayIntervalMs) {
            this.state.autoplayTime = timestamp;
            this.nextSlide(false);
        }
    }

    private prevSlide(userTriggered: boolean = false) {
        this.removeAnimatingClasses();
        this.state.previousSlideId = this.state.currentSlideId;
        const slides = this.getSlides();
        let targetId = this.state.currentSlideId - 1;
        if (targetId < 0) targetId = slides.length - 1;
        this.animateTrackToSlideId(targetId, userTriggered);
    }

    private nextSlide(userTriggered: boolean = false) {
        this.removeAnimatingClasses();
        this.state.previousSlideId = this.state.currentSlideId;
        const slides = this.getSlides();
        let targetId = this.state.currentSlideId + 1;
        if (targetId > slides.length - 1) targetId = 0;
        this.animateTrackToSlideId(targetId, userTriggered);
    }

    private animateTrackToSlideId(targetId: number, stopAutoplay: boolean) {
        if (this.state.isAnimating) return;
        if (stopAutoplay) this.state.autoplayStatus = 'stopped';
        if (this.state.currentSlideId === targetId) return;

        let targetDOMIndex = targetId;
        const slides = this.getSlides();

        if (this.settings.transitionEffect === 'slide' && this.settings.loopSlide) {
            this.restructureDOMForInfiniteLoop(targetId, slides);

            // Re-evaluate target index after DOM shift
            const slideNode = this.getSlideById(targetId);
            if (slideNode && slideNode.parentNode) {
                targetDOMIndex = Array.from(slideNode.parentNode.children).indexOf(slideNode);
            }
        }

        // Execute animation on next tick to allow DOM updates to flush
        setTimeout(() => this.executeAnimation(targetId, targetDOMIndex), 50);
    }

    private restructureDOMForInfiniteLoop(targetId: number, slides: HTMLElement[]) {
        // If moving backwards to the end
        if (this.state.currentSlideIndex === 0 && slides.length > 2) {
            this.removeTrackTransition();
            this.track.prepend(slides[slides.length - 1]);
            this.state.currentSlideIndex = 1;
            this.applyTrackTransform(this.state.currentSlideIndex * this.offsetPercent);
        }
        // If moving forwards to the start
        else if (this.state.currentSlideIndex === slides.length - 1) {
            this.removeTrackTransition();
            this.state.currentSlideIndex = slides.length - 2;
            this.applyTrackTransform(this.state.currentSlideIndex * this.offsetPercent);
            this.track.append(slides[0]);
        }
    }

    private executeAnimation(targetId: number, targetDOMIndex: number) {
        if (this.settings.transitionEffect === 'slide') {
            this.applyTrackTransition(this.settings.transitionDuration, this.settings.animation);
            this.applyTrackTransform(targetDOMIndex * this.offsetPercent);
        }

        this.state.currentSlideIndex = targetDOMIndex;
        this.state.currentSlideId = targetId;

        if (this.settings.transitionEffect === 'fade') {
            this.handleTransitionEnd(); // Fade relies entirely on CSS classes updated in transitionEnd
        }
    }

    private handleTransitionStart() {
        this.state.isAnimating = true;
        if (this.state.autoplayStatus === 'playing') this.state.autoplayStatus = 'paused';

        if (this.settings.transitionEffect === 'slide') {
            this.applyTrackTransition(this.settings.transitionDuration, this.settings.animation);
        }

        if (this.settings.variableHeight) this.updateSliderHeight();

        this.getSlideById(this.state.currentSlideId)?.classList.add('superblockslider__slide--animating-in');
        this.getSlideById(this.state.previousSlideId)?.classList.add('superblockslider__slide--animating-out');
    }

    private handleTransitionEnd() {
        const activeClass = 'superblockslider__slide--active';
        this.el.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
        this.getSlideById(this.state.currentSlideId)?.classList.add(activeClass);

        if (this.settings.slideNavigation !== 'none') {
            const btnClass = 'superblockslider__button--active';
            this.el.querySelector(`.${btnClass}`)?.classList.remove(btnClass);
            if (this.buttons[this.state.currentSlideId]) {
                this.buttons[this.state.currentSlideId].classList.add(btnClass);
            }
        }

        this.state.isAnimating = false;
        if (this.state.autoplayStatus === 'paused') this.state.autoplayStatus = 'playing';
    }

    private removeAnimatingClasses() {
        this.getSlideById(this.state.currentSlideId)?.classList.remove('superblockslider__slide--animating-in');
        this.getSlideById(this.state.previousSlideId)?.classList.remove('superblockslider__slide--animating-out');
    }

    private initParallax() {
        const windowHeight = window.innerHeight;
        const rect = this.el.getBoundingClientRect();

        this.parallaxSlides.forEach(slide => {
            const speedAttr = slide.getAttribute('data-parallax-speed');
            const speed = speedAttr ? parseInt(speedAttr) / 100 : 0;
            const bg = slide.querySelector('.superblockslider__slide__bg') as HTMLElement;
            const img = bg.querySelector('img') as HTMLImageElement;

            const requiredHeight = (speed * windowHeight / 2) + rect.height;
            img.style.height = `${requiredHeight}px`;

            const totalOffset = speed * windowHeight;
            let offset = 0;
            if (rect.y <= windowHeight && rect.y >= -windowHeight) {
                offset = speed * (windowHeight - rect.y);
            }
            bg.style.transform = `translateY(${offset - totalOffset}px)`;
        });
    }

    private updateSliderHeight() {
        this.el.style.transition = `height ease ${this.settings.transitionDuration}`;
        const screenSize = this.getScreenSize();
        const img = this.el.querySelector(`[data-slide-index="${this.state.currentSlideId}"] img.visible--${screenSize}`) as HTMLImageElement;

        if (img) {
            const origWidth = Number(img.getAttribute('width'));
            const origHeight = Number(img.getAttribute('height'));
            const newHeight = this.calculateVariableHeight(origWidth, this.el.offsetWidth, origHeight);
            this.el.style.height = `${newHeight}px`;
        }
    }

    private calculateVariableHeight(origWidth: number, newWidth: number, origHeight: number): number {
        const diff = Math.abs(origWidth - newWidth);
        const percent = diff / origWidth;
        return origWidth < newWidth
            ? origHeight + (percent * origHeight)
            : origHeight - (percent * origHeight);
    }

    private getScreenSize(): string {
        const w = window.innerWidth;
        if (w > 1280) return 'xl';
        if (w >= 1024) return 'lg';
        if (w >= 768) return 'md';
        return 'sm';
    }

    private bindDragEvents() {
        const mouseThreshold = 150;
        const touchThreshold = 6;

        this.el.addEventListener('mousedown', (e) => this.state.pressDownX = e.pageX);
        this.el.addEventListener('mouseup', (e) => {
            if (this.state.pressDownX === null) return;
            const diff = e.pageX - this.state.pressDownX;
            if (diff > mouseThreshold) this.nextSlide(true);
            else if (diff < -mouseThreshold) this.prevSlide(true);
            this.state.pressDownX = null;
        });

        this.el.addEventListener('touchstart', (e) => this.state.pressDownX = e.touches[0].clientX, { passive: true });
        this.el.addEventListener('touchmove', (e) => {
            if (this.state.pressDownX === null) return;
            const diff = this.state.pressDownX - e.touches[0].clientX;

            if (diff > touchThreshold) {
                this.nextSlide(true);
                this.state.autoplayStatus = 'stopped';
            } else if (diff < -touchThreshold) {
                this.prevSlide(true);
                this.state.autoplayStatus = 'stopped';
            }
            this.state.pressDownX = null;
        }, { passive: true });
    }
}

class SuperBlockSliderManager {
    static sliders: SuperBlockSlider[] = [];

    static init(selector: string) {
        document.querySelectorAll<HTMLElement>(selector).forEach(el => {
            this.sliders.push(new SuperBlockSlider(el));
        });

        window.addEventListener('resize', () => {
            this.sliders.forEach(s => s.onResize());
        });

        window.addEventListener('scroll', () => {
            this.sliders.forEach(s => s.onScroll());
        });

        const loop = (timestamp: number) => {
            this.sliders.forEach(s => s.onFrame(timestamp));
            window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);
    }
}

(() => {
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            SuperBlockSliderManager.init('.superblockslider');
        }
    }
})();
