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

			this._appendNavigationSubActions( item );
		}
	}

	getNavigationFor( item ) {
		let ret = document.createElement( 'li' );
		ret.classList = 'item list-group-item list-group-item-action no-gutters btn-group';

		let snapshotButton = document.createElement( 'button' );
		snapshotButton.classList = 'clip-button label-btn btn btn-light';
		snapshotButton.innerHTML = item.getLabel();
		snapshotButton.addEventListener( 'click', () => {
			this.snapshots.select( item );
		} );

		ret.appendChild( snapshotButton );

		return ret;
	}

	editItem( item ) {
		console.log( `You're about to edit item ${item.getLabel()}` );
	}

	/**k
	 * Appends buttons for sub-actions for a given snapshot item. It also make sure to remove these buttons for previously
	 * selected snapshot item.
	 *
	 * @private
	 * @param {ClipboardSnapshot} item Item that the buttons should be added for.
	 */
	_appendNavigationSubActions( item ) {
		// First remove old buttons.
		this._elem.querySelectorAll( '.edit-btn, .remove-btn' ).forEach( el => el.remove() );

		// Now add new buttons.
		// Technically it would be nice to just move buttons found above to the new wrapper and adjust the onclick listener
		// so it dynamically picks clicked snapshot, but it's fine for now.
		let targetWrapper = this._listItems.get( item ),
			labelEdit = document.createElement( 'button' ),
			labelRemove = document.createElement( 'button' );

		labelEdit.classList = 'clipi-button edit-btn btn btn-light';
		labelEdit.innerHTML = '✍';
		labelEdit.addEventListener( 'click', () => {
			this.editItem( item );
		} );

		labelRemove.classList = 'clip-button remove-btn btn btn-light';
		labelRemove.innerHTML = '🗑';
		labelRemove.addEventListener( 'click', () => {
			this.snapshots.remove( item );
		} );

		targetWrapper.appendChild( labelEdit );
		targetWrapper.appendChild( labelRemove );
	}
}

module.exports = Navigation;