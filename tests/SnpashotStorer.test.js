const SnpashotStorer = require( '../src/SnpashotStorer' ),
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

			expect( SnpashotStorer.proposeFileName( snapshotMock ) ).to.be.equal( 'sample-label123.clip' );
		} );

		it( 'returns sanitized name', () => {
			let snapshotMock = getSnapshotMock( 'foo/bar*baz' );

			expect( SnpashotStorer.proposeFileName( snapshotMock ) ).to.be.equal( 'foo-bar-baz.clip' );
		} );

		it( 'support snapshots without a label', () => {
			let snapshotMock = getSnapshotMock( null );

			expect( SnpashotStorer.proposeFileName( snapshotMock ) ).to.be.equal( 'snapshot.clip' );
		} );
	} );
} );
