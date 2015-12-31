/**
 * Created by justkenchu on 26/12/15.
 */
var spk = spk || {};
spk.lib = (function () {

    var helloWorld = function () {
        console.log("hello world!");
    };

    var getEvents = function (callback) {

        // el header lo genero con como basic authentication con: username <username> y password <un access token de los de la web de github>; con esto no necesito el two-factor
        // en Java es:
        // String decoded = user + ":" + password;
        // return "Basic " + Base64.encodeToString(decoded.getBytes(), Base64.DEFAULT);

        //Access-Control-Allow-Origin: *
        //Access-Control-Expose-Headers: ETag, Link, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval
        //Access-Control-Allow-Credentials: true

        // Sin headers obtengo los públicos, pero necesito los headers para obtener los privados!

        $.ajax({
            url: 'https://api.github.com/users/barriosnahuel/received_events',
            //headers: [
            //{'Authorization': ''}
            //{'Access-Control-Allow-Origin': '*'},
            //{'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Authorization'}
            //]
        }).done(function (data, textStatus, jqXHR) {
            console.log('done!');
            console.dir(data);
            console.log('textStatus: %s', textStatus);
            console.dir(jqXHR);

            callback(undefined, dummyResponse);
            //callback(undefined, data);
        }).fail(function (jqXHR, textStatus, errorThrown) {

            // Request header field 0 is not allowed by Access-Control-Allow-Headers in preflight response.

            console.log('fail!');
            console.dir(jqXHR);
            console.log('textStatus: %s', textStatus);
            console.log('errorThrown: %s', errorThrown);

            callback(textStatus, dummyResponse);
        });
    };

    return {
        helloWorld: helloWorld,
        getEvents: getEvents
    };
}());

