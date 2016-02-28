/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.issuesEvent = (function () {

    var parseGitHubEvent = function (event) {
        return {
            action: event.payload.action
            , title: event.payload.issue.title
            , number: event.payload.issue.number
            , link: event.payload.issue.html_url
        };
    };

    var shouldProcess = function (dto) {
        return !spk.properties.issues_action || spk.properties.issues_action.indexOf(dto.payload.action) >= 0;
    };

    var buildNotification = function (dto) {
        var icon;

        switch (dto.payload.action) {
            case 'closed':
                icon = 'img/events/issue-closed.png';
                break;
            case 'opened':
            case 'reopened':
                icon = 'img/events/issue-opened.png';
                break;
            case 'labeled':
                icon = 'img/events/issue-labeled.png';
                break;
            case 'unlabeled':
                icon = 'img/events/issue-unlabeled.png';
                break;
            case 'assigned':
                icon = 'img/events/issue-assigned.png';
                break;
            case 'unassigned':
                icon = 'img/events/issue-unassigned.png';
                break;
            default :
                console.warn('Wow! We\'ve got a new issue action and it is NOT mapped a switch statement.');
                icon = undefined;
                break;
        }

        return {
            title: 'Issue ' + dto.payload.action + ' by ' + dto.actor.username
            , message: dto.payload.title
            , contextMessage: spk.util.buildNotificationContext([
                dto.repo
                , '#' + dto.payload.number
            ])
            , link: dto.payload.link
            , icon: icon
        };
    };

    return {
        parse: parseGitHubEvent,
        shouldProcess: shouldProcess,
        buildNotification: buildNotification
    };
}());