const os = require( 'os' );

/**
 * Describes OS environment.
 */
class OsEnvironment {
	/**
	 * Creates a new OS environment object.
	 *
	 * Note that the objects are immutable.
	 *
	 * @param {string} name Platform name as returned by node's `os.platform()`.
	 * @param {Mixed} release Version as returned by node's `os.release()`.
	 */
	constructor( name, release ) {
		/**
		 * Name of the OS, e.g. `'win32'`, `'linux'`, `'darwin'`, see
		 * {@link https://nodejs.org/api/os.html#os_os_platform node platforms list} for more.
		 *
		 * @readonly
		 * @property {string}
		 */
		this.name = name;

		/**
		 * Release identifier of the OS, as returned by
		 * {@link https://nodejs.org/api/os.html#os_os_release node `os.release()`} function.
		 */
		this.release = release;

		/**
		 * OS major version, e.g. `'7'` in case of Windows 7.
		 *
		 * @property {string}
		 */
		this.version = this._getVersion( release );

		Object.freeze( this );
	}

	/**
	 * Returns OS environment obj for the current runtime.
	 *
	 * @returns {OsEnvironment}
	 */
	static createForCurrent() {
		return new OsEnvironment( os.platform(), os.release() );
	}

	/**
	 * Returns a major OS version, based on node-style `release` info.
	 *
	 * @private
	 * @param {string} release
	 * @returns {string}
	 */
	_getVersion( release ) {
		return String( release ).split( '.' )[ 0 ];
	}
}

module.exports = OsEnvironment;