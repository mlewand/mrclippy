( function() {
	'use strict';

	const LABEL_MAX_LENGTH = 50,
		clipboard = require( './clipboard' ),
		OsEnvironment = require( './OsEnvironment' ),
		crc32 = require( 'crc-32' );

	class ClipboardSnapshot {
		/**
		 * @param {OsEnvironment} [env=null] Environment for which the snapshot was taken. If skipped it will be
		 * detected automatically.
		 */
		constructor( env ) {
			this._content = new Map();
			/**
			 * Environment info for the platform that was used to create this snapshot.
			 *
			 * @property {OsEnvironment}
			 */
			this.env = env instanceof OsEnvironment ? env : OsEnvironment.createForCurrent();
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
		 * A map of hashes based on {@link #_content} used for quick snapshot comparison.
		 *
		 * @property {Map.<string,string>} _hashes
		 */
		get _hashes() {
			if ( !this._hashesCached ) {
				this._hashesCached = new Map(
					Array.from( this._content.keys() ).map( key => [ key, crc32.buf( this._content.get( key ) ) ] )
				);
			}

			return this._hashesCached;
		}

		set _hashes( val ) {
			this._hashesCached = val;
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
			let osMeta = data.meta.os,
				env = osMeta ? new OsEnvironment( osMeta.platform, osMeta.version ) : null,
				ret = new ClipboardSnapshot( env );

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