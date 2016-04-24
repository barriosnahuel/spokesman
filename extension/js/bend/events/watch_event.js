/**
 * Created by Fdiazreal on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.watchEvent = (function () {

    var parseGitHubEvent = function (event, username) {
        var repoOwner = event.repo.name.substring(0, event.repo.name.indexOf('/'));

        var link;
        if (repoOwner === username) {
            link = spk.properties.github_web + event.actor.login
        } else {
            link = spk.properties.github_web + event.repo.name;
        }

        return {
            user: event.actor.login,
            repo: event.repo.name,
            link: link
        };
    };

    var buildNotification = function (dto) {

        return {
            title: dto.repo + ' was starred',
            message: 'By ' + dto.actor.username,
            contextMessage: spk.util.buildNotificationContext([
                dto.payload.repo
            ]),
            link: dto.payload.link,
            icon: 'img/events/repository-starred.png'
        };
    };

    return {
        parse: parseGitHubEvent,
        buildNotification: buildNotification
    };
}());