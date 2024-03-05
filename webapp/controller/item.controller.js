sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../utils/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Formatter, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("geinfo.geinfo.controller.View1", {
            formatter: Formatter,
            
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.getRoute("RouteItem").attachPatternMatched(this.onRouteMatched, this);

                    this.getView().setModel(new JSONModel(), "priceModel");
            },

            onRouteMatched: function(oEvent, targetName) { 


                var oArgs = oEvent.getParameter("arguments"),
                oSelectedItem = {
                    id: oArgs.id,
                    name: oArgs.name,
                    members: oArgs.members,
                    equipable: oArgs.equipable,
                    noteable: oArgs.noteable
                },

                oTemp = this.getView().getModel("temp");

                if (!oSelectedItem.icon) {
                    oSelectedItem.icon = $.sap.getModulePath("geinfo.geinfo", "/items-icons/") + oSelectedItem.id + ".png";
                }

                oTemp.setProperty("/selectedItem", oSelectedItem);
                this.getView().setModel(oTemp, "temp");
                this.fetchPriceData(oSelectedItem.id);
            },

            fetchPriceData: function(itemId) {
                // API endpoint for detailed item information
                var apiUrl = "https://secure.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?item=" + itemId;
            
                // Fetch data from the API
                fetch(apiUrl, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                      'Access-Control-Allow-Origin': '*',
                      // Add other headers if required
                    },
                  })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Set the price data to the model
                        this.getView().getModel("priceModel").setData(data);
            
                        // Update the binding path for High Price and Low Price Text elements
                        this.getView().byId("highPriceText").bindText({
                            path: "priceModel>/item/high"
                        });
            
                        this.getView().byId("lowPriceText").bindText({
                            path: "priceModel>/item/low"
                        });
            
                        this.getView().byId("description").bindText({
                            path: "priceModel>/item/description"
                        });
                        this.getView().byId("currentPrice").bindText({
                            path: "priceModel>/item/current/price"
                        });
            
                        // Refresh the model to reflect the changes
                        this.getView().getModel("priceModel").refresh();
                    })
                    .catch(error => {
                        console.error("Error fetching price data:", error);
                    });
            },
            
                    setPriceImage: function(amount) {
                        // Get the Image control
                        var imageControl = this.getView().byId("highPriceImage");
                    
                        // Set the image source based on the amount
                        if (amount > 100000) {
                            var imagePath = $.sap.getModulePath("geinfo.geinfo", "/images/highprice.png");
                            imageControl.setSrc(imagePath);
                        } else {
                            var imagePath = $.sap.getModulePath("geinfo.geinfo", "/images/lowpriceprice.png");
                            imageControl.setSrc(imagePath);
                        }
                    },

                    onExit: function () {
                        // Clear the data when leaving the view
                        this.getView().getModel("priceModel").setData({});
                    },

            onButtonClick: function(){
                
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteView1");
            },

        });
    });