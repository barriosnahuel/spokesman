# spokesman
It's a GitHub's notifications interpreter for Chrome

## Screenshots

[Here](https://drive.google.com/folderview?id=0B6AWn1xLDRvPT0NjaXRJWElvOGc&usp=sharing)

## Use it

1. Clone this repo in your favourite directory.
2. Open Chrome and go to `chrome://extensions`
3. Assure **Developer mode** is checked, if not then check it.
4. Click on **Load unpacked extension**, then select the root directory of the cloned repository.
5. Go to **Develop and testing** section at the end of this file.
5. [Still in development] Now simply click on the octocat at the top-right corner of the browser and configure your username and your personal access token ([HowTo](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)) with `repo` permission enabled.

**Important:** Take into account that for private repos your access token *must* have the `repo` permission enabled.

## Manifest notes

### content_security_policy

It is required because of jsrender. If 

`script-src 'self' 'unsafe-eval'; object-src 'self'`

is not present, then it fails and log:

> Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of
  script in the following Content Security Policy directive: "default-src 'self'". Note that
  'script-src' was not explicitly set, so 'default-src' is used as a fallback.
  
## Supported events

The following events are those ones that are firing desktop notifications right now. We are working hard to add more events as soon as possible!

- CreateEvent
- DeleteEvent
- IssueCommentEvent
- IssuesEvent
- PullRequestEvent
- PullRequestReviewCommentEvent
- PushEvent
- ReleaseEvent

To see the full list of events published by the GitHub API take a look to [this link](https://developer.github.com/v3/activity/events/types/).

## Develop and testing

You must create a `local-properties.json` file in the root directory (just next to this file) containing:
 - `testing` <= Important flag to prevent checking for new events once a minute.
 - `username` <= Your GiHub's username.
 - `access_token` <= Your personal access token with `repo` permission checked. Take a look to [this link](http://lmgtfy.com/?q=github+access+token) ([or this ](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)) to create your access token.
 - `push_branches` <= Whitelist with branches that fire notifications after any `PushEvent`.
 - `issue_actions` <= Whitelist with actions over issues that fire notifications after any `IssuesEvent`. See `action` [here](https://developer.github.com/v3/activity/events/types/#issuesevent) for more information.
  
Sample file:

```json
{
    "testing": true,
    "username": "barriosnahuel",
    "access_token": "<ACCESS_TOKEN>",
    "push_branches": [
        "master",
        "develop",
        "development"
    ],
    "issues_action": [
        "opened",
        "closed",
        "reopened"
    ]
}
```

## Used libraries

- https://www.getbootstrap.com
- https://www.jquery.com
- https://www.jsviews.com
- https://www.bootstraptoggle.com