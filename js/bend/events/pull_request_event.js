/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.pullRequestEvent = (function () {

    var parseGitHubEvent = function (event) {
        return {
            action: event.payload.action
            , merged: event.payload.pull_request.merged
            , title: event.payload.pull_request.title
            , number: event.payload.number
            , additions: event.payload.pull_request.additions
            , deletions: event.payload.pull_request.deletions
            , author: '@' + event.payload.pull_request.user.login
        };
    };

    var buildNotification = function (dto) {
        var action = dto.payload.action === 'closed' && dto.payload.merged ? 'merged' : dto.payload.action;

        return {
            title: 'PR ' + action + ' by ' + dto.actor.username
            , message: dto.payload.title
            , contextMessage: spk.util.buildNotificationContext([
                dto.repo
                , '#' + dto.payload.number
                , '+' + dto.payload.additions + '/-' + dto.payload.deletions
            ])
        };
    };

    return {
        parse: parseGitHubEvent,
        buildNotification: buildNotification
    };
}());