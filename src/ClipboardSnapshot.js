( function() {
	'use strict';

	const LABEL_MAX_LENGTH = 50,
		EventEmitter = require( 'events' ),
		clipboard = require( './clipboard' ),
		OsEnvironment = require( './OsEnvironment' ),
		crc32 = require( 'crc-32' ),
		deepEql = require( 'deep-eql' ),
		isBufferBase = require( 'is-buffer' ),
		isBuffer = function( buffer ) {
			return isBufferBase( buffer ) || buffer instanceof Object.getPrototypeOf( Int8Array );
		};

	class ClipboardSnapshot extends EventEmitter {
		/**
		 * @param {OsEnvironment} [env=null] Environment for which the snapshot was taken. If skipped it will be
		 * detected automatically.
		 */
		constructor( env ) {
			super();

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

		/**
		 * @param {string} type Clipboard type to be written e.g. `'HTML Format'` or `'CF_UNICODETEXT'`.
		 * @param {Buffer/Uint8Array} data Data to be written.
		 */
		setValue( type, data ) {
			if ( !isBuffer( data ) ) {
				console.error( `ClipboardSnapshot.setValue() invalid argument, expected buffer while ${typeof data} was given.` );
			}

			if ( this._content.has( type ) && deepEql( this._content.get( type ), data ) ) {
				// If entries are the same, no reason to process it.
				return;
			}

			this._content.set( type, data );

			this.emit( 'changed' );
		}

		getLabel() {
			return this.label;
		}

		setLabel( newVal ) {
			let proposedVal = String( newVal );
			proposedVal = proposedVal.substr( 0, LABEL_MAX_LENGTH ) + ( proposedVal.length > LABEL_MAX_LENGTH ? '…' : '' );

			if ( proposedVal !== this.label ) {
				this.label = proposedVal;
				this.emit( 'changed' );
			}
		}

		/**
		 * Compares two clipboard snapshot.
		 *
		 * Note that compare is based on content data only, thus labels/meta data are skipped.
		 *
		 * @param {ClipboardSnapshot} other
		 * @returns {Boolean} `true` if both snapshots are equal.
		 */
		equals( other ) {
			return deepEql( this._hashes, other._hashes );
		}

		/**
		 * A map of hashes based on {@link #_content} used for quick snapshot comparison.
		 *
		 * @property {Map.<string,string>} _hashes
		 */
		get _hashes() {
			if ( !this._hashesCached ) {
				this._hashesCached = new Map(
					Array.from( this._content.keys() ).map( key => {
						let val = this._content.get( key );
						return [ key, isBuffer( val ) ? crc32.buf( val ) : val ];
					} )
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
			let ret = new ClipboardSnapshot(),
				types = clipboard.availableFormats(),
				textValue = clipboard.readText(),
				label = 'Snapshot';

			ret._content = new Map( types.map( type => {
				return [ type, clipboard.read( type ) ];
			} ) );

			// Determine the label.
			if ( typeof textValue == 'string' ) {
				label = textValue.trim();
			}

			ret.setLabel( label );

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