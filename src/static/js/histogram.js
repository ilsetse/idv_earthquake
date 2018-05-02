function loadHistogram(mag){
	
	// todo: replace with try/except
	if (isNaN(mag.length) || mag.length == 0) {
		d3.select('.bar').remove();
		return;
	}

	var margin = {top: 20, right: 20, bottom: 20, left: 20},
	width = Math.min(350, window.innerWidth - 2) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
	
	d3.select('#visual').select("svg").remove();
	
	var formatCount = d3.format(",.0f");
	var svg = d3.select('#visual').append("svg")
		.attr("width",  600 + margin.left + margin.right)
		.attr("height", 600 + margin.top + margin.bottom);

	var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var x = d3.scaleLinear()
		.domain([0,10])
		.nice()
		.rangeRound([0, width]);

	var bins = d3.histogram()
		.thresholds(x.ticks(10))(mag);
	
	var y = d3.scaleLinear()
	.domain([0, d3.max(bins, function(d) { return d.length; })])
	.range([height, 0]);
	

	var bar = g.selectAll(".bar")
	.data(bins)
	.enter().append("g")
	.attr("class", "bar")
	.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
	
	const barWidth = x(bins[0].x1) - x(bins[0].x0) - 1;

	//console.log(x(bins[0].x1));
	bar.append("rect")
	.attr("x", 1)
	// changes width to prevent overlap with center of bins
	.attr("width", barWidth >= 0 ? barWidth : 0)
	.attr("height", function(d) { return height - y(d.length); });
	

	bar.append("text")
		.attr("dy", ".75em")
		.attr("y", -10)
		.attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
		.attr("text-anchor", "middle")
		.text(function(d) { return formatCount(d.length); });
	
	svg.append("text")
	.attr("x", width-30)
	.attr("y", 30)
	.attr("text-anchor", "middle")
	.style("font-size", "16px")
	.text("Magnitude Frequency");
	
	
	g.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));
	
	//g.append("g").call(d3.axisLeft(y));

} // endof loadHistogram

