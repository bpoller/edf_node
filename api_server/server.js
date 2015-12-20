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

function process(req, res, next) {
  var params = req.params;
    save(toJson(params), new Date(params.published_at).getTime());
  res.send(200);
  next();
}

function toJson (params){
  var theString = params.data.replace(/'/g,"\"");
  console.log(theString);
  var data = JSON.parse(theString);
  data.time = params.published_at;
  return data;
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
