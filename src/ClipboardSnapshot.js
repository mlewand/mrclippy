( function() {
	'use strict';

	const LABEL_MAX_LENGTH = 50,
		clipboard = require( './clipboard' ),
		entities = require( 'entities' );

	class ClipboardSnapshot {
		constructor() {
			this._content = new Map();
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

		getLabel() {
			return this.label;
		}

		/**
		 * Creates a new clipboard snapshot from **current** clipboard.
		 *
		 * @returns {ClipboardSnapshot}
		 */
		static createFromClipboard() {
			let ret = new ClipboardSnapshot();

			let types = clipboard.availableFormats();

			ret._content = new Map( types.map( type => {
				return [ type, clipboard.read( type ) ];
			} ) );

			let textValue = clipboard.readText().trim();

			if ( textValue.length ) {
				ret.label = textValue.substr( 0, LABEL_MAX_LENGTH ) + ( textValue.length > LABEL_MAX_LENGTH ? '…' : '' );
			}

			return ret;
		}

		/**
		 * Creates a new clipboard snapshot from simplified data format, used by clipboard storers.
		 *
		 * @param {Object} data Parsed clipboard info.
		 * @returns {ClipboardSnapshot}
		 */
		static createFromData( data ) {
			let ret = new ClipboardSnapshot();

			ret._content = new Map( Object.keys( data.data ).map( type => {
				return [ type, data.data[ type ] ];
			} ) );

			ret.label = data.meta.label;

			return ret;
		}
	}

	ClipboardSnapshot.prototype.label = 'Unnamed Snapshot';

	module.exports = ClipboardSnapshot;
} )();