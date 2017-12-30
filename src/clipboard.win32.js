'use strict';

const winClipboard = require( 'win-clipboard' );

module.exports = {
	availableFormats: () => winClipboard.getFormats(),

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
	 * Reads `type` value from current OS clipboard.
	 *
	 * @param {string} type
	 * @returns {UInt8Array}
	 */
	read: function( type ) {
		return winClipboard.getData( type );
	},

	/**
	 * @type {string} [type='CF_UNICODETEXT'] Clipboard type to be read as text.
	 * @returns {string}
	 */
	readText: function( type ) {
		let encoding = null;

		type = type || 'CF_UNICODETEXT';

		if ( [ 'CF_UNICODETEXT', 'CF_TEXT' ].includes( type ) == false ) {
			encoding = 'utf8';
		}

		return winClipboard.getText( type, encoding );
	},

	/**
	 * Writes `data` to a given `format`.
	 *
	 * @param {string} format
	 * @param {Uint8Array} data
	 */
	write( format, data ) {
		// Note that data buffer might be shared (happens when loading clipboard from external file, for detailed repro steps
		// see revision dc64e9e10d09eb45cad4ac407376b4d78d07aa0b description).
		return winClipboard.setData( data.buffer.slice( data.byteOffset, data.byteOffset + data.byteLength ), format );
	},

	clear: winClipboard.clear
};