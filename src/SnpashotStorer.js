'use strict';

const sanitize = require( 'sanitize-filename' );

/**
 * Exports / imports snapshot to / from a file format.
 */
module.exports = {
	save( snapshot ) {},

	load( path ) {},

	/**
	 * Returns a proposed file name for given snapshot.
	 *
	 * @param {ClipboardSnapshot} snapshot
	 * @returns {string}
	 */
	proposeFileName( snapshot ) {
		let label = snapshot.getLabel();

		if ( !label ) {
			label = 'snapshot';
		}

		return sanitize( label, { replacement: '-' } ) + '.clip'
	}
};
