'use strict';

const winClipboard = require( 'win-clipboard' );

const clip = {
	availableFormats: () => winClipboard.getFormats(),
	read: function( type ) {
		return winClipboard.getData( type );
	},
	readText: function( type ) {
		return winClipboard.getText( type  );
	}
};

module.exports = clip;