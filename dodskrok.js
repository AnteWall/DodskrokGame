var sassMiddleware = require('node-sass-middleware');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var lobbyService = require('./services/lobbyService');

app.use(sassMiddleware({
    src: __dirname,
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix: '/prefix'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components')); //Serve bower_compontents
app.use('/common', express.static(__dirname + '/common')); //Serve common
app.use('/directives', express.static(__dirname + '/directives')); //Serve common


app.use(bodyParser.urlencoded({
    extended: false // parse application/x-www-form-urlencoded
}))
app.use(bodyParser.json()) // parse application/json
var routes = require('./routes/routes')(app, lobbyService);
var server = app.listen(20771, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});