/**
 * Created by justkenchu on 26/12/15.
 */

var spk = spk || {};

chrome.tabs.create({
    url: 'views/settings.html'
}, undefined);

//$(document).ready(function () {
//    console.log('==>document.ready');
//
//    spk.lib.helloWorld();
//    spk.templates.register();
//
//    var quantity = $('.spk-quantity');
//    var list = $('#notifications');
//
//    spk.lib.getFeed(function (err, notifications) {
//        if (err) {
//            alert('error!!');
//        } else {
//            quantity.text(notifications.length);
//
//            for (var i = 0; i < notifications.length; i++) {
//                var html;
//                if (i % 2 == 0) {
//                    html = $.render.comment({
//                        user: 'Nahuel Barrios'
//                    });
//                } else {
//                    html = $.render.branchUpdate({
//                        user: 'Nahuel Barrios'
//                    });
//                }
//
//                list.append('<li>' + html + '</li>');
//            }
//        }
//    });
//});