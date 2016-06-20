'use strict';

var exports = module.exports = {};

exports.getRandom = function() {
  var excuses = [
    'I am sorry. I haven\'t yet learned how to answer this question :)',
    'Please try to tell me that another way.',
    'Sorry, I don\'t know what that means.',
    'Mmmmh I don\'t understand, sorry.',
    'I wish I understand, but I don\'t.',
    'I feel stupid now.',
    'I don\'t understand yet, I just born !',
    'I have no idea what you are talking about :D',
    'Could you try to write it another way ?',
    'This is awkward, I have no idea about it.',
    'Sorry, I\'m not smarter than an octopus.'
  ];
  return excuses[this.getRandomIntBetween(0, excuses.length - 1)];
};

exports.getRandomIntBetween = function(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
};