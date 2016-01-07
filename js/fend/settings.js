/**
 * Created by Nahuel Barrios on 06/01/16.
 */
$(document).ready(function () {

    var username = $('#username');
    var accessToken = $('#accessToken');

    render();
    addListeners();

    function render() {
        chrome.storage.sync.get('username', function (storage) {
            if (storage.username) {
                username.val(storage.username);
            }
        });

        chrome.storage.local.get('accessToken', function (storage) {
            if (storage.accessToken) {
                accessToken.val(storage.accessToken);
            }
        });
    }

    function addListeners() {
        username.focusout(function (event) {
            chrome.storage.sync.set({'username': event.target.value}, undefined);
        });

        accessToken.focusout(function (event) {
            chrome.storage.local.set({'accessToken': event.target.value}, undefined);
        });

    }
});