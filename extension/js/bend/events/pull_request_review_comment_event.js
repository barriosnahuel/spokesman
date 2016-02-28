/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.pullRequestReviewCommentEvent = (function () {

    var parseGitHubEvent = function (event) {
        return {
            text: event.payload.comment.body
            , link: event.payload.comment.html_url
            , file: event.payload.comment.path.substring(event.payload.comment.path.lastIndexOf('/') + 1)
            , pullRequest: {
                number: event.payload.pull_request.number
                , title: event.payload.pull_request.title
            }
        };
    };

    var buildNotification = function (dto) {
        return {
            title: dto.actor.username + ' said on ' + dto.payload.pullRequest.title
            , message: '"' + dto.payload.text + '"'
            , contextMessage: spk.util.buildNotificationContext([
                dto.repo
                , '#' + dto.payload.pullRequest.number
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