!function(){"use strict";function t(n,o){function i(t,e){return function(){return t.apply(e,arguments)}}var r;if(o=o||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=o.touchBoundary||10,this.layer=n,this.tapDelay=o.tapDelay||200,!t.notNeeded(n)){for(var a=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],c=this,s=0,l=a.length;l>s;s++)c[a[s]]=i(c[a[s]],c);e&&(n.addEventListener("mouseover",this.onMouse,!0),n.addEventListener("mousedown",this.onMouse,!0),n.addEventListener("mouseup",this.onMouse,!0)),n.addEventListener("click",this.onClick,!0),n.addEventListener("touchstart",this.onTouchStart,!1),n.addEventListener("touchmove",this.onTouchMove,!1),n.addEventListener("touchend",this.onTouchEnd,!1),n.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(n.removeEventListener=function(t,e,o){var i=Node.prototype.removeEventListener;"click"===t?i.call(n,t,e.hijacked||e,o):i.call(n,t,e,o)},n.addEventListener=function(t,e,o){var i=Node.prototype.addEventListener;"click"===t?i.call(n,t,e.hijacked||(e.hijacked=function(t){t.propagationStopped||e(t)}),o):i.call(n,t,e,o)}),"function"==typeof n.onclick&&(r=n.onclick,n.addEventListener("click",function(t){r(t)},!1),n.onclick=null)}}var e=navigator.userAgent.indexOf("Android")>0,n=/iP(ad|hone|od)/.test(navigator.userAgent),o=n&&/OS 4_\d(_\d)?/.test(navigator.userAgent),i=n&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),r=navigator.userAgent.indexOf("BB10")>0;t.prototype.needsClick=function(t){switch(t.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(t.disabled)return!0;break;case"input":if(n&&"file"===t.type||t.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(t.className)},t.prototype.needsFocus=function(t){switch(t.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!e;case"input":switch(t.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!t.disabled&&!t.readOnly;default:return/\bneedsfocus\b/.test(t.className)}},t.prototype.sendClick=function(t,e){var n,o;document.activeElement&&document.activeElement!==t&&document.activeElement.blur(),o=e.changedTouches[0],n=document.createEvent("MouseEvents"),n.initMouseEvent(this.determineEventType(t),!0,!0,window,1,o.screenX,o.screenY,o.clientX,o.clientY,!1,!1,!1,!1,0,null),n.forwardedTouchEvent=!0,t.dispatchEvent(n)},t.prototype.determineEventType=function(t){return e&&"select"===t.tagName.toLowerCase()?"mousedown":"click"},t.prototype.focus=function(t){var e;n&&t.setSelectionRange&&0!==t.type.indexOf("date")&&"time"!==t.type&&"month"!==t.type?(e=t.value.length,t.setSelectionRange(e,e)):t.focus()},t.prototype.updateScrollParent=function(t){var e,n;if(e=t.fastClickScrollParent,!e||!e.contains(t)){n=t;do{if(n.scrollHeight>n.offsetHeight){e=n,t.fastClickScrollParent=n;break}n=n.parentElement}while(n)}e&&(e.fastClickLastScrollTop=e.scrollTop)},t.prototype.getTargetElementFromEventTarget=function(t){return t.nodeType===Node.TEXT_NODE?t.parentNode:t},t.prototype.onTouchStart=function(t){var e,i,r;if(t.targetTouches.length>1)return!0;if(e=this.getTargetElementFromEventTarget(t.target),i=t.targetTouches[0],n){if(r=window.getSelection(),r.rangeCount&&!r.isCollapsed)return!0;if(!o){if(i.identifier&&i.identifier===this.lastTouchIdentifier)return t.preventDefault(),!1;this.lastTouchIdentifier=i.identifier,this.updateScrollParent(e)}}return this.trackingClick=!0,this.trackingClickStart=t.timeStamp,this.targetElement=e,this.touchStartX=i.pageX,this.touchStartY=i.pageY,t.timeStamp-this.lastClickTime<this.tapDelay&&t.preventDefault(),!0},t.prototype.touchHasMoved=function(t){var e=t.changedTouches[0],n=this.touchBoundary;return Math.abs(e.pageX-this.touchStartX)>n||Math.abs(e.pageY-this.touchStartY)>n?!0:!1},t.prototype.onTouchMove=function(t){return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(t.target)||this.touchHasMoved(t))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},t.prototype.findControl=function(t){return void 0!==t.control?t.control:t.htmlFor?document.getElementById(t.htmlFor):t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},t.prototype.onTouchEnd=function(t){var r,a,c,s,l,u=this.targetElement;if(!this.trackingClick)return!0;if(t.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=t.timeStamp,a=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,i&&(l=t.changedTouches[0],u=document.elementFromPoint(l.pageX-window.pageXOffset,l.pageY-window.pageYOffset)||u,u.fastClickScrollParent=this.targetElement.fastClickScrollParent),c=u.tagName.toLowerCase(),"label"===c){if(r=this.findControl(u)){if(this.focus(u),e)return!1;u=r}}else if(this.needsFocus(u))return t.timeStamp-a>100||n&&window.top!==window&&"input"===c?(this.targetElement=null,!1):(this.focus(u),this.sendClick(u,t),n&&"select"===c||(this.targetElement=null,t.preventDefault()),!1);return n&&!o&&(s=u.fastClickScrollParent,s&&s.fastClickLastScrollTop!==s.scrollTop)?!0:(this.needsClick(u)||(t.preventDefault(),this.sendClick(u,t)),!1)},t.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},t.prototype.onMouse=function(t){return this.targetElement?t.forwardedTouchEvent?!0:t.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(t.stopImmediatePropagation?t.stopImmediatePropagation():t.propagationStopped=!0,t.stopPropagation(),t.preventDefault(),!1):!0:!0:!0},t.prototype.onClick=function(t){var e;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===t.target.type&&0===t.detail?!0:(e=this.onMouse(t),e||(this.targetElement=null),e)},t.prototype.destroy=function(){var t=this.layer;e&&(t.removeEventListener("mouseover",this.onMouse,!0),t.removeEventListener("mousedown",this.onMouse,!0),t.removeEventListener("mouseup",this.onMouse,!0)),t.removeEventListener("click",this.onClick,!0),t.removeEventListener("touchstart",this.onTouchStart,!1),t.removeEventListener("touchmove",this.onTouchMove,!1),t.removeEventListener("touchend",this.onTouchEnd,!1),t.removeEventListener("touchcancel",this.onTouchCancel,!1)},t.notNeeded=function(t){var n,o,i;if("undefined"==typeof window.ontouchstart)return!0;if(o=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!e)return!0;if(n=document.querySelector("meta[name=viewport]")){if(-1!==n.content.indexOf("user-scalable=no"))return!0;if(o>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(r&&(i=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),i[1]>=10&&i[2]>=3&&(n=document.querySelector("meta[name=viewport]")))){if(-1!==n.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===t.style.msTouchAction?!0:!1},t.attach=function(e,n){return new t(e,n)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return t}):"undefined"!=typeof module&&module.exports?(module.exports=t.attach,module.exports.FastClick=t):window.FastClick=t}(),function(t,e){var n=function(){function n(){var n=(t.querySelector(".day-on ").length,e.innerHeight,c.getBoundingClientRect()),o=n.top+e.scrollY,i=t.querySelector("header").clientHeight+t.querySelector(".day-on .header-day").clientHeight,r=75;e.scroll(0,~~(o-(i+r)))}function o(t){var n=e.getComputedStyle(a,null),i=a.clientHeight-parseInt(n.paddingTop),r=new Date,s=60*r.getHours()+r.getMinutes(),l=r.getSeconds(),u=s/1440;c.style.top=Math.round(i*u)+"px",c.innerHTML='<span class="clock-hand-time">'+f.minutesToTime(s)+":"+f.zeropad(l)+"</span>",p=e.setTimeout(o,1e3),"function"==typeof t&&t()}function i(n){n.stopImmediatePropagation(),s[l].classList.remove("day-on"),s[l].classList.add("day-off"),t.body.classList.remove("day-"+String(l+1)),l="next"===this.getAttribute("data-action")&&++l||--l,s[l].classList.remove("day-off"),s[l].classList.add("day-on"),h!==t.querySelector(".day-on h1").innerHTML?e.clearTimeout(p):o(),t.body.classList.add("day-"+String(l+1))}function r(){o(function(){e.setTimeout(n,100)}),[].forEach.call(t.querySelectorAll(".button-week"),function(t){t.addEventListener("click",i)}),e.addEventListener("resize",n),e.addEventListener("orientationchange",n)}var a=t.querySelector(".day-on .clock"),c=t.querySelector(".day-on .clock-hand"),s=[].slice.call(t.querySelectorAll(".day")),l=0,u=new Date,d=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],h=d[u.getDay()],p="",f={zeropad:function(t){return String("00"+t).substr(-2)},minutesToTime:function(t){return String(f.zeropad(f.minutesToHour(t)))+":"+String(f.zeropad(t%60))},minutesToHour:function(t){return Math.floor(t/60)}};return{init:r}}(),o=function(){function e(t){t.stopPropagation(),r.classList.add("modal-on")}function n(t){t.stopPropagation(),r.classList.remove("modal-on")}function o(){a.addEventListener("click",e),i.addEventListener("click",n)}var i=t.querySelector(".modal-overlay"),r=t.querySelector(".modal"),a=t.getElementById("info");return{init:o}}(),i={init:function(){FastClick.attach(t.body),n.init(),o.init()}};e.addEventListener("load",i.init)}(document,window);