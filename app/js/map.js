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
			var nodeSelection = d3.select(this).style("fill", "white");
			nodeSelection.select("text").style("fill", "white");
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
	
	d3.csv("../data/mex/mex.csv", function(error, csv) {
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
    			giniData = { year: year, gini: gini };
    			giniCityData.push(giniData);
    		}
    	}
		if(years[1]) {
			year = years[1];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini };
    			giniCityData.push(giniData);
    		}
		}
		if(years[2]) {
			year = years[2];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini };
    			giniCityData.push(giniData);
    		}
		}
		if(years[3]) {
			year = years[3];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini };
    			giniCityData.push(giniData);
    		}
		}
		if(years[4]) {
			year = years[4];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini };
    			giniCityData.push(giniData);
    		}
		}
		if(years[5]) {
			year = years[5];
    		gini = csv[0][year];
    		if(gini) {
    			giniData = { year: year, gini: gini };
    			giniCityData.push(giniData);
    		}
		}

    	graphGiniCity(giniCityData);
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

	activeCountry = "Mexico";
	alert(activeCountry);
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

function graphGiniCity(giniCityData) {
	
	var giniChart = document.createElement("script");
	//giniChart.type = "text/javascript";

	//link.setAttribute("src", "js/chart.js");
	// instantiate d3plus
	var visualization = d3plus.viz()
		.container("#viz1")  // container DIV to hold the visualization
		.data(giniCityData)  // data to use with the visualization
		.type("line")       // visualization type
		.id("gini")         // key for which our data is unique on
		//.text("name")       // key to use for display text
		.y("gini")         // key to use for y-axis
		.x("year")          // key to use for x-axis
		.draw();             // finally, draw the

	giniChart.appendChild(document.createTextNode(giniCityData));
	giniChart.appendChild(document.createTextNode(visualization));

	document.getElementById('data1').appendChild(giniChart);
}

d3.select(self.frameElement).style("height", height + "px");