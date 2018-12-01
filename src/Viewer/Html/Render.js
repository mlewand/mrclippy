'use strict';

const Viewer = require( '../Viewer' ),
	HtmlEditor = require( '../../Editor/Html' ),
	utf8decoder = new TextDecoder( 'utf8' );

class Text extends Viewer {
	constructor() {
		super();
		this.label = 'HTML Preview';
	}

	/**
	 * Tells whether this view is capable of handling given type.
	 *
	 * @param {string} type
	 * @returns {boolean}
	 */
	handles( type ) {
		return type.toLowerCase().indexOf( 'html' ) !== -1;
	}

	getEditor( _type ) {
		if ( !this._editor ) {
			this._editor = new HtmlEditor();
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
		let html = utf8decoder.decode( item.getValue( type ) );

		// For Windows, the display value needs to be further sanitized.
		if ( process.platform == 'win32' ) {
			html = this._stripWindowsMeta( html );
		}

		this._displaySandboxPreview( html, element );
	}

	/**
	 * Renders `html` in a sanboxed iframe.
	 *
	 * @param {string} html
	 * @param {HTMLElement} element Parent element that the `<iframe>` should get appended to.
	 */
	_displaySandboxPreview( html, element ) {
		let sandboxIframe = element.ownerDocument.createElement( 'iframe' );

		sandboxIframe.classList = 'preview-iframe';
		sandboxIframe.sandbox = '';
		sandboxIframe.style.display = 'none';
		element.appendChild( sandboxIframe );

		sandboxIframe.contentDocument.body.innerHTML = html;

		sandboxIframe.style.display = null;

		// Adjust iframe height to the content.
		sandboxIframe.style.height = sandboxIframe.contentWindow.document.body.scrollHeight + 'px';
	}

	/**
	 * Removes Windows-specific meta tags added to the HTML Format, like StartHTML/SourceURL headers etc.
	 *
	 * @param {bytes} html
	 * @returns {string}
	 */
	_stripWindowsMeta( html ) {
		html = String( html );

		let headerEnd = html.match( /^(EndFragment:.+?\r?\n(SourceURL:.+?\r?\n)?)/m );

		if ( headerEnd ) {
			return html.substr( headerEnd.index + headerEnd[ 0 ].length );
		}
		return html;
	}
}

module.exports = Text;
