'use strict';

const Viewer = require( './Viewer' ),
	Reader = require( '../Reader/Reader' ),
	TextEditor = require( '../Editor/Text' );

class Text extends Viewer {
	constructor() {
		super();
		this.label = 'Text';
	}

	/**
	 * Tells whether this view is capable of handling given type.
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	handles() {
		// For now let's assume that it handles everything.
		return true;
	}

	getEditor( _type ) {
		if ( !this._editor ) {
			this._editor = new TextEditor();
		}

		return this._editor;
	}

	/**
	 * This method implements rendering.
	 *
	 * @param {ClipboardSnapshot} item
	 * @param {string} type
	 * @param {HTMLElement} element A wrapper element where the content preview have to be rendered.
	 */
	display( item, type, element ) {
		let reader = Reader.getReaderFor( item );

		element.innerText = reader.readText( item, type );
	}
}

module.exports = Text;