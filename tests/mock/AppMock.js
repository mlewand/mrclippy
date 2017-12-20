const Storage = require( '../../src/Storage' );

class AppMock {
	constructor() {
		this.config = require( '../_fixtures/config.json' );
		this.storage = new Storage();
	}
}

module.exports = AppMock;
