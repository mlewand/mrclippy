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

	describe( 'Comparing', () => {
		let snapshots;

		beforeEach( () => {
			snapshots = {
				original: new ClipboardSnapshotMock( {
					aa: Buffer.from( [ 64, 65 ] ),
					bb: Buffer.from( [ 64, 65 ] )
				} ),
				// Snapshot with equal content to original.
				equal: new ClipboardSnapshotMock( {
					aa: Buffer.from( [ 64, 65 ] ),
					bb: Buffer.from( [ 64, 65 ] )
				} ),
				equalUintArray: new ClipboardSnapshotMock( {
					aa: new Uint8Array( [ 64, 65 ] ),
					bb: new Uint8Array( [ 64, 65 ] )
				} ),
				// One property differs from original.
				different: new ClipboardSnapshotMock( {
					aa: Buffer.from( [ 64, 65 ] ),
					bb: Buffer.from( [ 68, 72 ] )
				} ),
				// Partially equal to original.
				partial: new ClipboardSnapshotMock( {
					aa: Buffer.from( [ 64, 65 ] )
				} ),
				// Messed.
				messed: new ClipboardSnapshotMock( {
					aa: null,
					bb: undefined
				} )
			};
		} );

		describe( 'equals()', () => {
			it( 'Tells different snapshots', () => {
				expect( snapshots.original.equals( snapshots.different ) ).to.be.false;
			} );

			it( 'Tells partially different snapshots', () => {
				expect( snapshots.original.equals( snapshots.partial ) ).to.be.false;
			} );

			it( 'Tells equal snapshots', () => {
				expect( snapshots.original.equals( snapshots.equal ) ).to.be.true;
			} );

			it( 'Tells equal using a different buffer view', () => {
				expect( snapshots.original.equals( snapshots.equalUintArray ) ).to.be.true;
			} );

			it( 'Tells same snapshots', () => {
				expect( snapshots.original.equals( snapshots.original ) ).to.be.true;
			} );

			it( 'Doesnt break with undefined values', () => {
				// #49
				expect( snapshots.original.equals( snapshots.messed ) ).to.be.false;
			} );
		} );

		describe( 'Hashing', () => {
			it( 'Sets hashes only on demand', () => {
				expect( snapshots.original._hashesCached, 'hash before fetching' ).to.be.undefined;
				let hashes = snapshots.original._hashes;
				expect( snapshots.original._hashesCached, 'hash after fetching' ).not.to.be.undefined;
				expect( hashes ).to.be.instanceOf( Map );
			} );

			it( 'Returns correct hashes', () => {
				let hashes = snapshots.original._hashes;
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

			it( 'Returns correct hashes', () => {
				// #49
				let hashes = snapshots.messed._hashes;
				expect( hashes ).to.be.deep.equal( new Map( [
					[ 'aa', null ],
					[ 'bb', undefined ]
				] ) );
			} );
		} );
	} );

	describe( 'createFromClipboard()', () => {
		const clipboard = require( '../src/clipboard' ),
			sandbox = sinon.createSandbox();

		before( () => {
			sandbox.stub( clipboard, 'availableFormats' ).returns( [ 'custom-binary' ] );
			sandbox.stub( clipboard, 'read' ).returns( Buffer.from( [ 73, 74 ] ) );
			sandbox.stub( clipboard, 'readText' ).returns( undefined );
		} );

		after( () => {
			sandbox.restore();
		} );

		it( 'Doesnt break for non-textual snapshots', () => {
			// #50
			expect( ClipboardSnapshot.createFromClipboard().getLabel() ).to.be.equal( 'Snapshot' );
		} );
	} );
} );
