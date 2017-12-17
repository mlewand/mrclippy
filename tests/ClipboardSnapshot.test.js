// This will mock  win-clipboard.
require( './mock/ClipboardSnapshotMock' );

const ClipboardSnapshot = require( '../src/ClipboardSnapshot' );

describe( 'ClipboardSnapshot', () => {
	describe( 'createFromData', () => {
		let sampleData = {
				meta: {
					os: 'win10',
					label: 'snapshot-mock',
					format: '1',
					appVersion: '0.0.1'
				},
				data: {
					'HTML Format': '123',
					CF_UNICODETEXT: 'abc',
					Binary: Buffer.from( [ 64, 64, 64 ] )
				}
			},
			ret = ClipboardSnapshot.createFromData( sampleData );

		expect( ret ).to.be.instanceOf( ClipboardSnapshot );
		expect( ret.getValue( 'CF_UNICODETEXT' ) ).to.be.equal( 'abc' );
		expect( ret.getValue( 'Binary' ) ).to.be.eql( Buffer.from( [ 64, 64, 64 ] ) );
	} );
} );