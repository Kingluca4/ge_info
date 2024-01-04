sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../utils/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, formatter) {
        "use strict";

        return Controller.extend("geinfo.geinfo.controller.View1", {
            formatter: formatter,
            
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteView1").attachPatternMatched(this.onRouteMatched, this); 
                
            },

            onRouteMatched: function(oEvent, targetName) { 

                var link = $.sap.getModulePath("geinfo.geinfo", "/items-icons/");

                var oData = Object.values(this.getView().getModel("itemsData").getData()),
                    oModel = new JSONModel({});

                oData.forEach(ele => {
                    ele.icon = link + ele.id + ".png"
                });
                oModel.setData(oData);
                this.getView().setModel(oModel, "geItemsModel");
            },

        });
    });
