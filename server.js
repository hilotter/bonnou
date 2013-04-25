var express = require('express'),
    bonnou = require('./routes/bonnou');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/public'));
});

app.get('/favicon.ico', function(req, res){
    res.end();
    return;
});
app.get('/api', bonnou.findAll);
app.get('/api/:id', bonnou.findById);
app.get('*', function(req, res){
    res.send({error: "not found"}, 404);
});

app.listen(3000);
console.log('Listening on port 3000...');
