/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.manager = (function () {

    var KNOWN_EVENTS = [
        {id: 'IssueCommentEvent', event: spk.events.issueCommentEvent},
        {id: 'PushEvent', event: spk.events.pushEvent}
    ];

    var findEvent = function (type) {
        var event;
        for (var i = 0; i < KNOWN_EVENTS.length; i++) {
            var each = KNOWN_EVENTS[i];
            if (type === each.id) {
                event = each.event;
                break;
            }
        }

        if (!event) {
            console.log('Unknown event type %s', type);
        }

        return event;
    };

    var parseBasicData = function (event) {
        return {
            id: event.id,
            type: event.type,
            repo: event.repo.name.substring(event.repo.name.indexOf('/') + 1),
            actor: {
                username: event.actor.login
            }
        };
    };

    /**
     * ToDo: Add documentation!!
     * @param event
     */
    var parse = function (event) {
        var result;

        var eventManager = findEvent(event.type);
        if (eventManager) {
            var payload = eventManager.parse(event);

            if (payload) {
                var dto = parseBasicData(event);
                dto.payload = payload;
                result = dto;
            } else {
                result = undefined;
            }
        }

        return result;
    };

    var buildNotification = function (dto) {
        return findEvent(dto.type).buildNotification(dto);
    };

    return {
        parse: parse,
        buildNotification: buildNotification
    };
}());