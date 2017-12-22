'use strict';

const Component = require( './Component' );

/**
 * Types component, displaying a list of clipboard formats.
 */
class Types extends Component {
	constructor( controller, snapshots ) {
		super( controller, 'types' );

		this.snapshots = snapshots;

		this.snapshots.on( 'selected', this.snapshotSelected.bind( this ) );
	}

	snapshotSelected( item ) {
		this._clear();

		if ( item ) {
			for ( let type of item.getTypes() ) {
				this._elem.appendChild( this.getOptionFor( item, type ) );
			}
		}
	}

	getOptionFor( item, type ) {
		let ret = document.createElement( 'button' );
		ret.type = 'button';
		ret.classList = 'item list-group-item list-group-item-action btn-sm';
		ret.innerText = type || 'Unknown type';
		ret.addEventListener( 'click', () => {
			this.controller.previewItem( item, type );

			let curActiveType = this._elem.querySelector( '.active' );
			if ( curActiveType ) {
				curActiveType.classList.remove( 'active' );
			}

			ret.classList.add( 'active' );
		} );

		return ret;
	}

	_clear() {
		this._elem.innerHTML = '';
	}
}

module.exports = Types;