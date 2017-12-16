'use strict';

let clip;

if ( process.platform == 'win32' ) {
	clip = require( './clipboard.win32' );
} else {
	clip = require( 'electron' ).clipboard;
}

module.exports = clip;