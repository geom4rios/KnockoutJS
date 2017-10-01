var rp = require('request-promise');

var api  =  {

    dataFX: {
        "GBPUSD": [],
        "EURUSD": []
    },

    getPairData: function (url, pair) {
        var options = {
            uri: url,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };

        rp(options)
            .then(function (res) {
                var arr = Object.keys(res).map(function(k) { return res[k] });
                api.dataFX[pair] = arr;
            })
            .catch(function (err) {
                console.log("API call failed: " + err);
            });

    },

    getData: function () {
        var urlG = "http://api.fixer.io/latest?symbols=USD,GBP";
        api.getPairData(urlG, "GBPUSD");

        var urlE = "http://api.fixer.io/latest?symbols=USD,EUR";
        api.getPairData(urlE, "EURUSD");


        var urlE = "http://api.fixer.io/latest?symbols=AUD, CAD";
        api.getPairData(urlE, "AUDCAD");

    }

};

module.exports = api;
