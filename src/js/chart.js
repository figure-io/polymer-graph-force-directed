/**
*
*	CHART
*
*
*	DESCRIPTION:
*		- Defines the chart prototype.
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

/* global document */
'use strict';

// MODULES //

var // Writable stream constructor:
	Stream = require( './stream' ),

	// Utility to create delayed event listeners:
	delayed = require( './utils/delayed.js' );


// VARIABLES //

var EVENTS = [
	'vertices',
	'edges',

	'width',
	'height',

	'changed',
	'err',

	'resized',
	'clicked'
];


// FUNCTIONS //

/**
* FUNCTION: cx( d )
*	Vertex x-position accessor.
*
* @private
* @param {Object} d - datum
* @returns {Number} x-position
*/
function cx( d ) {
	return d.x;
}

/**
* FUNCTION: cy( d )
*	Vertex y-position accessor.
*
* @private
* @param {Object} d - datum
* @returns {Number} y-position
*/
function cy( d ) {
	return d.y;
}

/**
* FUNCTION: x1( d )
*	Edge source x-position accessor.
*
* @private
* @param {Object} d - datum
* @returns {Number} x-position
*/
function x1( d ) {
	return d.source.x;
}

/**
* FUNCTION: y1( d )
*	Edge source y-position accessor.
*
* @private
* @param {Object} d - datum
* @returns {Number} y-position
*/
function y1( d ) {
	return d.source.y;
}

/**
* FUNCTION: x2( d )
*	Edge target x-position accessor.
*
* @private
* @param {Object} d - datum
* @returns {Number} x-position
*/
function x2( d ) {
	return d.target.x;
}

/**
* FUNCTION: y2( d )
*	Edge target y-position accessor.
*
* @private
* @param {Object} d - datum
* @returns {Number} y-position
*/
function y2( d ) {
	return d.target.y;
}


// CHART //

/**
* FUNCTION: Chart()
*	Chart constructor.
*
* @constructor
* @returns {Chart} Chart instance
*/
function Chart() {
	if ( !( this instanceof Chart ) ) {
		return new Chart();
	}
	return this;
} // end FUNCTION Chart()

/**
* ATTRIBUTE: paddingLeft
*	Chart canvas left padding.
*
* @type {Number}
* @default 40px
*/
Chart.prototype.paddingLeft = 40;

/**
* ATTRIBUTE: paddingRight
*	Chart canvas right padding.
*
* @type {Number}
* @default 40px
*/
Chart.prototype.paddingRight = 40;

/**
* ATTRIBUTE: paddingBottom
*	Chart canvas bottom padding.
*
* @type {Number}
* @default 40px
*/
Chart.prototype.paddingBottom = 40;

/**
* ATTRIBUTE: paddingTop
*	Chart canvas top padding.
*
* @type {Number}
* @default 40px
*/
Chart.prototype.paddingTop = 40;

/**
* ATTRIBUTE: width
*	Chart canvas width. If not explicitly set, defaults to the width of the parent node.
*
* @type {Number}
* @default null
*/
Chart.prototype.width = null;

/**
* ATTRIBUTE: height
*	Chart canvas height. If not explicitly set, defaults to the height of the parent node.
*
* @type {Number}
* @default null
*/
Chart.prototype.height = null;

/**
* ATTRIBUTE: chartTitle
*	Chart title.
*
* @type {String}
* @default ''
*/
Chart.prototype.chartTitle = '';

/**
* ATTRIBUTE: radius
*	Specifies the vertex circle radius.
*
* @type {Number|Function}
* @default 10
*/
Chart.prototype.radius = 10;

/**
* ATTRIBUTE: vColor
*	Defines the vertex color class accessor.
*
* @type {Null|Function}
* @default null
*/
Chart.prototype.vColor = null;

/**
* METHOD: vLabel( d )
*	Returns the vertex label.
*
* @param {Object} d - datum
* @return {String} vertex label
*/
Chart.prototype.vLabel = function vLabel( d ) {
	return d.label;
}; // end METHOD vLabel()

/**
* ATTRIBUTE: eColor
*	Defines the edge color class accessor.
*
* @type {Null|Function}
* @default null
*/
Chart.prototype.eColor = null;

/**
* METHOD: eLabel( d )
*	Returns the edge label.
*
* @param {Object} d - datum
* @return {String} edge label
*/
Chart.prototype.eLabel = function vLabel( d ) {
	return d.label;
}; // end METHOD eLabel()

/**
* ATTRIBUTE: eLength
*	Specifies edge length. See [D3 documentation]{@link https://github.com/mbostock/d3/wiki/Force-Layout#linkDistance}.
*
* @type {Number|Function}
* @default 20
*/
Chart.prototype.eLength = 20;

/**
* ATTRIBUTE: eStrength
*	Specifies edge rigidity. See [D3 documentation]{@link https://github.com/mbostock/d3/wiki/Force-Layout#linkStrength}.
*
* @type {Number|Function}
* @default 1
*/
Chart.prototype.eStrength = 1;

/**
* ATTRIBUTE: friction
*	Specifies the velocity decay for each simulation tick. See [D3 documentation]{@link https://github.com/mbostock/d3/wiki/Force-Layout#fiction}.
*
* @type {Number}
* @default 0.9
*/
Chart.prototype.friction = 0.9;

/**
* ATTRIBUTE: charge
*	Specifies vertex charge. See [D3 documentation]{@link https://github.com/mbostock/d3/wiki/Force-Layout#charge}.
*
* @type {Number|Function}
* @default -30
*/
Chart.prototype.charge = -30;

/**
* ATTRIBUTE: chargeDistance
*	Specifies the maximum distance over which charge is applied. A finite charge distance helps force layout performance. See [D3 documentation]{@link https://github.com/mbostock/d3/wiki/Force-Layout#chargeDistance}.
*
* @type {Number}
* @default +infinity
*/
Chart.prototype.chargeDistance = Number.POSITIVE_INFINITY;

/**
* ATTRIBUTE: theta
*	Specifies a factor used to consider a group of charges (vertices) a single charge when simulating long-range charge interaction. See [D3 documentation]{@link https://github.com/mbostock/d3/wiki/Force-Layout#theta}.
*
* @type {Number}
* @default 0.8
*/
Chart.prototype.theta = 0.8;

/**
* ATTRIBUTE: gravity
*	Specifies a geometric constraint to prevent vertices from escaping the graph bounds. To disable, set to `0`. See [D3 documentation]{@link https://github.com/mbostock/d3/wiki/Force-Layout#gravity}.
*
* @type {Number}
* @default 0.1
*/
Chart.prototype.gravity = 0.1;

/**
* ATTRIBUTE: autoUpdate
*	Boolean flag indicating whether a chart should auto update DOM elements whenever an attribute changes.
*
* @type {Boolean}
* @default true
*/
Chart.prototype.autoUpdate = true;

/**
* ATTRIBUTE: autoResize
*	Boolean flag indicating whether a chart should auto resize when the window resizes.
*
* @type {Boolean}
* @default true
*/
Chart.prototype.autoResize = true;

/**
* METHOD: created()
*	Polymer hook that is called when an element is created.
*/
Chart.prototype.created = function() {
	this.init();
}; // end METHOD created()

/**
* METHOD: init()
*	Initialization.
*/
Chart.prototype.init = function() {
	var create = document.createElement.bind( document ),
		d3,
		el,
		$;

	// Create a new D3 element to access the library dependency:
	el = create( 'polymer-d3' );
	d3 = el.d3;
	this._d3 = d3;

	// Create a new uuid element to access the library dependency for creating uuids:
	el = create( 'polymer-uuid' );
	this._uuid = el.uuid;

	// Assign the chart a private uuid:
	this.__uid__ = this._uuid.v4();

	// Initialize attributes...

	// Config: (hint an object)
	this.config = {};

	// Events: (hint an array)
	this.events = EVENTS;

	// Vertices: (hint an array)
	this.vertices = [];

	// Edges: (hint an array)
	this.edges = [];

	// Private methods...

	// Force...
	this._force = d3.layout.force()
		.size([
			this.graphWidth(),
			this.graphHeight()
		])
		.nodes( this.vertices )
		.links( this.edges )
		.linkStrength( this.eStrength )
		.linkDistance( this.eLength )
		.charge( this.charge )
		.chargeDistance( this.chargeDistance )
		.friction( this.friction )
		.gravity( this.gravity )
		.theta( this.theta );

	// Stream...
	this._stream = null;

	// Interaction...
	this._onResize = delayed( this.onResize.bind( this ), 400 );

	// Element cache...
	this.$ = $ = {};

	// Base elements...
	$.root = null;
	$.canvas = null;
	$.clipPath = null;
	$.graph = null;
	$.bkgd = null;

	// Meta elements...
	$.meta = null;
	$.title = null;

	// Data elements...
	$.marks = null;
	$.vGroup = null;
	$.eGroup = null;
	$.vertices = null;
	$.edges = null;

	// Clip path...
	this._clipPathID = this._uuid.v4();
}; // end METHOD init()

/**
* METHOD: attached()
*	Polymer hook that is called when the element is inserted in the DOM.
*/
Chart.prototype.attached = function() {
	this.create().addListeners();
}; // end METHOD attached()

/**
* METHOD: detached()
*	Polymer hook that is called when the element is removed from the DOM.
*/
Chart.prototype.detached = function() {
	this.removeListeners();
}; // end METHOD detached()

/**
* METHOD: addListeners()
*	Adds event listeners.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.addListeners = function() {
	this.removeListeners();
	if ( this.autoResize ) {
		window.addEventListener( 'resize', this._onResize, false );
	}
	return this;
}; // end METHOD addListeners()

/**
* METHOD: removeListeners()
*	Removes event listeners.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.removeListeners = function() {
	window.removeEventListener( 'resize', this._onResize );
	return this;
}; // end METHOD removeListeners()

/**
* METHOD: create()
*	Creates a chart.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.create = function() {
	// Ensure that the width and height are set before creating a chart...
	this.width = this.width || this.clientWidth || this.parentNode.clientWidth || 600;
	this.height = this.height || this.clientHeight || this.parentNode.clientHeight || 400;

	// Create the chart layers...
	this
		.createBase()
		.createBackground()
		.createLayout()
		.createMarks()
		.createVertices()
		.createEdges()
		.createTitle();

	return this;
}; // end METHOD create()

/**
* METHOD: createBase()
*	Creates the chart base.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createBase = function() {
	var width = this.width,
		height = this.height,
		pLeft = this.paddingLeft,
		pTop = this.paddingTop,
		canvas;

	// Only cache the root element once (should not change)...
	if ( !this.$.root ) {
		this.$.root = this._d3.select( this.$.chart );
	}
	// Remove any existing canvas...
	if ( this.$.canvas ) {
		this.$.canvas.remove();
	}
	// Create the SVG element:
	canvas = this.$.root.append( 'svg:svg' )
		.attr( 'property', 'canvas' )
		.attr( 'class', 'canvas' )
		.attr( 'width', width )
		.attr( 'height', height );
	this.$.canvas = canvas;

	// Create the clip-path:
	this.$.clipPath = canvas.append( 'svg:defs' )
		.append( 'svg:clipPath' )
			.attr( 'id', this._clipPathID )
			.append( 'svg:rect' )
				.attr( 'class', 'clipPath' )
				.attr( 'width', this.graphWidth() )
				.attr( 'height', this.graphHeight() );

	// Create the graph element:
	this.$.graph = canvas.append( 'svg:g' )
		.attr( 'property', 'graph' )
		.attr( 'class', 'graph' )
		.attr( 'data-graph-type', 'graph-force-directed' )
		.attr( 'transform', 'translate(' + pLeft + ',' + pTop + ')' );

	// Create the meta element:
	this.$.meta = canvas.append( 'svg:g' )
		.attr( 'property', 'meta' )
		.attr( 'class', 'meta' )
		.attr( 'data-graph-type', 'graph-force-directed' )
		.attr( 'transform', 'translate(0,0)' );

	return this;
}; // end METHOD createBase()

/**
* METHOD: createBackground()
*	Creates a background element.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createBackground = function() {
	// Remove any existing background...
	if ( this.$.bkgd ) {
		this.$.bkgd.remove();
	}
	this.$.bkgd = this.$.graph.append( 'svg:rect' )
		.attr( 'class', 'background' )
		.attr( 'x', 0 )
		.attr( 'y', 0 )
		.attr( 'width', this.graphWidth() )
		.attr( 'height', this.graphHeight() );

	return this;
}; // end METHOD createBackground()

/**
* METHOD: createLayout()
*	Creates the graph layout.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createLayout = function() {
	this._force.start().stop();
	return this;
}; // end METHOD createLayout()

/**
* METHOD: createMarks()
*	Creates a graph marks element.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createMarks = function() {
	// Remove any existing marks...
	if ( this.$.marks ) {
		this.$.marks.remove();
	}
	// Create a `marks` group:
	this.$.marks = this.$.graph.append( 'svg:g' )
		.attr( 'property', 'marks' )
		.attr( 'class', 'marks' )
		.attr( 'clip-path', 'url(#' + this._clipPathID + ')' );

	return this;
}; // end METHOD createMarks()

/**
* METHOD: createVertices()
*	Creates graph vertices.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createVertices = function() {
	// Remove any existing vertices...
	if ( this.$.vertices ) {
		this.$.vertices.remove();
	}
	this.$.vGroup = this.$.marks.append( 'svg:g' )
		.attr( 'class', 'vertices' );

	this.$.vertices = this.$.vGroup.selectAll( '.vertex' )
		.data( this.vertices )
		.enter()
		.append( 'svg:circle' )
			.attr( 'property', 'circle vertex' )
			.attr( 'class', 'vertex' )
			.attr( 'data-label', this.vLabel )
			.attr( 'data-color', ( this.vColor ) ? this.vColor : '' )
			.attr( 'cx', cx )
			.attr( 'cy', cy )
			.attr( 'r', this.radius );

	return this;
}; // end METHOD createVertices()

/**
* METHOD: createEdges()
*	Creates graph edges.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createEdges = function() {
	// Remove any existing edges...
	if ( this.$.edges ) {
		this.$.edges.remove();
	}
	this.$.eGroup = this.$.marks.append( 'svg:g' )
		.attr( 'class', 'edges' );

	this.$.edges = this.$.eGroup.selectAll( '.edge' )
		.data( this.edges )
		.enter()
		.append( 'svg:line' )
			.attr( 'property', 'line edge' )
			.attr( 'class', 'edge' )
			.attr( 'data-label', this.eLabel )
			.attr( 'data-color', ( this.eColor ) ? this.eColor : '' )
			.attr( 'x1', x1 )
			.attr( 'y1', y1 )
			.attr( 'x2', x2 )
			.attr( 'y2', y2 );

	return this;
}; // end METHOD createEdges()

/**
* METHOD: createTitle()
*	Creates the chart title.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.createTitle = function() {
	if ( this.$.title ) {
		this.$.title.remove();
	}
	this.$.title = this.$.meta.append( 'svg:text' )
		.attr( 'property', 'chart.title' )
		.attr( 'class', 'title noselect' )
		.attr( 'x', 0 )
		.attr( 'y', 0 )
		.text( this.chartTitle );

	return this;
}; // end METHOD createTitle()

/**
* METHOD: clear()
*	Clears the chart.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.clear = function() {
	// TODO: should meta data (e.g., title) be cleared as well?

	// Remove the graph:
	this.vertices.length = 0;
	this.edges.length = 0;

	// TODO: need call update method

	return this;
}; // end METHOD clear()

// FIXME: remove once have more general solution
Chart.prototype.reset = function() {
	var force = this._force;

	force
		.nodes( this.vertices )
		.links( this.edges )
		.start();

	for ( var i = 0; i < this.vertices.length*10; i++ ) {
		force.tick();
	}
	force.stop();

	this.resetMarks();
	return this;
};

/**
* METHOD: resetLayout()
*	Resets the graph layout.
*
* @returns {DOMElement} element instance
*/
Chart.prototype.resetLayout = function() {
	this._force
		.nodes( this.vertices )
		.links( this.edges )
		.resume()
		.stop();

	return this;
}; // end METHOD resetLayout()

/**
* METHOD: resetMarks()
*	Resets graph marks (vertices and edges).
*
* @returns {DOMElement} element instance
*/
Chart.prototype.resetMarks = function() {
	var vertices,
		edges;

	// Bind the data and update existing vertices:
	vertices = this.$.vGroup.selectAll( '.vertex' )
		.data( this.vertices )
		.attr( 'data-label', this.vLabel )
		.attr( 'data-color', ( this.vColor ) ? this.vColor : '' )
		.attr( 'cx', cx )
		.attr( 'cy', cy )
		.attr( 'r', this.radius );

	// Remove any old vertices:
	vertices.exit().remove();

	// Add any new vertices:
	vertices.enter().append( 'svg:circle' )
		.attr( 'property', 'circle vertex' )
		.attr( 'class', 'vertex' )
		.attr( 'data-label', this.vLabel )
		.attr( 'data-color', ( this.vColor ) ? this.vColor : '' )
		.attr( 'cx', cx )
		.attr( 'cy', cy )
		.attr( 'r', this.radius );

	// Cache a reference to the vertices:
	this.$.vertices = vertices;

	// Bind the data and update existing edges:
	edges = this.$.eGroup.selectAll( '.edge' )
		.data( this.edges )
		.attr( 'data-label', this.eLabel )
		.attr( 'data-color', ( this.eColor ) ? this.eColor : '' )
		.attr( 'x1', x1 )
		.attr( 'y1', y1 )
		.attr( 'x2', x2 )
		.attr( 'y2', y2 );

	// Remove any old edges:
	edges.exit().remove();

	// Add any new edges:
	edges.enter().append( 'svg:line' )
		.attr( 'property', 'line edge' )
		.attr( 'class', 'edge' )
		.attr( 'data-label', this.eLabel )
		.attr( 'data-color', ( this.eColor ) ? this.eColor : '' )
		.attr( 'x1', x1 )
		.attr( 'y1', y1 )
		.attr( 'x2', x2 )
		.attr( 'y2', y2 );

	// Cache a reference to the edges:
	this.$.edges = edges;

	return this;
}; // end METHOD resetMarks()

/**
* METHOD: graphWidth()
*	Returns the graph width.
*
* @returns {Number} graph width
*/
Chart.prototype.graphWidth = function() {
	return this.width - this.paddingLeft - this.paddingRight;
}; // end METHOD graphWidth()

/**
* METHOD: graphHeight()
*	Returns the graph height.
*
* @returns {Number} graph height
*/
Chart.prototype.graphHeight = function() {
	return this.height - this.paddingTop - this.paddingBottom;
}; // end METHOD graphHeight()

/**
* METHOD: verticesChanged( val[, newVal] )
*	Event handler invoked when the `vertices` attribute changes.
*
* @param {Array} val - change event value
* @param {Array} [newVal] - new value
*/
Chart.prototype.verticesChanged = function( val, newVal ) {
	var vertices = this.vertices,
		len,
		err;

	// Determine if we have a new vertices array...
	if ( arguments.length > 1 && !Array.isArray( newVal ) ) {
		err = new TypeError( 'vertices::invalid assignment. Must provide an array. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.vertices = val;
		return;
	}
	len = vertices.length;

	// Update the force layout:
	this._force.nodes( vertices );

	// Do we even have any vertices?
	if ( !len ) {
		if ( this.$.vertices ) {
			this.$.vertices.remove();
		}
		return;
	}
	this.fire( 'vertices', {
		'type': 'changed'
	});
	if ( newVal === void 0 ) {
		this.fire( 'changed', {
			'attr': 'vertices',
			'data': val[ 0 ]
		});
	} else {
		this.fire( 'changed', {
			'attr': 'vertices',
			'prev': val,
			'curr': newVal
		});
	}
}; // end METHOD verticesChanged()

/**
* METHOD: edgesChanged( val[, newVal] )
*	Event handler invoked when the `edges` attribute changes.
*
* @param {Array} val - change event value
* @param {Array} [newVal] - new value
*/
Chart.prototype.edgesChanged = function( val, newVal ) {
	var edges = this.edges,
		len,
		err;

	// Determine if we have a new edges array...
	if ( arguments.length > 1 && !Array.isArray( newVal ) ) {
		err = new TypeError( 'edges::invalid assignment. Must provide an array. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.edges = val;
		return;
	}
	len = edges.length;

	// Update the force layout:
	this._force.links( edges );

	// Do we even have any edges?
	if ( !len ) {
		if ( this.$.edges ) {
			this.$.edges.remove();
		}
		return;
	}
	this.fire( 'edges', {
		'type': 'changed'
	});
	if ( newVal === void 0 ) {
		this.fire( 'changed', {
			'attr': 'edges',
			'data': val[ 0 ]
		});
	} else {
		this.fire( 'changed', {
			'attr': 'edges',
			'prev': val,
			'curr': newVal
		});
	}
}; // end METHOD edgesChanged()

/**
* METHOD: configChanged( oldConfig, newConfig )
*	Event handler invoked when the `config` attribute changes.
*
* @param {Object} oldConfig - old config
* @param {Object} newConfig - new config
*/
Chart.prototype.configChanged = function( oldConfig, newConfig ) {
	var bool,
		err;

	if ( typeof newConfig !== 'object' || newConfig === null || Array.isArray( newConfig) ) {
		err = new TypeError( 'config::invalid assignment. Must be an `object`. Value: `' + newConfig + '`.' );
		this.fire( 'err', err );
		this.config = oldConfig;
		return;
	}
	// TODO: schema validator

	// Turn off auto-update:
	bool = this.autoUpdate;
	this.autoUpdate = false;

	// this.width = newConfig.canvas.width;
	// this.height = newConfig.canvas.height;

	// FIXME: title should not be part of annotations, but meta. The config should be standardized. Put in repo. Version it. Create an associated validator. NPM.
	// this.chartTitle = newConfig.annotations.title;

	this.fire( 'changed', {
		'attr': 'config',
		'prev': oldConfig,
		'curr': newConfig
	});

	// Reset the auto update flag to its original value:
	this.autoUpdate = bool;

	// Only if auto update is enabled, redraw the chart...
	if ( bool ) {
		this.create();
	}
}; // end METHOD configChanged()

/**
* METHOD: widthChanged( oldVal, newVal )
*	Event handler invoked when the `width` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.widthChanged = function( oldVal, newVal ) {
	var width,
		size,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal <= 0 ) {
		err = new TypeError( 'width::invalid assignment. Must be a number greater than 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.width = oldVal;
		return;
	}
	width = newVal - this.paddingLeft - this.paddingRight;

	size = this._force.size();
	this._force.size( [width, size[1]] );

	if ( this.$.canvas && this.autoUpdate ) {
		// [0] Update the SVG canvas:
		this.$.canvas.attr( 'width', newVal );

		// [1] Update the background:
		this.$.bkgd.attr( 'width', width );

		// [2] Update the clipPath:
		this.$.clipPath.attr( 'width', width );
	}
	this.fire( 'width', {
		'type': 'changed'
	});
	this.fire( 'changed', {
		'attr': 'width',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD widthChanged()

/**
* METHOD: heightChanged( oldVal, newVal )
*	Event handler invoked when the `height` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.heightChanged = function( oldVal, newVal ) {
	var height,
		size,
		err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal <= 0 ) {
		err = new TypeError( 'height::invalid assignment. Must be a number greater than 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.height = oldVal;
		return;
	}
	height = newVal - this.paddingTop - this.paddingBottom;

	size = this._force.size();
	this._force.size( [size[0], height] );

	if ( this.$.canvas && this.autoUpdate ) {
		// [0] Update the SVG canvas:
		this.$.canvas.attr( 'height', newVal );

		// [1] Update the background:
		this.$.bkgd.attr( 'height', height );

		// [2] Update the clipPath:
		this.$.clipPath.attr( 'height', height );
	}
	this.fire( 'height', {
		'type': 'changed'
	});
	this.fire( 'changed', {
		'attr': 'height',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD heightChanged()

/**
* METHOD: chartTitleChanged( oldVal, newVal )
*	Event handler invoked when the `chartTitle` attribute changes.
*
* @param {String} oldVal - old value
* @param {String} newVal - new value
*/
Chart.prototype.chartTitleChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'string' ) {
		err = new TypeError( 'charTitle::invalid assignment. Must be a string. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.chartTitle = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		this.$.title.text( newVal );
	}
	this.fire( 'changed', {
		'attr': 'chartTitle',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD chartTitleChanged()

/**
* METHOD: paddingLeftChanged( oldVal, newVal )
*	Event handler invoked when the `paddingLeft` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.paddingLeftChanged = function( oldVal, newVal ) {
	var width,
		size,
		err;

	if ( typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0 ) {
		err = new TypeError( 'paddingLeft::invalid assignment. Must be an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingLeft = oldVal;
		return;
	}
	width = this.width - newVal - this.paddingRight;

	size = this._force.size();
	this._force.size( [width, size[1]] );

	if ( this.autoUpdate ) {
		// [0] Update the background:
		this.$.bkgd.attr( 'width', width );

		// [1] Update the clipPath:
		this.$.clipPath.attr( 'width', width );

		// [2] Update the graph:
		this.$.graph.attr( 'transform', 'translate(' + newVal + ',' + this.paddingTop + ')' );
	}
	this.fire( 'changed', {
		'attr': 'paddingLeft',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingLeftChanged()

/**
* METHOD: paddingRightChanged( oldVal, newVal )
*	Event handler invoked when the `padding` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.paddingRightChanged = function( oldVal, newVal ) {
	var width,
		size,
		err;

	if ( typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0 ) {
		err = new TypeError( 'paddingRight::invalid assignment. Must be an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingRight = oldVal;
		return;
	}
	width = this.width - this.paddingLeft - newVal;

	size = this._force.size();
	this._force.size( [width, size[1]] );

	if ( this.autoUpdate ) {
		// [0] Update the background:
		this.$.bkgd.attr( 'width', width );

		// [1] Update the clipPath:
		this.$.clipPath.attr( 'width', width );
	}
	this.fire( 'changed', {
		'attr': 'paddingRight',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingRightChanged()

/**
* METHOD: paddingBottomChanged( oldVal, newVal )
*	Event handler invoked when the `paddingBottom` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.paddingBottomChanged = function( oldVal, newVal ) {
	var height,
		size,
		err;

	if ( typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0 ) {
		err = new TypeError( 'paddingBottom::invalid assignment. Must be an integer greater than or equal to 0. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.paddingBottom = oldVal;
		return;
	}
	height = this.height - this.paddingTop - newVal;

	size = this._force.size();
	this._force.size( [size[0], height] );

	if ( this.autoUpdate ) {
		// [0] Update the background:
		this.$.bkgd.attr( 'height', height );

		// [1] Update the clipPath:
		this.$.clipPath.attr( 'height', height );
	}
	this.fire( 'changed', {
		'attr': 'paddingBottom',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingBottomChanged()

/**
* METHOD: paddingTopChanged( oldVal, newVal )
*	Event handler invoked when the `paddingTop` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.paddingTopChanged = function( oldVal, newVal ) {
	var height,
		size,
		err;

	if ( typeof newVal !== 'number' || newVal !== newVal || newVal%1 !== 0 || newVal < 0 ) {
		err = new TypeError( 'paddingTop::invalid assignment. Must be an integer greater than or equal to 0.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.paddingTop = oldVal;
		return;
	}
	height = this.height - newVal - this.paddingBottom;

	size = this._force.size();
	this._force.size( [size[0], height] );

	if ( this.autoUpdate ) {
		// [0] Update the background:
		this.$.bkgd.attr( 'height', height );

		// [1] Update the clipPath:
		this.$.clipPath.attr( 'height', height );

		// [2] Update the graph:
		this.$.graph.attr( 'transform', 'translate(' + this.paddingLeft + ',' + newVal + ')' );
	}
	this.fire( 'changed', {
		'attr': 'paddingTop',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD paddingTopChanged()

/**
* METHOD: radiusChanged( oldVal, newVal )
*	Event handler invoked when the `radius` attribute changes.
*
* @param {Number|Function} oldVal - old value
* @param {Number|Function} newVal - new value
*/
Chart.prototype.radiusChanged = function( oldVal, newVal ) {
	var type = typeof newVal,
		err;
	if ( type !== 'function' && (type !== 'number' || newVal !== newVal || newVal < 0) ) {
		err = new TypeError( 'radius::invalid assignment. Must be a number greater than or equal to 0 or an accessor function. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.radius = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		this.$.vertices.attr( 'r', newVal );
	}
	this.fire( 'changed', {
		'attr': 'radius',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD radiusChanged()

/**
* METHOD: vColorChanged( oldVal, newVal )
*	Event handler invoked when the `vColor` attribute changes.
*
* @param {Null|Function} oldVal - old value
* @param {Null|Function} newVal - new value
*/
Chart.prototype.vColorChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'function' && newVal !== null ) {
		err = new TypeError( 'vColor::invalid assignment. Must be a function or null. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.vColor = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		// TODO: work through logic here. Need to remove old class, if present. Need to apply new class, if present.
	}
	this.fire( 'changed', {
		'attr': 'vColor',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD vColorChanged()

/**
* METHOD: vLabelChanged( oldVal, newVal )
*	Event handler invoked when the `vLabel` attribute changes.
*
* @param {Function} oldVal - old value
* @param {Function} newVal - new value
*/
Chart.prototype.vLabelChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'function' ) {
		err = new TypeError( 'vLabel::invalid assignment. Must be a function. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.vLabel = oldVal;
		return;
	}
	// TODO: if label is just text, need to update. If label is displayed as result of some UI, then that interaction should just call the function, so nothing needed to update.

	this.fire( 'changed', {
		'attr': 'vLabel',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD vLabelChanged()

/**
* METHOD: eColorChanged( oldVal, newVal )
*	Event handler invoked when the `eColor` attribute changes.
*
* @param {Null|Function} oldVal - old value
* @param {Null|Function} newVal - new value
*/
Chart.prototype.eColorChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'function' && newVal !== null ) {
		err = new TypeError( 'eColor::invalid assignment. Must be a function or null. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.eColor = oldVal;
		return;
	}
	if ( this.autoUpdate ) {
		// TODO: work through logic here. Need to remove old class, if present. Need to apply new class, if present.
	}
	this.fire( 'changed', {
		'attr': 'eColor',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD eColorChanged()

/**
* METHOD: eLabelChanged( oldVal, newVal )
*	Event handler invoked when the `eLabel` attribute changes.
*
* @param {Function} oldVal - old value
* @param {Function} newVal - new value
*/
Chart.prototype.eLabelChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'function' ) {
		err = new TypeError( 'eLabel::invalid assignment. Must be a function. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.eLabel = oldVal;
		return;
	}
	// TODO: if label is just text, need to update. If label is displayed as result of some UI, then that interaction should just call the function, so nothing needed to update.

	this.fire( 'changed', {
		'attr': 'eLabel',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD eLabelChanged()

/**
* METHOD: eLengthChanged( oldVal, newVal )
*	Event handler invoked when the `eLength` attribute changes.
*
* @param {Number|Function} oldVal - old value
* @param {Number|Function} newVal - new value
*/
Chart.prototype.eLengthChanged = function( oldVal, newVal ) {
	var type = typeof newVal,
		err;
	if ( type !== 'function' && (type !== 'number' || newVal !== newVal || newVal <= 0) ) {
		err = new TypeError( 'eLength::invalid assignment. Must be a number greater than 0 or an accessor function. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.eLength = oldVal;
		return;
	}
	this._force.linkDistance( newVal );

	this.fire( 'changed', {
		'attr': 'eLength',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD eLengthChanged()

/**
* METHOD: eStrengthChanged( oldVal, newVal )
*	Event handler invoked when the `eStrength` attribute changes.
*
* @param {Number|Function} oldVal - old value
* @param {Number|Function} newVal - new value
*/
Chart.prototype.eStrengthChanged = function( oldVal, newVal ) {
	var type = typeof newVal,
		err;
	if ( type !== 'function' && (type !== 'number' || newVal !== newVal || newVal < 0 || newVal > 1) ) {
		err = new TypeError( 'eStrength::invalid assignment. Must be a number between 0 and 1 or an accessor function. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.eStrength = oldVal;
		return;
	}
	this._force.linkStrength( newVal );

	this.fire( 'changed', {
		'attr': 'eStrength',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD eStrengthChanged()

/**
* METHOD: frictionChanged( oldVal, newVal )
*	Event handler invoked when the `friction` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.frictionChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'number' || newVal !== newVal || newVal < 0 || newVal > 1 ) {
		err = new TypeError( 'friction::invalid assignment. Must be a number between 0 and 1. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.friction = oldVal;
		return;
	}
	this._force.friction( newVal );

	this.fire( 'changed', {
		'attr': 'friction',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD frictionChanged()

/**
* METHOD: chargeChanged( oldVal, newVal )
*	Event handler invoked when the `charge` attribute changes.
*
* @param {Number|Function} oldVal - old value
* @param {Number|Function} newVal - new value
*/
Chart.prototype.chargeChanged = function( oldVal, newVal ) {
	var type = typeof newVal,
		err;
	if ( type !== 'function' && (type !== 'number' || newVal !== newVal) ) {
		err = new TypeError( 'charge::invalid assignment. Must be a number or an accessor function. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.charge = oldVal;
		return;
	}
	this._force.charge( newVal );

	if ( this.autoUpdate ) {
		this.reset();
	}
	this.fire( 'changed', {
		'attr': 'charge',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD chargeChanged()

/**
* METHOD: chargeDistanceChanged( oldVal, newVal )
*	Event handler invoked when the `chargeDistance` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.chargeDistanceChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'number' || newVal !== newVal ) {
		err = new TypeError( 'chargeDistance::invalid assignment. Must be a number. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.chargeDistance = oldVal;
		return;
	}
	this._force.chargeDistance( newVal );

	this.fire( 'changed', {
		'attr': 'chargeDistance',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD chargeDistanceChanged()

/**
* METHOD: thetaChanged( oldVal, newVal )
*	Event handler invoked when the `theta` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.thetaChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'number' || newVal !== newVal ) {
		err = new TypeError( 'theta::invalid assignment. Must be a number. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.theta = oldVal;
		return;
	}
	this._force.theta( newVal );

	this.fire( 'changed', {
		'attr': 'theta',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD thetaChanged()

/**
* METHOD: gravityChanged( oldVal, newVal )
*	Event handler invoked when the `gravity` attribute changes.
*
* @param {Number} oldVal - old value
* @param {Number} newVal - new value
*/
Chart.prototype.gravityChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'number' || newVal !== newVal ) {
		err = new TypeError( 'gravity::invalid assignment. Must be a number. Value: `' + newVal + '`.' );
		this.fire( 'err', err );
		this.gravity = oldVal;
		return;
	}
	this._force.gravity( newVal );

	this.fire( 'changed', {
		'attr': 'gravity',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD gravityChanged()

/**
* METHOD: autoUpdateChanged( oldVal, newVal )
*	Event handler invoked when the `autoUpdate` attribute changes.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
Chart.prototype.autoUpdateChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'autoUpdate::invalid assignment. Must be a boolean.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.autoUpdate = oldVal;
		return;
	}
	this.fire( 'changed', {
		'attr': 'autoUpdate',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD autoUpdateChanged()

/**
* METHOD: autoResizeChanged( oldVal, newVal )
*	Event handler invoked when the `autoResize` attribute changes.
*
* @param {Boolean} oldVal - old value
* @param {Boolean} newVal - new value
*/
Chart.prototype.autoResizeChanged = function( oldVal, newVal ) {
	var err;
	if ( typeof newVal !== 'boolean' ) {
		err = new TypeError( 'autoResize::invalid assignment. Must be a boolean.  Value: `' + newVal + '.' );
		this.fire( 'err', err );
		this.autoResize = oldVal;
		return;
	}
	if ( newVal ) {
		window.addEventListener( 'resize', this._onResize, false );
	} else {
		window.removeEventListener( 'resize', this._onResize );
	}
	this.fire( 'changed', {
		'attr': 'autoResize',
		'prev': oldVal,
		'curr': newVal
	});
}; // end METHOD autoResizeChanged()

/**
* METHOD: onResize()
*	Resize listener.
*/
Chart.prototype.onResize = function() {
	this.fire( 'resized', {
		'el': 'polymer-graph-force-directed',
		'msg': 'Received a resize event.'
	});
	if ( !this.$.canvas ) {
		return;
	}
	this.width = this.clientWidth;
}; // end METHOD onResize()

/**
* METHOD: stream( [options])
*	Returns a writable stream.
*
* @param {Object} [options] - Writable stream options
* @returns {Stream} Stream instance
*/
Chart.prototype.stream = function( options ) {
	var opts = {},
		clbk,
		err;
	if ( arguments.length ) {
		if ( typeof options !== 'object' || options === null || Array.isArray( options ) ) {
			err = new TypeError( 'stream()::invalid input argument. Options must be an object.' );
			this.fire( 'err', err );
			return;
		}
		opts = options;
	}
	clbk = onData.bind( this );
	this._stream = new Stream( clbk, opts );
	return this._stream;

	function onData( error, arr ) {
		/* jshint validthis: true */
		if ( error ) {
			this.fire( 'err', error );
			return;
		}
		// TODO: call update function
		// TODO: change event name to something other than 'data'; 'data' is already used.
		this.fire( 'data', arr );
	}
}; // end METHOD stream()


// EXPORTS //

module.exports = Chart;
