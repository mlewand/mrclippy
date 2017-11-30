'use strict';

const Viewer = require( '../Viewer' );

class Bitmap extends Viewer {
	constructor() {
		super();
		this.label = 'PNG';
	}

	/**
	 * Tells whether this view is capable of handling given type.
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	handles( type ) {
		return type.toLowerCase() === 'png';
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

		img.src = 'data:image/png;base64,' + value.toString( 'base64' );

		element.appendChild( img );
	}
}

module.exports = Bitmap;