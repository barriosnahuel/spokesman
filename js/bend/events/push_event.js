/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.pushEvent = (function () {

    var parseGitHubEvent = function (event) {
        return {
            commitsQuantity: event.payload.commits.length,
            branch: event.payload.ref
        };
    };

    var buildNotification = function (dto) {
        return {
            title: dto.actor.username + ' pushed ' + dto.payload.commitsQuantity + (dto.payload.commitsQuantity === 1 ? ' commit' : ' commits'),
            message: 'on branch ' + dto.payload.branch,
            contextMessage: undefined
        };
    };

    return {
        parse: parseGitHubEvent,
        buildNotification: buildNotification
    };
}());