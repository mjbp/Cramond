/*global require, console*/
var jade = require('jade'),
    fs = require('fs'),
    cramondTides = require('./cramondTides.js'),
    dataFile = 'data/data.json',
    tpl = 'template/template.jade',
    dest = 'index.html',
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


function readData() {
    fs.readFile(dataFile, function (err, jsondata) {
        if (err) return console.error(err);
        try {
            data = JSON.parse(jsondata);
            buildPage();
        } catch (err2) {
            return console.error(err2);
        }
    });
}

function buildPage () {
    fs.readFile(tpl, 'utf8', function (err, tplfile) {
        if (err) throw err;
        try {
              var template = jade.compile(tplfile, {filename: tpl});
              fs.writeFile(dest, template({days: data}), function (err) {
                if (!err) {
                    console.log('success');
                } else {
                    console.error(err);
                }
              });
            } catch (e) {
              console.error(e);
            }
    });
}

(function () {
    cramondTides(dataFile, function (err) {
        if (err) console.log(err);
        readData();
    });
}());
