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
                    this.getView().setModel(new JSONModel(), "itemModel");
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
                this.getItemInfo(oSelectedItem.id, oSelectedItem.name);
            },

            formatNameIfNeeded: function(sName){
                if (sName.includes(" ")) {
                    // Replace all spaces with underscores
                    sName = sName.replace(/ /g, "_");
                }

                return sName;
            },

            getItemInfo: async function(sId, sName){
                await this.fetchPriceData(sId);
                await this.fetchDescrData(this.formatNameIfNeeded(sName));
            },

            fetchDescrData: async function(sName){
                const url = `https://oldschool.runescape.wiki/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(sName)}`;
                const res = await fetch(url);
                const json = await res.json();
                const pages = json.query.pages;
                const page = Object.values(pages)[0];
                this.getView().getModel("itemModel").setData(page);
            },

            fetchPriceData: function(itemId) {

                 var apiUrl = "https://prices.runescape.wiki/api/v1/osrs/latest?id=" + itemId;

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
                        this.getView().getModel("priceModel").setData(data.data[itemId]);
            
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