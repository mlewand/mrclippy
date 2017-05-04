'use strict';

const Viewer = require( './Viewer' ),
	entities = require( 'entities' );

class Text extends Viewer {
	constructor() {
		super();
		this.label = 'Text';
	}

	/**
	 * Tells whether this view is capable of handling given type.
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	handles( type ) {
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
		element.innerText = item.getValue( type );
	}
}

module.exports = Text;