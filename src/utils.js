
const isBufferBase = require( 'is-buffer' );

module.exports = {
	/**
	 * @param {mixed} buffer Returns `true` if given argument is a Buffer or Int8Array instance.
	 * @returns {boolean}
	 */
	isBuffer( buffer ) {
		return isBufferBase( buffer ) || buffer instanceof Object.getPrototypeOf( Int8Array );
	}
};