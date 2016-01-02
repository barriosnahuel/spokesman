/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.releaseEvent = (function () {

    var parseGitHubEvent = function (event) {
        return {
            action: event.payload.action
            , name: event.payload.release.name
            , tag: event.payload.release.tag_name
            , link: event.payload.release.html_url
        };
    };

    var buildNotification = function (dto) {

        return {
            title: 'Release ' + dto.payload.action + ' by ' + dto.actor.username
            , message: dto.payload.name
            , contextMessage: spk.util.buildNotificationContext([
                dto.repo
                , 'Tag: ' + dto.payload.tag
            ])
            , link: dto.payload.link
        };
    };

    return {
        parse: parseGitHubEvent,
        buildNotification: buildNotification
    };
}());