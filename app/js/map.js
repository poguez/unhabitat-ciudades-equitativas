// Canvas size
var width = 832,
	height = 640,
	active = d3.select(null);

// Map properties
var projection = d3.geo.mercator()
	.scale(320)
	.translate([width / 2, 280])
	.center([-80,-10])
	.precision(.1);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select(".map").append("svg")
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

var compareFlag = false;

function toggleCompareFlag() {
	if(compareFlag == true) compareFlag = false;
	else if (compareFlag == false) compareFlag = true;
}

function compare() {
	console.log(compareFlag);
	toggleCompareFlag();
	console.log(compareFlag);
}

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

	g.selectAll(".country-label")
		.data(countries.features)
		.enter().append("text")
		.attr("class", function(d) { return "country-label " + d.id; })
		.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.text(function(d) { return d.properties.name; });
	
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

//
function clicked_city(d) {
	document.getElementById('entity-a').innerHTML='';
	document.getElementById('title-1a').innerHTML='';
	document.getElementById('chart-1a').innerHTML='';
	document.getElementById('title-2a').innerHTML='';
	document.getElementById('chart-2a').innerHTML='';
	document.getElementById('title-3a').innerHTML='';
	document.getElementById('chart-3a').innerHTML='';
	
	var city_name = d.properties.name;
	document.getElementById('entity-a').innerHTML= city_name;
	document.getElementById('title-1a').innerHTML='Índice de Gini';
	document.getElementById('title-2a').innerHTML='Ingreso per cápita';
	document.getElementById('title-3a').innerHTML='Distribución de ingreso';
	
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

	if(compareFlag == false) {
		if (active.node() === this) {
			document.getElementById('entity-a').innerHTML='';
			//document.getElementById('gini').innerHTML='';
			document.getElementById('panel-left').style.visibility="hidden";
			d3.selectAll(".city-label").attr("visibility","hidden");
			return reset();
		}

		document.getElementById('panel-left').style.visibility="visible";

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
		document.getElementById('entity-a').innerHTML=country;
		//var gini = d.properties.gini;
		//document.getElementById('gini').innerHTML=gini;
	} 

	else if (compareFlag == true) {
		if (active.node() === this) {
			document.getElementById('entity-b').innerHTML='';
			//document.getElementById('gini').innerHTML='';
			document.getElementById('panel-right').style.visibility="hidden";
			d3.selectAll(".city-label").attr("visibility","hidden");
			return reset();
		}
		document.getElementById('panel-right').style.visibility="visible";

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
		document.getElementById('entity-b').innerHTML=country;
		toggleCompareFlag();
		//var gini = d.properties.gini;
		//document.getElementById('gini').innerHTML=gini;
	}
	graphGiniCountry();
}

function reset() {
	if(compareFlag == false) {
		document.getElementById('panel-left').style.visibility="hidden";
		document.getElementById('panel-right').style.visibility="hidden";
	} 
	else if(compareFlag == true) {
		document.getElementById('panel-right').style.visibility="hidden";
	}

	active.classed("active", false);
	active = d3.select(null);
	g.transition()
		.duration(750)
		.style("stroke-width", "1.5px")
		.attr("transform", "");

}

function graphGiniCity(data) {

	var	margin = {top: 5, right: 5, bottom: 5, left: 5},
	width = 220 - margin.left - margin.right,
	height = 140 - margin.top - margin.bottom;
 
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
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.gini); });

	// Adds the svg canvas
	var	svg = d3.select("chart-1a")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Get the data
	data.forEach(function(d) {
		d.year = parseDate(d.year);
		d.gini = +d.gini;
	});
	 
	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.year; }));
	y.domain([0, d3.max(data, function(d) { return d.gini; })]);

	// Add the valueline path.
	svg.append("linechartpath")	
		.attr("class", "linechartline")
		.attr("d", valueline(data));

	xAxis.tickValues(data.map(function(d){return d.year;}));

	// Add the X Axis
	svg.append("g")		
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// Add the Y Axis
	svg.append("g")		
		.attr("class", "y axis")
		.call(yAxis);

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
}

function graphIpcCity(ipcCityData) {

}

function graphGiniCountry() {
	var	margin = {top: 0, right: 0, bottom: 0, left: 0},
	width = 210 - margin.left - margin.right,
	height = 120 - margin.top - margin.bottom;
 
	// Parse the date / time
	var	parseDate = d3.time.format("%y").parse;
	 
	// Set the ranges
	var	x = d3.time.scale().range([0, width]);
	var	y = d3.scale.linear().range([height, 0]);
	 
	// Define the axes
	var	xAxis = d3.svg.axis().scale(x)
		.orient("bottom");
	 
	var	yAxis = d3.svg.axis().scale(y)
		.orient("left").ticks(6)

	// Define the line
	var	valueline = d3.svg.line()
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.close); });

	// Adds the svg canvas
	var	svg = d3.select("#chart-1a")
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Get the data
	d3.csv("/components/lineagini/data.csv", function(error, data) {
		data.forEach(function(d) {
			d.date = parseDate(d.date);
			d.close = +d.close;
		});
	 
		// Scale the range of the data
		x.domain(d3.extent(data, function(d) { return d.date; }));
		y.domain([0, d3.max(data, function(d) { return d.close; })]);

		// Add the valueline path.
		svg.append("gini-path")	
			.attr("class", "gini-line")
			.attr("d", valueline(data));

		xAxis.tickValues(data.map(function(d){return d.date;}));

		// Add the X Axis
		svg.append("g")		
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);



		// Add the Y Axis
		svg.append("g")		
			.attr("class", "y axis")
			.call(yAxis);

		svg.select('gini-line').style({ 'stroke-width': '0px'});

		var dataCirclesGroup = svg.append('svg:g');

		var circles = dataCirclesGroup.selectAll('.data-point')
					.data(data);

				circles
					.enter()
					.append('svg:circle')
					.attr('class', 'dot')
					.attr('fill', function() { return "steelblue"; })
					.attr('cx', function(d) { return x(d["date"]); })
					.attr('cy', function(d) { return y(d["close"]); })
					.attr('r', function() { return 3; })
					.on("mouseover", function(d) {
		  				d3.select(this)
							.attr("r", 8)
							.attr("class", "dot-selected")
							.transition()
		      					.duration(750);
					})
					.on("mouseout", function(d) {
		  				d3.select(this)
							.attr("r", 3)
							.attr("class", "dot")
							.transition()
		      					.duration(750);
					});
	 
	});
}

d3.select(self.frameElement).style("height", height + "px");