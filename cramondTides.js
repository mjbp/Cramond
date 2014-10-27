/*global require, console, module*/
var request = require('request'),
    cheerio = require('cheerio'),
    moment = require('moment'),
    fs = require('fs'),
    url = 'http://www.thebeachguide.co.uk/south-scotland/lothian/cramond-weather.htm',
    data = [],
    weekMinuteMarks = [],
    week = [],
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

//sort the week, it starting from today
days = days.slice(moment().day()).concat(days.slice(0, moment().day()));


var cramondTides = function (dataFile, cb) {
    request(url, function (err, resp, body) {
        if (err) return cb(err);
        var $ = cheerio.load(body),
            tmp,
            times = [];
        $('#tideTable td ul').each(function(i, day) {
            //Scrape the tide page and extract the low tide times for each day
            //Beware here be dragons..
            tmp = { title: days[i],
                    lowtides: cleanTimes($(this).text().replace(/\(.*?\)/g, '').replace(/(High \d+:\d+[a|p]m)+/g, '').replace(/(Low )/g, '').match(/.{1,7}/g))
                  };
            tmp.lowtides.forEach(function (t) {
                //safe time = 2 hours either side of low tide
                weekMinuteMarks = weekMinuteMarks.concat([~~convert24TimeStringToWeekMins(t, i) - 120, ~~convert24TimeStringToWeekMins(t, i) + 120]);
            });
            data.push(tmp);
            
        });
        times = buildWeekTimes();
        data.forEach(function (day, i) {
            day.times = times[i];
            day.safeTimeStrings = [];
            day.lowtides.forEach(function(t){
                day.safeTimeStrings.push(getDisplayTimes(t));
            });
            
            delete day.lowtides;
        });
        
        writeFile(dataFile, data, function (err, data) {
            if (err) cb(err);
            cb();
        });
    });
};

function buildWeekTimes() {
    var onOff = ['unsafe', 'safe'],
        s = 0,
        r = [],
        count = 0,
        tmp;
    
    for (var i = 1440, j = 0; i <= (1440 * 7); i += 1440) {
        tmp = {};
        tmp[0] = onOff[(count % 2)];
        weekMinuteMarks.forEach(function(m) {
            if (m <= i && m >= (i - 1440)) {
                count++;
                tmp[m - (j * 1440)] = onOff[(count % 2)];
            }
        });
        j++;
        r.push(tmp);
    }
    return r;
}

function cleanTimes (times) {
    var r = [];
    times.forEach(function (t, i) {
        r[i] = t.substr(-2) === 'am' ? 
                t.substr(0, 2) === String(12) ? '00' + t.substr(2, 3) : 
                    t.substr(0, 5) : String(+t.substr(0, 2) + 12 + t.substr(2, 3));
    });
    return r;
}

function convert24TimeStringToWeekMins(t, i) {
    return (~~(t.substr(0, 2) * 60) + (i * 1440)) + ~~(t.substr(-2));
}

function getDisplayTimes(t) {
    var shr, ehr, hr = t.substr(0, 2);
    shr = +hr - 2 >= 0 ? +hr - 2 : 24 + (+hr - 2);
    ehr = +hr + 2 < 24 ? +hr + 2 : (+hr + 2) - 24;

    return [timeHelper.zeropad(shr) + t.substr(-3), timeHelper.zeropad(ehr) + t.substr(-3)];
}

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
