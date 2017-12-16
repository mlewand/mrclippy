
module.exports = {
	/**
	 *
	 * @param {string} title Error title.
	 * @param {string} [msg] Error message.
	 * @param {Error} [err] Exception causing the error.
	 */
	error( title, msg, err ) {
		alert( `${title}${msg ? ': ' + msg : ''}` );

		if ( err && console.error ) {
			console.error( err );
		}
	}
};