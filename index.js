const http = require('http'),
      Bot = require('messenger-bot'),
      api = require('./modules/api'),
      apologies = require('./modules/apologies'),
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

  var text = payload.message.text;
  
  api.call(payload.sender.id, text, function(text){
    
    bot.getProfile(payload.sender.id, function(err, profile){
      if (err) console.log(err);
      if( text.length < 1) text = apologies.getRandom();
        
      reply({"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Classic White T-Shirt","image_url":"http://petersapparel.parseapp.com/img/item100-thumb.png","subtitle":"Soft white cotton t-shirt is back in style","buttons":[{"type":"web_url","url":"https://petersapparel.parseapp.com/view_item?item_id=100","title":"View Item"},{"type":"web_url","url":"https://petersapparel.parseapp.com/buy_item?item_id=100","title":"Buy Item"},{"type":"postback","title":"Bookmark Item","payload":"USER_DEFINED_PAYLOAD_FOR_ITEM100"}]},{"title":"Classic Grey T-Shirt","image_url":"http://petersapparel.parseapp.com/img/item101-thumb.png","subtitle":"Soft gray cotton t-shirt is back in style","buttons":[{"type":"web_url","url":"https://petersapparel.parseapp.com/view_item?item_id=101","title":"View Item"},{"type":"web_url","url":"https://petersapparel.parseapp.com/buy_item?item_id=101","title":"Buy Item"},{"type":"postback","title":"Bookmark Item","payload":"USER_DEFINED_PAYLOAD_FOR_ITEM101"}]}]}}}, function(err){
        if (err) console.log(err);
        console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
      });
    });

  });
});

http.createServer(bot.middleware()).listen(process.env.PORT);
console.log('Server is running on port '+process.env.PORT+'.');
