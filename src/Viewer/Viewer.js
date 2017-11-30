'use strict';

/**
 * Viewer is a generic class for features providing a different preview capabilities.
 *
 * Say text preview, would simply show stuff as a text, whereas hex preview would print multiple hex values.
 * Another idea would be rendered HTML previewer, JSON formatter, image renderer... you get the point!
 */
class Viewer {
	constructor() {
		this.label = 'Unnamed preview';
	}

	/**
	 * Tells whether this view is capable of handling given type.
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	handles( _type ) {
		return false;
	}

	/**
	 * This method implements rendering.
	 *
	 * @param {ClipboardSnapshot} item
	 * @param {string} type
	 * @param {HTMLElement} element A wrapper element where the content preview have to be rendered.
	 */
	display( _item, _type, _element ) {
	}
}

module.exports = Viewer;