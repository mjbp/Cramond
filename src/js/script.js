/*global console, window, document*/
(function (d, w) {

    var clock = (function () {
            var face = d.querySelector('.day-on .clock'),
                hand = d.querySelector('.day-on .clock-hand'),
                days = [].slice.call(d.querySelectorAll('.day')),
                current = 0,
                date = new Date(),
                week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                today = week[date.getDay()],
                timer = '',
                time = {
                    zeropad : function (n) {
                        return String('00'+n).substr(-2);
                    },
                    minutesToTime : function (n) {
                        return String(time.zeropad(time.minutesToHour(n))) + ':' + String(time.zeropad(n % 60));
                    },
                    minutesToHour : function (n) {
                        return Math.floor(n / 60);
                    }
                };

            function setClockViewport() {
                var currentDay = d.querySelector('.day-on ').length,
                    viewportHeight = w.innerHeight,
                    handRect = hand.getBoundingClientRect(),
                    handTop = handRect.top + w.scrollY,
                    headerHeight = d.querySelector('header').clientHeight + d.querySelector('.day-on .header-day').clientHeight,
                    timeHeight = 75;

                w.scroll(0, ~~(handTop - (headerHeight + timeHeight)));
            }

            function stopClock () {
                hand.innerHTML = '';
            }

            function tick (cb) {
                var style = w.getComputedStyle(face, null),
                    clockHeight = face.clientHeight - parseInt(style.paddingTop),
                    date = new Date(),
                    minutes = (date.getHours() * 60) + (date.getMinutes()),
                    seconds = date.getSeconds(),
                    fraction = minutes / (60 * 24);

                hand.style.top = Math.round(clockHeight * fraction) + 'px';

                hand.innerHTML = '<span class="clock-hand-time">' + time.minutesToTime(minutes) + ':' + time.zeropad(seconds) + '</span>';

                timer = w.setTimeout(tick, 1000);
                if (typeof cb === 'function') {cb();}
            }

            function changeDay (e) {
                e.stopImmediatePropagation();
                days[current].classList.remove('day-on');
                days[current].classList.add('day-off');
                d.body.classList.remove('day-' + String(current + 1));
                current = this.getAttribute('data-action') === 'next' && ++current || --current;
                days[current].classList.remove('day-off');
                days[current].classList.add('day-on');

                if (today !== d.querySelector('.day-on h1').innerHTML) {
                    w.clearTimeout(timer);
                } else {
                    tick();
                }

                d.body.classList.add('day-' + String(current + 1));
            }

            function init () {
                tick(function () {w.setTimeout(setClockViewport, 100);});
                [].forEach.call(d.querySelectorAll('.button-week'), function (el) {
                    el.addEventListener('click', changeDay);
                });
                w.addEventListener('resize', setClockViewport);
                w.addEventListener('orientationchange', setClockViewport);
            }

            return {
                init: init
            };
        }()),
        modal = (function () {
            var overlay = d.querySelector('.modal-overlay'),
                modal = d.querySelector('.modal'),
                button = d.getElementById('info');

            function show (e) {
                e.stopPropagation();
                modal.classList.add('modal-on');
            }

            function hide (e) {
                e.stopPropagation();
                modal.classList.remove('modal-on');
            }

            function init () {
                button.addEventListener('click', show);
                overlay.addEventListener('click', hide);
            }

            return {
                init: init
            };
        }()),
        CRAMOND = {
            init : function () {
                FastClick.attach(d.body);
                clock.init();
                modal.init();
            }
        };

    w.addEventListener('load', CRAMOND.init);
}(document, window));
