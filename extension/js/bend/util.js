/**
 * Created by Nahuel Barrios on 02/01/16.
 */
var spk = spk || {};

spk.util = (function () {
    var buildNotificationContext = function (parts) {
        return parts.join(' | ');
    };

    return {
        buildNotificationContext: buildNotificationContext
    };
}());