/**
 * Created by Nahuel Barrios on 28/12/15.
 */
var spk = spk || {};

chrome.notifications.onClicked.addListener(function (notificationId) {
    alert('clicked on: ' + notificationId);
});

chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
    if (byUser) {
        console.log('notification %s %s', notificationId, ' closed by the user');
    } else {
        console.log('notification %s %s', notificationId, 'closed by the system');
    }
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    // Fire requests...

    spk.lib.getEvents(function (err, events) {

        if (err) {
            alert('Can\'t get GitHub\'s events');
        } else {
            console.log('quantity: %d', events.length);

            //var uniqueTypes = [];
            //for (var i = 0; i < events.length; i++) {
            //    var anEvent = events[i];
            //
            //    if (uniqueTypes.indexOf(anEvent.type) < 0) {
            //        uniqueTypes.push(anEvent.type);
            //    }
            //}
            //console.dir(uniqueTypes);

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
                        iconUrl: 'img/icon.png'
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
    when: Date.now()
    //periodInMinutes: 0.2
});