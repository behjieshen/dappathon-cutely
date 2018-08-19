var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

var port = process.env.PORT || 8080;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var index = express.Router();
require('./routes/index.js')(index);
app.use('/', index);

app.listen(port);
console.log('Server started on port ' + port);
