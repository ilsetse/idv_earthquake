function loadHistogram(id, d){
	//console.log(d['features'][0]['properties']);
	n = d['features'].length
	
	data = []
	
	
	for (idx=0; idx<n; idx++){
		mag = d['features'][idx]['properties']['mag'];
		data.push(mag);
	}
	
	//var data = d3.range(1000).map(d3.randomBates(10));
	//console.log(data);
	
	var margin = {top: 20, right: 20, bottom: 20, left: 20},
	width = Math.min(350, window.innerWidth - 2) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
	
	d3.select(id).select("svg").remove();
	
	var formatCount = d3.format(",.0f");
	
	var svg = d3.select(id).append("svg")
		.attr("width",  600 + margin.left + margin.right)
		.attr("height", 600 + margin.top + margin.bottom);

	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	
	var x = d3.scaleLinear()
		.domain([0,10])
		.rangeRound([0, width]);

	var bins = d3.histogram()
		.thresholds(x.ticks(20))(data);
	
	var y = d3.scaleLinear()
	.domain([0, d3.max(bins, function(d) { return d.length; })])
	.range([height, 0]);
	
	var bar = g.selectAll(".bar")
	.data(bins)
	.enter().append("g")
	.attr("class", "bar")
	.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
	
	bar.append("rect")
	.attr("x", 1)
	.attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
	.attr("height", function(d) { return height - y(d.length); });
	
	// todo bin count
	/*
	bar.append("text")
	.attr("dy", ".75em")
	.attr("y", 6)
	.attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
	.attr("text-anchor", "middle")
	.text(function(d) { return formatCount(d.length); });
	*/
	g.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));

	 
}


