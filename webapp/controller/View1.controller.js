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
    function (Controller, JSONModel, formatter, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("geinfo.geinfo.controller.View1", {
            formatter: formatter,
            
            onInit: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteView1").attachPatternMatched(this.onRouteMatched, this);

                var that = this;
                document.addEventListener("click", function playMusicOnce() {
                    var audio = document.getElementById("bgmusic");
                    if (audio) {
                    audio.volume = 0.2; // 🔉 Set volume (range is 0.0 to 1.0)
                    audio.play().catch(function (error) {
                        console.warn("Autoplay failed:", error);
                    });
                    }

                    document.removeEventListener("click", playMusicOnce);
                });

            },
            onAfterRendering: function () {
            this._makeShellBgTransparent();
            },

            _makeShellBgTransparent: function() {
            const bgDiv = document.querySelector(".sapShellBG.sapUiGlobalBackgroundImageForce");
            if (bgDiv) {
                bgDiv.style.backgroundColor = "transparent";
                bgDiv.style.backgroundImage = "none";
            } else {
                // Retry a little later if not found yet
                setTimeout(() => {
                this._makeShellBgTransparent();
                }, 100);
            }
            },

            onNavigateToPlayers: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("playersRoute"); // This matches the name in manifest.json
            },

            onRouteMatched: function(oEvent, targetName) { 
                var oArgs = oEvent.getParameter("arguments"),
                    oSelectedItem = oArgs.selectedItem,
                    link = $.sap.getModulePath("geinfo.geinfo", "/items-icons/"),
                    oData = Object.values(this.getView().getModel("itemsData").getData()),
                    oModel = new JSONModel({});

                oData.forEach(ele => {
                    ele.icon = link + ele.id + ".png"
                });
                oModel.setData(oData);
                this.getView().setModel(oModel, "geItemsModel");
            },

            onSearchFieldLiveChange: function (oEvent) {
                // Get the user input from the search field as it changes
                var sQuery = oEvent.getParameter("newValue"),
                    oTable = this.getView().byId("geItems"),
                    oBinding = oTable.getBinding("items");
          
                if (sQuery) {
                  // Apply the filter to the table immediately
                  var oFilter = new Filter("name", FilterOperator.Contains, sQuery);
                  oBinding.filter([oFilter]);
                } else {
                  // If no query, clear the table filter
                  oBinding.filter([]);
                }
              },

              onDetailPress: function(oEvent){
                let oSelectedItem = oEvent.getSource().getBindingContext("geItemsModel").getObject(),
                    oRouter = sap.ui.core.UIComponent.getRouterFor(this),
                    oTemp = this.getView().getModel("temp");

                    oSelectedItem.icon = $.sap.getModulePath("geinfo.geinfo", "/items-icons/") + oSelectedItem.id + ".png";

                    oTemp.setProperty("/selectedItems", oSelectedItem); 
                    oRouter.navTo("RouteItem", {
                        id: oSelectedItem.id,
                        name: oSelectedItem.name,
                        members: oSelectedItem.members,
                        equipable: oSelectedItem.equipable,
                        noteable: oSelectedItem.noteable,
                        icon: oSelectedItem.icon,
                        selectedItem: oSelectedItem
                    });

                },

            onSelectionChange: function(oEvent){
                let oTemp = this.getView().getModel("temp"),
                    aSelectedItems = oEvent.getSource().getSelectedItems(),
                    aItems = [];  

                    aSelectedItems.forEach(element => {
                        aItems.push(element.getBindingContext("geItemsModel").getObject());
                    });
                    
                    oTemp.setProperty("/selectedItems", aItems); 
                    console.log(oTemp.getProperty("/selectedItems"))
            }

        });
    });
