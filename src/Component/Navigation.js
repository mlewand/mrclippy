"use strict";

const Component = require( './Component' );

class Navigation extends Component {
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
			this.snapshots.select( item );
		} );
		return ret;
	}
}

module.exports = Navigation;