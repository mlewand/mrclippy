"use strict";

const Comopnent = require( './Component' );

/**
 * Types component, displaying a list of clipboard formats.
 */
class Types extends Comopnent {
	constructor( controller ) {
		super( controller, 'types' );
	}
}

module.exports = Types;
