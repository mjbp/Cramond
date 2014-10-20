/*global console, document, window, XMLHttpRequest*/
var cramondclock = (function (d, w) {
    var face = d.getElementById('clock'),
        hand = d.getElementById('hand'),
        dataSrc = 'data.json',
        data = {},
        safeMins = [],
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        date = new Date(),
        today = days[date.getDay()],
        numberwang = {
            zeropad : function (n) {
                return String('00'+n).substr(-2);
            },
            roundTo : function (n, to) {
                return ~~to * Math.round(n/~~(to));
            },
            minutesToTime : function (n) {
                return String(numberwang.zeropad(numberwang.minutesToHour(n))) + ':' + String(numberwang.zeropad(n % 60));
            },
            minutesToHour : function (n) {
                return Math.floor(n / 60);
            }
        };

    function getData(cb) {
        var XHR = new XMLHttpRequest();
        XHR.onload = function (e) {
            try {
                data = JSON.parse(this.responseText);
                cb();
            } catch(e) {
                throw new Error(e.message);
            }
        };
        XHR.open("get", dataSrc, true);
        XHR.send();
    }

    function make () {
        var ul = d.createElement('ul'),
            li = d.createElement('li'),
            span = d.createElement('span'),
            mins = 60 * 24,
            si = 0,
            liClass = ['unsafe', 'safe'];
        for (var i = 0; i < mins; i += 5) {
            var tmp = li.cloneNode(true),
                tmpSpan = span.cloneNode(true),
                time = numberwang.minutesToHour(i);
            if (i >= safeMins[si]) {
                ++si;
            }
            if (~~numberwang.zeropad(i % 60) === 0) {
                tmpSpan.innerHTML = time;
                if (time % 6 === 0) {
                    tmp.classList.add('key-time');
                }
                tmp.appendChild(tmpSpan);
            }
            tmp.setAttribute('id', 't' + i);
            tmp.classList.add(liClass[si % 2]);
            ul.appendChild(tmp);
        }
        face.appendChild(ul);

        w.addEventListener('resize', tick);
        tick(function () {w.setTimeout(setClockViewport, 100);});
    }

    function tick (cb) {
        var style = w.getComputedStyle(face, null),
            clockHeight = face.clientHeight - parseInt(style.paddingTop),
            date = new Date(),
            minutes = (date.getHours() * 60) + (date.getMinutes()),
            seconds = date.getSeconds(),
            fraction = minutes / (60 * 24);

        hand.style.top = Math.round(clockHeight * fraction) + 'px';

        hand.innerHTML = '<span id="hand-time">' + numberwang.minutesToTime(minutes) + ':' + numberwang.zeropad(seconds) + '</span>';

        w.setTimeout(tick, 1000);
        if (typeof cb === 'function') {cb();}
    }

    function setClockViewport() {
        var viewportHeight = w.innerHeight,
            handRect = hand.getBoundingClientRect(),
            handTop = handRect.top + w.scrollY;
        w.scroll(0, ~~(handTop - (viewportHeight/2)));
    }

    function getTimeRangeArray(t) {
        var shr, ehr, hr = t.substr(0, 2);
        shr = +hr - 2 >= 0 ? +hr - 2 : 24 + (+hr - 2);
        ehr = +hr + 2 <= 24 ? +hr + 2 : 24 - (+hr + 2);

        return [(shr * 60) + ~~(t.substr(-2)), (ehr * 60) + ~~(t.substr(-2))];
    }

    function getSafeMins() {
        var r = [];

        data[today].forEach(function (t) {
            r = r.concat(getTimeRangeArray(t));
        });

        return r;
    }

    function writeSafeTimes () {
        var tmp,
            target = d.getElementById('safe-times');
        data[today].forEach(function (t) {
            tmp = getTimeRangeArray(t);
            target.innerHTML += '<span class="safe-time">' + numberwang.minutesToTime(tmp[0]) + '-' + numberwang.minutesToTime(tmp[1]) + '</span>';
        });

    }

    function init() {
        getData(function () {
            //set title and safe range
            d.getElementById('day').innerHTML = today;
            safeMins = getSafeMins();
            writeSafeTimes();
            make();
        });

    }
    init();
    return {
        changeDay : function () {}
    };


}(document, window));
