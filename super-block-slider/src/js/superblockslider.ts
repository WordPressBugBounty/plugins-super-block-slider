(() => {
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            superblockslider('.superblockslider')
        }
    }
    
    const superblockslider = (superblocksliderSlides: string)=> {
        // slides query
        const superblocksliderSlider = document.querySelectorAll<HTMLElement>(superblocksliderSlides)
        superblocksliderSlider.forEach((slider, index) => {
            // load settings
            
            const initialActiveSlideAttr = slider.getAttribute('data-initial-active-slide')
            const loopSlideAttr = slider.getAttribute('data-loop-slide')
            const autoplayAttr = slider.getAttribute('data-autoplay')
            const autoplayIntervalAttr = slider.getAttribute('data-autoplay-interval')
            const slideNavigationAttr = slider.getAttribute('data-slide-navigation')
            const hoverPauseAttr = slider.getAttribute('data-hover-pause')
            const transitionEffectAttr = slider.getAttribute('data-transition-effect')
            const transitionDurationAttr = slider.getAttribute('data-transition-duration')
            const animationAttr = slider.getAttribute('data-animation')

            const transitionSpeedAttr = slider.getAttribute('data-transition-speed')
            const arrowNavigationAttr = slider.getAttribute('data-arrow-navigation')
            const variableHeightAttr = slider.getAttribute('data-variable-height')

            const settings: {
                initialActiveSlide: number;
                loopSlide: boolean;
                autoplay: boolean;
                autoplayInterval: string;
                slideNavigation: string;
                hoverPause: boolean;
                transitionEffect: string;
                transitionDuration: string;
                animation: string;

                transitionSpeed: string;
                arrowNavigation: boolean;
                variableHeight: boolean;
            } =  {
                initialActiveSlide: initialActiveSlideAttr ? parseInt(initialActiveSlideAttr!) : 0,
                loopSlide: loopSlideAttr ? false : true,
                autoplay: autoplayAttr ? false : true,
                autoplayInterval: autoplayIntervalAttr ? autoplayIntervalAttr! : '1.5s',
                slideNavigation: slideNavigationAttr ? slideNavigationAttr! : 'dots',
                hoverPause: hoverPauseAttr ? false : true,
                transitionEffect: transitionEffectAttr ? transitionEffectAttr! : 'slide',
                transitionDuration: transitionDurationAttr ? transitionDurationAttr! : '.6s',
                animation: animationAttr ? animationAttr! : 'cubic-bezier(0.46, 0.03, 0.52, 0.96)',

                transitionSpeed: transitionSpeedAttr ? transitionSpeedAttr! : '.6s',
                arrowNavigation: arrowNavigationAttr ? false : true,
                variableHeight: variableHeightAttr ? true : false,
            }

            let currentSlideIndex = settings.initialActiveSlide
            let currentSlideId = settings.initialActiveSlide
            let previousSlideId = settings.initialActiveSlide
            let animating = false  
    
            const el_superblockslider__track = slider.querySelector('.superblockslider__track')!
            let el_superblockslider__slides = slider.querySelectorAll('.superblockslider__slide')

            const el_superblockslider__button__previous = slider.querySelector('.superblockslider__button__previous')
            const el_superblockslider__button__next = slider.querySelector('.superblockslider__button__next')
            
            // console.log(settings)
            
            el_superblockslider__track.addEventListener('transitionstart', transitionStart)
            el_superblockslider__track.addEventListener('transitionend', transitionEnd)
            
            // calculate slide width percentage
            const offsetPercent = 100 / el_superblockslider__slides.length
            const translateXOffset = currentSlideIndex * offsetPercent
            // generate translateX
            let translateX = `translateX(-${translateXOffset}%)`
    
            /**
             * parallax
             */

            const parallaxSlides = slider.querySelectorAll('.superblockslider__slide[data-parallax="true"]')

            if(parallaxSlides) {
                parallaxInit()

                window.addEventListener('scroll', (event)=> {
                    parallaxSlides.forEach((parallaxSlide, index)=> {
                            let parallaxAttribute = parallaxSlide.getAttribute('data-parallax-speed')
                            const el_slide_bg: HTMLElement = (<HTMLElement>parallaxSlide.querySelectorAll('.superblockslider__slide__bg')[0])
                            if(parallaxAttribute) {
                                const sliderPositionY = parallaxSlide.getBoundingClientRect().y
                                if(sliderPositionY <= window.innerHeight && sliderPositionY >= Math.abs(window.innerHeight) * -1) {
                                    let parallaxSpeed:number = parallaxAttribute ? parseInt(parallaxAttribute) / 100 : 0
                                    let parallaxOffset = (parallaxSpeed) * ((window.innerHeight - sliderPositionY));
                                    const totalParallaxOffset = (parallaxSpeed) * ((window.innerHeight));
                                    (<HTMLElement>el_slide_bg).style.transform = `translateY(${parallaxOffset - totalParallaxOffset}px)`
                                }
                                else {
                                    (<HTMLElement>el_slide_bg).style.transform = `translateY(0px)`
                                }
                            }

                    })
                })

                window.addEventListener('resize', parallaxInit)
            }
            function parallaxInit() {
                parallaxSlides.forEach((slide, index)=> {
                    let parallaxAttribute = slide.getAttribute('data-parallax-speed')
                    const parallaxSpeed:number = parallaxAttribute ? parseInt(parallaxAttribute) / 100 : 0
                    const sliderBoundingRect = slider.getBoundingClientRect()
                    const sliderPositionY = sliderBoundingRect.y
                    const sliderHeight = sliderBoundingRect.height
                    const windowHeight = window.innerHeight
                    
                    const el_slide_bg: HTMLElement = (<HTMLElement>slide.querySelectorAll('.superblockslider__slide__bg')[0])
                    
                    const el_slide_bg_img = el_slide_bg.querySelectorAll('img')[0]
                    
                    const imageHeight = (parallaxSpeed * windowHeight / 2) + sliderHeight;
                    el_slide_bg_img.style.height = `${imageHeight}px`
                    const totalParallaxOffset = (parallaxSpeed) * ((windowHeight));
                    let parallaxOffset = 0
                    if(sliderPositionY <= windowHeight && sliderPositionY >= Math.abs(windowHeight) * -1 ) {
                        parallaxOffset = (parallaxSpeed) * ((windowHeight - sliderPositionY));
                    }
                    el_slide_bg.style.transform = `translateY(${parallaxOffset - totalParallaxOffset}px)`
                })
                
            }
            
            /**
             * autoplay
             */
            let autoplayTime: number
            let autoplayInterval: number
            let autopayToggle: any
            function onMouseOutAutoplay() {
                autopayToggle = autoplayInterval
            }
            if(settings.autoplay == true) {
                
                if(settings.autoplayInterval.indexOf('ms') > 0) {
                    autoplayInterval = parseInt(settings.autoplayInterval.split('ms')[0])
                    autopayToggle = autoplayInterval
                }
                else {
                    const seconds = Number(settings.autoplayInterval.split('s')[0])
                    autoplayInterval = seconds * 1000
                    autopayToggle = autoplayInterval
                }
                // autoplay
                if(typeof autoplayInterval === 'number') {
                    window.requestAnimationFrame(autoplayTimerFrame)

                    if(settings.hoverPause == true) {
                        /**
                         * mouse over slider
                         */
                        slider.addEventListener('mouseover', (event)=> {
                            autopayToggle = 'pause'
                        })
                        
                        slider.addEventListener('mouseout', onMouseOutAutoplay)
                    }
                }
                
            }
            // timer
            function autoplayTimerFrame(timestamp: number) {
                if(autopayToggle === 'stop') return

                if (autoplayTime === undefined || autopayToggle === 'pause') autoplayTime = timestamp

                const elapsed = timestamp - autoplayTime
                
                window.requestAnimationFrame(autoplayTimerFrame);

                if (elapsed >= autopayToggle) {
                    // reset timer
                    autoplayTime = timestamp
                    
                    nextSlide()
                }
            }

            let el_superblockslider__buttons = slider.querySelectorAll('.superblockslider__button')
            if(settings.slideNavigation != 'none') {
                /**
                 * slide button events
                 */
                 el_superblockslider__buttons.forEach((button)=> {
                    button.addEventListener('click', () => {
                        if(!animating) {
                            const buttonIdValue = parseInt(button.getAttribute('data-button-id')!)
                            
                            animateTrackToSlideId(buttonIdValue, true)
                        }
                    })
                 })
            }
            
            /**
             * animate track function
             * @param {int} slideId 
             */
            function animateTrackToSlideId(slideId: number, toggleAutoplay: boolean = false) {
                if(!animating) {
                    if(toggleAutoplay) {
                        slider.removeEventListener('mouseout', onMouseOutAutoplay)
                        autopayToggle = "stop"
                    }
                    if(currentSlideId != slideId) {
                        el_superblockslider__slides = slider.querySelectorAll('.superblockslider__slide')
    
                        let slideIndex = slideId
                        if(settings.loopSlide == false) {
                            
                        }
                        // if infinite loop
                        else if(settings.transitionEffect == 'slide' && settings.loopSlide == true) {
                            /**
                             * move Last slide to first
                             */
                            if(currentSlideIndex === 0 && el_superblockslider__slides.length > 2) {
                                (<HTMLElement>el_superblockslider__track).style.transition = 'none'
                                const lastSide = el_superblockslider__slides[el_superblockslider__slides.length - 1]
    
                                el_superblockslider__track.prepend(lastSide)
                                
                                currentSlideIndex = 1
                                
                                let trackOffset = currentSlideIndex * offsetPercent
                                translateX = `translateX(-${trackOffset}%)`;
    
                                (<HTMLElement>el_superblockslider__track).style.transform = translateX
                            }
                            /**
                             * move First slide to last
                             */
                            else if(currentSlideIndex === el_superblockslider__slides.length - 1) {
                                (<HTMLElement>el_superblockslider__track).style.transition = 'none'
                                
                                
                                currentSlideIndex = el_superblockslider__slides.length - 2
                                
                                let trackOffset = currentSlideIndex * offsetPercent
                                translateX = `translateX(-${trackOffset}%)`;
    
                                (<HTMLElement>el_superblockslider__track).style.transform = translateX
    
                                const firstSlide = el_superblockslider__slides[0]
                                el_superblockslider__track.append(firstSlide)
                            }
    
                            const slideMatch = slider.querySelectorAll(`[data-slide-index="${slideId}"]`)!
                            if(slideMatch[0] && slideMatch[0].parentNode) {
                                const slideMatch_parent_children = slideMatch[0].parentNode.children
                            
                                let closeSlide = Array.from(slideMatch_parent_children).indexOf(slideMatch[0])
                                slideIndex = closeSlide
                            }
                        }
                        
                        // run on new thread to apply move translateX
                        setTimeout (() => {
                            animate(slideId, slideIndex)
                        }, 100);
                        
                    }
                }
            }
            function animate(slideId: number, slideIndex: number) {
                // console.log(animating)
                if(settings.transitionEffect == 'slide') {

                    (<HTMLElement>el_superblockslider__track).style.transition = `all ${settings.transitionDuration} ${settings.animation}`;
                    
                    let trackOffset = slideIndex * offsetPercent
                    translateX = `translateX(-${trackOffset}%)`;
                    
                    (<HTMLElement>el_superblockslider__track).style.transform = translateX
                    
                    currentSlideIndex = slideIndex
                    currentSlideId = slideId
                }
                else if(settings.transitionEffect == 'fade') {
                    currentSlideIndex = slideIndex
                    currentSlideId = slideId
                    transitionEnd()
                }
            }
    
            function transitionStart() {
                animating = true

                if(autopayToggle !== "stop") autopayToggle = "pause"
                
                if(settings.transitionEffect == 'slide') {
                    (<HTMLElement>el_superblockslider__track).style.transition = `all ${settings.transitionDuration} ${settings.animation}`;
                }

                /**
                 * variable height animation
                 */
                if(settings.variableHeight) {
                    // set slider height to inital slide
                    updateSliderHeight()
                }

                /**
                 * Add superblockslider__slide--animating
                 */

                slider.querySelector(`[data-slide-index="${currentSlideId}"]`)!.classList.add('superblockslider__slide--animating-in')
                slider.querySelector(`[data-slide-index="${previousSlideId}"]`)!.classList.add('superblockslider__slide--animating-out')
            }
    
            function transitionEnd() {
                // remove slide active class
                slider.querySelector('.superblockslider__slide--active')!.classList.remove('superblockslider__slide--active')
                
                // add slide active class
                slider.querySelector(`[data-slide-index="${currentSlideId}"]`)!.classList.add('superblockslider__slide--active')

                if(settings.slideNavigation != 'none') {
                    // remove button active class
                    slider.querySelector('.superblockslider__button--active')!.classList.remove('superblockslider__button--active')
                    // add button active class
                    el_superblockslider__buttons[currentSlideId].classList.add('superblockslider__button--active')
                }
    
                animating = false
                if(autopayToggle !== "stop") autopayToggle = autoplayInterval
            }

            // next, prev button event
            if(el_superblockslider__button__previous && el_superblockslider__button__next) {
                el_superblockslider__button__previous.addEventListener('click', ()=> {
                    prevSlide(null, true)
                })
                el_superblockslider__button__next.addEventListener('click', ()=> {
                    nextSlide(null, true)
                })
            }
    
            /**
             * prev slide
             */

            function prevSlide(event?: any, toggleAutoplay?: boolean) {
                removeAnimatingClasses()
                previousSlideId = currentSlideId

                let prevSlideId = currentSlideId - 1

                if(prevSlideId < 0) {
                    // get last slide Id
                    prevSlideId = el_superblockslider__slides.length - 1
                }
                animateTrackToSlideId(prevSlideId, toggleAutoplay)
            }
            
            /**
             * next slide
            */
            
           function nextSlide(event?: any, toggleAutoplay?: boolean) {
                removeAnimatingClasses()
                previousSlideId = currentSlideId

                let nextSlideId = currentSlideId + 1
                if(nextSlideId > el_superblockslider__slides.length - 1) {
                    nextSlideId = 0
                }
                animateTrackToSlideId(nextSlideId, toggleAutoplay)
            }
            
            /**
             * remove animating classes
             */
            function removeAnimatingClasses() {
                // remove slide animating class
                slider.querySelector(`[data-slide-index="${currentSlideId}"]`)!.classList.remove('superblockslider__slide--animating-in')
                // remove slide animating class
                slider.querySelector(`[data-slide-index="${previousSlideId}"]`)!.classList.remove('superblockslider__slide--animating-out')
            }

            /**
             * Variable height
             */

            if(settings.variableHeight) {
                slider.style.transition = `height ease ${settings.transitionDuration}`
                
                // set slider height to inital slide
                updateSliderHeight()

                window.addEventListener('resize', updateSliderHeight)
            }
            function updateSliderHeight() {
                let sliderWidth = slider.offsetWidth
                let currentSceenSize = getScreenSize()
                let currentImage = <HTMLImageElement>slider.querySelector(`[data-slide-index="${currentSlideId}"] img.visible--${currentSceenSize}`)
                if(currentImage) {
                    let imageOriginalWidth = Number(currentImage.getAttribute('width'))
                    let imageOriginalHeight = Number(currentImage.getAttribute('height'))
                    let imageVariableHeight = calculateVariableHeight(imageOriginalWidth, sliderWidth, imageOriginalHeight)
                    // currentImage.style.objectFit = 'cover'
                    slider.style.height = imageVariableHeight + 'px'
                }
            }

            /**
             * 
             * @param originalWidth Original width of image
             * @param newWidth Current rendered width of image
             * @param originalHeight Original height of image
             * @returns Number variable image height
             */
            function calculateVariableHeight(originalWidth:number, newWidth:number, originalHeight:number,) {
                // percenage increase
                let percentageDifference:number;
                if(originalWidth < newWidth) {
                    let widthDifference:number = newWidth - originalWidth;
                    percentageDifference = widthDifference / originalWidth;
                    return(percentageDifference * originalHeight + originalHeight)
                }

                // percentage decrease
                else {
                    let widthDifference:number = originalWidth - newWidth;
                    percentageDifference = widthDifference / originalWidth;
                    return(originalHeight - percentageDifference * originalHeight)
                }
                
            }
            
            /**
             * 
             * @returns String window screen width
             */
            function getScreenSize() {
                let windowWidth = window.innerWidth
                if(windowWidth > 1280) {
                    return 'xl'
                }
                else if (windowWidth < 1280 && windowWidth >= 1024) {
                    return 'lg'
                }
                else if (windowWidth < 1024 && windowWidth >= 768) {
                    return 'md'
                }
                else {
                    return 'sm'
                }
            }

            /**
             * Mouse, touch drag change slide
             */

            let pressDownX: any = null;

            /** 
             * Mouse drag
             */
            const mouseXtriggerThreshold = 150
            slider.addEventListener('mousedown', function (event) {
                pressDownX = event.pageX
            })
            
            slider.addEventListener('mouseup', function (event) {
                const diffX = event.pageX - pressDownX
                
                if(diffX > 0 && diffX < mouseXtriggerThreshold) {
                    nextSlide(null, true)
                }
                else if(diffX < 0 && diffX > -mouseXtriggerThreshold) {
                    prevSlide(null, true)
                }
            })
            
            /**
             * Touch drag
            */
           const touchXtriggerThreshold = 6
           slider.addEventListener('touchstart', handleTouchStart, {passive: true})
           slider.addEventListener('touchmove', handleTouchMove, {passive: true})                                                   
                                                                                        
            function handleTouchStart(event: any) {
                const firstTouch = event.touches[0];
                
                pressDownX = firstTouch.clientX;
            };                                                
            
            function handleTouchMove(event: any) {
                if ( ! pressDownX) {
                    return
                }
    
                let xUp = event.touches[0].clientX;                                    
    
                let xDiff = pressDownX - xUp;
                       
                if ( xDiff > touchXtriggerThreshold) {
                    nextSlide(null, true)
                    autopayToggle = 'stop'
                } else if(xDiff < -touchXtriggerThreshold) {
                    prevSlide(null, true)
                    autopayToggle = 'stop'
                } 
                /* reset values */
                pressDownX = null;                                         
            };
        })
    }
})()
