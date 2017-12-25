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
		let ret = document.createElement( 'li' );
		ret.classList = 'item list-group-item list-group-item-action no-gutters btn-group';

		let snapshotButton = document.createElement( 'button' );
		snapshotButton.classList = 'clip-button label-btn btn btn-primary';
		snapshotButton.innerHTML = item.getLabel();
		snapshotButton.addEventListener( 'click', () => {
			this.snapshots.select( item );
		} );

		let labelEdit = document.createElement( 'button' );
		labelEdit.classList = 'clip-button edit-btn btn btn-primary';
		labelEdit.innerHTML = '✍';
		labelEdit.addEventListener( 'click', () => {
			this.editItem( item );
		} );

		let labelRemove = document.createElement( 'button' );
		labelRemove.classList = 'clip-button remove-btn btn btn-primary';
		labelRemove.innerHTML = '🗑';
		labelRemove.addEventListener( 'click', () => {
			this.snapshots.remove( item );
		} );

		ret.appendChild( snapshotButton );
		ret.appendChild( labelEdit );
		ret.appendChild( labelRemove );

		return ret;
	}

	editItem( item ) {
		console.log( `You're about to edit item ${item.getLabel()}` );
	}
}

module.exports = Navigation;