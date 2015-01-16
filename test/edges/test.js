/* global describe, it, assert, expect */
'use strict';

// TESTS //

describe( 'edges', function tests() {

	var el = document.querySelector( '#fixture' );

	it( 'should provide an attribute to set edges', function test() {
		expect( el.edges ).to.be.an( 'array' );
	});

	it( 'should emit an `error` if set to a non-array', function test( done ) {
		var edges = el.edges,
			values;

		values = [
			'beep',
			5,
			NaN,
			null,
			undefined,
			true,
			{},
			function(){}
		];

		el.addEventListener( 'err', onError );

		next();

		function next() {
			el.edges = values.shift();
		}
		function onError( evt ) {
			assert.instanceOf( evt.detail, TypeError );
			if ( values.length ) {
				setTimeout( next, 0 );
				return;
			}
			setTimeout( end, 0 );
		}
		function end() {
			assert.deepEqual( el.edges, edges );
			el.removeEventListener( 'err', onError );
			done();
		}
	});

	it( 'should emit a `changed` event when set to a new value', function test( done ) {
		el.addEventListener( 'changed', onChange );

		el.edges = [];

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.attr, 'edges' );
			el.removeEventListener( 'changed', onChange );
			done();
		}
	});

	it( 'should emit an `edges` event when set to a new value', function test( done ) {
		el.addEventListener( 'edges', onChange );

		el.edges = [];

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.type, 'changed' );
			el.removeEventListener( 'edges', onChange );
			done();
		}
	});

	it( 'should emit a `changed` event when an edge is updated', function test( done ) {
		el.addEventListener( 'changed', onChange );

		el.edges[ 0 ] = {};

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.attr, 'edges' );
			el.removeEventListener( 'changed', onChange );
			done();
		}
	});

	it( 'should emit an `edges` event when an edge is updated', function test( done ) {
		el.addEventListener( 'edges', onChange );

		el.edges[ 0 ] = {};

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.type, 'changed' );
			el.removeEventListener( 'edges', onChange );
			done();
		}
	});

	it( 'should remove any existing edge elements if set to an empty array' );

});
