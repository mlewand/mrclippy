const localForage = require( 'localforage' );

localForage.setDriver( [ localForage.INDEXEDDB, localForage.WEBSQL ] );

class Storage {
	constructor() {
		this.snapshots = localForage.createInstance( {
			name: 'mrclippy_snapshots'
		} );
	}

	async clear() {
		return await this.snapshots.clear();
	}

	/**
	 * A temporary debug method to log items in clipboard snapshot storage.
	 */
	async dumpStorage() {
		let keys = await this.snapshots.keys();
		for ( let key of keys ) {
			// Replaces \0 chars due to #27.
			console.log( `${key} "${( await this.snapshots.getItem( key ) ).meta.label.replace( /\x00/g, '' )}"` );
		}
	}

	/**
	 * Note that the returned key will not be reserved.
	 *
	 * @returns {Promise.<string>}
	 */
	async requestNewSnapshotKey() {
		let keys = await this.snapshots.keys(),
			ret = 0; // Default value for empty array.

		if ( keys.length ) {
			ret = Math.max.apply( window, keys.map( key => parseInt( key ) ) ) + 1;
		}

		return String( ret );
	}
}

module.exports = Storage;
