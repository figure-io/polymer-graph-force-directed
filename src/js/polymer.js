/**
*
*	COMPONENT: polymer-force-layout
*
*
*	DESCRIPTION:
*		- Registers the polymer-force-layout web-component.
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

/* global Polymer */
'use strict';

// MODULES //

var Chart = require( './chart.js' );


// POLYMER //

Polymer( 'polymer-force-layout', Chart.prototype );
