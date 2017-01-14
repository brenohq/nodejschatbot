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
          trataMensagem(event);
        }
      });
    });
    
    res.sendStatus(200);
  }
});

function trataMensagem(event) {
  var senderId = event.sender.id;
  var recipientId = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  var messageId = message.mid;
  var messageText = message.text;
  var attachments = message.attachments;
  
  if (messageText) {
    switch (messageText) {
      case 'oi':
        sendTextMessage(senderId, 'Oi, tudo bem?');
        break;
        
      case 'tchau':
        break;
      
      default:
        
    }
  } else if (attachments) {
    console.log('Anexo recebido!');
  }
}

function callSendAPI (messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: 'EAAQ4WlMFaPIBAI6wtIIZAnjA8rcYsZBNqrYyj9lmOTdkMVcKgUvAvBFtzPzzvpgoZC3syyUyrHvfZBC9lTuufMfSpvZCujVILeiQw2832sxlb6RmbCbqMeYpTZCxZArdEJyhRuWFWeD4bixORMXv6ZCZCrUEzZAFwFddZAejPqy44zgCAZDZD' },
    method: 'POST',
    json: messageData
  }, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      console.log('mensagem enviada com sucesso!');
      var recipientId = body.recipient_id;
      var messageId = body.message_id;
    } else {
      console.log('não foi possível enviar a mensagem');
      console.log(error);
    }
  });
}

function sendTextMessage (recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  
  callSendAPI(messageData);
}



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("nodejschatbot server listening at", addr.address + ":" + addr.port);
});
