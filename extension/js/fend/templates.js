/**
 * Created by justkenchu on 26/12/15.
 */
/**
 * Created by justkenchu on 26/12/15.
 */
var spk = spk || {};
spk.templates = (function () {

    var registerTemplates = function () {
        $.templates("comment", "#commentTemplate");
        $.templates("branchUpdate", "#branchUpdateTemplate");
    };

    return {
        register: registerTemplates
    };
}());