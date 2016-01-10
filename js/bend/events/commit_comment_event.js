/**
 * Created by Nahuel Barrios on 10/01/16.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.commitCommentEvent = (function () {

    var parseGitHubEvent = function (event) {
        return {
            text: event.payload.comment.body
            , link: event.payload.comment.html_url
            , file: event.payload.comment.path.substring(event.payload.comment.path.lastIndexOf('/') + 1)
            // We show only the first 7 characters because that is what you see in short hashes: https://github.com/barriosnahuel/spokesman/commits/master
            , commitId: event.payload.comment.commit_id.substring(0, 7)
        };
    };

    var buildNotification = function (dto) {
        return {
            title: dto.actor.username + ' said on commit ' + dto.payload.commitId
            , message: dto.payload.text
            , contextMessage: spk.util.buildNotificationContext([
                dto.repo
                , dto.payload.file
            ])
            , link: dto.payload.link
            , icon: 'img/events/comments.png'
        };
    };

    return {
        parse: parseGitHubEvent,
        buildNotification: buildNotification
    };
}());