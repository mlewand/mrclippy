const OsEnvironment = require( '../src/OsEnvironment' ),
	os = require( 'os' );

describe( 'OsEnvironment', () => {
	const FAKE_OS_NAME = 'fancyOs',
		FAKE_OS_RELEASE = '10.0.17000';

	let mocks = sinon.createSandbox();

	mocks.stub( os, 'platform' ).returns( FAKE_OS_NAME );
	mocks.stub( os, 'release' ).returns( FAKE_OS_RELEASE );

	after( () => {
		mocks.restore();
	} );

	describe( 'constructor()', () => {
		let osEnvInstance = new OsEnvironment( FAKE_OS_NAME, FAKE_OS_RELEASE );

		it( 'Stores name and release', () => {
			expect( osEnvInstance.name ).to.be.equal( FAKE_OS_NAME );
			expect( osEnvInstance.release ).to.be.equal( FAKE_OS_RELEASE );
		} );

		it( 'Figures out version', () => {
			expect( osEnvInstance.version ).to.be.equal( '10' );
		} );

		it( 'Is frozen object', () => {
			expect( osEnvInstance ).to.be.frozen;
		} );
	} );

	describe( 'createForCurrent()', () => {
		it( 'Returns a correct type', () => {
			expect( OsEnvironment.createForCurrent() ).to.be.an.instanceOf( OsEnvironment );
		} );

		it( 'Sets correct OS info', () => {
			let ret = OsEnvironment.createForCurrent();

			expect( ret.name ).to.be.equal( FAKE_OS_NAME );
			expect( ret.release ).to.be.equal( FAKE_OS_RELEASE );
		} );
	} );
} );
