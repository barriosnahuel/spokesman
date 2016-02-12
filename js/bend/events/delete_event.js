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
            , link: 'https://github.com/' + event.repo.name + (event.payload.ref_type === 'tag' ? '/tags' : '/branches')
        };
    };

    var shouldProcess = function (dto) {
        return !spk.properties.push_branches || dto.payload.type !== 'branch' || spk.properties.push_branches.indexOf(dto.payload.branch) >= 0;
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
                    , link: dto.payload.link
                    , icon: 'img/events/tag-delete.png'
                };
                break;
            case 'branch':
                result = {
                    title: 'Deleted branch: ' + dto.payload.branch
                    , message: 'By ' + dto.actor.username
                    , contextMessage: spk.util.buildNotificationContext([
                        dto.repo
                    ])
                    , link: dto.payload.link
                    , icon: 'img/events/branch-delete.png'
                };
                break;
            default:
                console.warn('CreateEvent %s is NOT mapped', dto.payload.ref_type);
                break;
        }

        return result;
    };

    return {
        parse: parseGitHubEvent,
        shouldProcess: shouldProcess,
        buildNotification: buildNotification
    };
}());