// server.js
// where your node app starts

// init project
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {Schema} = mongoose;
const app = express();
require('dotenv').config()

app.enable('trust proxy');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => console.log(error));

const urlSchema = new Schema({
    url: {
        type: String,
        required: true
    }
});

let URL = mongoose.model('URL', urlSchema );


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/1", function (req, res) {
    res.sendFile(__dirname + '/views/1.html');
});

app.get("/2", function (req, res) {
    res.sendFile(__dirname + '/views/2.html');
});

app.get("/3", function (req, res) {
    res.sendFile(__dirname + '/views/3.html');
});


// Timestamp Microservice API
app.get("/api1/:date?", function (req, res) {
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

// Request Header Parser Microservice API
app.get("/api2/whoami", function (req, res) {
    let ip = req.get("X-Forwarded-For");
    let lang = req.get("accept-language");
    let info = req.get('user-agent');

    let result = { ipaddress: ip,
                   language: lang,
                   software: info };

    res.json(result);
});

// URL Shortener Microservice API
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api3/shorturl', function (req, res) {
    // const saveURL = (done) => {
    //     const url = new URL({ url: req.body.url });
    //     console.log(url);
    //     url.save(function(err, data) {
    //         console.log("URL saved to database.")
    //         if (err) return console.error(err);
    //         done(null, data);
    //     });
    // };

    const saveURL = new URL(req.body);
    saveURL.save()
        .then(item => {
            console.log("ok");
            console.log(item.id);
            console.log(saveURL);
            res.send(`URL is: ${req.body.url}.`);
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });

    console.log(saveURL);
})
// listen for requests :)
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
