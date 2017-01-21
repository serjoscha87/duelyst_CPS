custom_plugins.PluginLoader.getInstance().addPlugin(
   class AutoExpandBattlelog extends custom_plugins.Plugin {
      constructor() {
         super();
         this.VERSION = "1.1";
         this.URL = "http://duelyst.r4nd0m.org/page/duelyst_plugins/auto-expand-battlelog";
         super.addListener(function () {
            custom_plugins.exposed.battlelog.ctor.toggle(this);
            //ccui.Class.prototype.getScene().getGameLayer()._battleLog.toggle();
            //cc.Class.prototype.getScene().getGameLayer()._battleLog.toggle();
         }, custom_plugins.eventHooks.SESSION_CREATED.SHOW_ACTIVE_GAME);
      }
   }
);