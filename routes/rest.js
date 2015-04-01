// set up moving average calculation
var MA = require('../private_modules/moving-average');

var express = require('express');
var router = express.Router();

// one day of one minute
var SAMPLECOUNT = 24 * 60;


function dataramp(rate, period, tail) {
  var ma = MA(period * 60);
  var datapoints = { 'columns': [] };
  var data = ['Data'];
  var avg = ['Average'];
  var stdDev = ['Deviation'];
  var rampstart = 3 * 60;
  var rampstop = 21 * 60;
  var base = 500;
  var samples = tail == 'true' ? SAMPLECOUNT * 2 : SAMPLECOUNT;
  for(i = 1; i <= samples; i++) {
    if(i > rampstart && i < rampstop) {
      base += rate;
    }
    var val =  base + (Math.random() * 400);
    data.push(val);
    ma.push(val);
    avg.push(ma.movingAverage());
    stdDev.push(ma.movingAverage() + ma.standardDeviation());
  }
  datapoints.columns.push(data);
  datapoints.columns.push(avg);
  datapoints.columns.push(stdDev);
  return datapoints;
}

/* REST services */
router.get('/', function(req, res, next) {
  res.send('REST services');
});

router.get('/flat/:p/:t', function(req, res, next) {
  var period = req.params.p;
  var tail = req.params.t;
  var samples = tail == 'true' ? SAMPLECOUNT * 2 : SAMPLECOUNT;
  var ma = MA(period * 60);
  var datapoints = { 'columns': [] };
  var data = ['Data'];
  var avg = ['Average'];
  var stdDev = ['Deviation'];
  for(i = 1; i <= samples; i++) {
    var val = 1800 + (Math.random() * 400);
    data.push(val);
    ma.push(val);
    avg.push(ma.movingAverage());
    stdDev.push(ma.movingAverage() + ma.standardDeviation());
  }
  datapoints.columns.push(data);
  datapoints.columns.push(avg);
  datapoints.columns.push(stdDev);
  res.json(datapoints);
});

router.get('/bump/:p/:t', function(req, res, next) {
  var period = req.params.p;
  var tail = req.params.t;
  var samples = tail == 'true' ? SAMPLECOUNT * 2 : SAMPLECOUNT;
  var ma = MA(period * 60); // 2 hours
  var datapoints = { 'columns': [] };
  var data = ['Data'];
  var avg = ['Average'];
  var stdDev = ['Deviation'];
  var bumpstart = 11 * 60;
  var bumpstop = 13 * 60;
  var base = 0;
  for(i = 1; i <= samples; i++) {
    if(i > bumpstart && i < bumpstop) {
      base = 1800;
    } else {
      base = 800;
    }
    var val = base + (Math.random() * 400);
    data.push(val);
    ma.push(val);
    avg.push(ma.movingAverage());
    stdDev.push(ma.movingAverage() + ma.standardDeviation());
  }
  datapoints.columns.push(data);
  datapoints.columns.push(avg);
  datapoints.columns.push(stdDev);
  res.json(datapoints);
});

router.get('/noise/:p/:t', function(req, res, next) {
  var period = req.params.p;
  var tail = req.params.t;
  var samples = tail == 'true' ? SAMPLECOUNT * 2 : SAMPLECOUNT;
  var ma = MA(period * 60); // 2 hours
  var datapoints = { 'columns': [] };
  var data = ['Data'];
  var avg = ['Average'];
  var stdDev = ['Deviation'];
  var noisestart = 11 * 60;
  var noisestop = 13 * 60;
  var noise;
  var base = 0;
  for(i = 1; i <= samples; i++) {
    if(i > noisestart && i < noisestop) {
      noise = 1000;
    } else {
      noise = 400;
    }
    var val = base + (Math.random() * noise);
    data.push(val);
    ma.push(val);
    avg.push(ma.movingAverage());
    stdDev.push(ma.movingAverage() + ma.standardDeviation());
  }
  datapoints.columns.push(data);
  datapoints.columns.push(avg);
  datapoints.columns.push(stdDev);
  res.json(datapoints);
});

router.get('/step/:p/:t', function(req, res, next) {
  var period = req.params.p;
  var tail = req.params.t;
  var samples = tail == 'true' ? SAMPLECOUNT * 2 : SAMPLECOUNT;
  var ma = MA(period * 60);
  var datapoints = { 'columns': [] };
  var data = ['Data'];
  var avg = ['Average'];
  var stdDev = ['Deviation'];
  var stepstart = 12 * 60;
  var base = 0;
  for(i = 1; i <= samples; i++) {
    if(i > stepstart) {
      base = 1800;
    } else {
      base = 800;
    }
    var val = base + (Math.random() * 400);
    data.push(val);
    ma.push(val);
    avg.push(ma.movingAverage());
    stdDev.push(ma.movingAverage() + ma.standardDeviation());
  }
  datapoints.columns.push(data);
  datapoints.columns.push(avg);
  datapoints.columns.push(stdDev);
  res.json(datapoints);
});

router.get('/wave/:p/:t', function(req, res, next) {
  var period = req.params.p;
  var tail = req.params.t;
  var samples = tail == 'true' ? SAMPLECOUNT * 2 : SAMPLECOUNT;
  var ma = MA(period * 60);
  var datapoints = { 'columns': [] };
  var data = ['Data'];
  var avg = ['Average'];
  var stdDev = ['Deviation'];
  var base = 1800;
  for(i = 1; i <= samples; i++) {
    if(i % 240 == 0) {
      base = base == 1800 ? 800 : 1800;
    }
    // override for long tail
    if(i >= SAMPLECOUNT) {
      base = 800;
    }
    var val = base + (Math.random() * 400);
    data.push(val);
    ma.push(val);
    avg.push(ma.movingAverage());
    stdDev.push(ma.movingAverage() + ma.standardDeviation());
  }
  datapoints.columns.push(data);
  datapoints.columns.push(avg);
  datapoints.columns.push(stdDev);
  res.json(datapoints);
});

router.get('/framp/:p/:t', function(req, res, next) {
  res.json(dataramp(10, req.params.p, req.params.t));
});

router.get('/sramp/:p/:t', function(req, res, next) {
  res.json(dataramp(1, req.params.p, req.params.t));
});

module.exports = router;
