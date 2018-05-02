function getLineChartData(){
	loadData(globalData, globalCsv, globalFilters);
}

function loadLineChart(date, mag, felt){

	if ($('#actual-felt-on')[0].checked == false) {
		return;
	}

	/*
	var margin = {top: 20, right: 10, bottom: 20, left: 10},
	width = Math.min(350, window.innerWidth - 2) - margin.left - margin.right,
	height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
	*/
	var margin = 65;
	var width = 350;
	var height = 300;
	
	d3.select('#visual').select("svg").remove();
	//d3.select('.bar').remove();
	
	var x = d3.scaleBand()
		.domain(date)
		.rangeRound([0,width])
		.paddingInner(0.2)
		.paddingOuter(0.2);
	
	var y = d3.scaleLinear()
		.nice()
		.domain([-3,10])
		.range([height,0]);
	
	var svg = d3.select("#visual").append("svg")
		.attr("width",width + 2*margin)
		.attr("height",height + 2*margin);
	
	var g = svg.append("g")
		.attr("transform","translate(" + margin + "," + margin + ")")
		.selectAll("rect")
		.data(date)
		.enter().append("rect")
		.attr("x",function(d) { return x(d); })
		.data(mag)
		.attr("width", x.bandwidth())
		.attr("height",function(d) { return height - y(d); })
		.attr("y",function(d) { return y(d); });
	
	// add the y Axis
	svg.append("g")
		.attr("transform", "translate(" + margin + "," + margin + ")")
		.call(d3.axisLeft(y));
	
	// add the x Axis
	svg.append("g")
		.attr("transform", "translate(" + margin + "," + (height+margin) + ")")
		.call(d3.axisBottom(x))
		.selectAll("text")
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", "rotate(-78)");
	
	svg.append("text")
	.attr("x", width-30)
	.attr("y", 30)
	.attr("text-anchor", "middle")
	.style("font-size", "16px")
	.text("Magnitude by Date");
	////////////////////////////////////////
	///////////////// LINE /////////////////
	////////////////////////////////////////
	
	
  // console.log(depths);
	var line = d3.line()
	.y(function(d) { return y(d); });
	//.curve(d3.curveMonotoneX); // apply smoothing to the line

	svg.append("g")
	.enter().append("path")
	.datum(felt)
	.attr("d", line)
	.attr("class", "line"); // Assign a class for styling
	
}
