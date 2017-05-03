'use strict';

const base = require( './clipboard.base' ),
	winClipboard = require( 'win-clipboard' );

module.exports = Object.assign( {}, base, {
	availableFormats: () => winClipboard.getFormats(),
	read: function( type ) {
		return winClipboard.getData( type );
	},
	readText: function( type ) {

		let encoding = null;

		if ( [ 'CF_UNICODETEXT', 'CF_TEXT' ].includes( type ) == false ) {
			encoding = 'utf8';
		}

		return winClipboard.getText( type, encoding );
	}
} );