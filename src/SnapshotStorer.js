'use strict';

const sanitize = require( 'sanitize-filename' ),
	path = require( 'path' ),
	fs = require( 'fs' ),
	fsExtra = require( 'fs-extra' ),
	jszip = require( 'jszip' );

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

		let zip = new jszip();
		zip.file( 'content.json', JSON.stringify( content ) );

		return zip.generateAsync( { type: 'nodebuffer' } )
			.then( function( content ) {
				return fsExtra.writeFile( filePath, content );
			} );
	},

	load( path ) {
		return this._loadFromJson( path );
	},

	_loadFromJson( path ) {
		return fsExtra.readFile( path )
			.then( blob => {
				return jszip.loadAsync( blob )
					.then( zip => zip.file( 'content.json' ).async( 'string' ) );
			 } )
			.then( jsonContent => JSON.parse( jsonContent ) )
			.then( parsed => {
				let data = parsed.data;

				for ( let key of Object.keys( data ) ) {
					if ( data[ key ].type === 'Buffer' ) {
						if ( Uint8Array ) {
							data[ key ] = Uint8Array.from( data[ key ].data );
						} else {
							data[ key ] = Buffer.from( data[ key ].data );
						}
					}
				}

				return parsed;
			} );
	},

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
