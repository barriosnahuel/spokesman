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
        };
    };

    var shouldProcess = function (dto) {
        return !spk.properties.issues_action || spk.properties.issues_action.indexOf(dto.payload.action) >= 0;
    };

    var buildNotification = function (dto) {
        return {
            title: 'Issue ' + dto.payload.action + ' by ' + dto.actor.username
            , message: dto.payload.title
            , contextMessage: spk.util.buildNotificationContext([
                dto.repo
                , '#' + dto.payload.number
            ])
        };
    };

    return {
        parse: parseGitHubEvent,
        shouldProcess: shouldProcess,
        buildNotification: buildNotification
    };
}());