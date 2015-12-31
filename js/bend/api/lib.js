/**
 * Created by justkenchu on 26/12/15.
 */
var spk = spk || {};
spk.lib = (function () {

    var helloWorld = function () {
        console.log("hello world!");
    };

    var getEvents = function (callback) {
        $.ajax({
            url: 'https://api.github.com/users/' + spk.properties.username + '/received_events',
            beforeSend: function (jqXHR) {
                jqXHR.setRequestHeader('Authorization', 'token ' + spk.properties.access_token);
            }
        }).done(function (data, textStatus, jqXHR) {
            console.log('GitHub\'s API called OK');
            callback(undefined, data);

        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.log('Error calling GitHub\'s API: %s', textStatus);
            callback(textStatus, undefined);
        });
    };

    return {
        helloWorld: helloWorld,
        getEvents: getEvents
    };
}());