'use strict';

const Viewer = require( './Viewer' ),
	iconv = require( 'iconv-lite' );

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
		let bytes = item.getValue( type ),
			isWinClipboard = item.env.name == 'win32',
			string = ( isWinClipboard && type === 'CF_UNICODETEXT' ) ?
				iconv.decode( bytes, 'utf-16le' ) : String( bytes );

		if ( isWinClipboard && string[ string.length - 1 ] === '\0' ) {
			// Windows always adds NULL byte char at the end.
			string = string.slice( 0, -1 );
		}

		element.innerText = string;
	}
}

module.exports = Text;