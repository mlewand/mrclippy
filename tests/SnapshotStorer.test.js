const SnapshotStorer = require( '../src/SnapshotStorer' ),
	ClipboardSnapshotMock = require( './mock/ClipboardSnapshotMock' ),
	expect = require( 'chai' ).expect,
	sinon = require( 'sinon' );

describe( 'SnapshotStorer', () => {
	function getSnapshotMock( label ) {
		return {
			getLabel: sinon.stub().returns( label )
		};
	}

	describe( 'proposeFileName', () => {
		it( 'support snapshots with label', () => {
			let snapshotMock = getSnapshotMock( 'sample-label123' );

			expect( SnapshotStorer.proposeFileName( snapshotMock ) ).to.be.equal( 'sample-label123.clip' );
		} );

		it( 'returns sanitized name', () => {
			let snapshotMock = getSnapshotMock( 'foo/bar*baz' );

			expect( SnapshotStorer.proposeFileName( snapshotMock ) ).to.be.equal( 'foo-bar-baz.clip' );
		} );

		it( 'support snapshots without a label', () => {
			let snapshotMock = getSnapshotMock( null );

			expect( SnapshotStorer.proposeFileName( snapshotMock ) ).to.be.equal( 'snapshot.clip' );
		} );
	} );

	describe( 'save', () => {
		it( 'works', () => {
			let snapshotMock = new ClipboardSnapshotMock( {
					'HTML Format': '123',
					CF_UNICODETEXT: 'abc',
					Binary: Buffer.from( [ 64, 64, 64 ] )
				} ),
				ret;

			SnapshotStorer.save( snapshotMock );
		} );
	} );

	describe( '_getSnapshotObject', () => {
		it( 'works', () => {
			let snapshotMock = new ClipboardSnapshotMock( {
					'HTML Format': '123',
					CF_UNICODETEXT: 'abc',
					Binary: Buffer.from( [ 64, 64, 64 ] )
				} ),
				ret;

			snapshotMock.label = 'custom snapshot label';

			ret = SnapshotStorer._getSnapshotObject( snapshotMock );

			expect( ret ).to.be.deep.equal( {
				meta: {
					os: 'win10',
					label: 'custom snapshot label',
					format: '1',
					appVersion: '0.0.1'
				},
				data: {
					'HTML Format': '123',
					CF_UNICODETEXT: 'abc',
					Binary: Buffer.from( [ 64, 64, 64 ] )
				}
			} );
		} );
	} );
} );
