custom_plugins.PluginLoader.getInstance().addPlugin(
   class TurnTimeDisplay extends custom_plugins.Plugin {
      constructor() {
         super();
         this.VERSION = "1.1";
         this.URL = "http://duelyst.r4nd0m.org/page/duelyst_plugins/turn-time";
         super.addListener(function(time_left){
            $('.submit-turn').find('div').eq(1).text("turn ("+time_left+"s)");
         }, window.custom_plugins.eventHooks.c_APPLICATION_CREATED.SET_TURN_TIME);
      }
   }
);