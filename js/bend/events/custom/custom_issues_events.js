/**
 * Created by Nahuel Barrios on 11/02/16.
 */
var spk = spk || {};
spk.events = spk.events || {};
spk.events.custom = spk.events.custom || {};

spk.events.custom.issuesEvents = (function () {

    var check = function (events, index, currentEvent) {
        var decrement;

        if (currentEvent.type === 'IssueCommentEvent' && index - 1 >= 0) {
            var nextEvent = events[index - 1];
            if (nextEvent.type === 'IssuesEvent'
                && nextEvent.payload.issue.number == currentEvent.payload.issue.number
                && (nextEvent.payload.action === 'closed' || nextEvent.payload.action === 'reopened')) {

                currentEvent.type += '+' + nextEvent.type;
                currentEvent.payload.action += '+' + nextEvent.payload.action;

                decrement = 2;
            }
        }

        return decrement;
    };

    return {
        check: check
    };
}());