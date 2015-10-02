module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('home/index');
    });

    app.get('/lobby/:id', function(req, res, next) {
        res.render('lobby/game');
    });

    app.get('/help', function(req, res, next) {
        res.send('help');
    });
};