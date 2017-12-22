const ClipboardSnapshotMock = require( './mock/ClipboardSnapshotMock' ),
	ClipboardSnapshot = require( '../src/ClipboardSnapshot' );

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

	describe( 'equals()', () => {
		// @todo extract to a common place. Could be simply a before() method.
		let snapshots = {
			original: new ClipboardSnapshotMock( {
				aa: Buffer.from( [ 64, 65 ] ),
				bb: Buffer.from( [ 64, 65 ] )
			} ),
			// Snapshot with equal content to original.
			equal: new ClipboardSnapshotMock( {
				aa: Buffer.from( [ 64, 65 ] ),
				bb: Buffer.from( [ 64, 65 ] )
			} ),
			// One property differs from original.
			different: new ClipboardSnapshotMock( {
				aa: Buffer.from( [ 64, 65 ] ),
				bb: Buffer.from( [ 68, 72 ] )
			} ),
			// Partially equal to original.
			partial: new ClipboardSnapshotMock( {
				aa: Buffer.from( [ 64, 65 ] )
			} )
		};

		it( 'Tells different snapshots', () => {
			expect( snapshots.original.equals( snapshots.different ) ).to.be.false;
		} );

		it( 'Tells partially different snapshots', () => {
			expect( snapshots.original.equals( snapshots.partial ) ).to.be.false;
		} );

		it( 'Tells equal snapshots', () => {
			expect( snapshots.original.equals( snapshots.equal ) ).to.be.true;
		} );

		it( 'Tells same snapshots', () => {
			expect( snapshots.original.equals( snapshots.original ) ).to.be.true;
		} );
	} );

	describe( 'Hashing', () => {
		let snapshots = {
				original: new ClipboardSnapshotMock( {
					aa: Buffer.from( [ 64, 65 ] ),
					bb: Buffer.from( [ 64, 65 ] )
				} ),
				// Snapshot with equal content to original.
				equal: new ClipboardSnapshotMock( {
					aa: Buffer.from( [ 64, 65 ] ),
					bb: Buffer.from( [ 64, 65 ] )
				} ),
				// One property differs from original.
				different: new ClipboardSnapshotMock( {
					aa: Buffer.from( [ 64, 65 ] ),
					bb: Buffer.from( [ 68, 72 ] )
				} ),
				// Partially equal to original.
				partial: new ClipboardSnapshotMock( {
					aa: Buffer.from( [ 64, 65 ] )
				} )
			},
			originalSnapshot = snapshots.original;

		it( 'Sets hashes only on demand', () => {
			expect( originalSnapshot._hashesCached, 'hash before fetching' ).to.be.undefined;
			let hashes = originalSnapshot._hashes;
			expect( originalSnapshot._hashesCached, 'hash after fetching' ).not.to.be.undefined;
			expect( hashes ).to.be.instanceOf( Map );
		} );

		it( 'Returns correct hashes', () => {
			let hashes = originalSnapshot._hashes;
			expect( hashes ).to.be.deep.equal( new Map( [
				[ 'aa', -1334104836 ],
				[ 'bb', -1334104836 ]
			] ) );
		} );

		it( 'Tells different snapshots', () => {
			expect( snapshots.original._hashes ).not.to.be.deep.equal( snapshots.different._hashes );
		} );

		it( 'Tells partially different snapshots', () => {
			expect( snapshots.original._hashes ).not.to.be.deep.equal( snapshots.partial._hashes );
		} );

		it( 'Tells equal snapshots', () => {
			expect( snapshots.original._hashes ).to.be.deep.equal( snapshots.equal._hashes );
		} );
	} );
} );
