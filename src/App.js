'use strict';

const Navigation = require( './Component/Navigation' ),
	Types = require( './Component/Types.js' ),
	MainWindowController = require( './MainWindowController' ),
	SnapshotList = require( './SnapshotsList' );

class App {
	constructor() {
		this.controller = new MainWindowController();
		this.snapshots = new SnapshotList();

		this.nav = new Navigation( this.controller, this.snapshots );
		this.types = new Types( this.controller, this.snapshots );
	}

	main() {

		this.snapshots.on( 'selected', item => this.controller.previewItem( item ) )

		const ClipboardSnapshot = require( './ClipboardSnapshot' );

		let initialSnapshot = new ClipboardSnapshot()

		// By default add a current clipboard snapshot, and select it.
		this.snapshots.add( initialSnapshot );
		this.snapshots.select( initialSnapshot );
	}
}

module.exports = App;