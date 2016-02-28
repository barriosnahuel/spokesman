/**
 * Created by Nahuel Barrios on 11/02/16.
 */
var spk = spk || {};
spk.events = spk.events || {};
spk.events.custom = spk.events.custom || {};

spk.events.custom.pullRequestsEvents = (function () {

    var check = function (events, index, currentEvent) {
        var decrement;

        var containsSameLatestCommit = function (pullRequestEvent, pushEvent) {
            var commitShaFromPullRequestEvent = pullRequestEvent.payload.pull_request.head.sha;
            var commitShaFromPushEvent = pushEvent.payload.commits[pushEvent.payload.commits.length - 2].sha;

            return commitShaFromPullRequestEvent === commitShaFromPushEvent;
        };

        var isPullRequestClosedAndMerged = function (currentEvent) {
            return currentEvent.payload.action === 'closed' && currentEvent.payload.pull_request.merged;
        };

        var isPushToTheSameBranch = function (currentEvent, nextEvent) {
            return currentEvent.payload.pull_request.base.ref === nextEvent.payload.ref.substring(nextEvent.payload.ref.lastIndexOf('/') + 1)
        };

        if (currentEvent.type === 'PullRequestEvent' && index - 1 >= 0) {
            var nextEvent = events[index - 1];
            if (isPullRequestClosedAndMerged(currentEvent)
                && spk.events.custom.isSameActor(currentEvent, nextEvent)
                && isPushToTheSameBranch(currentEvent, nextEvent)
                && containsSameLatestCommit(currentEvent, nextEvent)) {

                // The only action we take here is skipping nextEvent (PushEvent) because the user knows that merging a PR implies pushing to that branch.

                decrement = 2;
            }
        }

        return decrement;
    };

    return {
        check: check
    };
}());