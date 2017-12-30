const iconv = require( 'iconv-lite' ),
	Reader = require( './Reader.js' );

class WinReader extends Reader {
	/**
	 *
	 * @param {ClipboardSnapshot} snapshot
	 * @param {string} [type='CF_UNICODETEXT']
	 * @returns {string}
	 */
	readText( snapshot, type ) {
		let encoding = 'utf8',
			val = snapshot.getValue( type ),
			ret;

		type = type || 'CF_UNICODETEXT';

		if ( [ 'CF_UNICODETEXT', 'CF_TEXT' ].includes( type ) ) {
			encoding = 'utf-16le';
		}

		ret = iconv.decode( Buffer.from( val ), encoding );

		if ( ret[ ret.length - 1 ] === '\0' ) {
			// Windows always adds NULL byte char at the end.
			// @todo: this should be handled in the clipboard lib.
			let nullBytesCount = 1;

			if ( encoding === 'utf-16le' && ret[ ret.length - 2 ] == 0 ) {
				nullBytesCount = 2;
			}

			ret = ret.slice( 0, nullBytesCount * -1 );
		}

		return ret;
	}
}

module.exports = WinReader;
