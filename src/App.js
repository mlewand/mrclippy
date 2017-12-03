'use strict';

const Navigation = require( './Component/Navigation' ),
	Types = require( './Component/Types' ),
	Previews = require( './Component/Previews' ),
	MainWindowController = require( './MainWindowController' ),
	ClipboardSnapshot = require( './ClipboardSnapshot' ),
	SnapshotList = require( './SnapshotsList' ),
	path = require( 'path' ),
	snapshotStorer = require( './SnapshotStorer' ),
	electron = require( 'electron' );

class App {
	constructor() {
		this.controller = new MainWindowController( this );
		this.snapshots = new SnapshotList();

		this.nav = new Navigation( this.controller, this.snapshots );
		this.types = new Types( this.controller, this.snapshots );
		this.previews = new Previews( this.controller, this.snapshots );
	}

	main() {
		this.snapshots.on( 'selected', item => {
			let firstType = item.getTypes().next().value;

			if ( firstType ) {
				this.controller.previewItem( item, firstType );
			}
		} );

		// By default capture current clipboard snapshot, and select it.
		this.snapshots.select( this.captureSnapshot() );
	}

	/**
	 * Saves current snapshot.
	 *
	 * @param {BrowserWindow} [window] Browser window that should be associated with the window.
	 */
	saveSnapshot( window ) {
		let selectedSnapshot = this.snapshots.getSelected(),
			defaultPath = path.join( __dirname, '..', snapshotStorer.proposeFileName( selectedSnapshot ) );

		electron.remote.dialog.showSaveDialog( window, {
			title: 'Save Clipboard Snapshot',
			defaultPath: defaultPath
		}, function( fileName ) {
			snapshotStorer.save( selectedSnapshot, fileName );
		} );
	}

	openSnapshot() {
		console.log( 'Not implemented yet' );
	}

	/**
	 * Creates a snapshot, adds it to the list and returns it.
	 *
	 * @returns {ClipboardSnapshot}
	 */
	captureSnapshot() {
		let initialSnapshot = new ClipboardSnapshot();

		this.snapshots.add( initialSnapshot );

		return initialSnapshot;
	}
}

module.exports = App;
