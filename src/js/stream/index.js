/**
*
*	COMPONENT: stream
*
*
*	DESCRIPTION:
*		- Defines the component stream interface.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2015. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2015.
*
*/

'use strict';

// MODULES //

var Writable = require( 'readable-stream' ).Writable,
	nextTick = require( 'next-tick' ),
	validate = require( './validate.js' );


// VARIABLES //

var isArray = /^\[{3}.+\]{3}$/;


// FUNCTIONS //

/**
* FUNCTION: copyOptions( options )
*	Copies relevant stream options into a new object.
*
* @private
* @param {Object} options - stream options
* @returns {Object} options copy
*/
function copyOptions( options ) {
	var props = [
			'objectMode',
			'highWaterMark',
			'decodeStrings',
			'newline'
		],
		copy = {},
		prop;

	for ( var i = 0; i < props.length; i++ ) {
		prop = props[ i ];
		if ( options.hasOwnProperty( prop ) ) {
			copy[ prop ] = options[ prop ];
		}
	}
	return copy;
} // end FUNCTION copyOptions()

/**
* FUNCTION: setOptions( options )
*	Sets stream specific options.
*
* @private
* @param {Object} options - stream options
*/
function setOptions( options ) {
	if ( !options.hasOwnProperty( 'objectMode' ) ) {
		options.objectMode = false;
	}
	if ( !options.hasOwnProperty( 'newline' ) ) {
		options.newline = '\n';
	}
} // end FUNCTION setOptions()

/**
* FUNCTION: isBuffer( chunk )
*	Checks if a chunk is a buffer via duck-typing. (NOTE: chunks emitted from a readable stream are not considered `buffers` by the browserify-buffer module due to `instanceof chunk !== Buffer`, despite a chunk being a Buffer. To address this, duck type based on known `buffer` methods.)
*
* @private
* @returns {Boolean} boolean indicating if a chunk is a Buffer instance
*/
function isBuffer( chunk ) {
	if ( Buffer.isBuffer( chunk ) ) {
		return true;
	}
	return ( typeof chunk.offset === 'number' && typeof chunk.get === 'function' && typeof chunk.readDoubleBE === 'function' && typeof chunk.readInt32BE === 'function' );
} // end FUNCTION isBuffer()


// STREAM //

/**
* FUNCTION: Stream( clbk[, options] )
*	Writable stream constructor.
*
* @constructor
* @param {Function} clbk - callback invoked upon receiving data
* @param {Object} [options] - Writable stream options
* @param {Number} [options.highWaterMark] - stream high watermark
* @param {Boolean} [options.objectMode] - whether the stream should operate in objectMode
* @param {Boolean} [option.decodeStrings] - whether the stream should decode strings back into buffers
* @param {String} [options.newline] - delimiter separating values associated with separate timestamps
* @returns {Stream} Writable stream
*/
function Stream( clbk, options ) {
	var err;
	if ( !arguments.length ) {
		throw new Error( 'Stream()::insufficient input arguments. Must provide a callback.' );
	}
	if ( typeof clbk !== 'function' ) {
		throw new TypeError( 'Stream()::invalid input argument. Callback must be a function.' );
	}
	if ( arguments.length < 2 ) {
		options = {};
	}
	if ( !( this instanceof Stream ) ) {
		return new Stream( clbk, options );
	}
	err = validate( options );
	if ( err ) {
		throw err;
	}
	setOptions( options );
	Writable.call( this, options );
	this._clbk = clbk;
	this._mode = options.objectMode;
	this._newline = options.newline;
	this._destroyed = false;

	return this;
} // end FUNCTION Stream()

/**
* Create a prototype which inherits from the parent prototype.
*/
Stream.prototype = Object.create( Writable.prototype );

/**
* Set the constructor.
*/
Stream.prototype.constructor = Stream;

/**
* METHOD: _write( chunk, encoding, clbk )
*	Implements the `_write` method to accept input.
*
* @private
* @param {Buffer|String} chunk - the chunk to be written
* @param {String} encoding - chunk encoding
* @param {Function} clbk - callback invoked after writing a chunk
*/
Stream.prototype._write = function( chunk, encoding, clbk ) {
	var err = null;

	if ( isBuffer( chunk ) ) {
		chunk = chunk.toString();
	}
	// [0] Object mode...
	if ( this._mode ) {
		if ( !Array.isArray( chunk ) ) {
			err = new TypeError( 'cannot stream non-arrays in objectMode. Chunk: `' + chunk + '`.' );
			this._clbk( err );
		} else {
			this._clbk( null, chunk );
		}
		clbk();
		return;
	}
	// [1] Stringified array...
	if ( !isArray.test( chunk ) ) {
		err = new Error( 'cannot stream non-arrays. Chunk: `' + chunk + '`.' );
		this._clbk( err );
		return;
	}
	// TODO: move to separate fcn, otherwise V8 cannot optimize!!!!
	try {
		chunk = JSON.parse( chunk );
		this._clbk( null, chunk );
	} catch ( e ) {
		err = new Error( 'unable to parse stream data as JSON array. Chunk: `' + chunk + '`.' );
		this._clbk( err );
	}
	clbk();
}; // end METHOD _write()

/**
* METHOD: destroy( [error] )
*	Gracefully destroys a stream, providing backwards compatibility.
*
* @param {Object} [error] - error message
* @returns {Stream} Stream instance
*/
Stream.prototype.destroy = function( error ) {
	if ( this._destroyed ) {
		return;
	}
	var self = this;
	this._destroyed = true;
	nextTick( function destroy() {
		if ( error ) {
			self.emit( 'error', error );
		}
		self.emit( 'close' );
	});
	return this;
}; // end METHOD destroy()


// OBJECT MODE //

/**
* FUNCTION: objectMode( clbk[, options] )
*	Returns a stream with `objectMode` set to `true`.
*
* @param {Function} clbk - callback invoked upon receiving data
* @param {Object} [options] - Writable stream options
* @returns {Stream} Writable stream
*/
function objectMode( clbk, options ) {
	if ( arguments.length < 2 ) {
		options = {};
	}
	options.objectMode = true;
	return new Stream( clbk, options );
} // end FUNCTION objectMode()


// FACTORY //

/**
* FUNCTION: streamFactory( [options] )
*	Creates a reusable stream factory.
*
* @param {Object} [options] - Writable stream options
* @returns {Function} stream factory
*/
function streamFactory( options ) {
	if ( !arguments.length ) {
		options = {};
	}
	options = copyOptions( options );
	/**
	* FUNCTION: createStream( clbk )
	*	Creates a stream.
	*
	* @param {Function} clbk - callback to be invoked upon receiving data
	* @returns {Stream} Writable stream
	*/
	return function createStream( clbk ) {
		return new Stream( clbk, options );
	};
} // end METHOD streamFactory()


// EXPORTS //

module.exports = Stream;
module.exports.objectMode = objectMode;
module.exports.factory = streamFactory;
