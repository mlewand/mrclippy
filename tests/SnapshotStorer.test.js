const SnapshotStorer = require( '../src/SnapshotStorer' ),
	ClipboardSnapshot = require( '../src/ClipboardSnapshot' ),
	ClipboardSnapshotMock = require( './mock/ClipboardSnapshotMock' ),
	path = require( 'path' ),
	fsExtra = require( 'fs-extra' ),
	os = require( 'os' );

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
				outputDir = path.join( __dirname, '_fixtures', '_output' ),
				outputPath = path.join( outputDir, 'snapshot-mock.clip' );

			return fsExtra.mkdirp( outputDir ).then( () => expect( SnapshotStorer.save( snapshotMock, outputPath ) ).to.eventually.be.fulfilled );
		} );
	} );

	describe( '_loadFromJson', () => {
		it( 'works', () => {
			let expected = {
				meta: {
					os: 'win32',
					label: 'snapshot-mock',
					format: '1',
					appVersion: '0.0.1'
				},
				data: {
					'HTML Format': '123',
					CF_UNICODETEXT: 'abc',
					Binary: Buffer.from( [ 64, 64, 64 ] )
				}
			};

			return expect( SnapshotStorer._loadFromJson( path.join( __dirname, '_fixtures', 'snapshot-mock.clip' ) ) ).to.eventually.be.deep.equal( expected );
		} );
	} );

	describe( 'load', () => {
		it( 'works', () => {
			let expected = {
				meta: {
					os: 'win32',
					label: 'snapshot-mock',
					format: '1',
					appVersion: '0.0.1'
				},
				data: {
					'HTML Format': '123',
					CF_UNICODETEXT: 'abc',
					Binary: Buffer.from( [ 64, 64, 64 ] )
				}
			};

			return SnapshotStorer.load( path.join( __dirname, '_fixtures', 'snapshot-mock.clip' ) )
				.then( ret => {
					expect( ret ).to.be.instanceOf( ClipboardSnapshot );
					expect( ret.getLabel() ).to.be.equal( 'snapshot-mock' );

					expect( ret.getValue( 'HTML Format' ) ).to.be.equal( '123' );
					expect( ret.getValue( 'CF_UNICODETEXT' ) ).to.be.equal( 'abc' );
					expect( ret.getValue( 'Binary' ) ).to.be.eql( expected.data.Binary );
				} );
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
					os: 'win32',
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

		describe( 'platform', () => {
			before( () => {
				sinon.stub( os, 'platform' ).returns( 'megaOS!' );
			} );

			after( () => {
				os.platform.restore();
			} );

			it( 'Stores OS info', () => {
				let snapshotMock = new ClipboardSnapshotMock( {
						Text: 'abc'
					} ),
					ret;

				snapshotMock.label = 'custom snapshot label';

				ret = SnapshotStorer._getSnapshotObject( snapshotMock );

				expect( ret.meta ).to.be.deep.equal( {
					os: 'megaOS!',
					label: 'custom snapshot label',
					format: '1',
					appVersion: '0.0.1'
				} );
			} );
		} );
	} );
} );