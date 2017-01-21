custom_plugins.PluginLoader.getInstance().addPlugin(
   class IngameQuestProgress extends custom_plugins.Plugin { 

      constructor() {
         super();
         this.VERSION = "1.0";
         this.URL = "http://duelyst.r4nd0m.org/page/duelyst_plugins/special-quest-info";
         super.addListener(this.prepare, window.custom_plugins.eventHooks.SESSION_CREATED); 
         super.addListener(this.infuse_dom, window.custom_plugins.eventHooks.SESSION_CREATED.SHOW_ACTIVE_GAME); 
         super.addListener(this.update_data, window.custom_plugins.eventHooks.SESSION_CREATED.END_STEP); 
      }

      prepare() { // triggered with SESSION_CREATED
         custom_plugins.loadStylesheet('plugins/boxes-1.0.css.html');
      }

      infuse_dom() { // triggered with SHOW_ACTIVE_GAME
          //var qs = QuestsManager.instance.dailyQuestsCollection._byId;
          // 20000 = welcome back quest
          var qs = QuestsManager.instance.getQuestCollection().models;
          for(var quest in qs) {
              if( (qs[quest].attributes.quest_type_id === 500 || qs[quest].attributes.quest_type_id === 401) && $('#plugin_sqi_box').length === 0 ) {
                  $(document.createElement('div'))
                      .addClass('ingame_infobox')
                      .attr('id', 'plugin_sqi_box')
                      .appendTo($("#app-game-right-region")); //  DRAGGABLE
              }
              if(qs[quest].attributes.quest_type_id === 500)
                  window.custom_plugins.has_aggressor_q = true;
              else if(qs[quest].attributes.quest_type_id === 401)
                  window.custom_plugins.has_assassin_q = true;
          }
      }

      update_data(){ // triggered with END_STEP
          var internal_gs = this;
          if (internal_gs.gameType === SDK.GameType.Gauntlet || internal_gs.gameType === SDK.GameType.Ranked) {
              if (window.custom_plugins.has_aggressor_q || window.custom_plugins.has_assassin_q)
                  $('#plugin_sqi_box').html('<b style="text-decoration: underline;">Quest Info:</b>');

              if (window.custom_plugins.has_aggressor_q) {
                  if (this.getMyPlayer().totalDamageDealt >= 40)
                      $('#plugin_sqi_box').append('<div>Ultimate Aggressor: <b color="green">DONE</b>');
                  else
                      $('#plugin_sqi_box').append('<div>Ultimate Aggressor: ' + this.getMyPlayer().totalDamageDealt + "/40</div>");
              }

              if (window.custom_plugins.has_assassin_q) {
                  if (this.getMyPlayer().totalMinionsKilled >= 5)
                      $('#plugin_sqi_box').append('<div>Assassin: <b color="green">DONE</b>');
                  else
                      $('#plugin_sqi_box').append('<div>Assassin: ' + this.getMyPlayer().totalMinionsKilled + "/5</div>");
              }
          }
      }
   } // end class def
);