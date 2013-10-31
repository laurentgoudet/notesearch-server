var Evernote = require('evernote').Evernote;

var config = require('../config.json');
var callbackUrl = "https://notesearch.laurentgoudet.com/oauth_callback";

// home page
exports.index = function(req, res) {
  res.render('index');
};

// OAuth
exports.oauth = function(req, res) {
  var client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX
  });

  client.getRequestToken(callbackUrl, function(error, oauthToken, oauthTokenSecret, results){
    if(error) {
      req.session.error = JSON.stringify(error);
      res.redirect('/error');
    }
    else { 
      // store the tokens in the session
      req.session.oauthToken = oauthToken;
      req.session.oauthTokenSecret = oauthTokenSecret;

      // redirect the user to authorize the token
      res.redirect(client.getAuthorizeUrl(oauthToken));
    }
  });

};

// OAuth callback
exports.oauth_callback = function(req, res) {
  var client = new Evernote.Client({
    consumerKey: config.API_CONSUMER_KEY,
    consumerSecret: config.API_CONSUMER_SECRET,
    sandbox: config.SANDBOX
  });

  client.getAccessToken(
    req.session.oauthToken, 
    req.session.oauthTokenSecret, 
    req.param('oauth_verifier'), 
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if(error) {
        console.log('error');
        console.log(error);
        req.session.error = error;
        res.redirect('/error#' + error.statusCode);
	  }
	  else {
		  res.redirect('/success#' + oauthAccessToken);
	  }	  
    });
};

exports.success = function(req, res) {
	res.render('success')
  req.session.destroy();
};

exports.error = function(req, res) {
	res.render('error')
  req.session.destroy();
};

