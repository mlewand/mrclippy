( function() {
	"use strict";

	class MainWindowController {
		/**
		 * Shows a detailed view for given `item`.
		 *
		 * @param {ClipboardSnapshot} item
		 * @memberOf MainWindowController
		 */
		previewItem( item ) {
			let prev = document.querySelector( '#preview' );

			// Nothing better than mixing view and logic for PoC purpose :D
			let types = Array.from( item.getTypes() ),
				content = `<p>${types.length} in total</p>`;

			for ( let type of types ) {
				content += `\n<div><h2>${type}</h2><div class="entry">${item.getValueAsHtml( type )}</div></div>`;
			}

			prev.innerHTML = content;
		}
	}

	module.exports = MainWindowController;
} )();
