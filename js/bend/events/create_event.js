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
                };
                break;
            case 'tag':
                result = {
                    commitsQuantity: event.payload.commits.length,
                    branch: event.payload.ref
                };
                break;
            case 'branch':
                result = {
                    branch: event.payload.ref
                };
                break;
            default:
                console.log('WARN: CreateEvent %s is NOT mapped', dto.payload.ref_type);
                break;
        }

        result.type = event.payload.ref_type;

        return result;
    };

    var buildNotification = function (dto) {
        var result;

        switch (dto.payload.type) {
            case 'repository':
                result = {
                    title: dto.actor.username + ' created repository: ' + dto.repo,
                    message: dto.payload.description,
                    contextMessage: undefined
                };
                break;
            case 'tag':
                result = {
                    title: dto.actor.username + ' pushed ' + dto.payload.commitsQuantity + (dto.payload.commitsQuantity === 1 ? ' commit' : ' commits'),
                    message: 'on branch ' + dto.payload.branch,
                    contextMessage: undefined
                };
                break;
            case 'branch':
                result = {
                    title: dto.actor.username + ' created branch: ' + dto.payload.branch,
                    message: 'on repo ' + dto.repo,
                    contextMessage: undefined
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