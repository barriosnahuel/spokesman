/**
 * This is the famous snippet we're used to see directly in the HTML page, but for Chrome extensions and its Content Security Policy (CSP) we must load it from an external *.js file.
 * Created by Nahuel Barrios on 29/02/16.
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-XXXX-9']);
_gaq.push(['_trackPageview']);

/**
 * Below is a modified version of the Google Analytics asynchronous tracking
 * code snippet.  It has been modified to pull the HTTPS version of ga.js
 * instead of the default HTTP version.  It is recommended that you use this
 * snippet instead of the standard tracking snippet provided when setting up
 * a Google Analytics account.
 */
(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();