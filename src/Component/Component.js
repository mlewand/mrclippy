"use strict";

class Component {
	constructor( controller, elementId ) {
		this.controller = controller;

		if ( elementId ) {
			this._elem = document.querySelector( '#' + elementId );

			if ( !this._elem ) {
				throw new Error( 'Couldnt find types element' );
			}
		}
	}

	getElement() {
		return this._elem;
	}
}

module.exports = Component;