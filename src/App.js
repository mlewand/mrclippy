'use strict';

const Navigation = require( './Component/Navigation' ),
	Types = require( './Component/Types' ),
	Previews = require( './Component/Previews' ),
	MainWindowController = require( './MainWindowController' ),
	ClipboardSnapshot = require( './ClipboardSnapshot' ),
	SnapshotList = require( './SnapshotsList' ),
	path = require( 'path' ),
	snapshotStorer = require( './SnapshotStorer' ),
	Storage = require( './Storage' ),
	notification = require( './notification' ),
	electron = require( 'electron' );

class App {
	constructor() {
		this.controller = new MainWindowController( this );
		this.storage = new Storage();
		this.config = require( '../config.json' );

		this.snapshots = new SnapshotList( this );

		this.nav = new Navigation( this.controller, this.snapshots );
		this.types = new Types( this.controller, this.snapshots );
		this.previews = new Previews( this.controller, this.snapshots );
	}

	async main() {
		await this.snapshots.loadFromStorage();

		this.snapshots.on( 'selected', item => {
			if ( item ) {
				let firstType = item.getTypes().next().value;

				if ( firstType ) {
					this.controller.previewItem( item, firstType );
				}
			} else {
				this.controller.promptItemSelection();
			}
		} );

		// By default capture current clipboard snapshot, and select it.
		await this.captureSnapshot();
	}

	/**
	 * Saves current snapshot.
	 *
	 * @param {BrowserWindow} [window=undefined] Browser window that should be associated with the dialog.
	 */
	saveSnapshot( window ) {
		let selectedSnapshot = this.snapshots.getSelected(),
			defaultPath = path.join( __dirname, '..', snapshotStorer.proposeFileName( selectedSnapshot ) );

		electron.remote.dialog.showSaveDialog( window, {
			title: 'Save Clipboard Snapshot',
			defaultPath: defaultPath
		}, function( fileName ) {
			if ( fileName ) {
				snapshotStorer.save( selectedSnapshot, fileName );
			}
		} );
	}

	/**
	 * Opens a file open dialog, where user can specify stored snapshot to be loaded.
	 *
	 * @param {BrowserWindow} [window=undefined] Browser window that should be associated with the dialog.
	 */
	openSnapshot( window ) {
		electron.remote.dialog.showOpenDialog( window, {
			filters: [ {
				name: 'MrClippy Snapshots',
				extensions: [ 'clip' ]
			},
			{
				name: 'All Files',
				extensions: [ '*' ]
			}
			],
			properties: [ 'openFile' ]
		}, fileNames => {
			if ( fileNames && fileNames[ 0 ] ) {
				snapshotStorer.load( fileNames[ 0 ] )
					.then( snapshot => this.snapshots.add( snapshot ) )
					.catch( e => notification.error( 'Snapshot couldnt be loaded', `MrClippy was unable to open "${fileNames[ 0 ]}" file.`, e ) );
			}
		} );
	}

	/**
	 * Writes snapshot to the current OS clipboard.
	 *
	 * @param {ClipboardSnapshot} clip
	 */
	writeSnapshot( clip ) {
		const clipboard = require( './clipboard' );
		clipboard.writeSnapshot( clip );
	}

	/**
	 * Creates a snapshot, adds it to the list and returns it.
	 *
	 * @returns {ClipboardSnapshot}
	 */
	async captureSnapshot() {
		let newSnapshot = ClipboardSnapshot.createFromClipboard(),
			last = this.snapshots.getFirst();

		if ( !this.config.allowSubsequentDuplicates && last && last.equals( newSnapshot ) ) {
			this.snapshots.select( last );
			return last;
		}

		await this.snapshots.add( newSnapshot );
		this.snapshots.select( newSnapshot );

		return newSnapshot;
	}
}

module.exports = App;