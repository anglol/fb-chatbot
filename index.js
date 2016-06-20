const http = require('http'),
      Bot = require('messenger-bot'),
      config = require('config'),
      api = require('./modules/api'),
      apologies = require('./modules/apologies'),
      payloads = require('./modules/payloads');

var bot = new Bot({
  token: process.env.FACEBOOK_PAGE_TOKEN,
  verify: process.env.FACEBOOK_VERIFICATION_TOKEN,
  app_secret: process.env.FACEBOOK_APP_SECRET
});

bot.setGreetingMessage(recipient, payload, page_id, cb)

bot.on('error', function(err){
  console.log(err.message)
});

bot.on('postback', function(payload, reply){
  var text = "Hello World";
  reply({ text }, function(err){
    console.log(err);
  });
});

bot.on('message', function(payload, reply){

  var text = payload.message.text;

  api.call(payload.sender.id, text, function(text){
    
    bot.setGreetingMessage(payload.sender.id, payloads.greeting, 1799909426895728, function(res){
      console.log(res);
    });

    bot.getProfile(payload.sender.id, function(err, profile){
      if (err) console.log(err);
      if( text.length < 1) text = apologies.getRandom();
        
      reply({ text }, function(err){
        if (err) console.log(err);
        console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
      });

    });

  });
});

http.createServer(bot.middleware()).listen(process.env.PORT);
console.log('Server is running on port '+process.env.PORT+'.');
