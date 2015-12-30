# spokesman
It's a GitHub's notifications interpreter for Chrome

## manifest notes

### content_security_policy

It is required because of jsrender. If 

`script-src 'self' 'unsafe-eval'; object-src 'self'`

is not present, then it fails and log:

> Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of
  script in the following Content Security Policy directive: "default-src 'self'". Note that
  'script-src' was not explicitly set, so 'default-src' is used as a fallback.
  
## supported events
- IssueCommentEvent (pueden ser en un PR, cuando no es por CR)
 - payload.issue.number => 123
 - payload.issue.title => "hacer algo"
 - payload.action => "created"
 - payload.comment.html_url => "el link al comentario"
 - payload.comment.body => "este es el comentario posta"
 - payload.issue.pull_request => object => si != null ==> es un PR y no un issue
- PushEvent
 - payload.commits => []
 - payload.ref => "refs/heads/develop"
- PullRequestEvent
 - payload.action => "closed"
 - payload.number => 123
 - payload.pull_request.title => "el titulo"
 - payload.pull_request.additions => 3
 - payload.pull_request.deletions => 2
 - payload.pull_request.commits => 5
 - payload.pull_request.merged => true
 - payload.pull_request.html_url => "mobile-android/pulls/123"
- DeleteEvent
 - payload.ref_type => "branch"
 - payload.ref => "release-test (el nombre de mi branch)"
- CreateEvent
 - payload.ref_type => "tag"
 - payload.ref => "v1.2.3-alpha"
 - payload.master_branch => "develop"
- ReleaseEvent
 - payload.action => "published"
 - payload.release.html_url => "mobile-android/releases/123"
 - payload.release.name => "Release 1.2.3"
 - payload.release.tag_name => "v1.2.3-alpha"
- PullRequestReviewCommentEvent
 - payload.action => "created"
 - payload.comment.body => "fallo travis"
 - payload.comment.html_url => "link al comentario ese"
 - payload.comment.path => "el path absoluto de la clase, incluyendo .java"
- IssuesEvent
 - payload.action => "opened"
 - payload.issue.title => "agregar checkstyle"
 - payload.issue.html_url => "el link"
 - payload.issue.number => 123"

## used libraries

- https://www.getbootstrap.com
- https://www.jquery.com
- https://www.jsviews.com