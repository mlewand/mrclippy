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
	}
} );