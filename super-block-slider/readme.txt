=== Super block slider - Responsive image & content slider ===
Contributors:       Mikemmx
Donate link:        https://www.paypal.com/paypalme/wpslider
Tags:               image slider, slider, parallax, content slider, responsive slider
Requires at least:  6.3
Tested up to:       6.5
Stable tag:         2.7.7
Requires PHP:       7.0.0
License:            GPL-2.0-or-later
License URI:        https://www.gnu.org/licenses/gpl-2.0.html

Lightweight, responsive, image & content slider for block and classic editor.

== Description ==

[youtube https://www.youtube.com/watch?v=6c2Rdi4o5MU]
<a href="https://superblockslider.com/slider-showcase/" target="_new">Slider examples</a>

Super Block Slider is a lightweight image & content slider plugin for creating dynamic and engaging sliders.

= Lightweight =

Standalone 5KB JavaScript file, optimize for loading speed and performance.

= Image slider =

Customize each slide's background image and customize the visual presentation of your sliders.

= Content slider =

Utilize any WordPress block in the content area, giving you full control over the slider layout and design.

= Supports block & classic editor =

Works for block editor and classic editor(via shortcode. example: [superblockslider id="123"]).

= Gradient / color overlay =

Enhance the visual impact of your sliders by applying gradient or solid color overlays, creating an eye-catching backdrop for your content.

= Responsive slider =

Set different background images for desktop, tablet, and mobile screen sizes, allowing for optimal visual presentation across various devices.

= Live Editor Preview =

Preview your slider's appearance in real-time within the WordPress editor, making it easy to fine-tune and perfect the design before publishing.

= Touch & mouse drag =

Supporting both touch and mouse swipe gestures, providing a seamless user experience on touchscreen devices and desktops.

= Title or Dot Icon Navigation =

Customize the navigation with title-based navigation or dot icons, allowing your users to easily navigate through your sliders.

= Parallax Effect =

Add a visually appealing parallax effect to your slider, this effect creates a captivating scrolling experience by moving the background at a different speed than the foreground content.

= Adaptive slider height =

The slider's height adjusts automatically based on the background size, ensuring that your slides are displayed properly.

= Transition Animations =

Choose from 20 transition animations to add dynamism and flair to your sliders.

== Featured highlight ==

* <a href="https://superblockslider.com/slider-showcase/#transition-efect" target="_new">Slide</a>, <a href="https://superblockslider.com/slider-showcase/#transition-efect" target="_new">fade</a> effect
* <a href="https://superblockslider.com/slider-showcase/#adaptive-height" target="_new">Adaptive slider height</a>
* Set multiple background image for responsive screen size
* <a href="https://superblockslider.com/slider-showcase/#demo" target="_new">Title-based</a> navigation or <a href="https://superblockslider.com/slider-showcase/#transition-efect" target="_new">dot icons</a>
* <a href="https://superblockslider.com/slider-showcase/#demo" target="_new">Parallax background effect</a>
* 20 slide <a href="https://superblockslider.com/slider-showcase/#transition-animations" target="_new">transition animations
* <a href="https://superblockslider.com/slider-showcase/#overlay" target="_new">Gradient or solid color overlay</a>

= Links =

<a href="https://superblockslider.com/slider-showcase/" target="_new">Slider examples</a>
<a href="https://superblockslider.com/documentations/" target="_new">Documentations</a>

== Changelog ==

= 2.7.7 =

* Fix editor styles: remove global editor styles
* clean up invalid registerBlockType parameter

= 2.7.6 =

* Fix bug Gutenberg blocks not being process when embeding using shortcode.

= 2.7.5 =

* Add load sueprblockslider.js in defer.
* Use passive listeners for touchstart, touchmove event.

= 2.7.3 =

* Fix WordPress 6.3 gradient crashes, bugs.
* Fix animating class

= 2.7.1 =

* Add class superblockslider__slide--animating-in, superblockslider__slide--animating-out when slide is animating.

= 2.7 =

* Added shortcode support for use in classic editor.

= 2.6.3 =

* Fix bug: Frontend autoplay not stopping when it should.

= 2.6.2 =

* Fix bug: Overlap timing of transition animate speed timing and autoplay timing.

= 2.6.1 =

* Fix bug: Reduce mobile touch sensitivity.

= 2.6 =

* Added content overflow options.
* Added mouse drag event changes slide
* Fix bug: Adaptive height not working in editor when slider is created.
* Optimise touch event code
* Add 6 more gradients
* Add donation link

= 2.4.7 =

* Fix Editor description for parallex.
* Fix Parallax code.
* Fix mobile gesture not stopping autoplay.

= 2.4.5 =

* Added "Adaptive slider height".
* Fix bug causing slider to disappear if transsition effect is set to "Fade".
* Fix bug: GradientPicker component causing crashes on full-site-editing mode.
* Fix ful-site-editing errors

= 2.3.2 =

* Fix bug: JS defer causes supersliderblock not to run.

= 2.3.1 =

* Add Mobile swipe gesture.
* Update responsive settings descriptions.

= 2.2.1 =

* Fix bug causing crashes if 2 or more slider is created.
* Changed editor text and rearange controls.
* Lock move control of single slide by default.

= 2.1.1 =

* Fix bug - CSS style causes slider arrow to overlaps content.

= 2.0 =

* Add custom responsive screen size images option.
* Fix bug - Added overflow style to content container.

= 1.5.5 =

* Fix bug - Slide index not set correctly if Super slider block is a child block.
* Slide title line height style.
* Update descriptions in editor.

= 1.5.4 =

* Fix parallax effect.
* Fix slide title line height in slide editor.
* Add src/js/
* minor bug fixes.

= 1.5.3 =

* Add support for WordPress version 5.9

= 1.5.2 =

* fix bug - WordPress version 5.8.1 cause slide index to be undefine.

= 1.5.1 =

* fix bug - Editor fade effect : selected slide not visible if child block selected.

= 1.5 =

* fix bug - track css transition all

= 1.4.9 =

* fix bug - Firefox transition-timing-function.
* fix bug - Chrome background image flicker.

= 1.4.8 =

* fix bug - fade effect not changing in editor.

= 1.4.7 =

* Add Parallax background image

= 1.3.7 =

* Add slide link option

= 1.2.7 =

* Fix bug - Title indicator to render html.
* Fix bug - Title indicator word-wrap.
* Fix editor .wp-block max-width css.

= 1.2.6 =

* Changed Super block slider category to 'Media' from 'Widgets'.

= 1.2.5 =

* Fix bug - initial active slide not correct cause by older versions.

== Installation ==

1. Visit **Plugins > Add New**.
2. Search for **super block slider**.
3. Install and activate the super block slider plugin.

= Manual installation =

1. Upload the entire `super-block-slider` folder to the `/wp-content/plugins/` directory.
2. Visit **Plugins**.
3. Activate super block slider.

= After activation =

While in Page/Post edit mode simply add/search for **super block slider**.

== Screenshots ==

1. Editor screenshot 1
2. Editor screenshot 2
3. Editor screenshot 3
4. Live results screenshot 4
5. Editor screenshot 5
6. Editor screenshot 6