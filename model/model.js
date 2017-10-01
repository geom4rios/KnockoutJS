var api = require('../api/api.js');

module.exports = function(app){

    app.get('/init', function (req, res) {

        //Editable data
        var myDataRow = [
            ["EURUSD", true, '22', true, '31'],
            ["AUDCAD", false, '23', true, '32'],
            ["GBPUSD", true, '24', true, '33']
        ];

        res.json(myDataRow);
    });

    app.get('/update', function (req, res) {
        api.getData();
        res.json(api.dataFX);
    });

};


