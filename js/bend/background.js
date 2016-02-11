/**
 * Created by Nahuel Barrios on 28/12/15.
 */
var spk = spk || {};

(function () {

    var isProcessingQueue;

    var onExtensionInstalledOrUpdated = function (details) {
        console.info('Running onInstalled, reason: %s', details.reason);
        console.info('Previous version: %s', details.previousVersion);

        if (details.reason === 'install') {
            chrome.tabs.create({
                url: 'views/settings.html'
            }, undefined);
        }
    };

    var fireDesktopNotification = function (notification) {
        var notificationOptions = {
            type: 'basic',
            title: notification.title,
            message: notification.message,
            contextMessage: notification.contextMessage,
            iconUrl: notification.icon || 'img/megaphone17-256.png'
        };

        chrome.notifications.create(notification.id, notificationOptions, function (notificationId) {
            var options = {};
            options[notificationId] = notification.link;
            chrome.storage.local.set(options);
        });
    };

    var saveQueue = function (queue) {
        chrome.storage.local.set({'queue': queue}, undefined);
        console.debug('Saved queue w/ size: %d', queue.length);
    };

    var scheduleNotifications = function (notifications) {
        chrome.storage.local.get('queue', function (storage) {
            var queue = storage.queue || [];
            queue = queue.concat(notifications);
            saveQueue(queue);
        });
    };

    var processEvent = function (eachEvent) {
        var dto = spk.events.manager.parse(eachEvent);
        var notification;

        if (dto && spk.events.manager.shouldProcess(dto)) {
            notification = spk.events.manager.buildNotification(dto);
        } else {
            console.info('Event id %s (%s) was NOT handled because of user configuration', eachEvent.id, eachEvent.type);
        }

        return notification;
    };

    var onNotificationClicked = function (notificationId) {
        chrome.storage.local.get(notificationId, function (data) {

            if (data[notificationId]) {
                chrome.tabs.create({
                    url: data[notificationId]
                }, function () {
                    chrome.notifications.clear(notificationId);
                });
            }
        });
    };

    var dequeue = function () {
        chrome.storage.local.get('queue', function (storage) {
            var queue = storage.queue || [];

            if (queue.length > 0) {
                var nextNotification = queue.shift();

                fireDesktopNotification(nextNotification);

                saveQueue(queue);
            }
        });
    };

    var onNotificationClosed = function (notificationId, byUser) {
        chrome.storage.local.remove(notificationId, undefined);

        /**
         * If the notification was closed by the user, then we wait for the next alarm to be fired before displaying another notification.
         */
        if (byUser) {
            isProcessingQueue = false;
        } else {
            isProcessingQueue = true;
            dequeue();
        }
    };

    var onAlarmFired = function (alarm) {
        runAPICall();

        setTimeout(processQueue, 5000);
    };

    var runAPICall = function () {
        console.debug('==> runAPICall...');

        console.info('Checking for new notifications...');

        spk.lib.getEvents(function (err, events) {

            var mergeEvents = function (lastEventId, events) {
                var mergedEvents = [];
                var decrement = 1;
                for (var i = events.length - 1; i >= 0; i -= decrement, decrement = 1) {
                    var currentEvent = events[i];

                    if (lastEventId && currentEvent.id <= lastEventId) {
                        console.debug('Skipping event %s because last read event is %s.', currentEvent.id, lastEventId);
                    } else {
                        var mergedEventsQuantity;

                        if (!mergedEventsQuantity) {
                            mergedEventsQuantity = spk.events.custom.issuesEvent.check(events, i, currentEvent);
                        }

                        if (mergedEventsQuantity) {
                            decrement = mergedEventsQuantity;
                        }

                        mergedEvents.push(currentEvent);
                    }
                }

                return mergedEvents;
            };

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

                    var mergedEvents = mergeEvents(storage.lastEventId, events);

                    var notifications = [];
                    for (var i = mergedEvents.length - 1; i >= 0; i--) {
                        var eachMergedEvent = mergedEvents[i];

                        var notification = processEvent(eachMergedEvent);
                        if (notification) {
                            notifications.push(notification);
                        }
                    }

                    console.debug('Created %d/%d notifications based on API response.', notifications.length, events.length);
                    scheduleNotifications(notifications);

                    console.info('Last event/notification read %s', events[0].id);
                    chrome.storage.sync.set({'lastEventId': events[0].id}, undefined);
                });
            }
        });
    };

    var processQueue = function () {
        console.debug('==> processQueue...');

        if (isProcessingQueue) {
            console.debug('Queue is already being processed.')
        } else {
            console.debug('Start queue process because of a new alarm.');
            dequeue();
        }
    };

    // END-Declaring methods //////////////////////////////////////////////////////////////////

    // ----------------------------------------------------------------------------------------

    // START-Event page flow //////////////////////////////////////////////////////////////////

    chrome.runtime.onInstalled.addListener(onExtensionInstalledOrUpdated);

    $.ajax({
        url: 'properties.json',
        dataType: 'json',
        async: false
    }).done(function (properties) {
        console.info('Properties file loaded OK');
        spk.properties = properties;

        chrome.notifications.onClicked.addListener(onNotificationClicked);

        chrome.notifications.onClosed.addListener(onNotificationClosed);

        chrome.alarms.onAlarm.addListener(onAlarmFired);

        if (spk.properties.testing) {
            chrome.storage.sync.clear();
            chrome.storage.sync.set({'username': 'barriosnahuel'}, undefined);
            chrome.storage.local.set({'queue': []}, undefined);
        }

        chrome.alarms.create('', {
            when: Date.now(),
            periodInMinutes: spk.properties.testing ? undefined : 1
        });

    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error(textStatus);
    });

}());