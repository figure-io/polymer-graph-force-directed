/* global describe, it, assert, expect */
'use strict';

// TESTS //

describe( 'vertices', function tests() {

	var el = document.querySelector( '#fixture' );

	it( 'should provide an attribute to set vertices', function test() {
		expect( el.vertices ).to.be.an( 'array' );
	});

	it( 'should emit an `error` if set to a non-array', function test( done ) {
		var vertices = el.vertices,
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
			el.vertices = values.shift();
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
			assert.deepEqual( el.vertices, vertices );
			el.removeEventListener( 'err', onError );
			done();
		}
	});

	it( 'should emit a `changed` event when set to a new value', function test( done ) {
		el.addEventListener( 'changed', onChange );

		el.vertices = [];

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.attr, 'vertices' );
			el.removeEventListener( 'changed', onChange );
			done();
		}
	});

	it( 'should emit a `vertices` event when set to a new value', function test( done ) {
		el.addEventListener( 'vertices', onChange );

		el.vertices = [];

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.type, 'changed' );
			el.removeEventListener( 'vertices', onChange );
			done();
		}
	});

	it( 'should emit a `changed` event when a vertex is updated', function test( done ) {
		el.addEventListener( 'changed', onChange );

		el.vertices[ 0 ] = {};

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.attr, 'vertices' );
			el.removeEventListener( 'changed', onChange );
			done();
		}
	});

	it( 'should emit a `vertices` event when a vertex is updated', function test( done ) {
		el.addEventListener( 'vertices', onChange );

		el.vertices[ 0 ] = {};

		function onChange( evt ) {
			assert.isObject( evt.detail );
			assert.strictEqual( evt.detail.type, 'changed' );
			el.removeEventListener( 'vertices', onChange );
			done();
		}
	});

	it( 'should remove any existing vertex elements if set to an empty array' );

});
