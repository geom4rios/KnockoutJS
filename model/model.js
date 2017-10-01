module.exports = function(app){

    app.get('/data', function (req, res) {
        console.log("GOT a GET REQUEST");
        res.json({0: "Hello"});
    });

};


