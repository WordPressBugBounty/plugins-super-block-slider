<?php
/**
 * Plugin Name:     Super Block Slider
 * Description:     Lightweight, responsive, image & content slider for block and classic editor.
 * Version:         2.8.2.4
 * Author:          mikemmx
 * Plugin URI:		https://superblockslider.com/
 * Author URI:  	https://wordpress.org/support/users/mikemmx/
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     super-block-slider
 * Domain Path:		/languages
 */

$dir = __DIR__;

/**
 * Load superblockslider post type
 */
require_once "$dir/includes/superblockslider_post_type.php";

/**
 * Register Super Block Slider
 */
function superblockslider_register_block() {
    $dir = __DIR__;

    // Enqueue editor scripts
    $script_asset_path = "$dir/build/index.asset.php";
    $script_asset = require $script_asset_path;

    $index_js = 'build/index.js';
    wp_register_script(
        'superblockslider-editor',
        plugins_url($index_js, __FILE__),
        $script_asset['dependencies'],
        $script_asset['version']
    );

    // Set translations for the block editor
    wp_set_script_translations(
        'superblockslider-editor',
        'super-block-slider',
        plugin_dir_path(__FILE__) . 'languages'
    );

    // Enqueue frontend scripts
    $slider_js = 'build/superblockslider.js';
    wp_register_script(
        'superblockslider',
        plugins_url($slider_js, __FILE__),
        array(),
        $script_asset['version'],
        true
    );

    // Enqueue editor styles
    $editor_css = 'build/index.css';
    wp_register_style(
        'superblockslider-editor',
        plugins_url($editor_css, __FILE__),
        array(),
        filemtime("$dir/$editor_css")
    );

    // Enqueue frontend styles
    $style_css = 'build/style-index.css';
    wp_register_style(
        'superblockslider',
        plugins_url($style_css, __FILE__),
        array(),
        filemtime("$dir/$style_css")
    );

    // Register the block
    register_block_type('superblockslider/slider', array(
        'editor_script' => 'superblockslider-editor',
        'editor_style'  => 'superblockslider-editor',
        'style'         => 'superblockslider',
        'script'        => 'superblockslider',
    ));
}
add_action('init', 'superblockslider_register_block');

/**
 * Load Super Block Slider text domain
 */
function superblockslider_load_textdomain() {
    load_plugin_textdomain('superblockslider', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('plugins_loaded', 'superblockslider_load_textdomain');
