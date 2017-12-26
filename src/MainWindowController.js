'use strict';

const TextViewer = require( './Viewer/Text' ),
	HTMLRenderViewer = require( './Viewer/Html/Render' ),
	HexViewer = require( './Viewer/Hex' );

class MainWindowController {
	constructor( app ) {
		this.app = app;

		/**
		 * @property {Object.<string, Viewer>} viewers a dictionary of available content viewers.
		 */
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
	 * @param {string} [viewerName] Preferred viewer name, based on {@link #viewers}.
	 * @memberOf MainWindowController
	 */
	previewItem( item, previewType, viewerName ) {
		let prev = document.querySelector( '#preview #render' ),
			viewer = this.viewers.text;

		if ( viewerName && this.viewers[ viewerName ] ) {
			viewer = this.viewers[ viewerName ];
		}

		this._showContainers( [ 'render', 'previewMenu' ] );

		this.app.previews.update( this.viewers, item, previewType );

		prev.innerHTML = '';
		viewer.display( item, previewType, prev );

		this._appendEditorUi( item, previewType, viewer );
	}

	/**
	 * Shows the edit component for a given `item`.
	 *
	 * @param {ClipboardSnapshot} item Snapshot to be edited.
	 * @param {string} type
	 * @param {Editor} editor
	 * @returns {Promise} Promise is resolved as edit view is displayed and ready.
	 */
	async editItem( item, type, editor ) {
		if ( !item ) {
			item = this.app.snapshots.getSelected();
		}

		if ( item ) {
			this._showContainers( [ 'previewMenu', 'editor' ] );

			await editor.show( item, type );
		}
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
		const allContainers = [ 'previewMenu', 'editor', 'content', 'render' ];

		for ( let id of allContainers ) {
			let elem = document.getElementById( id );
			if ( elem ) {
				elem.style.display = containers.includes( id ) ? null : 'none';
			}
		}
	}

	/**
	 * Appends editor for a given clipboard item.
	 *
	 * @private
	 * @param {ClipboardSnapshot} item
	 * @param {string} type Clipboard type previewed, e.g. `'HTML Format'`,  `'CF_UNICODE'` etc.
	 * @param {Viewer} viewer
	 */
	async _appendEditorUi( item, type, viewer ) {
		let editor = viewer.getEditor(),
			editorButton = document.querySelector( '#previewOptions .edit-btn' );

		const activeCssClass = 'btn-info';

		// In any case remove previous listener.
		editorButton.removeEventListener( 'click', this._editCallback );

		if ( this._lastEditor ) {
			await this._lastEditor.hide();
			this._lastEditor = null;
		}

		if ( editor ) {
			editorButton.classList.remove( 'hidden' );

			this._editCallback = async() => {
				if ( !editorButton.classList.contains( activeCssClass ) ) {
					editorButton.classList.add( activeCssClass );

					this.editItem( item, type, editor );
				} else {
					editorButton.classList.remove( activeCssClass );
					await editor.save( item, type );
					// Committing edit value.
					this.previewItem( item, type );
				}
			};

			this._lastEditor = editor;

			editorButton.addEventListener( 'click', this._editCallback );
		} else {
			editorButton.classList.add( 'hidden' );
			editorButton.classList.remove( activeCssClass );
		}
	}
}

module.exports = MainWindowController;