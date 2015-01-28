
function graphgini(data,pais,ciudad) {
    var giniCityData = [];
    var giniNacionalData = [];

    d3.csv(data, function(error, csv) {

		var year;
		var gini;

        // Parse the date / time
        var parseDate = d3.time.format("%Y").parse;

		//Empieza Sección Nacional


		csvnacional = csv.filter(function(row) {
        	return row['ciudad'] == pais;
    	});

    	csv = csv.filter(function(row) {
        	return row['ciudad'] == ciudad;
    	});

        var csvnacionallen= csvnacional.length;
        for (var i = 0; i < csvnacionallen; i++) {
            year = csvnacional[i]['year'];
            gini = csvnacional[i]['gini'];
            if(gini) {
                giniData = { year: parseDate(year), gini: gini, city: pais };
                giniNacionalData.push(giniData);
                }
            }


		//Aqui termina codigo nacional

        var csvlen= csv.length;
        for (var i = 0; i < csvlen; i++) {
            year = csv[i]['year'];
            gini = csv[i]['gini'];
            if(gini) {
                giniData = { year: parseDate(year), gini: gini, city: ciudad };
                giniCityData.push(giniData);
                }
            }

    console.log(giniCityData)
    console.log(giniNacionalData)


    var margin = {top: 10, right: 15, bottom: 80, left: 30};
    var width = 250 - margin.left - margin.right;
    var height = 250 - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
     
    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .orient("bottom");
     
    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(6);

    // Define the line
    var valueline = d3.svg.line()
        .x(function(d) { 
            console.log(d["year"])
            return x(d["year"]); })
        .y(function(d) { return y(d["gini"]); });

    // Adds the svg canvas

    var canvas = d3.select("div.chart1a")

var svg = canvas
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        


    // Scale the range of the data
    x.domain([d3.time.year.offset(d3.min(giniCityData, function(d) { return d["year"]; }),-1),d3.time.year.offset(d3.max(giniCityData, function(d) { return d["year"]; }),+1)]);
    //Deje el offset para el top value para que no sea dificil modificarlo al gusto.
    y.domain([0, 0.60000001]);
    //Se pone ese .0000001 para que muestre el label de ese tick

    xAxis.tickValues(giniNacionalData.map(function(d){return d["year"];}));

    // Add the X Axis
    svg.append("g")     
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Fecha");

    // Add the Y Axis
    svg.append("g")     
        .attr("class", "y axis")
        .call(yAxis);

    // Add the valueline path. El path es inevitable, pero no el tipo.

    if (ciudad != pais) {

    svg.append("path")  
        .attr("class", "linegini")
        .style("stroke","steelblue")
        .style("stroke-width","2")
        .style("fill","none")
        .attr("d", valueline(giniCityData));
    }

    svg.append("path")  
        .attr("class", "linegini_nacional")
        .style("stroke","lightblue")
        .style("stroke-width","2")
        .style("fill","none")
        .attr("d", valueline(giniNacionalData));

    //svg.select('linechartline').style({ 'stroke-width': '0px'});

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var dataCirclesGroup = svg.append('svg:g');
    var circles = dataCirclesGroup.selectAll('.data-point')
                .data(giniCityData);

    circles
        .enter()
        .append('svg:circle')
        
        .attr('class', 'dot')
        .attr('fill', function() { return "steelblue"; })
        .attr('cx', function(d) { return x(d["year"]); })
        .attr('cy', function(d) { return y(d["gini"]); })
        .attr('r', function() { return 3; })
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("r", 8)
                .attr("class", "dot-selected")
                .transition()
                .duration(750);
            d3.select(this)
                .append('svg:title')
                .text(function(d) {
                    return d.gini;
                });
            return tooltip.style("visibility", "visible");  
        })
        .on("mouseout", function(d) {
                d3.select(this)
                .attr("r", 3)
                .attr("class", "dot")
                .transition()
                    .duration(750);
        });

    //pintar bolitas nacionales

    var dataCirclesGroup = svg.append('svg:g');
    var circles = dataCirclesGroup.selectAll('.data-point')
                .data(giniNacionalData);

    circles
        .enter()
        .append('svg:circle')
        .attr('class', 'dot')
        .attr('fill', function() { return "lightblue"; })
        .attr('cx', function(d) { return x(d["year"]); })
        .attr('cy', function(d) { return y(d["gini"]); })
        .attr('r', function() { return 3; })
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("r", 8)
                .attr("class", "dot-selected")
                .transition()
                .duration(750);
            d3.select(this)
                .append('svg:title')
                .text(function(d) {
                    return d.gini;
                });
            return tooltip.style("visibility", "visible");  
        })
        .on("mouseout", function(d) {
                d3.select(this)
                .attr("r", 3)
                .attr("class", "dot")
                .transition()
                    .duration(750);
        });

    // empiezan labels

    if (ciudad != pais) {
    svg.append('text')
        .attr('fill', 'black')
        .attr('x', 0.03*width+24)
        .attr('y', height+height*.3 + 14)
        .text("Local")
        .style("font-family","sans-serif")
        .style("font-size","14px");
    svg.append('rect')
        .attr('fill', "steelblue")
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', 0.03*width)
        .attr('y', height+height*.3);

        svg.append('text')
        .attr('fill', 'black')
        .attr('x', 0.03*width+24+width/2)
        .attr('y', height+height*.3 + 14)
        .text("Nacional")
        .style("font-family","sans-serif")
        .style("font-size","14px");
    svg.append('rect')
        .attr('fill', "lightblue")
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', 0.03*width+width/2)
        .attr('y', height+height*.3);  
    } else {
        svg.append('text')
        .attr('fill', 'black')
        .attr('x', 0.35*width+24)
        .attr('y', height+height*.3 + 14)
        .text("Nacional")
        .style("font-family","sans-serif")
        .style("font-size","14px");
    svg.append('rect')
        .attr('fill', "lightblue")
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', 0.35*width)
        .attr('y', height+height*.3);  

    }
    
    });


 
}