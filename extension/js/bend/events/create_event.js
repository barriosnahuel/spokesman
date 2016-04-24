/**
 * Created by Nahuel Barrios on 29/12/15.
 */
var spk = spk || {};
spk.events = spk.events || {};

spk.events.createEvent = (function () {

    /**
     * Generates the entire web page for a specific GitHub section.
     * @param repo It should be the repo's owner and the repo name, like: "barriosnahuel/spokesman".
     * @param section The target section, like "releases".
     * @param branch You know what.
     * @returns {string} i.e.: https://github.com/barriosnahuel/spokesman/tree/develop
     */
    var buildRepoPage = function (repo, section, branch) {
        return spk.properties.github_web + repo + '/' + section + '/' + branch;
    };

    var parseGitHubEvent = function (event) {
        var result;

        switch (event.payload.ref_type) {
            case 'repository':
                result = {
                    description: event.payload.description
                    , link: spk.properties.github_web + event.repo.name
                };
                break;
            case 'tag':
            case 'branch':
                result = {
                    branch: event.payload.ref
                    , link: buildRepoPage(event.repo.name, event.payload.ref_type === 'tag' ? 'releases' : 'tree', event.payload.ref)
                };
                break;
            default:
                console.warn('CreateEvent %s is NOT mapped', dto.payload.ref_type);
                break;
        }

        result.type = event.payload.ref_type;

        return result;
    };

    var shouldProcess = function (dto) {
        return !spk.properties.push_branches || dto.payload.type !== 'branch' || spk.properties.push_branches.indexOf(dto.payload.branch) >= 0;
    };

    var buildNotification = function (dto) {
        var result;

        switch (dto.payload.type) {
            case 'repository':
                result = {
                    title: 'New repository: ' + dto.repo + ' by ' + dto.actor.username
                    , message: dto.payload.description
                    , contextMessage: spk.util.buildNotificationContext([
                        dto.repo
                    ])
                    , link: dto.payload.link
                    , icon: 'img/events/repository-create.png'
                };
                break;
            case 'tag':
                result = {
                    title: 'New tag: ' + dto.payload.branch
                    , message: 'from branch ' + dto.payload.branch
                    , contextMessage: spk.util.buildNotificationContext([
                        dto.repo
                    ])
                    , link: dto.payload.link
                    , icon: 'img/events/tag-create.png'
                };
                break;
            case 'branch':
                result = {
                    title: 'New branch: ' + dto.payload.branch
                    , message: 'By ' + dto.actor.username
                    , contextMessage: spk.util.buildNotificationContext([
                        dto.repo
                    ])
                    , link: dto.payload.link
                    , icon: 'img/events/branch-create.png'
                };
                break;
            default:
                console.warn('CreateEvent %s is NOT mapped', dto.payload.ref_type);
                break;
        }

        return result;
    };

    return {
        parse: parseGitHubEvent,
        shouldProcess: shouldProcess,
        buildNotification: buildNotification
    };
}());