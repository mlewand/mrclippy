'use strict';

const Component = require( './Component' );

/**
 * Lists all available previews for current content.
 */
class Previews extends Component {
	constructor( controller, snapshots ) {
		super( controller, 'previewTypes' );

		this.snapshots = snapshots;
	}

	update( viewers, item, type ) {
		this._clear();

		for ( let viewerName in viewers ) {
			let viewer = viewers[ viewerName ];

			if ( viewer.handles( type ) ) {
				this._elem.appendChild( this.getTabFor( item, type, viewer, viewerName ) );
			}
		}
	}

	getTabFor( item, type, viewer, viewerName ) {
		let ret = document.createElement( 'button' );
		ret.classList = 'btn';
		ret.innerText = viewer.label;
		ret.dataset.viewerName = viewerName;
		ret.addEventListener( 'click', () => {
			this.controller.previewItem( item, type, viewerName );
			this.markViewer( viewerName );
		} );

		return ret;
	}

	/**
	 * Marks given viewer as a selected one.
	 *
	 * @param {string} viewerName
	 */
	markViewer( viewerName ) {
		this._elem.querySelectorAll( '.btn-primary' ).forEach( el => el.classList.remove( 'btn-primary' ) );

		if ( viewerName ) {
			let res = this._elem.querySelector( `[data-viewer-name="${viewerName}"]` );
			if ( res ) {
				res.classList.add( 'btn-primary' );
			}
		}
	}

	_clear() {
		this._elem.innerHTML = '';
	}
}

module.exports = Previews;