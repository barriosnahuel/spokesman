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

    var syncLastEventRead = function (event) {
        console.log('Last event read %s', event.id);

        chrome.storage.sync.set({'lastEventId': event.id}, function () {
            // Do nothing?
        });
    };

    /**
     *
     * @param eachEvent
     * @param next
     */
    var isNotRead = function (eachEvent, next) {
        chrome.storage.sync.get('lastEventId', function (items) {
            if (!items.lastEventId || eachEvent.id > items.lastEventId) {
                next(eachEvent);
            }
        });
    };

    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.log('Checking for new notifications...');

        spk.lib.getEvents(function (err, events) {

            if (err) {
                alert('Can\'t get GitHub\'s events: ' + err);
            } else {
                for (var i = events.length - 1; i >= 0; i--) {
                    var eachEvent = events[i];

                    isNotRead(eachEvent, function (eachEvent) {
                        var dto = spk.events.manager.parse(eachEvent);
                        if (dto && spk.events.manager.shouldProcess(dto)) {
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
                    });
                }

                syncLastEventRead(events[0]);
            }
        });
    });

    if (spk.properties.testing) {
        chrome.storage.sync.clear();
    }

    chrome.alarms.create('', {
        when: Date.now(),
        periodInMinutes: spk.properties.testing ? undefined : 1
    });

}).fail(function (jqXHR, textStatus, errorThrown) {
    var errorMessage = 'Can\'t load properties file, extension will NOT work.';
    console.error(errorMessage);
    alert(errorMessage);
});