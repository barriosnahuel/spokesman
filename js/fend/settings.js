/**
 * Created by Nahuel Barrios on 06/01/16.
 */
var spk = spk || {};

$(document).ready(function () {

    $.templates("branchInput", "#branchInputTemplate");
    $.templates("supportedEvent", "#supportedEventTemplate");

    var $username = $('#username');
    var $accessToken = $('#accessToken');
    var $usernameCheck = $('#usernameCheck');
    var $accessTokenCheck = $('#accessTokenCheck');

    var $branchesList = $('#branches');
    var branches;
    var issues;
    var supportedEvents;

    render();
    addListeners();

    function render() {
        chrome.storage.sync.get('username', function (storage) {
            if (storage.username) {
                $username.val(storage.username);
                $usernameCheck.show();
            }
        });

        chrome.storage.local.get('accessToken', function (storage) {
            if (storage.accessToken) {
                $accessToken.val(storage.accessToken);
                $accessTokenCheck.show();
            }
        });

        chrome.storage.sync.get(undefined, function (storage) {
            branches = storage.branches || [];
            issues = storage.issues || [];
            supportedEvents = storage.supportedEvents;

            $.ajax({
                url: '../properties.json',
                dataType: 'json',
                async: false
            }).done(function (properties) {
                if (!storage.branches) {
                    branches = properties.push_branches;
                    saveBranches();
                }

                if (!storage.issues) {
                    issues = properties.issues_action;
                    saveIssues();
                }

                if (!supportedEvents) {
                    supportedEvents = properties.supported_events;
                    saveEnabledEvents();
                }

                addBranches();
                addIssuesActions();
                addSupportedEvents();
            });

            function addBranches() {
                for (var i = 0; i < branches.length; i++) {
                    addBranchInput(branches[i]);
                }

                addBranchInput();

                addBranchLastInputListener();
            }

            function addIssuesActions() {
                var $checkboxes = $('#issues').find('>li>ul>li input');
                for (var i = 0; i < $checkboxes.length; i++) {
                    var $each = $($checkboxes[i]);

                    if (issues.some(function (issueAction) {
                            return $each.val() === issueAction;
                        })) {
                        $each.bootstrapToggle('on');
                    }

                    $each.change(function () {
                        var $this = $(this);

                        if ($this.prop('checked')) {
                            issues.push($this.val());
                        } else {
                            issues.splice(issues.indexOf($this.val()), 1);
                        }

                        saveIssues();
                    });
                }
            }

            /**
             * This method is duplicated in background.js
             * @param supportedEvents
             * @param event
             * @returns {*}
             */
            function findEvent(supportedEvents, event) {
                var result;
                for (var j = 0; j < supportedEvents.length; j++) {
                    var eachSupportedEventType = supportedEvents[j];
                    if (eachSupportedEventType.event === event) {
                        result = eachSupportedEventType;
                        break;
                    }
                }
                return result;
            }

            function addSupportedEvents() {
                console.debug('==> addSupportedEvents');

                var $list = $('#supportedEvents');

                for (var i = 0; i < supportedEvents.length; i++) {
                    var eachEvent = supportedEvents[i];

                    $list.append($.render.supportedEvent(eachEvent));

                    var $checkbox = $list.find('input:last-child');
                    $checkbox.bootstrapToggle();
                    $checkbox.change(function () {
                        var $this = $(this);

                        var eventType = findEvent(supportedEvents, $this.val());
                        eventType.enabled = $this.prop('checked');

                        if (_gaq) {
                            if (eventType.enabled) {
                                _gaq.push(['_trackEvent', 'Event type', 'Enabled', eventType.event]);
                            } else {
                                _gaq.push(['_trackEvent', 'Event type', 'Disabled', eventType.event]);
                            }
                        } else {
                            console.warn('Analytics tracking is NOT working');
                        }

                        saveEnabledEvents();

                        console.dir(supportedEvents);
                    });
                }
            }
        });
    }

    function addListeners() {
        $username.focusout(function (event) {
            chrome.storage.sync.set({'username': event.target.value}, function () {
                $usernameCheck.show();
            });
        });

        $accessToken.focusout(function (event) {
            chrome.storage.local.set({'accessToken': event.target.value}, function () {
                $accessTokenCheck.show();
            });
        });
    }

    function addBranchInput(branchName) {

        var coolPlaceholders = [
            'feature/my-cool-feature'
            , 'hotfix/big-issue'
            , 'feature/other-feature'
            , 'feature/another-cool-feature'
            , 'hotfix/npe-in-object-dot-java'
            , 'feature/cook-some-hamburgers'
            , 'feature/give-me-another-chance'
            , 'release/with-bugs'
            , 'feature/tell-luke-im-his-father'
            , 'feature/the-no-feature'
            , 'hotfix/for-another-hotfix'
            , 'hotfix/its-britney-bitch'
            , 'hotfix/bieber-fever'
            , 'feature/galactic-tacos'
            , 'feature/im-not-beyonce'
        ];

        $branchesList.append($.render.branchInput({
            'name': branchName
            , 'placeholder': coolPlaceholders[Math.floor(Math.random() * coolPlaceholders.length)]
        }));

        var $lastItem = $($branchesList.find('li:last-child'));
        var $check = $lastItem.find('.spk-input-feedback');
        var $input = $lastItem.find('input');

        if (branchName) {
            $check.show();
        }

        $input.change(function (event) {
            var branch = $input.val();
            if (branches.indexOf(branch) < 0) {
                branches = $.makeArray($branchesList.find('input')).map(function (item) {
                    return item.value;
                }).filter(function (item) {
                    return item !== '';
                });

                saveBranches(function () {
                    $check.show();
                    if (branch == '') {
                        $lastItem.remove();
                    }
                });
            }
        });

        $lastItem.find('.glyphicon-remove').click(function (event) {
            if ($input.val() !== '') {
                branches.splice(branches.indexOf($input.val()), 1);
                saveBranches();
                $lastItem.remove();
            }
        });
    }

    function addBranchLastInputListener() {
        $branchesList.find('>li:last-child').focusin(function (event) {
            addBranchInput();

            $branchesList.find('>li:nth-child(n-1)').unbind();
            addBranchLastInputListener();
        });
    }

    var saveBranches = function (callback) {
        chrome.storage.sync.set({'branches': branches}, function () {
            if (callback) {
                callback();
            }
        });
    };

    var saveIssues = function (callback) {
        chrome.storage.sync.set({'issues': issues}, function () {
            if (callback) {
                callback();
            }
        });
    };

    var saveEnabledEvents = function (callback) {
        chrome.storage.sync.set({'supportedEvents': supportedEvents}, function () {
            if (callback) {
                callback();
            }
        });
    };
});