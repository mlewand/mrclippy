const ClipboardSnapshotMock = require( './mock/ClipboardSnapshotMock' ),
	clipboard = require( '../src/clipboard' ),
	chai = require( 'chai' ),
	expect = chai.expect,
	sinon = require( 'sinon' );

chai.use( require( 'chai-as-promised' ) );
chai.use( require( 'sinon-chai' ) );

describe( 'clipboard base module', () => {
	describe( 'writeSnasphot', () => {
		const mockSnapshot = new ClipboardSnapshotMock( {
			'HTML Format': Buffer.from( [ 31, 32, 33 ] ),
			CF_UNICODETEXT: Buffer.from( [ 31, 0, 32, 0, 33, 0 ] ),
			Binary: Buffer.from( [ 64, 64, 64 ] )
		} );

		before( () => {
			sinon.stub( clipboard, 'write' );
			sinon.stub( clipboard, 'clear' );
		} );

		beforeEach( () => {
			clipboard.clear.reset();
			clipboard.write.reset();
		} );

		after( () => {
			clipboard.clear.restore();
			clipboard.write.restore();
		} );

		it( 'passes all the data', () => {
			let formats = [ 'HTML Format', 'CF_UNICODETEXT', 'Binary' ];

			clipboard.writeSnapshot( mockSnapshot );

			for ( let format of formats ) {
				expect( clipboard.write ).to.be.calledWithExactly( format, mockSnapshot.getValue( format ) );
			}

			expect( clipboard.write ).to.have.callCount( formats.length );
		} );

		it( 'clears the existing clipboard', () => {
			clipboard.writeSnapshot( mockSnapshot );

			expect( clipboard.clear ).to.be.calledOnce;
		} );
	} );
} );
