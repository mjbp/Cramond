/*global require, console, module*/
var request = require('request'),
    cheerio = require('cheerio'),
    moment = require('moment'),
    fs = require('fs'),
    url = 'http://www.thebeachguide.co.uk/south-scotland/lothian/cramond-weather.htm',
    data = [],
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeHelper = {
        zeropad : function (n) {
            return String('00'+n).substr(-2);
        },
        minutesToTime : function (n) {
            return String(timeHelper.zeropad(timeHelper.minutesToHour(n))) + ':' + String(timeHelper.zeropad(n % 60));
        },
        minutesToHour : function (n) {
            return Math.floor(n / 60);
        }
    };

//sort it starting from today
days = days.slice(moment().day()).concat(days.slice(0, moment().day()));


var cramondTides = function (dataFile, cb) {
    request(url, function (err, resp, body) {
        if (err) return cb(err);
        var $ = cheerio.load(body),
            tmp;
        $('#tideTable td ul').each(function(i, day) {
            //Scrape the tide page and extract the low tide times for each day
            //Beware here be dragons..
            tmp = { day: days[i],
                    lowtides: convertArrayTimesTo24hrs($(this).text().replace(/\(.*?\)/g, '').replace(/(High \d+:\d+[a|p]m)+/g, '').replace(/(Low )/g, '').match(/.{1,7}/g))
                  };
            tmp.safe = [];
            tmp.safeMins = [];
            tmp.lowtides.forEach(function (t) {
                tmp.safeMins.push(getTimeRangeArray(t));
            });

            tmp.safeMins.forEach(function (t) {
                tmp.safe.push([timeHelper.minutesToTime(t[0]), timeHelper.minutesToTime(t[1])]);
            });
            tmp.safeMins = tmp.safeMins[0].concat(tmp.safeMins[1]);
            data.push(tmp);
        });

        writeFile(dataFile, data, function (err, data) {
            if (err) cb(err);
            cb();
        });
    });
};

function getTimeRangeArray(t) {
    var shr, ehr, hr = t.substr(0, 2);
    shr = +hr - 2 >= 0 ? +hr - 2 : 24 + (+hr - 2);
    ehr = +hr + 2 <= 24 ? +hr + 2 : 24 - (+hr + 2);

    return [(shr * 60) + ~~(t.substr(-2)), (ehr * 60) + ~~(t.substr(-2))];
}

function convertArrayTimesTo24hrs (times) {
    var r = [];
    times.forEach(function (t, i) {
        r[i] = t.substr(-2) === 'am' ? t.substr(0, 5) : String(+t.substr(0, 2) + 12 + t.substr(2, 3));
    });
    return r;
}


// Store in a file
function writeFile(file, obj, options, callback) {
    if (callback === undefined) {
      callback = options;
      options = null;
    }

    var str = '';
    try {
      str = JSON.stringify(obj, null, null) + '\n';
    } catch (err) {
      if (callback) return callback(err, null);
    }
    fs.writeFile(file, str, options, callback);
}

module.exports = cramondTides;
