/**
 * Created by Nahuel Barrios on 28/12/15.
 */
var spk = spk || {};

chrome.alarms.onAlarm.addListener(function (alarm) {
    // Fire requests...

    spk.lib.getEvents(function (err, events) {

        if (err) {
            alert('Can\'t get GitHub\'s events');
        } else {
            console.log('quantity: %d', events.length);

            for (var i = 0; i < events.length; i++) {
                var eachEvent = events[i];

                if (eachEvent.type === 'IssueCommentEvent') {


                    var filteredEvent = {
                        id: eachEvent.id,
                        type: eachEvent.type,
                        repo: eachEvent.repo.name.substring(eachEvent.repo.name.indexOf('/') + 1),
                        actor: {
                            username: eachEvent.actor.login
                        },
                        issue: {
                            number: eachEvent.payload.issue.number,
                            title: eachEvent.payload.issue.title
                        },
                        payload: {
                            // IssueCommentEvent
                            text: eachEvent.payload.comment.body,
                            url: eachEvent.payload.comment.url
                        }
                    };

                    chrome.notifications.create(eachEvent.id, {
                        type: 'basic',
                        title: filteredEvent.actor.username + ' said on ' + filteredEvent.issue.title,
                        message: filteredEvent.payload.text,
                        contextMessage: filteredEvent.repo + ' | ' + '#' + filteredEvent.issue.number,
                        iconUrl: 'img/icon.png'
                    }, function (notificationId) {
                        // Do nothing...
                    });

                }
            }
        }
    });
});

chrome.alarms.create('', {
    when: Date.now()
    //periodInMinutes: 0.2
});