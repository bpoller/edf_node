var restify = require('restify');

var fs = require('fs');
var parse = require('csv-parse');


var client = restify.createJsonClient({
  url: 'http://178.62.86.159:8080',
  version: '*'
});


var parser = parse({delimiter: ';'}, function(err, data){
  for(i = 0; i < data.length; i++){

   var time = Date.parse(data[i][2])/1000;
   var thedata = data[i][0]; 

   send(time,thedata);
}
});

function send(time, data){
 console.log(time + ":"+data);

  var path="/data?time="+time+"&data="+data;
  
  client.get(path,onReturn);

  function onReturn(err, req, res){
    console.log("Request executed with code HTTP %d",res.statusCode);
  }

}

fs.createReadStream(__dirname+'/data.csv').pipe(parser);
