/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.deleteEvent = (function () {

    var parseGitHubEvent = function (event) {
        return {
            branch: event.payload.ref
            , type: event.payload.ref_type
        };
    };

    var buildNotification = function (dto) {
        var result;

        switch (dto.payload.type) {
            case 'tag':
                result = {
                    title: 'Deleted tag: ' + dto.payload.branch
                    , message: 'By ' + dto.actor.username
                    , contextMessage: spk.util.buildNotificationContext([
                        dto.repo
                    ])
                };
                break;
            case 'branch':
                result = {
                    title: 'Deleted branch: ' + dto.payload.branch
                    , message: 'By ' + dto.actor.username
                    , contextMessage: spk.util.buildNotificationContext([
                        dto.repo
                    ])
                };
                break;
            default:
                console.log('WARN: CreateEvent %s is NOT mapped', dto.payload.ref_type);
                break;
        }

        return result;
    };

    return {
        parse: parseGitHubEvent,
        buildNotification: buildNotification
    };
}());