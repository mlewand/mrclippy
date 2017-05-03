( function() {
	"use strict";

	/**
	 * Types component, displaying a list of clipboard formats.
	 */
	class Types {
		constructor( controller ) {
			this.controller = controller;

			this._elem = document.querySelector( '#types' );

			if ( !this._elem ) {
				throw new Error( 'Couldnt find types element' );
			}
		}

		getElement() {
			return this._elem;
		}
	}

	module.exports = Types;
} )();
