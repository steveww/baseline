
exports =
module.exports =
function MovingAverage(timespan) {
  var alpha;
  var stdMean = 0;
  var stdM2 = 0;
  var count = 0;
  var stdDev;
  var ma;     // moving average

  var ret = {};

  if (typeof timespan != 'number')
    throw new Error('must provide a timespan to the moving average constructor');

  if (timespan <= 0)
    throw new Error('must provide a timespan > 0 to the moving average constructor');

  // default alpha
  alpha = 2 / (timespan + 1);
  

  // push a new value in to the calculation
  ret.push =
  function push(value) {
    count++;
    if(!ma) {
      // initialise
      ma = value
      stdDev = 0;
    } else {
      ma = alpha * value + (1 - alpha) * ma;
      // moving standard deviation
      var delta = value - stdMean;
      stdMean = stdMean + delta / count;
      stdM2 = stdM2 + delta * (value - stdMean);
      var s = Math.sqrt(stdM2 / (count - 1));
      stdDev = alpha * s + (1 - alpha) * stdDev;
    }
  };


  // Exponential Moving Average
  ret.movingAverage =
  function movingAverage() {
    return ma;
  };

  // online stdard deviation
  ret.standardDeviation =
  function standardDeviation() {
    return stdDev;
  };

  return ret;

};
