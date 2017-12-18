const ClipboardSnapshotMock = require( './mock/ClipboardSnapshotMock' ),
	SnapshotsList = require( '../src/SnapshotsList' );

describe( 'SnapshotsList', () => {
	let storageMock = {
			keys() {
				return 3;
			},
			setItem() {},
			getItem() {
				return 55;
			},
			removeItem() {}
		},
		listMock = new SnapshotsList( storageMock ),
		sandbox = sinon.createSandbox();

	const mockSnapshot = new ClipboardSnapshotMock( {
		'HTML Format': Buffer.from( [ 31, 32, 33 ] ),
		CF_UNICODETEXT: Buffer.from( [ 31, 0, 32, 0, 33, 0 ] ),
		Binary: Buffer.from( [ 64, 64, 64 ] )
	} );

	before( () => {
		sandbox.stub( storageMock, 'keys' );
		sandbox.stub( storageMock, 'setItem' );
		sandbox.stub( storageMock, 'getItem' );
		sandbox.stub( storageMock, 'removeItem' );

		sandbox.stub( listMock, 'emit' );
	} );

	beforeEach( () => {
		sandbox.reset();
		storageMock.keys.resolves( [] );
	} );

	describe( 'add()', () => {
		it( 'Adds the item to persistent storage', async() => {
			const SnapshotStorer = require( '../src/SnapshotStorer' );

			await listMock.add( mockSnapshot );

			expect( storageMock.setItem ).to.be.calledWith( '0', SnapshotStorer._getSnapshotObject( mockSnapshot ) );
		} );

		it( 'Fires added and changed events', async() => {
			await listMock.add( mockSnapshot );

			// Make sure first added event is fired.
			expect( listMock.emit.firstCall ).to.be.calledWithExactly( 'added', mockSnapshot );
			expect( listMock.emit ).to.be.calledWithExactly( 'changed' );
		} );
	} );

	describe( 'remove()', () => {
		let initialStorageKey = mockSnapshot._storageKey;

		beforeEach( () => {
			listMock._store.add( mockSnapshot );
			mockSnapshot._storageKey = '10';
		} );

		after( () => {
			mockSnapshot._storageKey = initialStorageKey;
		});

		it( 'Removes the item from storage', async() => {
			await listMock.remove( mockSnapshot );
			expect( storageMock.removeItem ).to.be.calledWith( '10' );
		} );

		it( 'Fires added and changed events', async() => {
			await listMock.remove( mockSnapshot );

			// Make sure first added event is fired.
			expect( listMock.emit.firstCall ).to.be.calledWithExactly( 'removed', mockSnapshot );
			expect( listMock.emit ).to.be.calledWithExactly( 'changed' );
		} );
	} );
} );
