<?php
/**
 * Register superblockslider post type
 */
function register_superblockslider_post_type() : void {
    $menu_icon = file_get_contents( plugin_dir_path( __FILE__ ) . '../assets/super-block-slider-icon.svg' );

	$labels = [
		'name' => _x( 'Super block slider', 'Super block slider', 'super-block-slider'),
		'singular_name' => _x( 'Super block slider', 'Super block slider', 'super-block-slider'),
		'menu_name' => __( 'Super block slider', 'super-block-slider'),
		'name_admin_bar' => __( 'Super block slider', 'super-block-slider'),
		'archives' => __( 'Super block slider Archives', 'super-block-slider'),
		'attributes' => __( 'Super block slider Attributes', 'super-block-slider'),
		'parent_item_colon' => __( 'Parent Super block slider:', 'super-block-slider'),
		'all_items' => __( 'All slider', 'super-block-slider'),
		'add_new_item' => __( 'Add New Super block slider', 'super-block-slider'),
		'add_new' => __( 'Add New Slider', 'super-block-slider'),
		'new_item' => __( 'New Super block slider', 'super-block-slider'),
		'edit_item' => __( 'Edit Super block slider', 'super-block-slider'),
		'update_item' => __( 'Update Super block slider', 'super-block-slider'),
		'view_item' => __( 'View Super block slider', 'super-block-slider'),
		'view_items' => __( 'View Super block slider', 'super-block-slider'),
	];
	$labels = apply_filters( 'superblockslider', $labels );

	$args = [
		'label' => __( 'Super block slider', 'super-block-slider'),
		'description' => __( 'Super block slider for use with shortcode', 'super-block-slider'),
		'labels' => $labels,
		'supports' => [
			'title',
			'editor',
		],
		'hierarchical' => false,
		'public' => true,
		'show_ui' => true,
		'show_in_menu' => true,
		'menu_position' => 10,
		'menu_icon' => 'data:image/svg+xml;base64,' . base64_encode( $menu_icon ),
		'show_in_admin_bar' => true,
		'show_in_nav_menus' => true,
		'exclude_from_search' => true,
		'has_archive' => false,
		'can_export' => false,
		'capability_type' => 'page',
		'show_in_rest' => true,
	];
	$args = apply_filters( 'superblockslider', $args );

	register_post_type( 'superblockslider', $args );
    // flush_rewrite_rules();
}
add_action( 'init', 'register_superblockslider_post_type', 0 );

// Define superblockslider shortcode
function superblockslider_shortcode($atts) {
    // Extract the ID from the shortcode attributes
    $atts = shortcode_atts(array(
        'id' => '',
    ), $atts);

    // Check if ID is provided
    if (empty($atts['id'])) {
        return __('Please provide a post ID.', 'super-block-slider');
    }

    // Retrieve the post using the ID
    $superblockslider_post = get_post($atts['id']);

    // Check if the post exists
    if (!$superblockslider_post) {
        return __('Post not found.', 'super-block-slider');
    }

	// Check if the post is publish and not password protected
    if ($superblockslider_post->post_status !== 'publish' || !empty( $superblockslider_post->post_password )) {
        return __('You do not have permission to view this post.', 'super-block-slider');
    }

    // Process shortcodes and Gutenberg blocks in the post content
    $content = apply_filters('the_content', $superblockslider_post->post_content);
    return do_shortcode($content);
}

// Register superblockslider shortcode
add_shortcode('superblockslider', 'superblockslider_shortcode');

/**
 * Load superblockslider frontend scripts if the post content uses [superblockslider] shortcode.
 */
function load_shortcode_frontend_scripts() {
	global $post;
	if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'superblockslider') ) {
		wp_enqueue_script('superblockslider');
		wp_enqueue_style('superblockslider');
	}
}
add_action( 'wp_enqueue_scripts', 'load_shortcode_frontend_scripts');

/**
 * Block-editor mode: Add notice message
 */
function add_messsage_to_superblockslider_edit_page() {
    $post_types = array('superblockslider');

    // superblockslider post type edit screen
    if (in_array(get_current_screen()->post_type, $post_types)) {

		if (is_block_editor_active()) {
			// Block editor is being used
			global $post;
			?>
			<script>
				// Wait for the editor to be ready.
				wp.domReady(function() {
					setTimeout(() => {
						/**
						 * Add superblockslider if no block exist
						 */
						var editor = wp.data.select('core/block-editor');
						var isFirstBlock = editor.getBlockCount() === 0;
						
						if (isFirstBlock) {
							var superblockslider_block = wp.blocks.createBlock('superblockslider/slider');
							wp.data.dispatch('core/block-editor').insertBlock(superblockslider_block);
						}
						
						// Get notice element.
						var editorElement = document.querySelector('.components-editor-notices__pinned');
						if (editorElement) {
							// Insert HTML content in admin notice section.
							editorElement.insertAdjacentHTML('afterbegin', '<div class="components-notice is-warning"><div class="components-notice__content"><p>This section should only be used if a shortcode is needed for other editors. Super Block Slider can be inserted directly in the block editor.</p><p>Shortcode: <strong>[superblockslider id="' + <?php echo esc_html($post->ID); ?> + '"]</strong></p><div class="components-notice__actions"></div></div></div>');
						}
					}, 100);
				});
			</script>
			<?php
		}
    }
}
add_action('admin_footer', 'add_messsage_to_superblockslider_edit_page');

/**
 * Classic-editor mode: Error notice if in classic editor mode
 */
function classic_editor_error_notice() {
    global $current_screen;
	$post_types = array('superblockslider');

	// check if classic editor and post type is superblockslider screen and in edit post mode
	if (!is_block_editor_active() && in_array($current_screen->post_type, $post_types) && $current_screen->base == 'post') {
	$message = '<div class="notice notice-error"><p>The block editor is required to create the slider and generate the shortcode to be used with classic or other editors.</p><p>Install <a href="https://wordpress.org/plugins/gutenberg/" target="_new">WordPress\'s block editor</a>, go to Settings > writing and <strong>Allow users to switch editors</strong> click "Yes". a "Switch to block editor" will appear on this page.</p></div>';
	echo esc_html($message);
	}
}
add_action('admin_notices', 'classic_editor_error_notice');

/**
 * check if using block-editor
 */
function is_block_editor_active() {
    global $current_screen;

    if (method_exists($current_screen, 'is_block_editor') && $current_screen->is_block_editor()) {
        return true;
    }

    return false;
}