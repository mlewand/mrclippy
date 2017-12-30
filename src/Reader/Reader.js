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
		return snapshot.getValue( type );
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
