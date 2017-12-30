'use strict';

let clip;

if ( process.platform == 'win32' ) {
	clip = require( './clipboard.win32' );
} else {
	clip = require( 'electron' ).clipboard;
}

// Extend returned object, to be ure not to overwrite Electron clipboard object.
module.exports = Object.assign( {}, clip, {
	/**
	 * Writes provided snapshot to the current OS clipboard.
	 *
	 * @param {ClipboardSnapshot} snapshot
	 */
	writeSnapshot( snapshot ) {
		this.clear();

		for ( let [ type, data ] of snapshot._content ) {
			this.write( type, data );
		}
	},

	/**
	 * Read method had to be overwritten, due to reasons described in {@link #_getElectronClipboardGetter}.
	 *
	 * @param {string} type
	 * @returns {mixed}
	 */
	read( type ) {
		let readFunction = this._getElectronClipboardGetter( type );

		if ( readFunction ) {
			console.log( 'reading', type );
			return this[ readFunction ]( type );
		}

		return null;
	},

	/**
	 * At the time of writing there's a rather big annoyance in Electron clipboard API. The problem is that in order to get any interesting
	 * type/value you need to call a different method for any clipboard type.
	 *
	 * For instance, if you want to get `'text/html'` value you must call `clipboard.readHTML( 'text/html' )`. You can't call `clipboard.readText( 'text/html' )`
	 * it will return empty string.
	 *
	 * Ideally I'd love to call `clipboard.readBuffer( type )` which should return `Buffer` instance containing raw data, but it's only working with **native
	 * formats**. So you should pass `'HTML Format'` on Windows, instead of `'text/html'` and **there is no method** to enumerate native types. The only method
	 * `clipboard.availableFormats()` returns "decorated" types, so `'text/html'` instead of `'HTML Format'`; `'text/plain'` instead of `'CF_UNICODETEXT'`.
	 *
	 * @private
	 * @returns {string} type "Decorated" electron clipboard format, like `'text/html'`.
	 * @returns {string/null} Read method name, like `'readHTML'`, `'readText'` or `null` if no matching type is known.
	 */
	_getElectronClipboardGetter( type ) {
		type = String( type );

		if ( type == 'text/html' ) {
			return 'readHTML';
		}

		if ( type == 'text/rtf' ) {
			return 'readRTF';
		}

		if ( String( type ).startsWith( 'image/' ) ) {
			return 'readImage';
		}

		if ( String( type ).startsWith( 'text/' ) ) {
			return 'readText';
		}

		return null;
	}
} );