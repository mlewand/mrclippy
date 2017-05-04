'use strict';

const TextViewer = require( './Viewer/Text' );

class MainWindowController {
	constructor() {
		this.viewers = {
			text: new TextViewer()
		};
	}

	/**
	 * Shows a detailed view for given `item`.
	 *
	 * @param {ClipboardSnapshot} item
	 * @param {string} previewType Type to be previewed.
	 * @memberOf MainWindowController
	 */
	previewItem( item, previewType ) {
		let prev = document.querySelector( '#preview' );

		prev.innerHTML = '';
		this.viewers.text.display( item, previewType, prev );
	}
}

module.exports = MainWindowController;