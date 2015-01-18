
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

		el.charge = -100;

		el.radius = function radius() {
			return Math.round( Math.random()*10 );
		};

		// [2.2] Figure 2:
		el = charts[ 1 ];
		d = data[ 1 ];

		el.addEventListener( 'clicked.vertex', function onVertex( evt ) {
			var el = charts[ 1 ],
				d = data[ 1 ];

			el.edges = d.edges[ evt.detail.index ];
			el.resetMarks();
			el._force
				.nodes( el.vertices )
				.links( el.edges )
				.start();
		});

		el.eLength = function edgeLength( d ) {
			return d.weight * 10;
		};

		el.vertices = d.vertices;
		el.edges = [];

		el.vColor = function vColor( d, i ) {
			return 'category10-' + (i%5+1);
		};

		el.charge = -200;

		// el.reset();

		// [2.3] Figure 3:
		el = charts[ 2 ];
		d = simulation1( 100 );

		el.eLength = function edgeLength( d ) {
			return d.weight;
		};

		el.vertices = d.vertices;
		el.edges = d.edges;

		el.charge = -200;

		// [2.4] Figure 4:
		el = charts[ 3 ];
		d = simulation2( 20 );

		el.eLength = function edgeLength( d ) {
			return d.weight;
		};

		el.vertices = d.vertices;
		el.edges = d.edges;

		el.charge = -150;

	} // end FUNCTION onData()

	/**
	* FUNCTION: simulation1( N )
	*	Simulates a connected graph having a central vertex.
	*
	* @param {Number} N - number of vertices
	* @returns {Object} simulated graph
	*/
	function simulation1( N ) {
		var data;

		data = {
			'vertices': new Array( N ),
			'edges': new Array( N )
		};
		for ( var i = 0; i < N; i++ ) {
			data.vertices[ i ] = {
				'id': i,
				'label': i
			};
			data.edges[ i ] = {
				'source': 0,
				'target': i,
				'weight': Math.random()*100
			};
		}
		return data;
	} // end FUNCTION simulation1()

	/**
	* FUNCTION: simulation2( N )
	*	Simulates a chain of vertices as a connected graph.
	*
	* @param {Number} N - number of vertices
	* @returns {Object} simulated graph
	*/
	function simulation2( N ) {
		var data;

		data = {
			'vertices': new Array( N ),
			'edges': new Array( N-1 )
		};
		data.vertices[ 0 ] = {
			'id': 0,
			'label': 0
		};
		for ( var i = 1; i < N; i++ ) {
			data.vertices[ i ] = {
				'id': i,
				'label': i
			};
			data.edges[ i-1 ] = {
				'source': i-1,
				'target': i,
				'weight': Math.random()*100
			};
		}
		return data;
	} // end FUNCTION simulation2()


	// SCRIPT //

	// Get the template for a figure configuration:
	getResource( './../examples/data/data.json', onData );

})();
