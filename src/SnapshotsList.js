'use strict';

const ClipboardSnapshot = require( './ClipboardSnapshot' ),
	SnapshotStorer = require( './SnapshotStorer' ),
	EventEmitter = require( 'events' );

class SnapshotsList extends EventEmitter {
	constructor( storage ) {
		super();

		/**
		 * @private
		 * @property {ClipboardSnapshot/null} _selected Currently selected snapshot.
		 */
		this._selected = null;

		/**
		 * In-memory store of clipboard snapshots.
		 *
		 * @property {Set<ClipboardSnapshot>}
		 */
		this._store = new Set();

		/**
		 * Persistent storage keeping the clipboard snapshots.
		 *
		 * @private
		 * @property {Object} _storage LocalForage db instance.
		 */
		this._storage = storage;
	}

	async add( item ) {
		this._store.add( item );

		if ( typeof item._storageKey === 'undefined' ) {
			let keys = await this._storage.keys();
			item._storageKey = String( keys.length );
		}

		await this._storage.setItem( item._storageKey, SnapshotStorer._getSnapshotObject( item ) );

		this.emit( 'added', item );
		this.emit( 'changed' );
	}

	async remove( item ) {
		this._store.delete( item );
		await this._storage.removeItem( item._storageKey );

		this.emit( 'removed', item );
		this.emit( 'changed' );
	}

	select( item ) {
		if ( item === this._selected ) {
			return;
		}

		let prevSelected = this._selected;
		this._selected = item;
		this.emit( 'selected', item, prevSelected );
	}

	/**
	 * Returns currently selected clipboard snapshot or `null` if none is selected.
	 *
	 * @returns {ClipboardSnapshot/null}
	 */
	getSelected() {
		return this._selected || null;
	}

	/**
	 * Loads snapshot list from it's associated local storage.
	 */
	async loadFromStorage() {
		let storage = this._storage,
			keys = await storage.keys();

		for ( let curKey of keys ) {
			let loadedSnapshot = ClipboardSnapshot.createFromData( await storage.getItem( curKey ) );
			loadedSnapshot._storageKey = curKey;
			this.add( loadedSnapshot );
		}
	}
}

module.exports = SnapshotsList;
