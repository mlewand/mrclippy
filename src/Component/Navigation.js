( function() {
	"use strict";

	class Navigation {
		constructor( controller, snapshots ) {
			this.controller = controller;
			this.snapshots = snapshots;

			this._elem = document.querySelector( '#navigation' );

			if ( !this._elem ) {
				throw new Error( 'Couldnt find navigation element' );
			}

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

		getElement() {
			return this._elem;
		}
	}

	module.exports = Navigation;
} )();
