( function() {
	"use strict";

	class Navigation {
		constructor( controller ) {
			this.controller = controller;

			this._elem = document.querySelector( '#navigation' );

			if ( !this._elem ) {
				throw new Error( 'Couldnt find navigation element' );
			}

			this._items = new Set();
		}

		addItem( item ) {
			this._items.add( item );
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
