/*global require, console, process*/
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.env.PORT || 3000,
    jade = require('jade'),
    cramondTides = require('./cramondTides.js'),
    dataFile = 'data/data.json',
    tpl = 'template/template.jade',
    data = {},
    helpers = {
        zeropad : function (n) {
            return String('00'+n).substr(-2);
        },
        minutesToTime : function (n) {
            return String(helpers.zeropad(helpers.minutesToHour(n))) + ':' + String(helpers.zeropad(n % 60));
        },
        minutesToHour : function (n) {
            return Math.floor(n / 60);
        }
    };

checkData(readData);

//create the linear gradient string here and pass to each day
function checkData (cb) {
    fs.stat(dataFile, function (err, stats) {
        if (err) console.log(err);
        var date = new Date(),
            today = String(date.getDate()) + String(date.getMonth()) + String(date.getFullYear()),
            mtime = String(stats.mtime.getDate()) + String(stats.mtime.getMonth()) + String(stats.mtime.getFullYear());
     
        if (mtime !== today) {
            cramondTides(dataFile, function (err) {
                if (err) console.log(err);
                cb();
            });
        } else {
            cb();
        }
    });
}


function readData() {
    fs.readFile(dataFile, function (err, jsondata) {
        if (err) return console.error(err);
        
        try {
            data = JSON.parse(jsondata);
            run();
        } catch (err2) {
            return new Error(err);
        }
    });
}

function run () {
    http.createServer(function(req, res) {
        var template;
        fs.readFile(tpl, 'utf8', function (err, tplfile) {
            if (err) throw new Error(err);
            template = jade.compile(tplfile, {filename: tpl});
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(template({days: data}));
        });
    }).listen(port);

    console.log("Server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
}