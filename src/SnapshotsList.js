'use strict';

const EventEmitter = require( 'events' );

class SnapshotsList extends EventEmitter {
	constructor() {
		super();
		this._store = new Set();
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
}

module.exports = SnapshotsList;