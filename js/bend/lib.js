/**
 * Created by justkenchu on 26/12/15.
 */
var spk = spk || {};
spk.lib = (function () {
    var github = new Github({
        token: 'YOUR_AUTHENTICATION_TOKEN',
        auth: 'oauth'
    });

    var helloWorld = function () {
        console.log("hello world!");
    };

    var getFeed = function (callback) {
        var user = github.getUser();

        user.notifications(undefined, callback)
    };

    return {
        helloWorld: helloWorld,
        getFeed: getFeed
    };
}());