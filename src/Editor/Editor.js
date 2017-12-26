
'use strict';

/**
 * Abstract base class for editors used to modify supported content types.
 */
class Editor {
	/**
	 * Commits edited value to the given clipboard data type.
	 *
	 * @returns {Promise.<Buffer>}
	 */
	async save() {
	}

	/**
	 * Shows the editor (and adds it to the DOM if necessary).
	 *
	 * @param {ClipboardSnapshot} item Clipboard item that the editor is shown for.
	 * @param {string} type Clipboard type to be edit.
	 */
	async show( _item, _type ) {}

	/**
	 * Hides the editor. It also reverts the value back to the original one if necessary.
	 */
	async hide() {}
}

module.exports = Editor;