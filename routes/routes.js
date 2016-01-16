module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('home/index');
    });

    app.post('/lobby/create', function(req, res, next) {
        console.log(req.body.name);
        console.log(req.body.players);
    });

    app.get('/lobby/:id', function(req, res, next) {
        res.render('lobby/game');
    });

    app.get('/help', function(req, res, next) {
        res.send('help');
    });
};