var restify = require('restify');
var server = restify.createServer();
var client = restify.createJsonClient({
  url: 'http://178.62.105.232:9200',
  version: '*'
});

function save(payload, id){
  var path="/edf/measure/"+id;
  client.post(path,payload, onReturn);

  function onReturn(err, req, res){
    console.log("Request executed with code HTTP %d",res.statusCode);
  }
}

function isValid(params){
  return typeof(parseInt(params.time))==="number" &&
           typeof(parseInt(params.measurement)) === "number" &&
           typeof(params.tariff)==="string" &&
           (params.tariff==="PEAK" || params.tariff==="OFF_PEAK");
}

function process(req, res, next) {
  var params = req.params;
  if(isValid(params)){
    save(toJson(params), parseInt(params.time));
  }
  else {
    console.log("There was an error in the request.");
    console.log(params);
  }
  res.send(200);
  next();
}

function toJson (params){
  return {time:new Date(parseInt(params.time)).toISOString(), measurement:parseInt(params.measurement), tariff:params.tariff};
}


server.use(restify.queryParser());

server.get('/data', process);

server.get(/.*/,restify.serveStatic({
	directory:'./kibana',
	default: 'index.html'
}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
