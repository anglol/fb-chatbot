const http = require('http'),
      Bot = require('messenger-bot'),
      api = require('./api'),
      config = require('config');

var bot = new Bot({
  token: process.env.FACEBOOK_PAGE_TOKEN,
  verify: process.env.FACEBOOK_VERIFICATION_TOKEN,
  app_secret: process.env.FACEBOOK_APP_SECRET
});

bot.on('error', function(err){
  console.log(err.message)
});

bot.on('message', function(payload, reply){
  console.log(text);
  var text = payload.message.text,
      senderId = payload.sender.id;

  api.call(senderId, text, function(text){
    
    bot.getProfile(senderId, function(err, profile){
      if (err) throw err;

      reply({ text }, function(err){
        if (err) throw err;
        console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
      });
    });

  });

});

http.createServer(bot.middleware()).listen(process.env.PORT);
console.log('Server is running on port '+process.env.PORT+'.');