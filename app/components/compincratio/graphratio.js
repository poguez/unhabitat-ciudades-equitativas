function graphratio(datasource,ciudad) {
	// Set the dimensions of the canvas / graph
	var	margin = {top: 75, right: 50, bottom: 75, left: 50},
		width = 600 - margin.left - margin.right,
		height = 135 - margin.top - margin.bottom;
	 

	var transbolita 


	// Adds the svg canvas
	var	svg = d3.select("chart4a")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Get the data
	d3.csv(datasource, function(error, data) {
		data.forEach(function(d) {
			d.value = +d.value;
			d.color = d.color;
		};

		csv = csv.filter(function(row) {
	        return row['Ciudad'] == ciudad;}););

	       var csvlen= csv.length;
        for (var i = 0; i < csvlen; i++) {
            anho = parseDate(csv[i]['anho']);
            ratio = +csv[i]['ingreso_total_salarios'];

	var max = d3.max(data, function(d) { return +d.value;} );

	var circles = svg.selectAll("circle")
	                          .data(data)
	                          .enter()
	                          .append("circle");

	var circleAttributes = circles
			               .attr("cx", function(d, i) {
			                   return i*width/6.0;
			               })
			               .attr("cy", height / 2)
	                       .attr("r", function (d) { return d.value; })
	                       .style("fill", function(d) { return d.color; });


	var labels = svg.selectAll("text")
	                          .data(data)
	                          .enter()
	                          .append("text");

	 var circleAttributes = labels
			               .attr("x", function(d, i) { return i*width/6.0-5-i*max/4; })
			               .attr("y", function(d) { return height / 2 + max*2; })
	                       .text(function (d) { return d.value; })
	                       .attr("font-family", "sans-serif")
							.attr("font-size", "20px")
							.attr("fill", "black");                      
 
});
}