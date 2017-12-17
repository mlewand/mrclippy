
const os = require( 'os' );

/**
 * Describes OS environment.
 */
class OsEnvironment {
	/**
	 *
	 * @param {string} name Platform name as returned by node's `os.platform()`.
	 * @param {Mixed} release Version as returned by node's `os.release()`.
	 */
	constructor( name, release ) {
		this.name = name;
		this.release = release;

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