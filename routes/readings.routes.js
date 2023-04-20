const ReadingController = require('../controllers/readings.controller')

exports.routesConfig = function(app) {
    app.get('/reading', [
        ReadingController.getReading
    ]);

    app.post('/reading', [
        ReadingController.pushReading
    ]);
};