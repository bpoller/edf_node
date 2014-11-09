var restify = require('restify');

function process(req, res, next) {
  
  var time = req.params.time * 1000;
  var data = req.params.data;

  var currentTariff = extractTariff(req.params.data)=="01";

  //transitionIndex is one-based zero means no transition took place.
  var transitionIndex = Number(extractTransitionIndex(data));
  for (i = 0; i < 10; i++) {
  	save(toJson(measurementTime(time,i), extractMeasurement(data, i), tariff(transitionIndex, currentTariff, i)));
  }

  res.send(200);
  next();
}

function save(payload){
  var path="/edf/measure/";
  client.post(path,payload, onReturn);

  function onReturn(err, req, res){
    console.log("Request executed with code HTTP %d",res.statusCode);
  }
}

function toJson (vTime, vMeasurement, isPeakTariff){
  return {time:vTime, measurement:vMeasurement, tariff:isPeakTariff?"PEAK":"OFF_PEAK"};
}

function measurementTime(time, index){
  return time + index*60000;
}

function extractMeasurement(data, i){
  var position = 4 + 2*i;
  return parseInt("0x"+data.substring(position, position + 2));
}

function tariff(transitionIndex, currentTariff, index){
  if(transitionIndex >=index){
    return currentTariff;
  } else {
    return !currentTariff;
  }
}

function extractTariff(data){
  return data.substring(2, 4);
}

function extractTransitionIndex(data){
  return data.substring(1,2);
}

var server = restify.createServer();
server.use(restify.queryParser());
server.get('/data', process);

server.get(/.*/,restify.serveStatic({
	directory:'./kibana',
	default: 'index.html'
}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

var client = restify.createJsonClient({
  url: 'http://localhost:9200',
  version: '*'
});
