# spokesman
It's a GitHub's notifications interpreter for Chrome

[![version](https://img.shields.io/github/release/barriosnahuel/spokesman.svg)](chrome.google.com/webstore/detail/epemkmimdjecaegobcafcblljdjjicpm)
[![Semver](http://img.shields.io/SemVer/2.0.0.png)](http://semver.org/spec/v2.0.0.html)
[![experimental](https://img.shields.io/badge/stability-experimental-yellow.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![Code Climate](https://codeclimate.com/github/barriosnahuel/spokesman/badges/gpa.svg)](https://codeclimate.com/github/barriosnahuel/spokesman)
[![Issue Count](https://codeclimate.com/github/barriosnahuel/spokesman/badges/issue_count.svg)](https://codeclimate.com/github/barriosnahuel/spokesman)

## Project status

[![Throughput Graph](https://graphs.waffle.io/barriosnahuel/spokesman/throughput.svg)](https://waffle.io/barriosnahuel/spokesman/metrics)

Working on: [![Issues ready to take](https://badge.waffle.io/barriosnahuel/spokesman.png?label=ready&title=Ready)](https://waffle.io/barriosnahuel/spokesman)

## Screenshots

See [listing](https://goo.gl/vBtHnG) in Chrome's store.

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
- WatchEvent

To see the full list of events published by the GitHub API take a look to [this link](https://developer.github.com/v3/activity/events/types/).

## Manifest notes

### content_security_policy

It is required because of jsrender. If 

`script-src 'self' 'unsafe-eval'; object-src 'self'`

is not present, then it fails and log:

> Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of
  script in the following Content Security Policy directive: "default-src 'self'". Note that
  'script-src' was not explicitly set, so 'default-src' is used as a fallback.

  
## Contributing

### Setup your Chrome

1. Clone this repo in your favourite directory.
2. Open Chrome and go to `chrome://extensions`
3. Assure **Developer mode** is checked, if not then check it.
4. Click on **Load unpacked extension**, then select the `extension` directory of the cloned repository.
5. Setup your username and personal access token on the settings page.

**Important:** Take into account that for private repositories your access token *must* have the `repo` permission enabled.

### Configure properties file
Edit `properties.json` file in the root directory (just next to this file) and add
 - `"testing": true` <= It's an important flag to prevent checking for new events once a minute.

### icons

Icons were taken from [here](http://www.iconsdb.com/black-icons/megaphone-2-icon.html) and [here](http://www.flaticon.com/free-icon/leader-with-loudspeaker_75899#term=megaphone&page=1&position=12).
In the other hand, event's icons were taken from:
- Branch: [here](http://www.flaticon.com/free-icon/code-fork-symbol_25406#term=software&page=1&position=22).
- Tag: [here](http://www.flaticon.com/free-icon/black-shop-tag_16260#term=tag&page=1&position=15).
- Comment: [here](http://www.flaticon.com/free-icon/comments_25360#term=comments&page=1&position=1).
- Repository: [here](http://www.flaticon.com/free-icon/data-management-interface-symbol-with-gears-and-binary-code-numbers_36094#term=code&page=1&position=1).
- Issue: [here](http://www.flaticon.com/free-icon/checked-list_13194#term=task&page=1&position=1).
- Issue labeled/unlabeled: [here](http://www.flaticon.com/free-icon/label_24141#term=label&page=1&position=11).
- Issue assigned: [here](http://www.flaticon.com/free-icon/new-user_72648#term=add-user&page=1&position=3).
- Issue unassigned: [here](http://www.flaticon.com/free-icon/remove-user_72830#term=delete-user&page=1&position=2).
- Pull Request: It's the same used for the branch rotated 180º.
- Release: [here](http://www.flaticon.com/free-icon/checkered-flag_62499#term=flag&page=2&position=23).
- Star: [here](http://www.flaticon.com/free-icon/mark-as-favorite-star_60973#term=star&page=1&position=3).

Colors:
- Opened: #6cc644
- Closed: #bd2c00
- Merged: #6e5494
- Comments: #607d8b

Sizes:
- Single: 256px (original) ==> 200px (scaled-centered)
- Double: 128px

### Used libraries

- https://www.getbootstrap.com
- https://www.jquery.com
- https://www.jsviews.com
- https://www.bootstraptoggle.com