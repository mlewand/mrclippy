( function() {
	"use strict";

	const electron = require( 'electron' ),
		clipboard = require( './clipboard' ),
		entities = require( 'entities' );

	class ClipboardSnapshot {
		constructor() {
			let types = clipboard.availableFormats();

			this._content = new Map( types.map( type => {
				let textType = type.toLowerCase().search( /text|html format/ ) !== -1,
					val = textType ? clipboard.readText( type ) : String( clipboard.read( type ) );

				return [ type, val ]
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
