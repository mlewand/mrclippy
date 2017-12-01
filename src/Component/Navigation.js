'use strict';

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
		let ret = document.createElement( 'button' );
		ret.classList = 'item list-group-item list-group-item-action btn-sm';
		ret.innerHTML = 'This is an example item';
		ret.addEventListener( 'click', () => {
			this.snapshots.select( item );

			let curActiveType = this._elem.querySelector( '.active' );
			if ( curActiveType ) {
				curActiveType.classList.remove( 'active' );
			}

			ret.classList.add( 'active' );
		} );
		return ret;
	}
}

module.exports = Navigation;