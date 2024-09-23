"use strict";
(function () {
    document.onreadystatechange = function () {
        if (document.readyState === 'complete') {
            superblockslider('.superblockslider');
        }
    };
    var superblockslider = function (superblocksliderSlides) {
        var superblocksliderSlider = document.querySelectorAll(superblocksliderSlides);
        superblocksliderSlider.forEach(function (slider, index) {
            var initialActiveSlideAttr = slider.getAttribute('data-initial-active-slide');
            var loopSlideAttr = slider.getAttribute('data-loop-slide');
            var autoplayAttr = slider.getAttribute('data-autoplay');
            var autoplayIntervalAttr = slider.getAttribute('data-autoplay-interval');
            var slideNavigationAttr = slider.getAttribute('data-slide-navigation');
            var hoverPauseAttr = slider.getAttribute('data-hover-pause');
            var transitionEffectAttr = slider.getAttribute('data-transition-effect');
            var transitionDurationAttr = slider.getAttribute('data-transition-duration');
            var animationAttr = slider.getAttribute('data-animation');
            var transitionSpeedAttr = slider.getAttribute('data-transition-speed');
            var arrowNavigationAttr = slider.getAttribute('data-arrow-navigation');
            var variableHeightAttr = slider.getAttribute('data-variable-height');
            var settings = {
                initialActiveSlide: initialActiveSlideAttr ? parseInt(initialActiveSlideAttr) : 0,
                loopSlide: loopSlideAttr ? false : true,
                autoplay: autoplayAttr ? false : true,
                autoplayInterval: autoplayIntervalAttr ? autoplayIntervalAttr : '1.5s',
                slideNavigation: slideNavigationAttr ? slideNavigationAttr : 'dots',
                hoverPause: hoverPauseAttr ? false : true,
                transitionEffect: transitionEffectAttr ? transitionEffectAttr : 'slide',
                transitionDuration: transitionDurationAttr ? transitionDurationAttr : '.6s',
                animation: animationAttr ? animationAttr : 'cubic-bezier(0.46, 0.03, 0.52, 0.96)',
                transitionSpeed: transitionSpeedAttr ? transitionSpeedAttr : '.6s',
                arrowNavigation: arrowNavigationAttr ? false : true,
                variableHeight: variableHeightAttr ? true : false,
            };
            var currentSlideIndex = settings.initialActiveSlide;
            var currentSlideId = settings.initialActiveSlide;
            var previousSlideId = settings.initialActiveSlide;
            var animating = false;
            var el_superblockslider__track = slider.querySelector('.superblockslider__track');
            var el_superblockslider__slides = slider.querySelectorAll('.superblockslider__slide');
            var el_superblockslider__button__previous = slider.querySelector('.superblockslider__button__previous');
            var el_superblockslider__button__next = slider.querySelector('.superblockslider__button__next');
            el_superblockslider__track.addEventListener('transitionstart', transitionStart);
            el_superblockslider__track.addEventListener('transitionend', transitionEnd);
            var offsetPercent = 100 / el_superblockslider__slides.length;
            var translateXOffset = currentSlideIndex * offsetPercent;
            var translateX = "translateX(-" + translateXOffset + "%)";
            var parallaxSlides = slider.querySelectorAll('.superblockslider__slide[data-parallax="true"]');
            if (parallaxSlides) {
                parallaxInit();
                window.addEventListener('scroll', function (event) {
                    parallaxSlides.forEach(function (parallaxSlide, index) {
                        var parallaxAttribute = parallaxSlide.getAttribute('data-parallax-speed');
                        var el_slide_bg = parallaxSlide.querySelectorAll('.superblockslider__slide__bg')[0];
                        if (parallaxAttribute) {
                            var sliderPositionY = parallaxSlide.getBoundingClientRect().y;
                            if (sliderPositionY <= window.innerHeight && sliderPositionY >= Math.abs(window.innerHeight) * -1) {
                                var parallaxSpeed = parallaxAttribute ? parseInt(parallaxAttribute) / 100 : 0;
                                var parallaxOffset = (parallaxSpeed) * ((window.innerHeight - sliderPositionY));
                                var totalParallaxOffset = (parallaxSpeed) * ((window.innerHeight));
                                el_slide_bg.style.transform = "translateY(" + (parallaxOffset - totalParallaxOffset) + "px)";
                            }
                            else {
                                el_slide_bg.style.transform = "translateY(0px)";
                            }
                        }
                    });
                });
                window.addEventListener('resize', parallaxInit);
            }
            function parallaxInit() {
                parallaxSlides.forEach(function (slide, index) {
                    var parallaxAttribute = slide.getAttribute('data-parallax-speed');
                    var parallaxSpeed = parallaxAttribute ? parseInt(parallaxAttribute) / 100 : 0;
                    var sliderBoundingRect = slider.getBoundingClientRect();
                    var sliderPositionY = sliderBoundingRect.y;
                    var sliderHeight = sliderBoundingRect.height;
                    var windowHeight = window.innerHeight;
                    var el_slide_bg = slide.querySelectorAll('.superblockslider__slide__bg')[0];
                    var el_slide_bg_img = el_slide_bg.querySelectorAll('img')[0];
                    var imageHeight = (parallaxSpeed * windowHeight / 2) + sliderHeight;
                    el_slide_bg_img.style.height = imageHeight + "px";
                    var totalParallaxOffset = (parallaxSpeed) * ((windowHeight));
                    var parallaxOffset = 0;
                    if (sliderPositionY <= windowHeight && sliderPositionY >= Math.abs(windowHeight) * -1) {
                        parallaxOffset = (parallaxSpeed) * ((windowHeight - sliderPositionY));
                    }
                    el_slide_bg.style.transform = "translateY(" + (parallaxOffset - totalParallaxOffset) + "px)";
                });
            }
            var autoplayTime;
            var autoplayInterval;
            var autopayToggle;
            function onMouseOutAutoplay() {
                autopayToggle = autoplayInterval;
            }
            if (settings.autoplay == true) {
                if (settings.autoplayInterval.indexOf('ms') > 0) {
                    autoplayInterval = parseInt(settings.autoplayInterval.split('ms')[0]);
                    autopayToggle = autoplayInterval;
                }
                else {
                    var seconds = Number(settings.autoplayInterval.split('s')[0]);
                    autoplayInterval = seconds * 1000;
                    autopayToggle = autoplayInterval;
                }
                if (typeof autoplayInterval === 'number') {
                    window.requestAnimationFrame(autoplayTimerFrame);
                    if (settings.hoverPause == true) {
                        slider.addEventListener('mouseover', function (event) {
                            autopayToggle = 'pause';
                        });
                        slider.addEventListener('mouseout', onMouseOutAutoplay);
                    }
                }
            }
            function autoplayTimerFrame(timestamp) {
                if (autopayToggle === 'stop')
                    return;
                if (autoplayTime === undefined || autopayToggle === 'pause')
                    autoplayTime = timestamp;
                var elapsed = timestamp - autoplayTime;
                window.requestAnimationFrame(autoplayTimerFrame);
                if (elapsed >= autopayToggle) {
                    autoplayTime = timestamp;
                    nextSlide();
                }
            }
            var el_superblockslider__buttons = slider.querySelectorAll('.superblockslider__button');
            if (settings.slideNavigation != 'none') {
                el_superblockslider__buttons.forEach(function (button) {
                    button.addEventListener('click', function () {
                        if (!animating) {
                            var buttonIdValue = parseInt(button.getAttribute('data-button-id'));
                            animateTrackToSlideId(buttonIdValue, true);
                        }
                    });
                });
            }
            function animateTrackToSlideId(slideId, toggleAutoplay) {
                if (toggleAutoplay === void 0) { toggleAutoplay = false; }
                if (!animating) {
                    if (toggleAutoplay) {
                        slider.removeEventListener('mouseout', onMouseOutAutoplay);
                        autopayToggle = "stop";
                    }
                    if (currentSlideId != slideId) {
                        el_superblockslider__slides = slider.querySelectorAll('.superblockslider__slide');
                        var slideIndex_1 = slideId;
                        if (settings.loopSlide == false) {
                        }
                        else if (settings.transitionEffect == 'slide' && settings.loopSlide == true) {
                            if (currentSlideIndex === 0 && el_superblockslider__slides.length > 2) {
                                el_superblockslider__track.style.transition = 'none';
                                var lastSide = el_superblockslider__slides[el_superblockslider__slides.length - 1];
                                el_superblockslider__track.prepend(lastSide);
                                currentSlideIndex = 1;
                                var trackOffset = currentSlideIndex * offsetPercent;
                                translateX = "translateX(-" + trackOffset + "%)";
                                el_superblockslider__track.style.transform = translateX;
                            }
                            else if (currentSlideIndex === el_superblockslider__slides.length - 1) {
                                el_superblockslider__track.style.transition = 'none';
                                currentSlideIndex = el_superblockslider__slides.length - 2;
                                var trackOffset = currentSlideIndex * offsetPercent;
                                translateX = "translateX(-" + trackOffset + "%)";
                                el_superblockslider__track.style.transform = translateX;
                                var firstSlide = el_superblockslider__slides[0];
                                el_superblockslider__track.append(firstSlide);
                            }
                            var slideMatch = slider.querySelectorAll("[data-slide-index=\"" + slideId + "\"]");
                            if (slideMatch[0] && slideMatch[0].parentNode) {
                                var slideMatch_parent_children = slideMatch[0].parentNode.children;
                                var closeSlide = Array.from(slideMatch_parent_children).indexOf(slideMatch[0]);
                                slideIndex_1 = closeSlide;
                            }
                        }
                        setTimeout(function () {
                            animate(slideId, slideIndex_1);
                        }, 100);
                    }
                }
            }
            function animate(slideId, slideIndex) {
                if (settings.transitionEffect == 'slide') {
                    el_superblockslider__track.style.transition = "all " + settings.transitionDuration + " " + settings.animation;
                    var trackOffset = slideIndex * offsetPercent;
                    translateX = "translateX(-" + trackOffset + "%)";
                    el_superblockslider__track.style.transform = translateX;
                    currentSlideIndex = slideIndex;
                    currentSlideId = slideId;
                }
                else if (settings.transitionEffect == 'fade') {
                    currentSlideIndex = slideIndex;
                    currentSlideId = slideId;
                    transitionEnd();
                }
            }
            function transitionStart() {
                animating = true;
                if (autopayToggle !== "stop")
                    autopayToggle = "pause";
                if (settings.transitionEffect == 'slide') {
                    el_superblockslider__track.style.transition = "all " + settings.transitionDuration + " " + settings.animation;
                }
                if (settings.variableHeight) {
                    updateSliderHeight();
                }
                slider.querySelector("[data-slide-index=\"" + currentSlideId + "\"]").classList.add('superblockslider__slide--animating-in');
                slider.querySelector("[data-slide-index=\"" + previousSlideId + "\"]").classList.add('superblockslider__slide--animating-out');
            }
            function transitionEnd() {
                slider.querySelector('.superblockslider__slide--active').classList.remove('superblockslider__slide--active');
                slider.querySelector("[data-slide-index=\"" + currentSlideId + "\"]").classList.add('superblockslider__slide--active');
                if (settings.slideNavigation != 'none') {
                    slider.querySelector('.superblockslider__button--active').classList.remove('superblockslider__button--active');
                    el_superblockslider__buttons[currentSlideId].classList.add('superblockslider__button--active');
                }
                animating = false;
                if (autopayToggle !== "stop")
                    autopayToggle = autoplayInterval;
            }
            if (el_superblockslider__button__previous && el_superblockslider__button__next) {
                el_superblockslider__button__previous.addEventListener('click', function () {
                    prevSlide(null, true);
                });
                el_superblockslider__button__next.addEventListener('click', function () {
                    nextSlide(null, true);
                });
            }
            function prevSlide(event, toggleAutoplay) {
                removeAnimatingClasses();
                previousSlideId = currentSlideId;
                var prevSlideId = currentSlideId - 1;
                if (prevSlideId < 0) {
                    prevSlideId = el_superblockslider__slides.length - 1;
                }
                animateTrackToSlideId(prevSlideId, toggleAutoplay);
            }
            function nextSlide(event, toggleAutoplay) {
                removeAnimatingClasses();
                previousSlideId = currentSlideId;
                var nextSlideId = currentSlideId + 1;
                if (nextSlideId > el_superblockslider__slides.length - 1) {
                    nextSlideId = 0;
                }
                animateTrackToSlideId(nextSlideId, toggleAutoplay);
            }
            function removeAnimatingClasses() {
                slider.querySelector("[data-slide-index=\"" + currentSlideId + "\"]").classList.remove('superblockslider__slide--animating-in');
                slider.querySelector("[data-slide-index=\"" + previousSlideId + "\"]").classList.remove('superblockslider__slide--animating-out');
            }
            if (settings.variableHeight) {
                slider.style.transition = "height ease " + settings.transitionDuration;
                updateSliderHeight();
                window.addEventListener('resize', updateSliderHeight);
            }
            function updateSliderHeight() {
                var sliderWidth = slider.offsetWidth;
                var currentSceenSize = getScreenSize();
                var currentImage = slider.querySelector("[data-slide-index=\"" + currentSlideId + "\"] img.visible--" + currentSceenSize);
                if (currentImage) {
                    var imageOriginalWidth = Number(currentImage.getAttribute('width'));
                    var imageOriginalHeight = Number(currentImage.getAttribute('height'));
                    var imageVariableHeight = calculateVariableHeight(imageOriginalWidth, sliderWidth, imageOriginalHeight);
                    slider.style.height = imageVariableHeight + 'px';
                }
            }
            function calculateVariableHeight(originalWidth, newWidth, originalHeight) {
                var percentageDifference;
                if (originalWidth < newWidth) {
                    var widthDifference = newWidth - originalWidth;
                    percentageDifference = widthDifference / originalWidth;
                    return (percentageDifference * originalHeight + originalHeight);
                }
                else {
                    var widthDifference = originalWidth - newWidth;
                    percentageDifference = widthDifference / originalWidth;
                    return (originalHeight - percentageDifference * originalHeight);
                }
            }
            function getScreenSize() {
                var windowWidth = window.innerWidth;
                if (windowWidth > 1280) {
                    return 'xl';
                }
                else if (windowWidth < 1280 && windowWidth >= 1024) {
                    return 'lg';
                }
                else if (windowWidth < 1024 && windowWidth >= 768) {
                    return 'md';
                }
                else {
                    return 'sm';
                }
            }
            var pressDownX = null;
            var mouseXtriggerThreshold = 150;
            slider.addEventListener('mousedown', function (event) {
                pressDownX = event.pageX;
            });
            slider.addEventListener('mouseup', function (event) {
                var diffX = event.pageX - pressDownX;
                if (diffX > 0 && diffX < mouseXtriggerThreshold) {
                    nextSlide(null, true);
                }
                else if (diffX < 0 && diffX > -mouseXtriggerThreshold) {
                    prevSlide(null, true);
                }
            });
            var touchXtriggerThreshold = 6;
            slider.addEventListener('touchstart', handleTouchStart, { passive: true });
            slider.addEventListener('touchmove', handleTouchMove, { passive: true });
            function handleTouchStart(event) {
                var firstTouch = event.touches[0];
                pressDownX = firstTouch.clientX;
            }
            ;
            function handleTouchMove(event) {
                if (!pressDownX) {
                    return;
                }
                var xUp = event.touches[0].clientX;
                var xDiff = pressDownX - xUp;
                if (xDiff > touchXtriggerThreshold) {
                    nextSlide(null, true);
                    autopayToggle = 'stop';
                }
                else if (xDiff < -touchXtriggerThreshold) {
                    prevSlide(null, true);
                    autopayToggle = 'stop';
                }
                pressDownX = null;
            }
            ;
        });
    };
})();
//# sourceMappingURL=superblockslider.js.map