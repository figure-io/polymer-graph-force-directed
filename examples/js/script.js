
(function() {
	'use strict';

	// FUNCTIONS //

	/**
	* FUNCTION: getResource( url, clbk )
	*   Fetches a resource from a provided URL and returns the result to a provided callback.
	*
	* @param {String} url - resource location
	* @param {Function} clbk - callback to invoke upon resource receipt. Function should accept one input argument: [ result ]
	*/
	function getResource( url, clbk ) {
		var xhr;

		// Create a new request object:
		xhr = new XMLHttpRequest();

		// Open the request connection:
		xhr.open( 'GET', url, true );

		// Define the state change callback:
		xhr.onreadystatechange = function () {
			if ( xhr.readyState !== 4 || xhr.status !== 200 ){
				return;
			}
			clbk( xhr.responseText );
		};

		// Send the request:
		xhr.send();
	} // end FUNCTION getResource()

	/**
	* FUNCTION: onData( body )
	*	Response handler for an HTTP request. Parses the returned data.
	*
	* @param {String} body - HTTP response body
	*/
	function onData( body ) {
		var figs,
			len,
			charts,
			data,
			d,
			el,
			i;

		// [0] Grab chart elements...
		figs = document.querySelectorAll( '.figure' );

		len = figs.length;
		charts = new Array( len );
		for ( i = 0; i < len; i++ ) {
			charts[ i ] = figs[ i ].querySelector( '.chart' );
		}

		// [1] Parse the data:
		data = JSON.parse( body );

		// [2] Configure each figure...

		// [2.1] Figure 1:
		el = charts[ 0 ];
		d = data[ 0 ];

		el.vertices = d.vertices;
		el.edges = d.edges;

		// FIXME: reset will be replaced
		el.reset();

		el.radius = function radius() {
			return Math.round( Math.random()*10 );
		};

		// [2.2] Figure 2:
		el = charts[ 1 ];
		d = data[ 1 ];

		el.vertices = d.vertices;
		el.edges = [];

		el.charge = -300;

		// el.reset();

	} // end FUNCTION onData()


	// SCRIPT //

	// Get the template for a figure configuration:
	getResource( './../examples/data/data.json', onData );

})();
