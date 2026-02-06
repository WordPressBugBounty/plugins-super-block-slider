<?php
/**
 * Plugin Name:     Super Block Slider
 * Description:     Lightweight image & content slider for block and classic editor.
 * Version:         2.8.3.3
 * Author:          mikemmx
 * Plugin URI:      https://superblockslider.com/
 * Author URI:      https://wordpress.org/support/users/mikemmx/
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     super-block-slider
 * Domain Path:     /languages
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('SUPERBLOCKSLIDER_VERSION', '2.8.3.3');
define('SUPERBLOCKSLIDER_DIR', __DIR__);
define('SUPERBLOCKSLIDER_URL', plugin_dir_url(__FILE__));

/**
 * Load superblockslider post type
 */
$superblockslider_post_type_file = SUPERBLOCKSLIDER_DIR . '/includes/superblockslider_post_type.php';
if (file_exists($superblockslider_post_type_file)) {
    require_once $superblockslider_post_type_file;
}

/**
 * Register Super Block Slider
 */
function superblockslider_register_block() {
    $script_asset_path = SUPERBLOCKSLIDER_DIR . '/build/index.asset.php';
    
    if (!file_exists($script_asset_path)) {
        return;
    }
    
    $script_asset = require $script_asset_path;

    // Enqueue editor scripts
    wp_register_script(
        'superblockslider-editor',
        SUPERBLOCKSLIDER_URL . 'build/index.js',
        $script_asset['dependencies'],
        SUPERBLOCKSLIDER_VERSION
    );

    // Set translations
    wp_set_script_translations(
        'superblockslider-editor',
        'super-block-slider',
        SUPERBLOCKSLIDER_DIR . '/languages'
    );

    // Enqueue frontend scripts
    wp_register_script(
        'superblockslider',
        SUPERBLOCKSLIDER_URL . 'build/superblockslider.js',
        array(),
        SUPERBLOCKSLIDER_VERSION,
        true
    );

    // Enqueue styles
    wp_register_style(
        'superblockslider-editor',
        SUPERBLOCKSLIDER_URL . 'build/index.css',
        array(),
        SUPERBLOCKSLIDER_VERSION
    );

    wp_register_style(
        'superblockslider',
        SUPERBLOCKSLIDER_URL . 'build/style-index.css',
        array(),
        SUPERBLOCKSLIDER_VERSION
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
 * Add shortcode column
 */
add_filter('manage_superblockslider_posts_columns', 'superblockslider_add_shortcode_column');
function superblockslider_add_shortcode_column($columns) {
    /* translators: Column header for shortcode display in admin list */
    $columns['post_id'] = __('Shortcode', 'super-block-slider');
    return $columns;
}

/**
 * Display shortcode in column
 */
add_action('manage_superblockslider_posts_custom_column', 'superblockslider_show_shortcode', 10, 2);
function superblockslider_show_shortcode($column, $post_id) {
    if ($column === 'post_id' && current_user_can('edit_posts')) {
        /* translators: %d: slider post ID */
        $shortcode = sprintf('[superblockslider id="%d"]', absint($post_id));
        echo esc_html($shortcode);
    }
}