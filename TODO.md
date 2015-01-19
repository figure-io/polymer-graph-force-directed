TODO
====

1. remove the reset function
2. Update favicon
3. Update stream implementation
	- readable state should be object mode
4. general update strategy
5. eWidth (?)
	-	Do we want to allow edge width encoding??? Adjusting vertex radius is one thing, but edge width is not as straightforward a visual encoding (interpretation)
6. 
7. title
8. static mode
9. 
10. should we throttle how often the simulation can be run?
	-	use `delayed()` util
11. 
12. [distortion](http://bost.ocks.org/mike/fisheye/)
13. [curved](http://bl.ocks.org/mbostock/4600693) links
14. self-connections (?)
15. directed connections (?)
	- 	arrows
16. duplicate connections (?)
	-	1->2
	-	2->1
	-	arrows going opposite ways
17. draggable nodes (`drag()`)
18. hover event
	-	hovered.vertex
	-	hovered.edge
19. drag event
20. click event
	-	clicked.vertex
	-	clicked.edge
21. start
22. stop
23. tick
24. resume (?) --> or could this just be subsumed by start?
25. update
	-	wrapper for start, stop, tick, resetMarks (?)
26. 
27. multiple definitions for graph in chart-metadata-terms
	-	update to include graph (node-link) defns.
28. describe how colors work (i.e., how to hook into default color options)
29. legend
	-	entries
	-	color classes (?)
30. 


## Tests

1. `clear()`
2. `vertices()`
3. `edges()`



