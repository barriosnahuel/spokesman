/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.issueCommentEvent = (function () {

    var parseGitHubEvent = function (event) {
        return {
            text: event.payload.comment.body
            , url: event.payload.comment.html_url
            , issue: {
                number: event.payload.issue.number
                , title: event.payload.issue.title
            }
        };
    };

    var buildNotification = function (dto) {
        return {
            title: dto.actor.username + ' said on ' + dto.payload.issue.title
            , message: dto.payload.text
            , contextMessage: spk.util.buildNotificationContext([
                dto.repo
                , '#' + dto.payload.issue.number
            ])
        };
    };

    return {
        parse: parseGitHubEvent,
        buildNotification: buildNotification
    };
}());