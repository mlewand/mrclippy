( function() {
	"use strict";

	class MainWindowController {
		/**
		 * Shows a detailed view for given `item`.
		 *
		 * @param {ClipboardSnapshot} item
		 * @param {string} [previewType] Type to be previewed.
		 * @memberOf MainWindowController
		 */
		previewItem( item, previewType ) {
			let prev = document.querySelector( '#preview' );

			// Nothing better than mixing view and logic for PoC purpose :D
			let types = Array.from( item.getTypes() ),
				content = '';

			for ( let type of types ) {
				if ( previewType && type !== previewType ) {
					continue;
				}

				content += `\n<div><h2>${type}</h2><div class="entry">${item.getValueAsHtml( type )}</div></div>`;
			}

			prev.innerHTML = content;
		}
	}

	module.exports = MainWindowController;
} )();
