function graphratio(data,ciudad) {
	// Set the dimensions of the canvas / graph

	 d3.csv(data, function(error, csv) {

		var year;
		var ratio;
        var ratioData;
        var ratioData2;
        var ratioDataarr = [];
        var valueratio;
        var ratio;

        // Parse the date / time
        var parseDate = d3.time.format("%Y").parse;

		//Empieza Sección Nacional
        
        csv = csv.filter(function(row) {
            return row['Tipo GINI'] == "Urbano";
        });

		csv= csv.filter(function(row) {
        	return row['Ciudad'] == ciudad;
    	});


		//Aqui termina codigo nacional

        var csvlen= csv.length;
        for (var i = 0; i < csvlen; i++) {
            year = parseDate(csv[i]['Ano']);
            ratio = +csv[i]['RazonD1-D10'];
            intratio= parseInt(ratio)
            if(ratio) {
                ratioData = { value: intratio, year:year, color:"Red" }
                ratiofinal = intratio
                }
            }

    ratioData2={ value: 1, year:year, color:"blue" }
    ratioDataarr.push(ratioData2)
    ratioDataarr.push(ratioData)



	var	margin = {top: 25, right: 25, bottom: 25, left: 25},
		width = 250 - margin.left - margin.right,
		height = 250 - margin.top - margin.bottom;
	 

	var transbolita 


	// Adds the svg canvas
	var	svg = d3.select("div.chart4a")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
	var max = d3.max(ratioDataarr, function(d) { return +d.value;} );

	var circles = svg.selectAll("circle")
	                          .data(ratioDataarr)
	                          .enter()
	                          .append("circle");

	var circleAttributes = circles
			               .attr("cx", function(d, i) {
			                   return i*width/3.0;
			               })
			               .attr("cy", height / 24)
	                       .attr("r", function(d) { return d.value; })
	                       .style("fill", function(d) { return d.color; });


	var labels = svg.selectAll("text")
	                          .data(ratioDataarr)
	                          .enter()
	                          .append("text");

	 var circleAttributes = labels
			               .attr("x", function(d, i) { return i*width/3-9; })
			               .attr("y", height/24+50)
	                       .text(function(ratioDataarr) { return ratioDataarr.value; })
	                       .attr("font-family", "sans-serif")
							.attr("font-size", "20px")
							.attr("fill", "black");                      
 
   })}