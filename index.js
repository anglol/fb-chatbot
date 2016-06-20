const http = require('http'),
      Bot = require('messenger-bot'),
      api = require('./api');

var bot = new Bot({
  token: 'EAAOX9MyzB74BAFuiOtSRxgObuSxXUVkJe37W9qrRDtAFQNeEQE9TcWTuGZBSgQHyDoH20Tk2MgpUinCOE78tQRPUnhFMKPnZBZAdHRHj06KFiM1a0o8lzuHSsCGaZBd9BX5i0q6QsB8CVbEisDZA5fzuDMmX3Oohsfrx23ICuZBwZDZD',
  //verify: 'Ijh02V8lXzvCKrSzyTqlxJYiIl7etG6Z',
  app_secret: 'd5617a24f2a8a5c297668b085aa58e8c'
});

bot.on('error', function(err){
  console.log(err.message)
});

bot.on('message', function(payload, reply){
  console.log(text);
  var text = payload.message.text,
      sendId = payload.sender.id;

  api.call(senderId, text, function(text){
    
    bot.getProfile(sendId, function(err, profile){
      if (err) throw err;

      reply({ text }, function(err){
        if (err) throw err;
        console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
      });
    });

  });

});

http.createServer(bot.middleware()).listen(3000);
console.log('Server is running on port 3000.');