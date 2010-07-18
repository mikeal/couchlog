var request = require('request')
  , sys = require('sys')
  , irc = require('./IRC/lib/irc')
  ;
  
var ircOptions = { server: 'irc.freenode.net'};
var couchOptions = { uri:'http://mikeal.couchone.com/couchdbirc'
                   , method:'POST'
                   , headers:{'content-type':'application/json'}
                   }
                   ;

var bot = new irc(ircOptions);
bot.connect(function () {
  bot.nick('couchlog');
  bot.join('#couchdb');
  bot.addListener('privmsg', function (message) {
    if (message.params.length === 2) {
      message.channel = message.params[0];
      message.message = message.params[1];
      delete message.params
    }
    if (message.channel === '#couchdb') {
      message.timestamp = new Date();
      couchOptions.body = JSON.stringify(message);
      couchOptions.headers['content-length'] = couchOptions.body.length;
      request(couchOptions, function (err, resp, body) {
        sys.puts(body);
      })
    }
  })
});
