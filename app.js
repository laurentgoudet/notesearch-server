// Module dependencies
var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path');

var app = express();

var config = require('./config.json');

// Configurations
app.configure(function(){
  app.enable('trust proxy');
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.cookieSession({ secret: config.COOKIE_SECRET}));
  app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
  });

  app.use(app.router);
  app.use(require('less-middleware')({src: __dirname + '/public'}));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/oauth', routes.oauth);
app.get('/oauth_callback', routes.oauth_callback);
app.get('/success', routes.success);
app.get('/error', routes.error);

// Run
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
