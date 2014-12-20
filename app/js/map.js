// Canvas size
var width = 680,
	height = 750,
	active = d3.select(null);

// Map properties
var projection = d3.geo.mercator()
	.scale(375)
	.translate([width / 2, height / 2])
	.center([-75,-10])
	.precision(.1);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

svg.append("rect")
    .attr("class", "background")
	.attr("width", width)
	.attr("height", height)
	.on("click", reset);

var g = svg.append("g")
	.style("stroke-width", ".5px");

var activeCountry;

d3.json("data/la.json", function(error, la) {

	var countries = topojson.feature(la, la.objects.countries);
	var cities = topojson.feature(la, la.objects.cities);
	var cityRadius = 1;

	g.selectAll(".country")
		.data(topojson.feature(la, la.objects.countries).features)
		.enter().append("path")
		/*.attr("class", "feature")*/
		.attr("class", function(d) { return "country " + d.properties.category; })
		.attr("d", path)
		.on("mouseover", function(d) {
			/*var name = d.properties.gini;
			return document.getElementById('gini').innerHTML=name;*/
		})
		.on("click", function(d) {
			activeCountry = d.properties.name;
			console.log(activeCountry);
		})
  		.on("click", clicked_country);

	g.append("path")
		.datum(topojson.mesh(la, la.objects.countries, function(a, b) { return a !== b }))
		.attr("class", "mesh")
		.attr("d", path)
		.attr("class", "country-boundary");

	/*
	g.selectAll(".country-label")
		.data(countries.features)
		.enter().append("text")
		.attr("class", function(d) { return "country-label " + d.id; })
		.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.text(function(d) { return d.properties.name; });
	*/

	g.selectAll(".cities")
  		.data(topojson.feature(la, la.objects.cities).features)
		.enter().append("path")
		.attr("class", "feature")
		.attr('d', path.pointRadius(cityRadius))
		.attr("d", path)
		.attr("class", "hidden")
		.on("mouseover", function(d) {
			alert();
		});

	g.append("path")
		.datum(cities)
		.attr("d", path)
		.attr("class", "city");

	g.selectAll(".city-label")
		.data(cities.features)
		.enter().append("text")
		.attr("class", "city-label")
		.attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
		.attr("x", function(d) {
			length = d.properties.name.length;
			switch(d.properties.pos) {
				case "N":
					return length;
					break;
				case "NE":
					return length+14;
					break;
				case "E":
					return length+16;
					break;
				case "SE":
					return length+14;
					break;
				case "S":
					return length;
					break;
				case "SW":
					return length-12;
					break; 
				case "W":
					return -length;
					break;
				case "NW":
					return length-12;
					break;
				default:
					return d.geometry.coordinates[0] > -75 ? 6 : -6;
					break;
			}
		})
		.attr("dy", function(d) {
			switch(d.properties.pos) {
				case "N":
					return -5;
					break;
				case "NE":
					return -3;
					break;
				case "E":
					return 1+cityRadius/2;
					break;
				case "SE":
					return 6;
					break;
				case "S":
					return 8;
					break;
				case "SW":
					return 6;
					break; 
				case "W":
					return 1;
					break;
				case "NW":
					return -3;
					break;
				default:
					return -5;
					break;
			}
		})
		.attr("visibility", "hidden")
		.style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
		// Cjange to left, middle or right, depending on the label cardinal direction.
		.text(function(d) { return d.properties.name; })
		.on("mouseover", function(d) {
			var nodeSelection = d3.select(this).style("fill", "#9C5308");
			nodeSelection.select("text").style("fill", "#9C5308");
		})
		.on("mouseout", function(d) {
			var nodeSelection = d3.select(this).style("fill", "#444");
			nodeSelection.select("text").style("fill", "#444");
		})
		.on("click", clicked_city);

	var cityLabels = g.selectAll(".city-label");
	
});

function clicked_city(d) {
	document.getElementById('entity').innerHTML='';
	document.getElementById('title1').innerHTML='';
	document.getElementById('viz1').innerHTML='';
	document.getElementById('title2').innerHTML='';
	document.getElementById('viz2').innerHTML='';
	document.getElementById('title3').innerHTML='';
	document.getElementById('viz3').innerHTML='';
	
	var city_name = d.properties.name;
	document.getElementById('entity').innerHTML= city_name;
	document.getElementById('title1').innerHTML='Gini';
	document.getElementById('title2').innerHTML='Ingreso per cápita';
	
	var country_code = d.properties.country;
	country_code = country_code.toLowerCase();
	var giniDataURL = "../data/" + country_code + "/" + country_code + "_gini.csv";
	var ipcDataURL = "../data/" + country_code + "/" + country_code + "_ipc.csv";

	d3.csv(giniDataURL, function(error, csv) {
		var years = d3.keys(csv[0]);
		years.splice(years.indexOf("city"));
		years.sort();

		var year;
		var gini;
		var giniCityData = [];

        csv = csv.filter(function(row) {
        	return row['city'] == city_name;
    	});

    	if(years[0]) {
    		year = years[0];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini, city: city_name };
    			giniCityData.push(giniData);
    		}
    	}
		if(years[1]) {
			year = years[1];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini, city: city_name };
    			giniCityData.push(giniData);
    		}
		}
		if(years[2]) {
			year = years[2];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini, city: city_name };
    			giniCityData.push(giniData);
    		}
		}
		if(years[3]) {
			year = years[3];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini, city: city_name };
    			giniCityData.push(giniData);
    		}
		}
		if(years[4]) {
			year = years[4];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini, city: city_name };
    			giniCityData.push(giniData);
    		}
		}
		if(years[5]) {
			year = years[5];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini, city: city_name };
    			giniCityData.push(giniData);
    		}
		}

    	graphGiniCity(giniCityData);

	});

	d3.csv(ipcDataURL, function(error, csv) {

		var years = d3.keys(csv[0]);
		years.splice(years.indexOf("city"));
		years.sort();

		var year;
		var ipc;
		var ipcCityData = [];

        csv = csv.filter(function(row) {
        	return row['city'] == city_name;
    	});

    	if(years[0]) {
    		year = years[0];
    		ipc = csv[0][year];
    		if(ipc) {
    			ipcData = { year: year, ipc: ipc };
    			ipcCityData.push(ipcData);
    		}
    	}
		if(years[1]) {
			year = years[1];
    		ipc = csv[0][year];
    		if(ipc) {
    			ipcData = { year: year, ipc: ipc };
    			ipcCityData.push(ipcData);
    		}
		}
		if(years[2]) {
			year = years[2];
    		ipc = csv[0][year];
    		if(ipc) {
    			ipcData = { year: year, ipc: ipc };
    			ipcCityData.push(ipcData);
    		}
		}
		if(years[3]) {
			year = years[3];
    		ipc = csv[0][year];
    		if(ipc) {
    			ipcData = { year: year, ipc: ipc };
    			ipcCityData.push(ipcData);
    		}
		}
		if(years[4]) {
			year = years[4];
    		ipc = csv[0][year];
    		if(ipc) {
    			ipcData = { year: year, ipc: ipc };
    			ipcCityData.push(ipcData);
    		}
		}
		if(years[5]) {
			year = years[5];
    		ipc = csv[0][year];
    		if(ipc) {
    			ipcData = { year: year, ipc: ipc };
    			ipcCityData.push(ipcData);
    		}
		}

    	graphIpcCity(ipcCityData);		
	});

}

function clicked_country(d) {
	if (active.node() === this) {
		document.getElementById('entity').innerHTML='';
		document.getElementById('gini').innerHTML='';
		document.getElementById('info').style.visibility="hidden";
		d3.selectAll(".city-label").attr("visibility","hidden");
		return reset();
	}

	document.getElementById('info').style.visibility="visible";

	active.classed("active", false);
	active = d3.select(this).classed("active", true);
	d3.selectAll(".city-label").attr("visibility","visible");


		var bounds = path.bounds(d),
		dx = bounds[1][0] - bounds[0][0],
		dy = bounds[1][1] - bounds[0][1],
		x = (bounds[0][0] + bounds[1][0]) / 2,
		y = (bounds[0][1] + bounds[1][1]) / 2,
		scale = .9 / Math.max(dx / width, dy / height),
		translate = [width / 2 - scale * x, height / 2 - scale * y];

		g.transition()
		.duration(750)
		.style("stroke-width", 1.5 / scale + "px")
		.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
	
	var country = d.properties.name;
	document.getElementById('entity').innerHTML=country;
	//var gini = d.properties.gini;
	//document.getElementById('gini').innerHTML=gini;
}

function reset() {
	active.classed("active", false);
		active = d3.select(null);

		g.transition()
		.duration(750)
		.style("stroke-width", "1.5px")
		.attr("transform", "");
}

function graphGiniCity(data) {

	var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 300 - margin.left - margin.right,
	height = 200 - margin.top - margin.bottom;
 
	// Parse the date / time
	var	parseDate = d3.time.format("%Y").parse;

	// Set the ranges
	var	x = d3.time.scale().range([0, width]);
	var	y = d3.scale.linear().range([height, 0]);
	 
	// Define the axes
	var	xAxis = d3.svg.axis().scale(x)
		.orient("bottom");
	 
	var	yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(6);

	// Define the line
	var	valueline = d3.svg.line()
		.x(function(d) { return x(d["year"]); })
		.y(function(d) { return y(d["gini"]); });

	// Adds the svg canvas
	var	svg = d3.select("#viz1")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Get the data
	data.forEach(function(d) {
		d.year = parseDate(d["year"]);
		d.gini = +d["gini"];
	});
	

	// Scale the range of the data
	x.domain([d3.time.year.offset(d3.min(data, function(d) { return d["year"]; }),-1),d3.time.year.offset(d3.max(data, function(d) { return d["year"]; }),+0)]);
	y.domain([0, 0.60000001]);
	//Se pone ese .0000001 para que muestre el label de ese tick

	xAxis.tickValues(data.map(function(d){return d["year"];}));

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
	    .text("Año");

	// Add the Y Axis
	svg.append("g")		
		.attr("class", "y axis")
		.call(yAxis);

	// Add the valueline path. El path es inevitable, pero no el tipo.
	svg.append("path")	
		.attr("class", "linegini")
		.attr("d", valueline(data));

	svg.select('linechartline').style({ 'stroke-width': '0px'});

	var dataCirclesGroup = svg.append('svg:g');

	var tooltip = d3.select("body")
    	.append("div")
    	.attr("class", "tooltip")
		.style("opacity", 0);

	var circles = dataCirclesGroup.selectAll('.data-point')
				.data(data);

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

	/*
	var giniChart = document.createElement("script");
	giniChart.type = "text/javascript";

	// instantiate d3plus
	var visualization = d3plus.viz()
		.container("#viz1")	// container DIV to hold the visualization
		.data(giniCityData)	// data to use with the visualization
		.type("line")		// visualization type
		.id("city")			// key for which our data is unique on
		.text("gini")		// key to use for display text
		.y("gini")			// key to use for y-axis
		.x("year")			// key to use for x-axis
		.draw();

	giniChart.appendChild(document.createTextNode(giniCityData));
	giniChart.appendChild(document.createTextNode(visualization));

	document.getElementById('data1').appendChild(giniChart);
	*/
}

function graphIpcCity(ipcCityData) {

}

d3.select(self.frameElement).style("height", height + "px");