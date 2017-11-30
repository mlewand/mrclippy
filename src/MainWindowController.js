'use strict';

const TextViewer = require( './Viewer/Text' ),
	HTMLRenderViewer = require( './Viewer/Html/Render' ),
	HexViewer = require( './Viewer/Hex' ),
	Bitmap = require( './Viewer/Image/Bitmap' ),
	Png = require( './Viewer/Image/Png' );

class MainWindowController {
	constructor( app ) {
		this.app = app;

		/**
		 * @property {Object.<string, Viewer>} viewers a dictionary of available content viewers.
		 */
		this.viewers = {
			text: new TextViewer(),
			html: new HTMLRenderViewer(),
			hex: new HexViewer(),
			bitmap: new Bitmap(),
			png: new Png()
		};
	}

	/**
	 * Shows a detailed view for given `item`.
	 *
	 * @param {ClipboardSnapshot} item
	 * @param {string} previewType Type to be previewed.
	 * @param {string} [viewerName] Preferred viewer name, based on {@link #viewers}.
	 * @memberOf MainWindowController
	 */
	previewItem( item, previewType, viewerName ) {
		let prev = document.querySelector( '#preview #render' ),
			viewer = this.viewers.text;

		if ( viewerName && this.viewers[ viewerName ] ) {
			viewer = this.viewers[ viewerName ];
		}

		this._showContainers( [ 'render', 'previewTypes' ] );

		this.app.previews.update( this.viewers, item, previewType );

		prev.innerHTML = '';
		viewer.display( item, previewType, prev );
	}

	/**
	 * Displays a view that prompts user to create a clipboard snapshot.
	 */
	promptItemSelection() {
		this._showContainers( [ 'content' ] );

		document.getElementById( 'content' ).innerHTML = '<div class="alert alert-success fade show" role="alert">' +
				'<p>No clipboard snapshot is selected 😱</p>' +
				'<p>You can use <button class="btn btn-success btn-xl" onclick="app.captureSnapshot()">Capture a snapshot</button> button to create one!</p>' +
			'</div>';
	}

	/**
	 * Shows given `containers` and hides remaining ones.
	 *
	 * @param {string[]} containers Id of HTML containers to be shown. All others will be hidden.
	 */
	_showContainers( containers ) {
		const allContainers = [ 'previewTypes', 'content', 'render' ];

		for ( let id of allContainers ) {
			let elem = document.getElementById( id );
			if ( elem ) {
				elem.style.display = containers.includes( id ) ? null : 'none';
			}
		}
	}
}

module.exports = MainWindowController;