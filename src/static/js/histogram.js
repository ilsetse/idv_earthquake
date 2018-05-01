function loadHistogram(id, d, data_length){
	//console.log(d['features'][0]['properties']);
	
	// todo probably a while loop is better?
	// or some sort of continuous check.
	if (isNaN(data_length)) {
		//console.log('isNan');
		return;
	}
	
	var mag = []
	var felt = []
	for (idx=0; idx<data_length; idx++){
		mag.push(d[idx]['properties']['mag']);
		
		tmp = d[idx]['properties']['felt'];
		if (tmp==null) { tmp = 0 }
		felt.push(tmp);
	}

	//console.log(felt);
	
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
		.thresholds(x.ticks(20))(mag);
	
	var y = d3.scaleLinear()
	.domain([0, d3.max(bins, function(d) { return d.length; })])
	.range([height, 0]);
	

	var bar = g.selectAll(".bar")
	.data(bins)
	.enter().append("g")
	.attr("class", "bar")
	.attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
	
	
	//console.log(x(bins[0].x1));
	bar.append("rect")
	.attr("x", 1)
	.attr("width", x(bins[0].x1) - x(bins[0].x0) - 1) // changes width to prevent overlap with center of bins
	.attr("height", function(d) { return height - y(d.length); });

	bar.append("text")
	.attr("dy", ".75em")
	.attr("y", -10)
	.attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
	.attr("text-anchor", "middle")
	.text(function(d) { return formatCount(d.length); });
	
	
	g.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));

	
	// define the line
	var valueline = d3.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.close); });


	
}


