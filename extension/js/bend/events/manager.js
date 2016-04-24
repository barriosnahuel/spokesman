/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.manager = (function () {
    var KNOWN_EVENTS = [
        {id: 'CommitCommentEvent', event: spk.events.commitCommentEvent}
        , {id: 'CreateEvent', event: spk.events.createEvent}
        , {id: 'DeleteEvent', event: spk.events.deleteEvent}
        //, {id: 'DeploymentEvent', event: spk.events.deploymentEvent}
        //, {id: 'DeploymentStatusEvent', event: spk.events.deploymentStatusEvent}
        //, {id: 'DownloadEvent', event: spk.events.downloadEvent}
        //, {id: 'FollowEvent', event: spk.events.followEvent}
        //, {id: 'ForkEvent', event: spk.events.forkEvent}
        //, {id: 'ForkApplyEvent', event: spk.events.forkApplyEvent}
        //, {id: 'GistEvent', event: spk.events.gistEvent}
        //, {id: 'GollumEvent', event: spk.events.gollumEvent}
        , {id: 'IssueCommentEvent', event: spk.events.issueCommentEvent}
        , {id: 'IssuesEvent', event: spk.events.issuesEvent}
        , {id: 'IssueCommentEvent+IssuesEvent', event: spk.events.issueCommentEvent}
        //, {id: 'MemberEvent', event: spk.events.memberEvent}
        //, {id: 'MembershipEvent', event: spk.events.membershipEvent}
        //, {id: 'PageBuildEvent', event: spk.events.pageBuildEvent}
        //, {id: 'PublicEvent', event: spk.events.publicEvent}
        , {id: 'PullRequestEvent', event: spk.events.pullRequestEvent}
        , {id: 'PullRequestReviewCommentEvent', event: spk.events.pullRequestReviewCommentEvent}
        , {id: 'PushEvent', event: spk.events.pushEvent}
        , {id: 'ReleaseEvent', event: spk.events.releaseEvent}
        //, {id: 'RepositoryEvent', event: spk.events.repositoryEvent}
        //, {id: 'StatusEvent', event: spk.events.statusEvent}
        //, {id: 'TeamAddEvent', event: spk.events.teamAddEvent}
        , {id: 'WatchEvent', event: spk.events.watchEvent}
    ];

    var findEvent = function (type) {
        var event;
        for (var i = 0; i < KNOWN_EVENTS.length; i++) {
            var each = KNOWN_EVENTS[i];
            if (type === each.id) {
                event = each.event;
                break;
            }
        }

        if (!event) {
            console.warn('Unknown event type %s', type);
        }

        return event;
    };

    var parseBasicData = function (event) {
        return {
            id: event.id,
            type: event.type,
            repo: event.repo.name.substring(event.repo.name.indexOf('/') + 1),
            actor: {
                username: '@' + event.actor.login
            }
        };
    };

    /**
     * Parse basic data required for any kind of event, and also parses each specific event's data by calling the manager.js.
     * @param event The event to parse.
     * @param username The login name of the configured user.
     */
    var parse = function (event, username) {
        var result;

        var eventManager = findEvent(event.type);
        if (eventManager) {
            var payload = eventManager.parse(event, username);

            if (payload) {
                var dto = parseBasicData(event);
                dto.payload = payload;
                result = dto;
            } else {
                result = undefined;
            }
        }

        return result;
    };

    var buildNotification = function (dto) {
        var result = findEvent(dto.type).buildNotification(dto);

        result.id = dto.id;

        return result;
    };

    var shouldProcess = function (dto) {
        var event = findEvent(dto.type);

        // !event.shouldProcess because the function may not exist in many events.
        return !event.shouldProcess || event.shouldProcess(dto);
    };

    return {
        parse: parse,
        shouldProcess: shouldProcess,
        buildNotification: buildNotification
    };
}());