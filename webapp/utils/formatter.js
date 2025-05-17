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
        },

        formatPrice: function (value) {
        if (value == null || isNaN(value)) return "";
        return Number(value).toLocaleString();
        },

        selectCoinIcon: function (value) {
        const num = Number(value);
        if (num > 1_000_000) {
            return "icons/Coins_10000.png";
        } else if (num > 100_000) {
            return "icons/Coins_250.png";
        } else {
            return "icons/Coins_5.png";
        }
        }


    };

});