sap.ui.define([], function () {
    "use strict";

    return {

        formatPriceImage: function(param) {
            var link = $.sap.getModulePath("geinfo.geinfo", "/images/")
            if (typeof param === "number") {
                return link;
            } else {
                // Provide a default image or an empty string if imageUrl is empty
                return "";
            }
        }

    };

});