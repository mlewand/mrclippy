const SnapshotStorer = require( '../src/SnapshotStorer' ),
	ClipboardSnapshotMock = require( './mock/ClipboardSnapshotMock' ),
	chai = require( 'chai' ),
	expect = chai.expect,
	path = require( 'path' ),
	sinon = require( 'sinon' ),
	fsExtra = require( 'fs-extra' );

chai.use( require( 'chai-as-promised' ) );

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
				};

			return expect( SnapshotStorer._loadFromJson( path.join( __dirname, '_fixtures', 'snapshot-mock.clip' ) ) ).to.eventually.be.deep.equal( expected );
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
