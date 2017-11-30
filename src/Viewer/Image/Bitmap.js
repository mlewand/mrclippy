'use strict';

const Viewer = require( '../Viewer' );

class Bitmap extends Viewer {
	constructor() {
		super();
		this.label = 'Bitmap';
	}

	/**
	 * Tells whether this view is capable of handling given type.
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	handles( type ) {
		return type.toLowerCase().includes( 'bitmap' ) || type.toLowerCase().includes( 'cf_dib' );
	}

	/**
	 * This method implements rendering.
	 *
	 * @param {ClipboardSnapshot} item
	 * @param {string} type
	 * @param {HTMLElement} element A wrapper element where the content preview have to be rendered.
	 */
	display( item, type, element ) {
		let value = item.getValue( type ),
			img = new Image();

		element.innerHTML = '<p>At the moment there\'s no good handling for BMP. Instead it\'s stubbed with a dummy img.</p>';

		// Temporarily stub it.
		const os = require( 'os' ),
			path = require( 'path' );
		value = require( 'fs' ).readFileSync( path.join( __dirname, '..', '..', '..', 'resources', 'stub.bmp' ) );

		img.src = 'data:image/bmp;base64,' + value.toString( 'base64' );

		element.appendChild( img );
	}
}

module.exports = Bitmap;