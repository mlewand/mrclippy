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
		let html = item.getValue( type );

		// For Windows, the display value needs to be further sanitized.
		if ( process.platform == 'win32' ) {
			html = this._stripWindowsMeta( html );
		}

		element.innerHTML = html;
	}

	/**
	 * Removes Windows-specific meta tags added to the HTML Format, like StartHTML/SourceURL headers etc.
	 *
	 * @param {bytes} html
	 * @returns {string}
	 */
	_stripWindowsMeta( html ) {
		html = String( html );

		let headerEnd = html.match( /^(EndFragment:.+?\r?\n(SourceURL:.+?\r?\n)?)/m );

		if ( headerEnd ) {
			return html.substr( headerEnd.index + headerEnd[ 0 ].length );
		} else {
			return html;
		}
	}
}

module.exports = Text;