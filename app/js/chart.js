var data = [
	{"name":"Salarios2", "Porcentaje del Ingreso":53.1, "  ": 1},
	{"name":"Ganancias2", "Porcentaje del Ingreso":9.1,"  ": 1},
	{"name":"Capital2", "Porcentaje del Ingreso":0.2,"  ": 1},  
	{"name":"Transferencias2", "Porcentaje del Ingreso":8.9,"  ": 1},
	{"name":"Otros2", "Porcentaje del Ingreso":31.9,"  ": 1},
]
 
var visualization = d3plus.viz()
	.container("#viz1")
	.data(data)
	.type("bar")
	.id("name")
	.x({"stacked": true, "value": "Porcentaje del Ingreso"})
	.y("  ")
	.time("  ")
	.draw()

/* Chart properties */
/*var chart_width = 200,
	chart_height = 150;

var y = d3.scale.linear().range([height, 0]);

var chart = d3.select(".chart")
	.attr("width", chart_width)
	.attr("height", chart_height);

d3.tsv("data.tsv", type, function(error, data) {
 	y.domain([0, d3.max(data, function(d) { return d.value; })]);

 	var barWidth = chart_width / data.length;

 	var bar = chart.selectAll("g")
				.data(data)
				.enter().append("g")
				.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

	bar.append("rect")
		.attr("y", function(d) { return y(d.value); })
		.attr("height", function(d) { return height - y(d.value); })
		.attr("width", barWidth - 1);

	bar.append("text")
		.attr("x", barWidth / 2)
		.attr("y", function(d) { return y(d.value) + 3; })
		.attr("dy", ".75em")
		.text(function(d) { return d.value; });
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}*/
