'use strict';

const Editor = require( './Editor' ),
	utf8decoder = new TextDecoder( 'utf8' ),
	utf16decoder = new TextDecoder( 'utf-16le' );

class Text extends Editor {
	/**
	 * Commits edited value to the given clipboard data type.
	 *
	 * @returns {Promise.<Buffer>}
	 */
	async save( item, type ) {
		let textarea = this._getTextarea(),
			val = textarea && textarea.value;

		if ( typeof val !== 'string' ) {
			console.warn( 'Could not pick new text value' );
		} else {
			let isWinClipboard = item.env.name == 'win32',
				targetEncoding = 'utf8';

			if ( isWinClipboard && type === 'CF_UNICODETEXT' ) {
				targetEncoding = 'utf-16le';
			}

			item.setValue( type, Buffer.from( val, targetEncoding ) );
		}

		await this.hide();
	}

	async show( item, type ) {
		let bytes = item.getValue( type ),
			isWinClipboard = item.env.name == 'win32',
			decoder = ( isWinClipboard && type === 'CF_UNICODETEXT' ) ? utf16decoder : utf8decoder,
			string = decoder.decode( bytes ),
			textarea = this._getTextarea();

		if ( isWinClipboard && string[ string.length - 1 ] === '\0' ) {
			// Windows always adds NULL byte char at the end.
			string = string.slice( 0, -1 );
		}

		if ( !textarea ) {
			textarea = document.createElement( 'textarea' );
			textarea.classList = 'text-editor';
			document.getElementById( 'editor' ).prepend( textarea );
		}

		textarea.value = string;

		textarea.focus();
	}

	/**
	 * Hides the editor. It also reverts the value back to the original one if necessary.
	 */
	async hide() {
		let textarea = this._getTextarea();

		if ( textarea ) {
			textarea.remove();
		}
	}

	/**
	 * Returns the textarea element if present.
	 *
	 * @returns {HTMLTextareaElement/null}
	 */
	_getTextarea() {
		return document.querySelector( '#editor textarea.text-editor' );
	}
}

module.exports = Text;