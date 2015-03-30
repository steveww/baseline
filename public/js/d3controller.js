/* Angular controller */

var baseline = angular.module('baseline', []);

baseline.controller('baseform', function($scope, $http) {
  console.log('Controller started');

  // baseline data options
  $scope.dataSel = {}; // selected option
  $scope.dataOpts = [
    {'val': 'flat', 'text': 'Flat'},
    {'val': 'bump', 'text': 'Bump'},
    {'val': 'step', 'text': 'Step'},
    {'val': 'framp', 'text': 'Fast Ramp'},
    {'val': 'sramp', 'text': 'Slow Ramp'},
  ];
  $scope.periodOpts = [
    {'val': 1, 'text': '1 hour'},
    {'val': 2, 'text': '2 hours'},
    {'val': 4, 'text': '4 hours'},
    {'val': 8, 'text': '8 hours'},
    {'val': 16, 'text': '16 hours'},
  ];
  $scope.periodSel = $scope.periodOpts[1];


  // Event handlers
  $scope.selectData = function() {
    console.log("selectData called");
    var dataType = $scope.dataSel.val;
    var period = $scope.periodSel.val;
    console.log('Type ' + dataType + ' Period ' + period);

    $http.get('/rest/' + dataType + '/' + period).success(function(datapoints) {
      var vis = d3.select('#graph');
      var WIDTH = 800,
        HEIGHT = 500,
        MARGINS = {
          'top': 20,
          'right': 20,
          'bottom': 20,
          'left': 50
        };
      var xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right])
        .domain([d3.min(datapoints.data, function(d){return d.x;}), d3.max(datapoints.data, function(d){ return d.x;})]);
      var yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom])
        .domain([0, d3.max(datapoints.data, function(d){return d.y;})]);
      var xAxis = d3.svg.axis().scale(xRange).tickSize(5).tickSubdivide(true);
      var yAxis = d3.svg.axis().scale(yRange).tickSize(5).orient('left').tickSubdivide(true);

      //var zoom = d3.behavior.zoom().x(xRange).y(yRange).scaleExtent([1, 10]).on('zoom', zoomed);

      // remove old data
      d3.select('#xaxis').remove();
      d3.select('#yaxis').remove();
      d3.select('#datapath').remove();
      d3.select('#average').remove();

      // Zoom Hook?
      /*vis.append('svg:g')
        .attr('id', 'zoom')
        .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')')
        .call(zoom);*/

      // draw X axis
      vis.append('svg:g')
        .attr('id', 'xaxis')
        .attr('transform', 'translate(0, ' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

      // draw Y axis
      vis.append('svg:g')
        .attr('id', 'yaxis')
        .attr('transform', 'translate(' + MARGINS.left + ',0)')
        .call(yAxis);

      var lineFunc = d3.svg.line()
        .x(function(d){return xRange(d.x);})
        .y(function(d){return yRange(d.y);})
        .interpolate('linear');

      // plot the data line
      vis.append('svg:path')
        .attr('id', 'datapath')
        .attr('d', lineFunc(datapoints.data))
        .attr('stroke', '#00ffff')
        .attr('stoke-width' , 2)
        .attr('fill', 'none');

      // plot the average line
      vis.append('svg:path')
        .attr('id', 'average')
        .attr('d', lineFunc(datapoints.ma))
        .attr('stroke', '#00ff00')
        .attr('stoke-width' , 2)
        .attr('fill', 'none');
    });
  };
});

/*
function zoomed() {
  svg.select('#xaxis').call(xAxis);
  svg.select('#yaxis').call(yAxis);
}
*/
