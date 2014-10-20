var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var fs = require('fs');
var url = 'http://www.thebeachguide.co.uk/south-scotland/lothian/cramond-weather.htm';
var datafile = 'data.json';

var data = {};
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//sort it starting from today
days = days.slice(moment().day()).concat(days.slice(0, moment().day()));


request(url, function (err, resp, body) {
    if (err) return console.error(err);
    var $ = cheerio.load(body);
    $('#tideTable td ul').each(function(i, day) {
        //Scrape the tide page and extract the low tide times for each day
        //Beware here, be dragons..
        data[days[i]] = convertArrayTimesTo24hrs($(this).text().replace(/\(.*?\)/g, '').replace(/(High \d+:\d+[a|p]m)+/g, '').replace(/(Low )/g, '').match(/.{1,7}/g));
    });

    //addToDb();
    writeFile(datafile, data, function (err, data) {
        if (err) console.error(err);

    });

    //read it
    /*
    readFile(datafile, data, function (err, data) {
        if (err) console.error(err);
        console.log(data);
    });
    */
});

convertArrayTimesTo24hrs = function (times) {
    var r = [];
    times.forEach(function (t, i) {
        r[i] = t.substr(-2) === 'am' ? t.substr(0, 5) : String(+t.substr(0, 2) + 12 + t.substr(2, 3));
    });
    return r;
};


// Store in a file
writeFile = function(file, obj, options, callback) {
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
};

readFile = function(file, options, callback) {
  if (callback === undefined) {
    callback = options;
    options = null;
  }

  fs.readFile(file, options, function(err, data) {
    if (err) return callback(err, null);

    var obj = null;
    try {
      obj = JSON.parse(data);
    } catch (err2) {
      return callback(err2, null);
    }

    callback(null, obj);
  });
};
