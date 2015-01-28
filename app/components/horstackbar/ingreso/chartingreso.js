function graphingreso(data,ciudad) {
    d3.csv(data, function(error, csv) {

        var margins = {
            top: 12,
            left: 48,
            right: 24,
            bottom: 24
        },
        legendPanel = {
            width: 180
        },
        width = 250 - margins.left - margins.right - legendPanel.width,
            height = 250 - margins.top - margins.bottom,
        csv = csv.filter(function(row) {
            return row['ciudad'] == ciudad;
        });

        var parseDate = d3.time.format("%Y").parse;

        var csvlen= csv.length;
        for (var i = 0; i < csvlen; i++) {
            anho = parseDate(csv[i]['anho']);
            salarios = +csv[i]['ingreso_total_salarios'];
            ganancias = +csv[i]['ingreso_total_ganancias'];
            capital = +csv[i]['ingreso_total_capital'];
            transferencias = +csv[i]['ingreso_total_transferencias'];
            otros = +csv[i]['ingreso_total_otros'];
            if(anho) {
            dataset = [{
                data: [{
                    dato: '1',
                    count: salarios
                }],
                name: 'salarios'
            }, {
                data: [{
                    dato: '1',
                    count: ganancias
                }],
                name: 'ganancias'
            }, {
                data: [{
                    dato: '1',
                    count: capital
                }],
                name: 'capital'
            }, {
                data: [{
                    dato: '1',
                    count: transferencias
                }],
                name: 'transferencias'
            }, {
                data: [{
                    dato: '1',
                    count: otros
                }],
                name: 'otros'
            }],
            series = dataset.map(function (d) {
                return d.name;
            }),
            dataset = dataset.map(function (d) {
                return d.data.map(function (o, i) {
                    // Structure it so that your numeric
                    // axis (the stacked amount) is y
                    return {
                        y: o.count,
                        x: o.dato
                    };
                });
            });
        }}
    stack = d3.layout.stack();

stack(dataset);
var dataset = dataset.map(function (group) {
    return group.map(function (d) {
        // Invert the x and y values, and y0 becomes x0
        return {
            x: d.y,
            y: d.x,
            x0: d.y0
        };
    });

});


    svg = d3.select('div.chart3a')
        .append('svg')
        .attr('width', width + margins.left + margins.right + legendPanel.width)
        .attr('height', height + margins.top + margins.bottom)
        .append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')'),
    xMax = d3.max(dataset, function (group) {
        return d3.max(group, function (d) {
            return d.x + d.x0;
        });
    })

    console.log(xMax)
    xScale = d3.scale.linear()
        .domain([0,-1])
        .range([0, width]),
    datos = dataset[0].map(function (d) {
        return d.y;
    }),
    _ = console.log(datos),
    yScale = d3.scale.ordinal()
        .domain(datos)
        .rangeRoundBands([0, height/6], .1),
    xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom'),
    yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left'),
    colours = d3.scale.category10(),
    groups = svg.selectAll('g')
        .data(dataset)
        .enter()
        .append('g')
        .style('fill', function (d, i) {
        return colours(i);
    }),
    rects = groups.selectAll('rect')
        .data(function (d) {
        return d;
    })
        .enter()
        .append('rect')
        .attr('x', function (d) {
        return xScale(d.x0);
    })
        .attr('y', function (d, i) {
        
        return yScale(d.y);
    })
        .attr('height', function (d) {
        return yScale.rangeBand();
    })
        .attr('width', function (d) {
        console.log(d.x)
        return xScale(d.x);
    })
        .on('mouseover', function (d) {
        var xPos = parseFloat(d3.select(this).attr('x')) / 2 + width / 2;
        var yPos = parseFloat(d3.select(this).attr('y')) + yScale.rangeBand() / 2;

        d3.select('#tooltip')
            .style('left', xPos + 'px')
            .style('top', yPos + 'px')
            .select('#value')
            .text(d.x);

        d3.select('#tooltip').classed('hidden', false);
    })
        .on('mouseout', function () {
        d3.select('#tooltip').classed('hidden', true);
    })

svg.append('rect')
    .attr('fill', 'None')
    .attr('width', 160)
    .attr('height', 30 * dataset.length)
    .attr('x', width + margins.left)
    .attr('y', height/2);

series.forEach(function (s, i) {
    svg.append('text')
        .attr('fill', 'black')
        .attr('x', 30)
        .attr('y', height/4 + i * 24 )
        .text(s)
        .style("font-family","sans-serif");
    svg.append('rect')
        .attr('fill', colours(i))
        .attr('width', 20)
        .attr('height', 20)
        .attr('x', 0)
        .attr('y', height/4 + i * 24 - 15);
});
})}

