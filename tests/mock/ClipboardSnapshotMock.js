
const mock = require( 'mock-require' );

mock( 'win-clipboard', {
	getFormats: function() {
		return [];
	},
	getText: function() {
		return '';
	},
	clear: function() {}
} );

const ClipboardSnapshot = require( '../../src/ClipboardSnapshot' ),
	entries = require( 'object.entries' );

mock.stop( 'win-clipboard' );

class ClipboardSnapshotMock extends ClipboardSnapshot {
	/**
	 *
	 * @param {Object.key<string, UInt8Array>} clipboardData
	 */
	constructor( clipboardData ) {
		super();

		this._content = new Map( entries( clipboardData ) );

		this.label = 'snapshot-mock';
	}
}

module.exports = ClipboardSnapshotMock;