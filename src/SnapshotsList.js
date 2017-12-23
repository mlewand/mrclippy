'use strict';

const ClipboardSnapshot = require( './ClipboardSnapshot' ),
	SnapshotStorer = require( './SnapshotStorer' ),
	EventEmitter = require( 'events' );

class SnapshotsList extends EventEmitter {
	/**
	 * @param {App} app Application instance owning the list.
	 */
	constructor( app ) {
		super();

		/**
		 * @private
		 * @property {App} _app Owning app.
		 */
		this._app = app;

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
		this._storage = app.storage.snapshots;
	}

	async add( item ) {
		if ( this._app.config.maxSnapshots > 0 && this._store.size >= this._app.config.maxSnapshots ) {
			// In case we exceeded the limit, pick last one and remove it before adding a new snapshot.
			await this.remove( this.getLast() );
		}

		this._store.add( item );

		if ( this._isStorageEnabled() ) {
			if ( typeof item._storageKey === 'undefined' ) {
				item._storageKey = await this._app.storage.requestNewSnapshotKey();
			}

			await this._storage.setItem( item._storageKey, SnapshotStorer._getSnapshotObject( item ) );
		}

		this.emit( 'added', item );
		this.emit( 'changed' );
	}

	async remove( item ) {
		if ( item === this._selected ) {
			this.select( null );
		}

		this._store.delete( item );

		if ( this._isStorageEnabled() ) {
			await this._storage.removeItem( item._storageKey );
		}

		this.emit( 'removed', item );
		this.emit( 'changed' );
	}

	/**
	 * Clears snapshot list.
	 */
	async clear() {
		this._store.forEach( snapshot => this.remove( snapshot ) );
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
		if ( !this._isStorageEnabled() ) {
			return;
		}

		let storage = this._storage,
			keys = await storage.keys();

		for ( let curKey of keys ) {
			let loadedSnapshot = ClipboardSnapshot.createFromData( await storage.getItem( curKey ) );
			loadedSnapshot._storageKey = curKey;
			this.add( loadedSnapshot );
		}
	}

	/**
	 * @returns {ClipboardSnapshot/undefined} Returns the last snapshot.
	 */
	getLast() {
		return this._store.values().next().value;
	}

	/**
	 * Tells whether persistent storage is enabled.
	 *
	 * @returns {Boolean}
	 */
	_isStorageEnabled() {
		return this._app.config.persistentStorage !== false;
	}
}

module.exports = SnapshotsList;
