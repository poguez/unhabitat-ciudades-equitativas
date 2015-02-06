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

// Map legend
svg.append("circle").attr("cx",40).attr("cy",300).attr("r", 4).attr("class","c1");
svg.append("text").attr("x",55).attr("y",304).attr("class","legend").text("0.000 - 0.459");
svg.append("circle").attr("cx",40).attr("cy",315).attr("r", 4).attr("class","c2");
svg.append("text").attr("x",55).attr("y",319).attr("class","legend").text("0.450 - 0.474");
svg.append("circle").attr("cx",40).attr("cy",330).attr("r", 4).attr("class","c3");
svg.append("text").attr("x",55).attr("y",334).attr("class","legend").text("0.475 - 0.494");
svg.append("circle").attr("cx",40).attr("cy",345).attr("r", 4).attr("class","c4");
svg.append("text").attr("x",55).attr("y",349).attr("class","legend").text("0.495 - 0.529");
svg.append("circle").attr("cx",40).attr("cy",360).attr("r", 4).attr("class","c5");
svg.append("text").attr("x",55).attr("y",364).attr("class","legend").text("0.530 - 1.000");

svg.append("rect")
    .attr("class", "background")
	.attr("width", width)
	.attr("height", height)
	.on("click", reset);

var g = svg.append("g")
	.style("stroke-width", ".5px");

var compareFlag = false;
var cityView = false;
var current = 0;
var activeCountry;
var currentEntityA;
var currentEntityB;
var countries;
var cities;
var capitals;

//var dropDown = d3.selectAll(".map").append("select").attr("name", "country-list");

d3.json("../data/la.json", function(error, la) {
	countries = topojson.feature(la, la.objects.countries);
	cities = topojson.feature(la, la.objects.cities);
	var cityRadius = 1;

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

	// Label positions in the map.
	var positions = {
		"GUA": "left", "CHI": "left", "ECU": "left", "COR": "left", "PER": "left",
		"NIC": "right",	"URU": "right",
		"DOM": "up",
		"PAN": "down",
	};

	g.selectAll(".country-label")
		.data(countries.features)
		.enter().append("text")
		.attr("class", function(d) { return "country-label " + d.id; })
		.attr("transform", function(d) {
				return "translate(" + path.centroid(d) + ")"; 
			}
		)
		.attr("dy", ".35em")
		.text(function(d) { return d.properties.name; });
	
	g.selectAll(".city")
  		.data(topojson.feature(la, la.objects.cities).features)
		.enter().append("path")
		.attr("class", "feature")
		.attr('d', path.pointRadius(0))
		.attr("d", path)
		.attr("visibility", "hidden")
		.on("mouseover", function() {
			d3.select(this).attr("class", "city-hover");
		})
		.on("mouseout", function() {	
        	d3.select(this).attr("class", "city");
		})
		.on("click", function() {
			console.log("popo");
		});

	g.append("path")
		.datum(cities)
		.attr("d", path)
		.attr("class", "city")
		.attr("visibility", "hidden");
});

function showCities() {
	d3.selectAll(".city").attr("visibility","visible");
	d3.selectAll(".city-label").attr("visibility","visible");


	/*
	d3.selectAll(".city")
		.on("mouseover", function() {
			d3.select(this).attr("class", ".city-hover");
		})
		.on("mouseout", function() {
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
	*/
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

function showRightPanel() {
	document.getElementById('panel-right').style.visibility="visible";
}

function closeLeftPanel() {
	closeRightPanel();
	document.getElementById('panel-left').style.display = "none";
	document.getElementById('intro').style.display = "";
}

function closeRightPanel() {
	document.getElementById('panel-right').style.display="none";
	currentEntityB = "";
}

function addPanel(side, title) {
	if(side == "left") {
		d3.select("#chart1a").selectAll("*").remove();
		document.getElementById("entity-a").innerHTML = title;
		showLeftPanel();
	} else if (side == "right") {
		d3.select("#chart1b").selectAll("*").remove();
		document.getElementById("entity-b").innerHTML = title;
		showRightPanel();
	}
	loadGraph("gini","right");
}

function loadGraph(chart, side, entity, decil) {
	var data;
	switch(chart) {
		case 'gini':
			data = "../data/indicegini.csv";
			graphgini(side,data,entity,entity);
			break;
		case 'ingreso':
			data = "../data/contribucionesporcentualessalarioygini.csv";
			graphingreso(side,data,entity);
			break;
		case 'consumo':
			data = "../data/consumopordecil.csv";
			graphconsumo(side,data,entity,decil);
			break;
		case 'relacion':
			data = "../data/relaciond1d10.csv";
			graphratio(side,data,entity);
			break;
		default:
			break;
	}
}

function onCountryClick(d) {
	document.getElementById('intro').style.display = "none";
	d3.select("#chart1a").selectAll("*").remove();
	document.getElementById('panel-left').style.display = "block";
	document.getElementById('chart1a').style.display = "visible";
	activeCountry = d.id;
	currentEntityA = d.properties.name;
	//hideCountryLabels();
	showCities();

	for(i = 0; i < countries.features.length; i++) {
		d3.select("#country-selector").append("option").text(countries.features[i].properties.name);
	}

	for(i = 0; i < cities.features.length; i ++) {
		d3.select("#city-selector")
			.append("option")
			.text(cities.features[i].properties.name+ " ("+cities.features[i].properties.country+")");
		if(cities.features[i].properties.country == activeCountry) {
			//console.log(cities.features[i].properties.name);
			d3.select("#local-city-selector").append("option").text(cities.features[i].properties.name);
		}
	}
	next();

	//graphgini("left","../data/indicegini.csv",country,country);	
	//loadGraph("left","gini",currentEntityA,null);
	current = document.getElementById('current').innerHTML;
	
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

function switchCity() {
	entity = document.getElementById("local-city-selector").value;
	d3.select("#chart1a").selectAll("*").remove();
	currentEntityA = entity;
	current = 0;
	next();
	document.getElementById("entity-a").innerHTML = entity;
}

function compareWithCity() {
	entity = document.getElementById("city-selector").value;
	compareWithEntity(entity);
}

function compareWithCountry() {
	entity = document.getElementById("country-selector").value;
	compareWithEntity(entity);
}

function compareWithEntity(entity) {
	currentEntityB = entity;
	addPanel("right", entity);
}

// Function for iterating to the next graph in the panel.
function next() {
	console.log(currentEntityA);
	if(current != 0) {
		current = document.getElementById('current').innerHTML;
	}

	total = document.getElementById('total').innerHTML;

	if(current < total) {
		current++;
		current = parseInt(document.getElementById('current').innerHTML = current);
	} else if(current == total) {
		current = 1;
		current = parseInt(document.getElementById('current').innerHTML = current);
	}

	// Changes the chart that is displayed in the panel.
	switch(current) {
		case 1:
			document.getElementById('chart4a').style.display = "none";
			document.getElementById('chart1a').style.display = "block";
			document.getElementById('chart-title-left').innerHTML = "Distribución per cápita";
			loadGraph("gini","left",currentEntityA,null);
			break;
		case 2:
			document.getElementById('chart1a').style.display = "none";
			document.getElementById('chart2a').style.display = "block";
			document.getElementById('chart-title-left').innerHTML = "Contribuciones porcentuales salario y gini";
			loadGraph("left","ingreso",currentEntityA,null);
			break;
		case 3:
			document.getElementById('chart2a').style.display = "none";
			document.getElementById('chart3a').style.display = "block";
			document.getElementById('chart-title-left').innerHTML = "Consumo por decil";
			loadGraph("left","consumo",currentEntityA,null);
			break;
		case 4:
			document.getElementById('chart3a').style.display = "none";
			document.getElementById('chart4a').style.display = "block";
			document.getElementById('chart-title-left').innerHTML = "Relación D1/D10";
			loadGraph("left","relacion",currentEntityA,null);
			break;
		default:
			break;
	}
}

// Function for iterating to the previous graph in the panel.
function prev() {
	if(current > 1) {
		current--;
		current = parseInt(document.getElementById('current').innerHTML = current);
	} else if(current == 1) {
		current = 4;
		current = parseInt(document.getElementById('current').innerHTML = current);
	}

	// Changes the chart that is displayed in the panel.
	switch(current) {
		case 1:
			document.getElementById('chart2a').style.display = "none";
			document.getElementById('chart1a').style.display = "block";
			document.getElementById('chart-title-left').innerHTML = "Distribución per cápita";
			break;
		case 2:
			document.getElementById('chart3a').style.display = "none";
			document.getElementById('chart2a').style.display = "block";
			document.getElementById('chart-title-left').innerHTML = "Contribuciones porcentuales salario y gini";
			break;
		case 3:
			document.getElementById('chart4a').style.display = "none";
			document.getElementById('chart3a').style.display = "block";
			document.getElementById('chart-title-left').innerHTML = "Consumo por decil";
			break;
		case 4:
			document.getElementById('chart1a').style.display = "none";
			document.getElementById('chart4a').style.display = "block";
			document.getElementById('chart-title-left').innerHTML = "Relación D1/D10";
			break;
		default:
			break;
	}
}

function reset() {
	current = 0;
	currentEntityA = "";
	currentEntityB = "";

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

	//hideCities();
	//showCountryLabels();
}

d3.select(self.frameElement).style("height", height + "px");