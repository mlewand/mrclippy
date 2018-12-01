'use strict';

const Editor = require( './Editor' ),
	utf8decoder = new TextDecoder( 'utf8' ),
	path = require( 'path' );

class Html extends Editor {
	/**
	 * Commits edited value to the given clipboard data type.
	 *
	 * @returns {Promise.<Buffer>}
	 */
	async save( item, type ) {
		if ( this._editor ) {
			item.setValue( type, Buffer.from( this._editor.getValue(), 'utf8' ) );
		}

		await this.hide();
	}

	async show( item, type ) {
		let monaco = await this._getMonaco(),
			wrapper = document.getElementById( 'editor' ),
			string = utf8decoder.decode( item.getValue( type ) );

		wrapper.innerHTML = '<div id="monaco-editor"></div>';

		let editor = monaco.editor.create( document.getElementById( 'monaco-editor' ), {
			value: string,
			language: 'html',
			theme: global.app.config.monacoTheme,
			minimap: {
				enabled: false
			}
		} );

		this._editor = editor;

		editor.focus();
	}

	/**
	 * Hides the editor. It also reverts the value back to the original one if necessary.
	 */
	async hide() {
		if ( this._editor ) {
			this._editor.dispose();
			this._editor = null;
		}
	}

	/**
	 * Encapsulates all the [Monaco](https://github.com/Microsoft/monaco-editor) loading stuff.
	 *
	 * @returns {Promise.<monaco>} See https://microsoft.github.io/monaco-editor/api/index.html for a reference.
	 */
	async _getMonaco() {
		// Code is heavily based on:
		// https://github.com/Microsoft/monaco-editor-samples/blob/4ce21071528f9b6f898975ff35730e6833552623/sample-electron/index.html
		// It caches AMD loader from Monaco in a cached variable in prototype, so that other instances have access to it.
		let editorPrototype = Object.getPrototypeOf( this );

		if ( !editorPrototype._amdRequire ) {
			// Monaco is being loaded for the first time.
			editorPrototype._amdRequire = require( '../../node_modules/monaco-editor/min/vs/loader.js' ).require;

			function uriFromPath( _path ) {
				var pathName = path.resolve( _path ).replace( /\\/g, '/' );
				if ( pathName.length > 0 && pathName.charAt( 0 ) !== '/' ) {
					pathName = '/' + pathName;
				}
				return encodeURI( 'file://' + pathName );
			}

			editorPrototype._amdRequire.config( {
				baseUrl: uriFromPath( path.join( __dirname, '..', '../node_modules/monaco-editor/min' ) )
			} );

			// Workaround monaco-css not understanding the environment.
			self.module = undefined;
			// Workaround monaco-typescript not understanding the environment.
			self.process.browser = true;
		}

		return new Promise( resolve => {
			editorPrototype._amdRequire( [ 'vs/editor/editor.main' ], function() {
				resolve( global.monaco );
			} );
		} );
	}
}

module.exports = Html;
