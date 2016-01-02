/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.pushEvent = (function () {

    var parseGitHubEvent = function (event) {
        return {
            commitsQuantity: event.payload.size,
            branch: event.payload.ref.substring('refs/heads/'.length)
        };
    };

    var shouldProcess = function (dto) {
        return !spk.properties.push_branches || spk.properties.push_branches.indexOf(dto.payload.branch) >= 0;
    };

    var buildNotification = function (dto) {
        return {
            title: dto.payload.commitsQuantity + (dto.payload.commitsQuantity === 1 ? ' commit' : ' commits') + ' pushed by ' + dto.actor.username,
            message: 'on branch ' + dto.payload.branch,
            contextMessage: spk.util.buildNotificationContext([
                dto.repo
            ])
        };
    };

    return {
        parse: parseGitHubEvent,
        shouldProcess: shouldProcess,
        buildNotification: buildNotification
    };
}());