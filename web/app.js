//set dimensions and margins of the graph
var margin = {top:20, right:20, bottom:20, left:60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

// create tooltip
var tooltip = d3.select("body")
                .append("div")
                  .classed("tooltip", true);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// move the 'group' element to the top left margin
var svg = d3.select("#South_suburbs").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("../SoutherSuburbs2016.csv", function(error, data){
  if (error) throw error;

  // format the data
  data.forEach(function(d){
    d.TOTAL = +d.TOTAL;
  });

  // scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.Suburb; }));
  y.domain([0, d3.max(data, function(d){ return d.TOTAL; })]);

  //append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Suburb); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.TOTAL); })
      .attr("height", function(d) { return height - y(d.TOTAL); })
      .on("mousemove", function(d) {
        tooltip
          .style("opacity", 1)
          .style("left", d3.event.x + "px")
          .style("top", d3.event.y + "px")
          .html(`
            <p><b>${d.Suburb}</b></p>
            <p>Consumption: ${d.SUM.toLocaleString()} kilolitres </p>
            <p>Theoretical Losses: ${d.Losses.toLocaleString()} kilolitres </p>
            <p>Total Usage: ${d.TOTAL.toLocaleString()} kilolitres </p>
            `);
      })
      .on("mouseout", function() {
        tooltip
          .style("opacity", 0);
      });

  // add the x axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // add the y axis
  svg.append("g")
      .call(d3.axisLeft(y));
})
