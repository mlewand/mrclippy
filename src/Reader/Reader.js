const iconv = require( 'iconv-lite' ),
	isBuffer = require( '../utils' ).isBuffer;

/**
 * Reader is a helper type that can read from ClipboardSnapshot instance, adjusting to the way how OS stores the clipboard.
 */
class Reader {
	/**
	 *
	 * @param {ClipboardSnapshot} snapshot
	 * @param {string} type
	 * @returns {string}
	 */
	readText( snapshot, type ) {
		// By default all the OS that uses Electron clipboard API stores strings (except for stuff like images).
		let ret = snapshot.getValue( type );

		// But images due to our custom logic images are returned as blob (since Electron operates on NativeImage).
		if ( type.startsWith( 'image/' ) && isBuffer( ret ) ) {
			// Treat images as encoded with ASCII.
			ret = iconv.decode( Buffer.from( ret ), 'ascii' );
		}

		return ret;
	}

	static getReaderFor( snapshot ) {
		const Win = require( './Win' );

		if ( snapshot.env.name == 'win32' ) {
			return new Win();
		}

		return new Reader();
	}
}

module.exports = Reader;
