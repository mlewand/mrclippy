'use strict';

const Viewer = require( '../Viewer' );

class Text extends Viewer {
	constructor() {
		super();
		this.label = 'HTML Preview';
	}

	/**
	 * Tells whether this view is capable of handling given type.
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	handles( type ) {
		return type.toLowerCase().indexOf( 'html' ) !== -1;
	}

	/**
	 * This method implements rendering.
	 *
	 * @param {ClipboardSnapshot} item
	 * @param {string} type
	 * @param {HTMLElement} element A wrapper element where the content preview have to be rendered.
	 */
	display( item, type, element ) {
		element.innerHTML = item.getValue( type );
	}
}

module.exports = Text;