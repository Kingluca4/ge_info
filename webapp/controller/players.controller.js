sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
  "use strict";

  return Controller.extend("geinfo.geinfo.controller.players", {
    onInit: function () {
      // Create an empty JSON model for player data
      var oModel = new JSONModel();
      this.getView().setModel(oModel, "playerData");
    },

    onSearch: function () {
      var sPlayerName = this.getView().byId("inputPlayer").getValue();
      if (!sPlayerName) {
        sap.m.MessageToast.show("Please enter a player name");
        return;
      }

      var sEncodedName = encodeURIComponent(sPlayerName);
      var sUrl = `https://api.wiseoldman.net/v2/players/${sEncodedName}`;

      fetch(sUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          // Add headers if necessary; the API doesn't require auth
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          // API returns a single player object, wrap in array for Table binding
          this.getView().getModel("playerData").setData({ players: [data] });

            var skillsArr = this._prepareSkillsForList(data);
            this.getView().setModel(new sap.ui.model.json.JSONModel({ skills: skillsArr }), "skillsModel");
        })
        .catch(error => {
          sap.m.MessageToast.show("Player not found or error occurred");
          this.getView().getModel("playerData").setData({ players: [] });
          console.error("Fetch error:", error);
        });


    },

            _prepareSkillsForList: function(player) {

        var skillsObj = player.latestSnapshot.data.skills;
        var skillsArr = [];

        for (var skillName in skillsObj) { 
            skillsArr.push({
                name: skillName.charAt(0).toUpperCase() + skillName.slice(1),
                level: skillsObj[skillName].level
            });
        }

        return skillsArr;
    }

  });
});
