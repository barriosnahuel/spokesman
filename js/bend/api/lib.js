/**
 * Created by justkenchu on 26/12/15.
 */
var spk = spk || {};
spk.lib = (function () {

    var helloWorld = function () {
        console.log("hello world!");
    };

    var getEvents = function (callback) {

        chrome.storage.sync.get('username', function (localStorage) {
            if (localStorage.username) {

                chrome.storage.local.get('accessToken', function (syncedStorage) {

                    if (syncedStorage.accessToken) {
                        $.ajax({
                            url: 'https://api.github.com/users/' + localStorage.username + '/received_events',
                            beforeSend: function (jqXHR) {
                                jqXHR.setRequestHeader('Authorization', 'token ' + syncedStorage.accessToken);
                            }
                        }).done(function (data, textStatus, jqXHR) {
                            console.log('GitHub\'s API called OK');
                            callback(undefined, data);

                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            console.log('Error calling GitHub\'s API: %s', textStatus);
                            callback(textStatus, undefined);
                        });
                    } else {
                        callback('Must configure your GitHub\'s personal access token');
                    }
                });
            } else {
                callback('Must configure your GitHub\'s username');
            }
        });
    };

    return {
        helloWorld: helloWorld,
        getEvents: getEvents
    };
}());