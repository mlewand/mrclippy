'use strict';

const TextViewer = require( './Viewer/Text' ),
	HTMLRenderViewer = require( './Viewer/Html/Render' ),
	HexViewer = require( './Viewer/Hex' );

class MainWindowController {
	constructor( app ) {
		this.app = app;

		this.viewers = {
			text: new TextViewer(),
			html: new HTMLRenderViewer(),
			hex: new HexViewer()
		};
	}

	/**
	 * Shows a detailed view for given `item`.
	 *
	 * @param {ClipboardSnapshot} item
	 * @param {string} previewType Type to be previewed.
	 * @memberOf MainWindowController
	 */
	previewItem( item, previewType, viewerName ) {
		let prev = document.querySelector( '#preview #render' ),
			viewer = this.viewers.text;

		if ( viewerName && this.viewers[ viewerName ] ) {
			viewer = this.viewers[ viewerName ];
		}

		this.app.previews.update( this.viewers, item, previewType );

		prev.innerHTML = '';
		viewer.display( item, previewType, prev );
	}
}

module.exports = MainWindowController;