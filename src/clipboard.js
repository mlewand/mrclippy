'use strict';

let clip = require( 'electron' ).clipboard;

if ( process.platform == 'win32' ) {
	clip = require( './clipboard.win32' );
}

module.exports = clip;