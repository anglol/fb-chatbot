'use strict';

var exports = module.exports = {};

var apiai = require('apiai'),
    jsonfile = require('jsonfile');

var apiaiClient = apiai("f83c20e2568641128261f275d8d392b2");

var leechedFile = './flux/leeched.json';
var userFile = "./flux/user.json";
var infoPrefix = "info.";

var data = jsonfile.readFileSync(leechedFile);
var userData = jsonfile.readFileSync(userFile);

for (var attrname in userData) data[attrname] = userData[attrname];

exports.call = function(recipientId, messageText, cb) {
    var request = apiaiClient.textRequest(messageText, { 'sessionId': recipientId });

    request.on('error', function(error) {
        console.log(error);
        return;
    });

    request.on('response', function(response) {

        var result = response.result;
        // Case of FAQ info questions
        if (result && result.action && result.action.startsWith(infoPrefix)) {

            var id = result.action.substr(infoPrefix.length);

            // Speech is retrieved from our local flat JSON file
            var item = data[id];
            for (var i in item.responses) {
                // payload.content.fulfillment.speech = item.responses[i];
                // payload.content.fulfillment.links = item.links;
                cb(item.responses[i]);
            }
        } else {
            cb(result.fulfillment.speech);
        }

    });
    request.end();
}