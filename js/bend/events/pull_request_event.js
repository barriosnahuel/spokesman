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
            , link: event.payload.pull_request.html_url
        };
    };

    var buildNotification = function (dto) {
        var action = dto.payload.action === 'closed' && dto.payload.merged ? 'merged' : dto.payload.action;

        var icon;

        switch (action) {
            case 'opened':
                icon = 'img/events/pr-opened.png';
                break;
            case 'closed':
                icon = 'img/events/pr-closed.png';
                break;
            case 'merged':
                icon = 'img/events/pr-merged.png';
                break;
            default :
                console.log('Wow! We\'ve got a new PR action and it is NOT mapped a switch statement.');
                icon = undefined;
                break;
        }

        return {
            title: 'PR ' + action + ' by ' + dto.actor.username
            , message: dto.payload.title
            , contextMessage: spk.util.buildNotificationContext([
                dto.repo
                , '#' + dto.payload.number
                , '+' + dto.payload.additions + '/-' + dto.payload.deletions
            ])
            , link: dto.payload.link
            , icon: icon
        };
    };

    return {
        parse: parseGitHubEvent,
        buildNotification: buildNotification
    };
}());