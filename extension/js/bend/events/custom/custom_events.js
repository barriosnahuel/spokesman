/**
 * Created by Nahuel Barrios on 11/02/16.
 */
/**
 * Created by Nahuel Barrios on 11/02/16.
 */
var spk = spk || {};
spk.events = spk.events || {};
spk.events.custom = spk.events.custom || {};

spk.events.custom.isSameIssue = function (currentEvent, nextEvent) {
    return nextEvent.type === 'IssuesEvent' && nextEvent.payload.issue.number == currentEvent.payload.issue.number;
};

spk.events.custom.isSamePullRequest = function (currentEvent, nextEvent) {
    return nextEvent.type === 'PullRequestEvent' && nextEvent.payload.pull_request.number == currentEvent.payload.issue.number;
};

spk.events.custom.isSameActor = function (currentEvent, nextEvent) {
    return currentEvent.actor.login === nextEvent.actor.login;
};
