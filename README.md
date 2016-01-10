# spokesman
It's a GitHub's notifications interpreter for Chrome

## Screenshots

[Here](https://drive.google.com/folderview?id=0B6AWn1xLDRvPT0NjaXRJWElvOGc&usp=sharing)

## Use it

1. Clone this repo in your favourite directory.
2. Open Chrome and go to `chrome://extensions`
3. Assure **Developer mode** is checked, if not then check it.
4. Click on **Load unpacked extension**, then select the root directory of the cloned repository.
5. Setup your username and personal access token on the settings page.

**Important:** Take into account that for private repos your access token *must* have the `repo` permission enabled.

## Manifest notes

### content_security_policy

It is required because of jsrender. If 

`script-src 'self' 'unsafe-eval'; object-src 'self'`

is not present, then it fails and log:

> Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of
  script in the following Content Security Policy directive: "default-src 'self'". Note that
  'script-src' was not explicitly set, so 'default-src' is used as a fallback.
  
### icons

Icons were taken from:
- Extension icon: [here](http://www.iconsdb.com/black-icons/github-9-icon.html).
- Browser action and favicon: [here](http://www.flaticon.com/free-icon/github-logo-face_37819#term=github&page=1&position=19).

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

Edit `properties.json` file in the root directory (just next to this file) and add
 - `"testing": true` <= It's an important flag to prevent checking for new events once a minute.
 
  
Sample file:

```json
{
    "testing": true,
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
