const ClipboardSnapshotMock = require( './mock/ClipboardSnapshotMock' ),
	AppMock = require( './mock/AppMock' ),
	SnapshotsList = require( '../src/SnapshotsList' );

describe( 'SnapshotsList', () => {
	let appMock = new AppMock(),
		listMock = new SnapshotsList( appMock ),
		storageMock = appMock.storage.snapshots,
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
		} );

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

	describe( 'clear()', () => {
		let removeStub;

		before( () => removeStub = sinon.spy( listMock, 'remove' ) );

		after( () => removeStub.restore() );

		it( 'works', async() => {
			let snapshot2 = new ClipboardSnapshotMock( {} );

			await listMock.add( mockSnapshot );
			await listMock.add( snapshot2 );

			await listMock.clear();

			expect( listMock.remove ).to.be.calledWithExactly( mockSnapshot );
			expect( listMock.remove ).to.be.calledWithExactly( snapshot2 );

			expect( listMock._store ).is.empty;
		} );
	} );

	describe( 'config.persistentStorage = false', () => {
		let initialConfigValue = appMock.config.persistentStorage;

		before( () => appMock.config.persistentStorage = false );
		after( () => appMock.config.persistentStorage = initialConfigValue );

		it( 'Does not create storage entry with add', async() => {
			await listMock.add( mockSnapshot );

			expect( storageMock.setItem ).not.to.be.called;
		} );

		it( 'Does not modify storage on remove', async() => {
			await listMock.add( mockSnapshot );
			await listMock.remove( mockSnapshot );

			expect( storageMock.removeItem ).not.to.be.called;
		} );

		it( 'Does not load entries in loadFromStorage', async() => {
			await listMock.loadFromStorage();

			expect( storageMock.keys ).not.to.be.called;
			expect( storageMock.getItem ).not.to.be.called;
		} );
	} );
} );
