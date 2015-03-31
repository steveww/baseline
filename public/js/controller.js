/* Angular controller */

var baseline = angular.module('baseline', []);

baseline.controller('baseform', function($scope, $http) {
  console.log('Controller started');

  // baseline data options
  $scope.dataSel = {}; // selected option
  $scope.dataOpts = [
    {'val': 'flat', 'text': 'Flat'},
    {'val': 'noise', 'text': 'Noise Bump'},
    {'val': 'bump', 'text': 'Bump'},
    {'val': 'step', 'text': 'Step'},
    {'val': 'wave', 'text': 'Wave'},
    {'val': 'sramp', 'text': 'Slow Ramp'},
    {'val': 'framp', 'text': 'Fast Ramp'},
  ];
  $scope.periodOpts = [
    {'val': 0.5, 'text': '30 mins'},
    {'val': 1, 'text': '1 hour'},
    {'val': 2, 'text': '2 hours'},
    {'val': 4, 'text': '4 hours'},
    {'val': 8, 'text': '8 hours'},
    {'val': 16, 'text': '16 hours'},
  ];
  $scope.periodSel = $scope.periodOpts[2];

  $scope.tailSel = false;

  // Event handlers
  $scope.selectData = function() {
    console.log('selectData called');
    var dataType = $scope.dataSel.val;
    var period = $scope.periodSel.val;
    // console.log('Type ' + dataType + ' Period ' + period + 'tail ' + $scope.tailSel);

    if(! dataType) {
      return;
    }

    $http.get('/rest/' + dataType + '/' + period + '/' + $scope.tailSel).success(function(datapoints) {
      var chart = c3.generate({
        'bindto': '#graph',
        'data': {
          'columns': datapoints.columns
          },
        'subchart': {
          'show': true
        },
        'point': {
          'show': false
        },
        'axis': {
          'x': {
            'label': 'Minutes'
          }
        }
      }); // end of chart
      $scope.zoomNote = 'Use the bottom chart to pan and zoom. Select a region to zoom in to and drag to pan. Double click resets';
    });
  };
});

