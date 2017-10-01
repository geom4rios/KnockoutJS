var rp = require('request-promise');

var api  =  {

    dataFX: {},

    getPairData: function (pair) {

        var yearMonth = "2017-09-";
        var day = api.randomIntFromInterval(10, 31);
        var date = yearMonth + day.toString();

        var base = pair.substring(0, 3);
        var price = pair.substring(3, 6);

        var url = "http://api.fixer.io/"+ date +"?symbols=" + base + "," + price;
        console.log(url);

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
                console.log("URL used to fetch data: " + url);
            });

    },

    getData: function () {
        api.getPairData("GBPUSD");
        api.getPairData("EURUSD");
        api.getPairData("AUDCAD");
        api.getPairData("EURCAD");
        api.getPairData("EURCHF");
        api.getPairData("EURGBP");
        api.getPairData("CADJPY");
        api.getPairData("CADUSD");
    },

    randomIntFromInterval: function (min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

};

module.exports = api;
