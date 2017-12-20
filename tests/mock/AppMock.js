class AppMock {
	constructor() {
		this.config = require( '../_fixtures/config.json' );

		// Can't use real localforage instance, or it will throw: "UnhandledPromiseRejectionWarning: Unhandled promise
		// rejection (rejection id: 10): Error: No available storage method found." error.
		this.storage = {
			snapshots: {
				keys: () => null,
				setItem: () => null,
				getItem: () => null,
				removeItem: () => null
			}
		};
	}
}

module.exports = AppMock;
