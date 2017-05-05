( function() {
	"use strict";

	const electron = require( 'electron' ),
		clipboard = require( './clipboard' ),
		entities = require( 'entities' );

	class ClipboardSnapshot {
		constructor() {
			let types = clipboard.availableFormats();

			this._content = new Map( types.map( type => {
				return [ type, clipboard.read( type ) ]
			 } ) );
		}

		getTypes() {
			return this._content.keys();
		}

		isEmpty() {
			return this.getTypes().length === 0;
		}

		getValues() {
			return this._content.values();
		}

		getValue( type ) {
			return this._content.get( type );
		}

		// @todo: remove this method, encoding should not be a concern of this type.
		getValueAsHtml( type ) {
			// Dummy handling so far.
			return entities.encodeHTML( this.getValue( type ) );
		}

		getLabel() {
			return 'ClipboardSnapshot label';
		}
	}

	module.exports = ClipboardSnapshot;
} )();
