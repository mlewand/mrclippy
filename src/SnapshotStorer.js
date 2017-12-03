'use strict';

const sanitize = require( 'sanitize-filename' ),
	path = require( 'path' ),
	fs = require( 'fs' );

/**
 * Exports / imports snapshot to / from a file format.
 */
module.exports = {
	/**
	 *
	 * @param {ClipboardSnapshot} snapshot
	 * @param {string} [filePath]
	 */
	save( snapshot, filePath ) {
		let content = this._getSnapshotObject( snapshot );

		if ( !filePath ) {
			filePath = path.join( __dirname, '..', this.proposeFileName( snapshot ) );
		}

		console.log( `Saving to "${filePath}".` );

		var output = fs.createWriteStream( filePath ),
			archive = this._archiver( 'zip', {
				zlib: {
					level: 9
				}
			} );

		archive.pipe( output );

		archive.append( JSON.stringify( content ), {
			name: 'content.json'
		} );

		archive.finalize();
	},

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

		return sanitize( label, {
			replacement: '-'
		} ) + '.clip';
	},

	_archiver: require( 'archiver' ),

	_getSnapshotObject( snapshot ) {
		let data = {};

		for ( let type of snapshot.getTypes() ) {
			data[ type ] = snapshot.getValue( type );
		}

		return {
			meta: {
				os: 'win10',
				label: snapshot.getLabel(),
				format: '1',
				appVersion: '0.0.1'
			},
			data: data
		};
	}
};
