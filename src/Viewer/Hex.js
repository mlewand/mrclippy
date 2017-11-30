'use strict';

const Viewer = require( './Viewer' ),
	pad = require( 'pad' );

class Hex extends Viewer {
	constructor() {
		super();
		this.label = 'Hex';
	}

	/**
	 * Tells whether this view is capable of handling given type.
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	handles() {
		// For now let's assume that it handles everything.
		return true;
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
			html = '',
			i;

		for ( i = 0; i < value.length; i++ ) {
			let byte = value[ i ];

			html += ( pad( 2, byte.toString( 16 ), { char: '0' } ) + ' ' );

			if ( ( i + 1 ) % 16 === 0 ) {
				html += '<br>';
			}
		}

		html = '<pre style="font-size: 1.4em"><code>' + html + '</pre></code>';

		element.innerHTML = html;
	}
}

module.exports = Hex;