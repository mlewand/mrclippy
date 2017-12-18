// This will mock  win-clipboard.
require( './mock/ClipboardSnapshotMock' );

const ClipboardSnapshot = require( '../src/ClipboardSnapshot' );

describe( 'ClipboardSnapshot', () => {
	describe( 'createFromData', () => {
		let sampleData = {
				meta: {
					os: {
						platform: 'fancy-os',
						version: '5.0.6'
					},
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
			snapshot = ClipboardSnapshot.createFromData( sampleData );

		it( 'Sets the data correctly', () => {
			expect( snapshot ).to.be.instanceOf( ClipboardSnapshot );
			expect( snapshot.getValue( 'CF_UNICODETEXT' ) ).to.be.equal( 'abc' );
			expect( snapshot.getValue( 'Binary' ) ).to.be.eql( Buffer.from( [ 64, 64, 64 ] ) );
		} );

		it( 'Applies custom env correctly', () => {
			let env = snapshot.env;

			expect( env.name ).to.be.equal( 'fancy-os' );
			expect( env.release ).to.be.equal( '5.0.6' );
		} );
	} );
} );