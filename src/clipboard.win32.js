'use strict';

const winClipboard = require( 'win-clipboard' );

const clip = {
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
};

module.exports = clip;