/* global describe, it, assert, expect */
'use strict';

// TESTS //

describe( 'init', function tests() {

	var el = document.querySelector( '#fixture' );

	it( 'should have an `init` method', function test() {
		assert.ok( el.init );
	});

	it( 'should initialize a vertices attribute as an empty array', function test() {
		assert.deepEqual( el.vertices, [] );
	});

	it( 'should initialize an edges attribute as an empty array', function test() {
		assert.deepEqual( el.edges, [] );
	});

	it( 'should expose an events attribute listing all publicly emitted events', function test() {
		assert.ok( el.events.length );
	});

});
