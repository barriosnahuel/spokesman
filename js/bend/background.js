/**
 * Created by Nahuel Barrios on 28/12/15.
 */
var spk = spk || {};

$.ajax({
    url: 'local-properties.json',
    dataType: 'json',
    async: false
}).done(function (properties) {
    console.log('local-properties.json loaded OK');
    spk.properties = properties;

    chrome.notifications.onClicked.addListener(function (notificationId) {
        alert('clicked on: ' + notificationId);

        // TODO: Search notification data and send user to notification's link.
    });

    chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
        if (byUser) {
            console.log('notification %s %s', notificationId, ' closed by the user');
        }

        // TODO: Mark notification as viewed... always?
    });

    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.log('Checking for new notifications...');

        spk.lib.getEvents(function (err, events) {

            if (err) {
                alert('Can\'t get GitHub\'s events: ' + err);
            } else {
                for (var i = 0; i < events.length; i++) {
                    var eachEvent = events[i];

                    var dto = spk.events.manager.parse(eachEvent);
                    if (dto) {

                        var notification = spk.events.manager.buildNotification(dto);

                        var notificationOptions = {
                            type: 'basic',
                            title: notification.title,
                            message: notification.message,
                            contextMessage: notification.contextMessage,
                            iconUrl: 'img/Octocat.png'
                        };

                        chrome.notifications.create(dto.id, notificationOptions, function (notificationId) {
                            // Do nothing...
                        });
                    } else {
                        console.log('WARN: Event id %s (%s) was NOT handled', eachEvent.id, eachEvent.type);
                    }
                }
            }
        });
    });

    chrome.alarms.create('', {
        when: Date.now(),
        periodInMinutes: spk.properties.testing ? undefined : 1
    });

}).fail(function (jqXHR, textStatus, errorThrown) {
    var errorMessage = 'Can\'t load properties file, extension will NOT work.';
    console.error(errorMessage);
    alert(errorMessage);
});