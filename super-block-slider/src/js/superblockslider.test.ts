import { SuperBlockSlider, SuperBlockSliderManager } from './superblockslider';

describe('SuperBlockSlider - Mouse Swipe Direction', () => {
    let container: HTMLElement;
    let slider: SuperBlockSlider;

    beforeEach(() => {
        container = document.createElement('div');
        container.classList.add('superblockslider');
        container.innerHTML = `
            <div class="superblockslider__track">
                <div class="superblockslider__slide" data-slide-index="0">Slide 1</div>
                <div class="superblockslider__slide" data-slide-index="1">Slide 2</div>
                <div class="superblockslider__slide" data-slide-index="2">Slide 3</div>
            </div>
            <button class="superblockslider__button__previous">Prev</button>
            <button class="superblockslider__button__next">Next</button>
        `;
        document.body.appendChild(container);
        
        slider = new SuperBlockSlider(container);
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    it('should navigate to previous slide on left-to-right mouse drag', () => {
        const prevSlideSpy = jest.spyOn(slider as any, 'prevSlide');
        const nextSlideSpy = jest.spyOn(slider as any, 'nextSlide');

        const mouseDown = new MouseEvent('mousedown', { bubbles: true, clientX: 100, clientY: 100 });
        Object.defineProperty(mouseDown, 'pageX', { value: 100 });
        container.dispatchEvent(mouseDown);

        const mouseUp = new MouseEvent('mouseup', { bubbles: true, clientX: 300, clientY: 100 });
        Object.defineProperty(mouseUp, 'pageX', { value: 300 });
        container.dispatchEvent(mouseUp);

        expect(prevSlideSpy).toHaveBeenCalledWith(true);
        expect(nextSlideSpy).not.toHaveBeenCalled();
    });

    it('should not restructure DOM when clicking forward from first slide to a middle slide', () => {
        // Setup buttons to act as navigation dots
        const button1 = document.createElement('button');
        button1.classList.add('superblockslider__button');
        button1.setAttribute('data-button-id', '1');
        container.appendChild(button1);

        // Re-init to pick up the new button
        slider = new SuperBlockSlider(container);

        // Current index should be 0. Let's spy on track prepend
        const prependSpy = jest.spyOn(slider['track'], 'prepend');
        
        // Act: click button to go to slide 1 (which is the second slide)
        button1.click();

        // Assert: It should not prepend the last slide because we are not going backwards to the end.
        expect(prependSpy).not.toHaveBeenCalled();
    });

    it('should not call play() on video elements during initialization (ADR 0004)', () => {
        // Setup a slide with a video
        container.innerHTML = `
            <div class="superblockslider__track">
                <div class="superblockslider__slide" data-slide-index="0">
                    <video data-autoplay="true" src="test.mp4"></video>
                </div>
            </div>
        `;
        const video = container.querySelector('video') as HTMLVideoElement;
        
        // JSDOM video element doesn't have play() implemented by default, we mock it.
        video.play = jest.fn().mockReturnValue(Promise.resolve());
        video.pause = jest.fn();

        slider = new SuperBlockSlider(container);

        // Assert play is not called on init
        expect(video.play).not.toHaveBeenCalled();
        // It should still pause inactive videos, though in this case it's active.
    });

    it('should not trigger horizontal swipe if mostly scrolling vertically (Bug 4)', () => {
        const nextSlideSpy = jest.spyOn(slider as any, 'nextSlide');

        // touch start
        const touchStart = new Event('touchstart') as any;
        touchStart.touches = [{ clientX: 100, clientY: 100 }];
        container.dispatchEvent(touchStart);

        // touch move (moving left 40px, moving down 100px - mostly vertical)
        const touchMove = new Event('touchmove') as any;
        touchMove.touches = [{ clientX: 60, clientY: 200 }];
        container.dispatchEvent(touchMove);

        // Should not trigger slide change because Y movement > X movement
        expect(nextSlideSpy).not.toHaveBeenCalled();
    });

    it('should not use requestAnimationFrame for autoplay loop (Bug 5)', () => {
        const rafSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => 0);
        
        // Re-run manager init to see if it calls requestAnimationFrame
        SuperBlockSliderManager.init('.superblockslider');

        expect(rafSpy).not.toHaveBeenCalled();
    });
});
