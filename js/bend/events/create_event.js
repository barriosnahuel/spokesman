/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.createEvent = (function () {

    var parseGitHubEvent = function (event) {
        var result;

        switch (event.payload.ref_type) {
            case 'repository':
                result = {
                    description: event.payload.description
                    , link: 'https://github.com/' + event.repo.name
                };
                break;
            case 'tag':
                result = {
                    branch: event.payload.ref
                    , link: 'https://github.com/' + event.repo.name + '/releases/' + event.payload.ref
                };
                break;
            case 'branch':
                result = {
                    branch: event.payload.ref
                    , link: 'https://github.com/' + event.repo.name + '/tree/' + event.payload.ref
                };
                break;
            default:
                console.log('WARN: CreateEvent %s is NOT mapped', dto.payload.ref_type);
                break;
        }

        result.type = event.payload.ref_type;

        return result;
    };

    var shouldProcess = function (dto) {
        return !spk.properties.push_branches || dto.payload.type !== 'branch' || spk.properties.push_branches.indexOf(dto.payload.branch) >= 0;
    };

    var buildNotification = function (dto) {
        var result;

        switch (dto.payload.type) {
            case 'repository':
                result = {
                    title: 'New repository: ' + dto.repo + ' by ' + dto.actor.username
                    , message: dto.payload.description
                    , contextMessage: spk.util.buildNotificationContext([
                        dto.repo
                    ])
                    , link: dto.payload.link
                    , icon: 'img/events/repository-create.png'
                };
                break;
            case 'tag':
                result = {
                    title: 'New tag: ' + dto.payload.branch
                    , message: 'from branch ' + dto.payload.branch
                    , contextMessage: spk.util.buildNotificationContext([
                        dto.repo
                    ])
                    , link: dto.payload.link
                    , icon: 'img/events/tag-create.png'
                };
                break;
            case 'branch':
                result = {
                    title: 'New branch: ' + dto.payload.branch
                    , message: 'By ' + dto.actor.username
                    , contextMessage: spk.util.buildNotificationContext([
                        dto.repo
                    ])
                    , link: dto.payload.link
                    , icon: 'img/events/branch-create.png'
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
        shouldProcess: shouldProcess,
        buildNotification: buildNotification
    };
}());