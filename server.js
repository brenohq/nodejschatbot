var http = require('http');
var path = require('path');

var express = require('express');
var router = express();
var server = http.createServer(router);

var bodyParser = require("body-parser");
var request = require("request");

router.use(express.static(path.resolve(__dirname, 'client')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/webhook', (req, res) => {
  if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'minhasenhaboladona' ){
    console.log('Validação concluída!');
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.log('Validação falhou!');
    res.sendStatus(403);
  }
});

router.post('/webhook', (req, res) => {
  var data = req.body;
  
  if(data && data.object === 'page'){
    data.entry.forEach((entry) => {
      var pageId = entry.id;
      var timeOfEvent = entry.time;
      
      entry.messaging.forEach((event) => {
        if(event.message){
          console.log(event.message);
        }
      });
    });
    
    res.sendStatus(200);
  }
});



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
