'use strict';

const Component = require( './Component' );

class Navigation extends Component {
	constructor( controller, snapshots ) {
		super( controller, 'navigation' );
		this.snapshots = snapshots;

		this._listItems = new Map();

		snapshots.on( 'added', this.addItem.bind( this ) );
		snapshots.on( 'removed', this.removeItem.bind( this ) );
		snapshots.on( 'selected', this.itemSelected.bind( this ) );
	}

	addItem( item ) {
		let listItem = this.getNavigationFor( item );

		this._elem.prepend( listItem );

		this._listItems.set( item, listItem );
	}

	removeItem( item ) {
		let listItem = this._listItems.get( item );

		if ( listItem ) {
			listItem.remove();
			this._listItems.delete( item );
		}
	}

	itemSelected( item, prevSelected ) {
		let prevItem = prevSelected && this._listItems.get( prevSelected ),
			curItem = item && this._listItems.get( item );

		if ( prevItem ) {
			prevItem.classList.remove( 'active' );
		}

		if ( curItem ) {
			curItem.classList.add( 'active' );
		}
	}

	getNavigationFor( item ) {
		let ret = document.createElement( 'button' );
		ret.classList = 'item list-group-item list-group-item-action btn-sm';
		ret.innerHTML = item.getLabel();
		ret.addEventListener( 'click', () => {
			this.snapshots.select( item );
		} );
		return ret;
	}
}

module.exports = Navigation;