( function() {
	'use strict';

	const electron = require( 'electron' );
	const app = electron.app;

	// adds debug features like hotkeys for triggering dev tools and reload
	require( 'electron-debug' )();

	require( 'electron-reload' )( __dirname );

	// prevent window being garbage collected
	let mainWindow;

	function onClosed() {
		// dereference the window
		// for multiple windows store them in an array
		mainWindow = null;
	}

	function dumpClipboard() {
		const { clipboard } = require( 'electron' );
		console.log( 'supported types: ', clipboard.availableFormats() );
	}

	function createMainWindow() {
		const win = new electron.BrowserWindow( {
			width: 600,
			height: 400
		} );

		win.foo = 'bar';

		win.loadURL( `file://${__dirname}/index.html` );
		win.webContents.openDevTools();
		win.webContents.on( 'did-finish-load', () => dumpClipboard );
		win.on( 'ready-to-show', dumpClipboard );

		win.on( 'closed', onClosed );

		return win;
	}

	app.on( 'window-all-closed', () => {
		if ( process.platform !== 'darwin' ) {
			app.quit();
		}
	} );

	app.on( 'activate', () => {
		if ( !mainWindow ) {
			mainWindow = createMainWindow();
		}
	} );

	app.on( 'ready', () => {
		mainWindow = createMainWindow();
	} );
} )();