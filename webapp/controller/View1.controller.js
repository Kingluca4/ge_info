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
