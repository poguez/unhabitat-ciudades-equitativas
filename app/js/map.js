// Canvas size
var width = 560,
	height = 560,
	active = d3.select(null);

// Map properties
var projection = d3.geo.mercator()
	.scale(300)
	.translate([width / 2, 280])
	.center([-76,-16])
	.precision(0);

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

var compareFlag = false;
var cityView = false;
var current;

var dropDown = d3.selectAll(".map").append("select").attr("name", "country-list");


d3.json("../data/la.json", function(error, la) {
	var countries = topojson.feature(la, la.objects.countries);
	var cities = topojson.feature(la, la.objects.cities);
	var cityRadius = 1;
	var activeCountry;

	g.selectAll(".country")
		.data(topojson.feature(la, la.objects.countries).features)
		.enter().append("path")
		.attr("class", "feature")
		.attr("class", function(d) { return "country " + d.properties.category; })
		.attr("d", path)
		.on("mouseover", function() {
        	d3.select(this).attr("class", "country-hover");
		})
		.on("mouseout", function() {	
        	d3.select(this).attr("class", function(d) { return "country " + d.properties.category; });
		})
  		.on("click", onCountryClick);

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
		.attr("visibility", "hidden")
		.on("mouseover", function(d) {
		})
		.on("click", onCityClick);

	g.append("path")
		.datum(cities)
		.attr("d", path)
		.attr("class", "city")
		.attr("visibility", "hidden")
		.on("click", onCityClick);

	g.selectAll(".city-label")
		.data(cities.features)
		.enter().append("text")
		.attr("class", "city-label")
		.attr("transform", function(d, i) { 
			return "translate(90," + i * 6 + ")"; 
		})
		.attr("x", 100)
		.attr("y", 1)
		.attr("dy", 1)
		.attr("visibility", "hidden")
		.on("click", onCityClick);
	
});

function showCities() {
	d3.selectAll(".city").attr("visibility","visible");
	d3.selectAll(".city-label").attr("visibility","visible");

	d3.selectAll(".city")
		.on("mouseover", function(d) {
			d3.select(this).attr("class", ".city-hover");
		})
		.on("mouseout", function(d) {
			d3.select(this).attr("class", ".city");
		});

	d3.selectAll(".city-label")
		.text(function(d) {
			return d.properties.name; 
		})
		.on("mouseover", function(d) {
			var nodeSelection = d3.select(this).style("fill", "#9C5308");
			nodeSelection.select("text").style("fill", "#9C5308");
		})
		.on("mouseout", function(d) {
			var nodeSelection = d3.select(this).style("fill", "#444");
			nodeSelection.select("text").style("fill", "#444");
		});
}

function hideCities() {
	d3.selectAll(".city").attr("visibility","hidden");
	d3.selectAll(".city-label").attr("visibility","hidden");
}

function showCountryLabels() {
	d3.selectAll(".country-label")
		.style("visibility", "visible");
}

function hideCountryLabels() {
	d3.selectAll(".country-label")
		.style("visibility", "hidden");
}

function showLeftPanel() {
	document.getElementById('panel-left').style.visibility="visible";
}

function hideLeftPanel() {
	document.getElementById('panel-left').style.visibility="hidden";
}

function showRightPanel() {
	document.getElementById('panel-right').style.visibility="visible";
}

function hideRightPanel() {
	document.getElementById('panel-right').style.visibility="hidden";
}

function closeLeftPanel() {
	document.getElementById('panel-left').style.visibility="hidden";
}

function closeRightPanel() {
	document.getElementById('panel-right').style.visibility="hidden";
}

function onCountryClick(d) {
	current = document.getElementById('current').innerHTML;
	//var current_chart = "";
	//current_chart = current_chart.concat("chart",current,"a");
	//console.log(current_chart);
	//document.getElemendById(current_chart).style.display = "none";
	//document.getElementById('chart1a').style.display = "block";
	document.getElementById('current').innerHTML = 1;
	document.getElementById('total').innerHTML = 4;

	small = ["COR", "DOM", "ECU", "GUA", "HON",  "NIC", "PAN", "PAR", "URU"];
	large = ["ARG", "BRA", "CHI", "MEX"];

	// Default zoom scale.
	size = 0.5

	// Zoom scale for small countries.
	for (i = 0; i < small.length; i++) {
        if (small[i] === d.id) {
            size = 0.2
        }
    }

    // Zoom scale for large countries.
    for (i = 0; i < large.length; i++) {
        if (large[i] === d.id) {
            size = 0.85
        }
    }

	d3.select(this)
		.on("mouseover", function() {
        	d3.select(this).attr("class", function(d) { return "country " + d.properties.category; });
	});

	hideCountryLabels();
	showCities();

	if(compareFlag == false) {
		if (active.node() === this) {
			document.getElementById('entity-a').innerHTML='';
			hideLeftPanel();
			return reset();
		}

		showLeftPanel();

		active.classed("active", false);
		active = d3.select(this).classed("active", true);
		
		var bounds = path.bounds(d),
			dx = bounds[1][0] - bounds[0][0],
			dy = bounds[1][1] - bounds[0][1],
			x = (bounds[0][0] + bounds[1][0]) / 2,
			y = (bounds[0][1] + bounds[1][1]) / 2,
			scale = size / Math.max(dx / width, dy / height),
			translate = [width / 2 - scale * x, height / 2 - scale * y];
		g.transition()
			.duration(750)
			.style("stroke-width", 1.5 / scale + "px")
			.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
		var country = d.properties.name;
		document.getElementById('entity-a').innerHTML=country;
	} 

	else if (compareFlag == true) {
		if (active.node() === this) {
			document.getElementById('entity-b').innerHTML='';
			hideRightPanel();
			hideCities();
			return reset();
		}

		showRightPanel();
		active.classed("active", false);
		active = d3.select(this).classed("active", true);
		showCities();
		
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
	}
}

function onCityClick(d) {

	var city_name = d.properties.name;

	if(compareFlag) {
		document.getElementById('entity-b').innerHTML= city_name;
	} else {
		document.getElementById('entity-a').innerHTML= city_name;
		cityComparisonFlag = true;
	}
}

function next() {
	current = document.getElementById('current').innerHTML;
	total = document.getElementById('total').innerHTML;

	if(current < total) {
		current++;
		current = parseInt(document.getElementById('current').innerHTML = current);
	}
	switch(current) {
		case 2:
			document.getElementById('chart1a').style.display = "none";
			document.getElementById('chart2a').style.display = "block";
			break;
		case 3:
			document.getElementById('chart2a').style.display = "none";
			document.getElementById('chart3a').style.display = "block";
			break;
		case 4:
			document.getElementById('chart3a').style.display = "none";
			document.getElementById('chart4a').style.display = "block";
			break;
		default:
			break;
	}
}

function prev() {
	if(current > 1) {
		current--;
		current = parseInt(document.getElementById('current').innerHTML = current);
	}
	switch(current) {
		case 1:
			document.getElementById('chart2a').style.display = "none";
			document.getElementById('chart1a').style.display = "block";
			break;
		case 2:
			document.getElementById('chart3a').style.display = "none";
			document.getElementById('chart2a').style.display = "block";
			break;
		case 3:
			document.getElementById('chart4a').style.display = "none";
			document.getElementById('chart3a').style.display = "block";
			break;
		default:
			break;
	}
}

function reset() {
	hideCities();

	if(compareFlag == false) {
		//hideLeftPanel();
		//hideRightPanel();
		//document.getElementById('entity-a').innerHTML="";
	} 
	else if(compareFlag == true) {
		//hideRightPanel();
	}

	active.classed("active", false);
	active = d3.select(null);

	g.transition()
		.duration(750)
		.style("stroke-width", "1.5px")
		.attr("transform", "");

	g.selectAll(".country")
		.on("mouseover", function() {
        	d3.select(this).attr("class", "country-hover");
	});

	hideCities();
	showCountryLabels();
}

function toggleCompareFlag() {
	if(compareFlag == true) compareFlag = false;
	else if (compareFlag == false) compareFlag = true;
}

function compare() {
	toggleCompareFlag();
}

d3.select(self.frameElement).style("height", height + "px");