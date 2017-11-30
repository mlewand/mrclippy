"use strict";

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
			// this._elem.appendChild( this.getTabFor( item, type ) );
		}
	}

	getTabFor( item, type, viewer, viewerName ) {
		let ret = document.createElement( 'a' );
		ret.href = '#';
		ret.innerText = viewer.label;
		ret.addEventListener( 'click', evt => {
			this.controller.previewItem( item, type, viewerName );
		} );

		return ret;
	}

	_clear() {
		this._elem.innerHTML = '';
	}
}

module.exports = Previews;
