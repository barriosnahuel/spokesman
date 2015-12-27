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
  
## used libraries

- https://www.getbootstrap.com
- https://www.jquery.com
- https://www.jsviews.com
- https://github.com/michael/github