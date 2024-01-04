sap.ui.define([], function () {
    "use strict";

    return {

        formatImage: function(imageUrl) {
            if (imageUrl) {
                return `<img src="${imageUrl}" style="width:50px;height:50px" / >` ;
            } else {
                // Provide a default image or an empty string if imageUrl is empty
                return "";
            }
        }

    };

});