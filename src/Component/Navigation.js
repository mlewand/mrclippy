"use strict";

const Comopnent = require( './Component' );

class Navigation extends Comopnent {
	constructor( controller, snapshots ) {
		super( controller, 'navigation' );
		this.snapshots = snapshots;

		snapshots.on( 'added', this.addItem.bind( this ) );
	}

	addItem( item ) {
		this._elem.appendChild( this.getNavigationFor( item ) );
	}

	getNavigationFor( item ) {
		let ret = document.createElement( 'a' );
		ret.href = '#';
		ret.classList.add( 'item' );
		ret.innerHTML = 'This is an example item';
		ret.addEventListener( 'click', evt => {
			this.controller.previewItem( item );
		} );
		return ret;
	}
}

module.exports = Navigation;