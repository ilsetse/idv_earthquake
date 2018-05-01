function loadLineChart(){
	
	
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
	width = Math.min(350, window.innerWidth - 2) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
	
	d3.select('#visual').select("svg").remove();
	//d3.select('.bar').remove();
	
	var svg = d3.select('#visual').append("svg")
	.attr("width",  600 + margin.left + margin.right)
	.attr("height", 600 + margin.top + margin.bottom);
	
	var circle = svg.append("circle")
	                         .attr("cx", 30)
	                         .attr("cy", 30)
	                         .attr("r", 20);
	
	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	
	
	
}
