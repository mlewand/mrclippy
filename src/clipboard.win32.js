'use strict';

const winClipboard = require( 'win-clipboard' );

module.exports = {
	availableFormats: () => winClipboard.getFormats(),

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

		if ( [ 'CF_UNICODETEXT', 'CF_TEXT' ].includes( type ) == false ) {
			encoding = 'utf8';
		}

		return winClipboard.getText( type, encoding );
	}
};