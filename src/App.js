'use strict';

const Navigation = require( './Component/Navigation' ),
	Types = require( './Component/Types' ),
	Previews = require( './Component/Previews' ),
	MainWindowController = require( './MainWindowController' ),
	SnapshotList = require( './SnapshotsList' );

class App {
	constructor() {
		this.controller = new MainWindowController( this );
		this.snapshots = new SnapshotList();

		this.nav = new Navigation( this.controller, this.snapshots );
		this.types = new Types( this.controller, this.snapshots );
		this.previews = new Previews( this.controller, this.snapshots );
	}

	main() {

		// this.snapshots.on( 'selected', item => this.controller.previewItem( item, item.getTypes().next().value ) )
		this.snapshots.on( 'selected', item => this.controller.previewItem( item, 'HTML Format', 'html' ) )

		const ClipboardSnapshot = require( './ClipboardSnapshot' );

		let initialSnapshot = new ClipboardSnapshot()

		// By default add a current clipboard snapshot, and select it.
		this.snapshots.add( initialSnapshot );
		this.snapshots.select( initialSnapshot );
	}
}

module.exports = App;