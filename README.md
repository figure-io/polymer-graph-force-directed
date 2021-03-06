Force-Directed Graph
===
[![NPM version][npm-image]][npm-url] [![Bower version][bower-image]][bower-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> A [Polymer](https://www.polymer-project.org/) web component for displaying force-directed graphs.


## Install

``` bash
$ bower install figure-io/polymer-graph-force-directed
```


## Usage

To use the component,

``` html
<!DOCTYPE html>
<html>
	<head>
		<script src="path/to/webcomponentsjs/webcomponents.min.js"></script>
		<link rel="import" href="path/to/polymer-graph-force-directed.html">
	</head>
	<body>
		<polymer-graph-force-directed id="chart"></polymer-graph-force-directed>
	</body>
</html>
```

and

``` javascript
var el = document.querySelector( '#chart' );
```

The component has the following public attributes and methods...



### Attributes

#### el.vertices

Graph vertices, where each `array` element is an `object`.

``` javascript
el.vertices = [
	{'id': 0, 'name': 'beep'},
	{'id': 1, 'name': 'boop'},
	{'id': 2, 'name': 'foo'},
	...
];
```

Note: when storing associated node data, the following attributes are [reserved](https://github.com/mbostock/d3/wiki/Force-Layout#nodes) for internal use: `index`, `x`, `y`, `px`, `py`, `fixed`, and `weight`.

TODO: define vertex data behavior. How is that data made meaningful? Is it provided on events (hover, click, etc) along with position for the user to deal with, or some other mechanism?


#### el.edges

Graph edges, where each `array` element is an `object` having `source` and `target` attributes. The source and target values should correspond to vertex indices in `el.vertices`.

``` javascript
el.edges = [
	{'source': 0, 'target': 5, 'label': 'foo'},
	{'source': 2, 'target': 14, 'label': 'bar'},
	{'source': 7, 'target': 8, 'label': 'baz'},
	...
];
```

Note: once the graph is initialized, the `source` and `target` values are [__overwritten__](https://github.com/mbostock/d3/wiki/Force-Layout#links) to point to the vertex `array` element, rather than the element index. Any other attributes are unaffected.


#### el.config

Configuration `object` containing parameters corresponding to known attributes, as defined below.

``` javascript
el.config = {};
```

TODO: implement and define. Vega reference. Specification.


#### el.width

Chart canvas width. If not explicitly set, defaults to the width of the parent node.

``` javascript
el.width = 600; // px
```


#### el.height

Chart canvas height. If not explicitly set, defaults to the height of the parent node.

``` javascript
el.height = 600; // px
```


#### el.paddingLeft

Chart canvas left padding; i.e., space between the left canvas edge and the left graph edge. Typically needed to create room for a left oriented y-axis. Default is 40 pixels.

``` javascript
el.paddingLeft = 120; // px
```

#### el.paddingRight

Chart canvas right padding; i.e., space between the right canvas edge and the right graph edge. Typically needed to create room for a right oriented y-axis. Default is 40 pixels.

``` javascript
el.paddingRight = 90; // px
```

#### el.paddingTop

Chart canvas top padding; i.e., space between the top canvas edge and the top graph edge. Typically needed to create room for a chart title or top positioned legend. Default is 40 pixels.

``` javascript
el.paddingTop = 200; // px
```

#### el.paddingBottom

Chart canvas bottom padding; i.e., space between the bottom canvas edge and the bottom graph edge. Typically needed to create room for a bottom oriented x-axis or bottom positioned legend. Default is 40 pixels.

``` javascript
el.paddingBottom = 100; // px
```

#### el.chartTitle

Chart title. Default is an empty `string`.

``` javascript
el.chartTitle = 'Awesome chart.';
```


#### el.radius

Specifies the vertex circle radius. The value may be a `numeric` constant or an accessor `function`. Default is 10 pixels.

``` javascript
// Numeric constant:
el.radius = 20; // px

// Accessor:
el.radius = function radius( d, i ) {
	return d.radius;
};
```


#### el.vColor

Defines the vertex color __data attribute__ accessor. Default is `null`.

``` javascript
el.vColor = function vColor( d, i ) {
	return 'vertex-color-' + i;
};
```


#### el.vLabel

Defines the vertex label accessor. The default accessor assumes an `array` of `objects`, each a `label` property.

``` javascript
// Default:
el.vLabel = function vLabel( d, i ) {
	return d.label;
};

// Custom:
el.vLabel = function vLabel( d, i ) {
	return d[ 3 ];
};
```


#### el.eColor

Defines the edge color __data attribute__ accessor. Default is `null`.

``` javascript
el.eColor = function eColor( d, i ) {
	return d.color;
};
```


#### el.eLabel

Defines the edge label accessor. The default accessor assumes an `array` of `objects`, each a `label` property.

``` javascript
// Default:
el.eLabel = function eLabel( d, i ) {
	return d.label;
};

// Custom:
el.eLabel = function eLabel( d, i ) {
	return d[ 0 ];
};
```


#### el.eLength

Specifies the [edge length](https://github.com/mbostock/d3/wiki/Force-Layout#linkDistance). The value may be a `numeric` constant or an accessor `function`. Default is 20 pixels.

``` javascript
el.eLength = function edgeLength( d, i ) {
	return d.weight;
};
```


#### el.eStrength

Specifies the [edge strength](https://github.com/mbostock/d3/wiki/Force-Layout#linkStrength). The value may be a `numeric` constant between `0` and `1` or an accessor `function`. Default is `1`.

``` javascript
el.eStrength = function edgeStrength( d, i ) {
	return d.strength;
};
```


#### el.friction

Specifies the [velocity decay](https://github.com/mbostock/d3/wiki/Force-Layout#fiction) for each simulation tick. Default is `0.9`.

``` javascript
el.friction = 0.5;
```


#### el.charge

Specifies the vertex [charge](https://github.com/mbostock/d3/wiki/Force-Layout#charge). The value may be a `numeric` constant or an accessor `function`. Default is `-30`.

``` javascript
el.charge = function charge( d, i ) {
	return d.charge;
};
```

#### el.chargeDistance

Specifies the [maximum distance](https://github.com/mbostock/d3/wiki/Force-Layout#chargeDistance) over which charge is applied. A finite distance helps force layout performance. Default is `+infinity`.

``` javascript
el.chargeDistance = 200; // px
```


#### el.theta

Specifies a [factor](https://github.com/mbostock/d3/wiki/Force-Layout#theta) used to consider a group of charges (vertices) a single charge when simulating long-range charge interaction. Default is `0.8`.

``` javascript
el.theta = 1.5;
```

#### el.gravity

Specifies a [geometric constraint](https://github.com/mbostock/d3/wiki/Force-Layout#gravity) to prevent vertices from escaping the graph bounds. To disable, set to `0`. Default is `0.1`.

``` javascript
el.gravity = 0.8;
```


#### el.autoUpdate

Specifies whether the element should auto update whenever an attribute changes. Default is `true`.

``` javascript
el.autoUpdate = false;
```


#### el.autoResize

Specifies whether the element should auto resize when the window resizes. Default is `true`.

``` javascript
el.autoResize = false;
```


### Methods

#### el.clear()

Clears the chart.

``` javascript
el.clear();
```


#### el.stream( [options] )

Returns a writable chart stream.

``` javascript
var stream = el.stream();
```

TODO: define. Options. Behavior.


### Events

The component emits events during both chart configuration and interaction. The following events are emitted... 


#### 'err'

The element emits an `err` event whenever an error occurs; e.g., improper setting of attributes.

``` javascript
el.addEventListener( 'err', function onError( err ) {
	console.log( err );	
});
```

__NOTE__: the event name will change to `error` once issue [#138](https://github.com/webcomponents/webcomponentsjs/issues/138) is resolved. The preferred name is `error`.


#### 'changed'

The element emits a `changed` event whenever an attribute changes.

``` javascript
el.addEventListener( 'changed', function onChange( evt ) {
	console.log( evt.attr, evt.prev, evt.curr, evt.data );	
});
```

#### 'vertices'

The element emits a `vertices` event when the `vertices` attribute changes.

``` javascript
el.addEventListener( 'vertices', function onEvent( evt ) {
	console.log( this.vertices );
});
```

#### 'edges'

The element emits an `edges` event when the `edges` attribute changes.

``` javascript
el.addEventListener( 'edges', function onEvent( evt ) {
	console.log( this.edges );
});
```


#### 'width'

The element emits a `width` event when the `width` attribute changes.

``` javascript
el.addEventListener( 'width', function onEvent( evt ) {
	console.log( this.width );
});
```

#### 'height'

The element emits a `height` event when the `height` attribute changes.

``` javascript
el.addEventListener( 'height', function onEvent( evt ) {
	console.log( this.height );
});
```


#### 'resized'

The element emits a `resized` event when the element's resize listener is triggered.

``` javascript
el.addEventListener( 'resized', function onResize( evt ) {
	console.log( 'Chart received a resize event.' );
});
```

#### 'clicked'

The element emits a `clicked` event when a chart element having a click handler is clicked.

``` javascript
el.addEventListener( 'clicked', function onClick( evt ) {
	console.log( evt );
});
```




## Examples

To run the example code, navigate to the parent directory and start a [simple python server](https://docs.python.org/2/library/simplehttpserver.html),

``` bash
$ cd ..
$ python -m SimpleHTTPServer 9090
```

Once the server is running, open the following URL in your browser

```
http://127.0.0.1:9090/polymer-graph-force-directed/examples
```


## Development

To install development dependencies,

``` bash
$ make install
```

which installs [node modules](https://www.npmjs.org/) and [bower components](http://bower.io/).

> WARNING: bower components are installed in the parent directory, __not__ the component directory.

By installing components in the parent directory, we mimic a production environment, in which bower components are siblings (needed for correct relative paths). Beware, however, that this may result in conflicts with existing components. Or worse, where existing sibling components are being developed (git repositories), completely overwriting siblings.

To avoid such issues, you may want to clone the repository into its own isolated directory. The downside of this approach is increased disk usage due to (possibly) duplicated dependencies.


## Build

The `src` directory contains the component source files. Source files must be [browserified](https://github.com/substack/node-browserify) and then [vulcanized](https://github.com/polymer/vulcanize) before creating a distributable component. To run the build,

``` bash
$ make build
```

which generates a `build` directory containing [browserified](https://github.com/substack/node-browserify) scripts and a [vulcanized](https://github.com/polymer/vulcanize) distributable in the top-level directory.


## Tests

### Unit

Unit tests are run via [web component tester](https://github.com/Polymer/web-component-tester), which in turn uses the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) to instrument code coverage. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/.svg
[npm-url]: https://npmjs.org/package/

[bower-image]: https://img.shields.io/bower/v/polymer-graph-force-directed.svg
[bower-url]: https://github.com/figure-io/polymer-graph-force-directed

[travis-image]: http://img.shields.io/travis/figure-io/polymer-graph-force-directed/master.svg
[travis-url]: https://travis-ci.org/figure-io/polymer-graph-force-directed

[coveralls-image]: https://img.shields.io/coveralls/figure-io/polymer-graph-force-directed/master.svg
[coveralls-url]: https://coveralls.io/r/figure-io/polymer-graph-force-directed?branch=master

[dependencies-image]: http://img.shields.io/david/figure-io/polymer-graph-force-directed.svg
[dependencies-url]: https://david-dm.org/figure-io/polymer-graph-force-directed

[dev-dependencies-image]: http://img.shields.io/david/dev/figure-io/polymer-graph-force-directed.svg
[dev-dependencies-url]: https://david-dm.org/dev/figure-io/polymer-graph-force-directed

[github-issues-image]: http://img.shields.io/github/issues/figure-io/polymer-graph-force-directed.svg
[github-issues-url]: https://github.com/figure-io/polymer-graph-force-directed/issues

