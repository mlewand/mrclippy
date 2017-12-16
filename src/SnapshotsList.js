'use strict';

const EventEmitter = require( 'events' );

class SnapshotsList extends EventEmitter {
	constructor() {
		super();
		this._store = new Set();
		this._selected = null;
	}

	add( item ) {
		this._store.add( item );

		this.emit( 'added', item );
		this.emit( 'changed' );
	}

	remove( item ) {
		if ( this._store.delete( item ) ) {
			this.emit( 'removed', item );
			this.emit( 'changed' );
		}
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
}

module.exports = SnapshotsList;