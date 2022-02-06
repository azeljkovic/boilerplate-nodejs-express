// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Timestamp Microservice API
app.get("/api/:date?", function (req, res) {
    let date = req.params.date;
    let unix, utc, result;

    // if date is a timestamp, convert to int
    if(/^\d+$/.test(date)){
        date = parseInt(date);
    }

    // if date is an empty param, send current time
    if(date === undefined){
        unix = Date.now();
        utc = new Date().toUTCString();
        result = {unix: unix,
                  utc: utc};
    }
    // if date is invalid, return error
    else if(new Date(date).toString() === "Invalid Date"){
        result = { error : "Invalid Date" };
    }
    // if date is valid, convert
    else{
        unix = new Date(date).getTime();
        utc = new Date(date).toUTCString();
        result = {unix: unix,
                  utc: utc};
    }

    res.json(result);
});


// listen for requests :)
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
