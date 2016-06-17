var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var apiai = require('apiai');

/* place in this variable client API key from API.AI */
/* todo: check differences between client key and developer key */

var apiaiClient = apiai("f83c20e2568641128261f275d8d392b2");
var jsonfile = require('jsonfile');
//var basicAuth = require('basic-auth');


app.set('port', (process.env.PORT || 5000));
app.use(express.static('public'));


/*var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.send(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if (user.name === 'contact@distributionlab.com' && user.pass === 'lb€pdAx7') {
    return next();
  } else {
    return unauthorized(res);
  };
};*/

app.get('/', /*auth, */ function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var jsonfile = require('jsonfile')

var leechedFile = './leeched.json';
var userFile = "./user.json";

// prefix of all FAQ information intents
var infoPrefix = "info.";

var data = jsonfile.readFileSync(leechedFile);
var userData = jsonfile.readFileSync(userFile);

for (var attrname in userData) {
    data[attrname] = userData[attrname];
}


io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {

        if (msg) {

            // Provides a fixed client id to API.AI to manage the context properly
            var params = {
                sessionId: socket.id
            }

            var request = apiaiClient.textRequest(msg.message, params);

            var payload = {
                from: "self",
                content: msg.message
            };

            socket.emit('chat message', payload);

            request.on('response', function(response) {

                var result = response.result;

                var payload = {
                    from: "api.ai",
                    content: result
                };

                // Case of FAQ info questions
                if (result && result.action && result.action.startsWith(infoPrefix)) {

                    var id = result.action.substr(infoPrefix.length);

                    // Speech is retrieved from our local flat JSON file
                    var item = data[id];
                    for (var i in item.responses) {
                        payload.content.fulfillment.speech = item.responses[i];
                        payload.content.fulfillment.links = item.links;

                        socket.emit('chat message', payload);
                    }
                } else {
                    socket.emit('chat message', payload);
                }

            });
            request.end();
        }

        request.on('error', function(error) {
            console.log(error);
        });


    });
});

http.listen(app.get('port'), function() {
    console.log('listening on *:' + app.get('port'));
});