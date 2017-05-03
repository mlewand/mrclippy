"use strict";

const Comopnent = require( './Component' );

/**
 * Types component, displaying a list of clipboard formats.
 */
class Types extends Comopnent {
	constructor( controller, snapshots ) {
		super( controller, 'types' );

		this.snapshots = snapshots;

		this.snapshots.on( 'selected', this.snapshotSelected.bind( this ) );
	}

	snapshotSelected( item ) {
		this._clear();

		for ( let type of item.getTypes() ) {
			this._elem.appendChild( this.getOptionFor( item, type ) );
		}
	}

	getOptionFor( item, type ) {
		let ret = document.createElement( 'a' );
		ret.href = '#';
		ret.classList.add( 'item' );
		ret.innerText = type || 'Unknown type';
		ret.addEventListener( 'click', evt => {
			this.controller.previewItem( item, type );
		} );

		return ret;
	}

	_clear() {
		this._elem.innerHTML = '';
	}
}

module.exports = Types;
