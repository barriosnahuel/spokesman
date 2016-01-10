/**
 * Created by Nahuel Barrios on 28/12/15.
 */
var spk = spk || {};


chrome.runtime.onInstalled.addListener(function (details) {
    console.log('Running onInstalled, reason: %s', details.reason);
    console.log('Previous version: %s', details.previousVersion);

    if (details.reason === 'install') {
        chrome.tabs.create({
            url: 'views/settings.html'
        }, undefined);
    }
});

$.ajax({
    url: 'properties.json',
    dataType: 'json',
    async: false
}).done(function (properties) {
    console.log('Properties file loaded OK');
    spk.properties = properties;

    chrome.notifications.onClicked.addListener(function (notificationId) {
        chrome.storage.local.get(notificationId, function (data) {

            if (data[notificationId]) {
                chrome.tabs.create({
                    url: data[notificationId]
                }, function () {
                    chrome.notifications.clear(notificationId);
                });
            }
        });
    });

    chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
        if (byUser) {
            console.log('notification %s %s', notificationId, ' closed by the user');

            chrome.storage.local.remove(notificationId, undefined);
        }
    });

    var syncLastEventRead = function (event) {
        console.log('Last event read %s', event.id);

        chrome.storage.sync.set({'lastEventId': event.id}, undefined);
    };

    /**
     *
     * @param eachEvent
     * @param next
     */
    var isNotRead = function (eachEvent, next) {
        chrome.storage.sync.get('lastEventId', function (data) {
            if (!data.lastEventId || eachEvent.id > data.lastEventId) {
                next(eachEvent);
            }
        });
    };

    chrome.alarms.onAlarm.addListener(function (alarm) {
        console.log('Checking for new notifications...');

        spk.lib.getEvents(function (err, events) {

            if (err) {
                console.error('Can\'t get GitHub\'s events: %s', err);
            } else {
                chrome.storage.sync.get(undefined, function (storage) {
                    if (storage.branches) {
                        spk.properties.push_branches = storage.branches;
                    }

                    if (storage.issues) {
                        spk.properties.issues_action = storage.issues;
                    }

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
                                    iconUrl: notification.icon || 'img/megaphone17-256.png'
                                };

                                chrome.notifications.create(dto.id, notificationOptions, function (notificationId) {
                                    var options = {};
                                    options[notificationId] = notification.link;
                                    chrome.storage.local.set(options);
                                });
                            } else {
                                console.log('WARN: Event id %s (%s) was NOT handled', eachEvent.id, eachEvent.type);
                            }
                        });
                    }

                    syncLastEventRead(events[0]);
                });
            }
        });
    });

    if (spk.properties.testing) {
        chrome.storage.sync.clear();
        chrome.storage.sync.set({'username': 'barriosnahuel'}, undefined);
    }

    chrome.alarms.create('', {
        when: Date.now(),
        periodInMinutes: spk.properties.testing ? undefined : 1
    });

}).fail(function (jqXHR, textStatus, errorThrown) {
    console.error(errorMessage);
});