<?php
/**
 * Plugin Name:     Super block slider
 * Description:     Lightweight, responsive, image & content slider for block and classic editor.
 * Version:         2.7.7
 * Author:          mikemmx
 * Plugin URI:		https://superblockslider.com/
 * Author URI:  	https://wordpress.org/support/users/mikemmx/
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     superblockslider
 * Domain Path:		/languages
 *
 */

$dir = __DIR__;
/**
 * Load superblockslider post type
 */
$superblockslider_post_type = "$dir/includes/superblockslider_post_type.php";
require( $superblockslider_post_type );
 
 /**
  * Register superblockslider
  */
function superblockslider() {
	$dir = __DIR__;

	$script_asset_path = "$dir/build/index.asset.php";

	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'superblockslider-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);
	wp_set_script_translations( 'superblockslider-editor', 'slider' );

	$slider_js = 'build/superblockslider.js';
	wp_register_script(
		'superblockslider',
		plugins_url( $slider_js, __FILE__ ),
		array(),
		$script_asset['version'],
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);

	$editor_css = 'build/index.css';
	wp_register_style(
		'superblockslider-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'build/style-index.css';
	wp_register_style(
		'superblockslider',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type(
		'superblockslider/slider',
		array(
			'editor_script' => 'superblockslider-editor',
			'editor_style'  => 'superblockslider-editor',
			'style'         => 'superblockslider',
			'script'        => 'superblockslider',
		)
	);
}
add_action( 'init', 'superblockslider' );