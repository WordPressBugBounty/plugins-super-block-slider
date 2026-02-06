<?php
/**
 * Register superblockslider post type
 */
function superblockslider_register_post_type(): void {
    $svg_icon = '
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 457 527.6400146484375">
		<path d="M65.28 207.3L359 376.9l32.65-18.85v-37.71L97.93 150.75l-32.65 18.84zm163.2 245l65.27-37.68L0 245V131.91L228.48 0 457 131.91v75.38L228.48 75.37l-65.28 37.69L457 282.65v113.08L228.48 527.64 0 395.73v-75.37z" fill="#FFF"/>
	</svg>';

	$menu_icon = 'data:image/svg+xml;base64,' . base64_encode($svg_icon);

    $labels = [
        'name' => _x('Super block slider', 'Post type general name', 'super-block-slider'),
        'singular_name' => _x('Super block slider', 'Post type singular name', 'super-block-slider'),
        'menu_name' => __('Super block slider', 'super-block-slider'),
        'name_admin_bar' => __('Super block slider', 'super-block-slider'),
        'archives' => __('Super block slider Archives', 'super-block-slider'),
        'attributes' => __('Super block slider Attributes', 'super-block-slider'),
        'parent_item_colon' => __('Parent Super block slider:', 'super-block-slider'),
        'all_items' => __('All slider', 'super-block-slider'),
        'add_new_item' => __('Add New Super block slider', 'super-block-slider'),
        'add_new' => __('Add New Slider', 'super-block-slider'),
        'new_item' => __('New Super block slider', 'super-block-slider'),
        'edit_item' => __('Edit Super block slider', 'super-block-slider'),
        'update_item' => __('Update Super block slider', 'super-block-slider'),
        'view_item' => __('View Super block slider', 'super-block-slider'),
        'view_items' => __('View Super block slider', 'super-block-slider'),
    ];
    $labels = apply_filters('superblockslider_post_type_labels', $labels);

    $args = [
        'label' => __('Super block slider', 'super-block-slider'),
        'description' => __('Super block slider for use with shortcode', 'super-block-slider'),
        'labels' => $labels,
        'supports' => ['title', 'editor'],
        'hierarchical' => false,
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 10,
        'menu_icon' => $menu_icon,
        'show_in_admin_bar' => true,
        'show_in_nav_menus' => true,
        'exclude_from_search' => true,
        'has_archive' => false,
        'can_export' => false,
        'capability_type' => 'page',
        'show_in_rest' => true,
    ];
    $args = apply_filters('superblockslider_post_type_args', $args);

    register_post_type('superblockslider', $args);
}
add_action('init', 'superblockslider_register_post_type', 0);

/**
 * Define superblockslider shortcode
 */
function superblockslider_shortcode_handler($atts): string {
    $atts = shortcode_atts([
        'id' => '',
    ], $atts);

    // Sanitize and validate ID
    $post_id = absint($atts['id']);
    
    if (empty($post_id)) {
        return esc_html__('Please provide a post ID.', 'super-block-slider');
    }

    $superblockslider_post = get_post($post_id);

    if (!$superblockslider_post || $superblockslider_post->post_type !== 'superblockslider') {
        return esc_html__('Post not found.', 'super-block-slider');
    }

    if ($superblockslider_post->post_status !== 'publish' || !empty($superblockslider_post->post_password)) {
        return esc_html__('You do not have permission to view this post.', 'super-block-slider');
    }

	// Using core 'the_content' filter is required so blocks, embeds, and shortcodes render correctly.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
    $content = apply_filters('the_content', $superblockslider_post->post_content);
    return do_shortcode($content);
}
add_shortcode('superblockslider', 'superblockslider_shortcode_handler');

/**
 * Load superblockslider frontend scripts if shortcode is used
 */
function superblockslider_enqueue_frontend_scripts(): void {
    if (is_singular() || is_page()) {
        $post = get_post();
        if ($post && has_shortcode($post->post_content, 'superblockslider')) {
            wp_enqueue_script('superblockslider');
            wp_enqueue_style('superblockslider');
        }
    }
}
add_action('wp_enqueue_scripts', 'superblockslider_enqueue_frontend_scripts');

/**
 * Classic-editor mode: Error notice if in classic editor mode
 */
function superblockslider_classic_editor_admin_notice(): void {
    $current_screen = get_current_screen();
    
    if (!$current_screen || !current_user_can('edit_posts')) {
        return;
    }

    $post_types = ['superblockslider'];

    if (!superblockslider_is_block_editor_active() && 
        in_array($current_screen->post_type, $post_types, true) && 
        $current_screen->base === 'post') {
        
        $message = '<div class="notice notice-error"><p>The block editor is required to create the slider and generate the shortcode to be used with classic or other editors.</p><p>Install <a href="https://wordpress.org/plugins/gutenberg/" target="_new">WordPress\'s block editor</a>, go to Settings > writing and <strong>Allow users to switch editors</strong> click "Yes". a "Switch to block editor" will appear on this page.</p></div>';
		echo wp_kses_post($message);
    }
}
add_action('admin_notices', 'superblockslider_classic_editor_admin_notice');

/**
 * Check if using block-editor
 */
function superblockslider_is_block_editor_active(): bool {
    $current_screen = get_current_screen();

    if ($current_screen && method_exists($current_screen, 'is_block_editor')) {
        return $current_screen->is_block_editor();
    }

    return false;
}

/**
 * Flush rewrite rules on activation
 */
function superblockslider_activate(): void {
    superblockslider_register_post_type();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'superblockslider_activate');

/**
 * Flush rewrite rules on deactivation
 */
function superblockslider_deactivate(): void {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'superblockslider_deactivate');