/**
 * Created by justkenchu on 26/12/15.
 */
var spk = spk || {};
spk.lib = (function () {

    var helloWorld = function () {
        console.log("hello world!");
    };

    var getEvents = function (callback) {
        callback(undefined, response);
    };

    return {
        helloWorld: helloWorld,
        getEvents: getEvents
    };
}());

